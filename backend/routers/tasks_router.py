from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Form, UploadFile, File, Request
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from dependencies import get_db
from models.db_model import User, MicroTask
from schemas.task_schema import  CrowdTaskResponse
from schemas.task_table_schema import TaskTableCreate
from services.auth_services import get_current_user
from crud.task_crud import create_task, get_tasks, get_task_by_id
from crud.task_table_crud import create_task_table
from crud.microtasks_crud import get_microtask_without_answer
from services.tasks_service import process_tables
from crud.user_crud import get_user
from utils.utils import create_temp_dir
from schemas.microtask_answer_schema import MicrotaskAnswerRequest
from models.db_model import MicroTaskAnswers
from sqlalchemy.future import select
import logging


import os


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

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
    request:Request =None

):

    existing_tasks = await get_tasks(db, current_user.id)

    if existing_tasks:
        if any(existing_task.name == name for existing_task in existing_tasks):
            raise HTTPException(
                status_code=400, detail="Task with this name already exists.")

    new_task = {
        "name": name,
        "description": description,
        "threshold": threshold,
        "num_of_tables": len(files),
        "is_experience_required": is_experience_required
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
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())

    background_tasks.add_task(process_tables, temp_path, new_task.id, [
                              file.filename for file in files], threshold, required_answers,current_user.id, db, request)

    response_message = {
        "task_id": new_task.id,
        "message": "Task created successfully",
        "file_count": len(files),
        "task_name": new_task.name
    }

    return response_message


@router.get("/tasks/")
async def get_user_tasks(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        tasks = await get_tasks(db, current_user.id)
        return tasks

    except Exception:
        raise HTTPException(status_code=500, detail="An internal error occurred.")


@router.get("/crowd_tasks/")
async def get_other_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        tasks = await get_tasks(db, current_user.id, exclude=True)
        if not tasks:
            return tasks

        task_data = []
        for task in tasks:
            logger.info(f"Processing task ID: {task.id}")
            microtask = await get_microtask_without_answer(db, task.id, current_user.id)
            logger.debug(f"Microtask for task ID {task.id}: {microtask}")

            if not microtask:
                logger.info(f"No unanswered microtasks for task ID: {task.id}, skipping.")
                continue

            user = await get_user(db, user_id=task.user_id)
            if user:
                task_data.append({
                    "task_id": task.id,
                    "name": task.name,
                    "description": task.description,
                    "username": user.username
                })

        response = CrowdTaskResponse(tasks=task_data)
        return response

    except Exception:
        raise HTTPException(status_code=500, detail="An internal error occurred.")


@router.delete("/delete/{task_id}")
async def delete_selected_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):      
        task = await get_task_by_id(db, task_id)
        if task is None:
            raise HTTPException(
                status_code=404,
                detail="Task not found."
            )
        await db.delete(task)
        await db.commit()

        return {"message": "Task and its associated microtasks successfully deleted."}



@router.get("/microtask/{task_id}/")
async def get_microtask(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    print(f"Received task_id: {task_id}")
    print(f"Current user ID: {current_user.id}")

    task = await get_task_by_id(db, task_id)
   
    microtask = await get_microtask_without_answer(db, task.id, current_user.id)
    

    if not microtask:
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



@router.post("/microtask_answer/")
async def submit_microtask_answer(
    answer_data: MicrotaskAnswerRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    microtask = await db.execute(select(MicroTask).where(MicroTask.id == answer_data.microtask_id))
    microtask = microtask.scalars().first()
    print(microtask)

    new_answer = MicroTaskAnswers(
        user_id=current_user.id,
        microtask_id=microtask.id,
        answer=answer_data.response,
        time_taken=answer_data.time_taken  
    )

    db.add(new_answer)

    if answer_data.response == 'yes':
        microtask.yes_count += 1
    elif answer_data.response == 'no':
        microtask.no_count += 1

    if (microtask.yes_count + microtask.no_count) >= microtask.required_answers:
        microtask.is_completed = True

    await db.commit()

    return {"message": "Answer submitted successfully"}