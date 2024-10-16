from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    BackgroundTasks,
    Form,
    UploadFile,
    File,
    Request,
)
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from dependencies import get_db
from models.db_model import User
from schemas.task_schema import CrowdTaskResponse
from schemas.task_table_schema import TaskTableCreate
from services.auth_services import get_current_user
from crud.task_crud import create_task, get_tasks, get_task_by_id
from crud.task_table_crud import create_task_table
from crud.microtasks_crud import get_microtask_without_answer, get_microtask_by_id
from services.tasks_service import process_tables
from crud.user_crud import get_user
from utils.utils import create_temp_dir
from schemas.microtask_answer_schema import MicrotaskAnswerRequest
from models.db_model import MicroTaskAnswers
import aiofiles
import logging
import os


logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/create/")
async def create_new_task(
    name: str = Form(...),
    description: str = Form(...),
    threshold: float = Form(...),
    required_answers: int = Form(...),
    is_experience_required: bool = Form(...),
    files: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    request: Request = None,
):
    try:
        existing_tasks = await get_tasks(db, current_user.id)

        if existing_tasks:
            if any(existing_task.name == name for existing_task in existing_tasks):
                raise HTTPException(
                    status_code=400, detail="Task with this name already exists."
                )

        new_task = {
            "name": name,
            "description": description,
            "threshold": threshold,
            "num_of_tables": len(files),
            "is_experience_required": is_experience_required,
        }

        new_task = await create_task(db, new_task, current_user.id)
        temp_path = f"temp/{new_task.id}"
        create_temp_dir(temp_path)
        for file in files:
            task_table_create = TaskTableCreate(
                task_id=new_task.id,
                table_name=file.filename,
            )
            await create_task_table(db, task_table_create)

            file_location = os.path.join(temp_path, file.filename)
            async with aiofiles.open(file_location, "wb") as buffer:
                content = await file.read()
                await buffer.write(content)

        background_tasks.add_task(
            process_tables,
            temp_path,
            new_task.id,
            [file.filename for file in files],
            threshold,
            required_answers,
            current_user.id,
            db,
            request,
        )

        return {
            "message": "Task created successfully",
        }
    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        logger.error(f"Failed to create task: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"An internal error occurred.")


@router.get("/tasks/")
async def get_user_tasks(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    try:
        tasks = await get_tasks(db, current_user.id)
        return tasks

    except Exception as e:
        logger.error(f"Failed to get tasks: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred.")


@router.get("/crowd_tasks/")
async def get_other_tasks(
    db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)
):
    try:
        tasks = await get_tasks(db, current_user.id, exclude=True)
        if not tasks:
            return tasks

        task_data = []
        for task in tasks:
            microtask = await get_microtask_without_answer(db, task.id, current_user.id)

            if not microtask:
                continue

            user = await get_user(db, user_id=task.user_id)
            if user:
                task_data.append(
                    {
                        "task_id": task.id,
                        "name": task.name,
                        "description": task.description,
                        "username": user.username,
                    }
                )

        response = CrowdTaskResponse(tasks=task_data)
        return response

    except Exception as e:
        logger.error(f"Failed to retrieve crowd tasks: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred.")


@router.delete("/delete/{task_id}")
async def delete_selected_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        task = await get_task_by_id(db, task_id)
        if task is None:
            raise HTTPException(status_code=404, detail="Task not found.")

        await db.delete(task)
        await db.commit()

        return {"message": "Task and its associated microtasks successfully deleted."}

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Failed to delete task {task_id}: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="An internal error occurred.")


@router.get("/microtask/{task_id}/")
async def get_microtask(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        task = await get_task_by_id(db, task_id)
        microtask = await get_microtask_without_answer(db, task.id, current_user.id)

        if not microtask:
            task.status = "completed"
            db.add(task)
            await db.commit()
            return None

        return {
            "id": microtask.id,
            "task_id": microtask.task_id,
            "table_1": microtask.table_1,
            "table_2": microtask.table_2,
            "column_1": microtask.column_1,
            "column_2": microtask.column_2,
            "rows_1": microtask.rows_1,
            "rows_2": microtask.rows_2,
        }
    except Exception as e:
        logger.error(f"Failed to get microtask for task {task_id}: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred.")


@router.post("/microtask_answer/")
async def submit_microtask_answer(
    answer_data: MicrotaskAnswerRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:

        microtask = await get_microtask_by_id(db, answer_data.microtask_id)
        if not microtask:
            raise HTTPException(status_code=404, detail="Microtask not found.")

        new_answer = MicroTaskAnswers(
            user_id=current_user.id,
            microtask_id=microtask.id,
            answer=answer_data.response,
            time_taken=answer_data.time_taken,
        )

        db.add(new_answer)

        if answer_data.response == "yes":
            microtask.yes_count += 1
        elif answer_data.response == "no":
            microtask.no_count += 1

        if (microtask.yes_count + microtask.no_count) >= microtask.required_answers:
            microtask.is_completed = True

        await db.commit()

        return {"message": "Answer submitted successfully"}

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Failed to submit microtask answer: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="An internal error occurred.")
