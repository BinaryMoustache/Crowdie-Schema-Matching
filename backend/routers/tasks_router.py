from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Form, UploadFile, File, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from sqlalchemy import select
from database.database import get_db
from database.db_models import Task, User, MicroTask
from database.db_schemas import CrowdTasksResponse
from services.auth_services import get_current_user
from services.tasks_service import process_tables
import os

router = APIRouter()


@router.post("/create/")
async def create_task(
    name: str = Form(...),
    description: str = Form(...),
    threshold: float = Form(...),
    files: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    print(f"Task Name: {name}")
    print(f"Task Description: {description}")
    print(f"Similarity Threshold: {threshold}")

    new_task = Task(
        user_id=current_user.id,
        name=name,
        description=description,
        threshold=threshold,
        table_names=",".join([file.filename for file in files])
    )

    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)

    temp_path = f"assets/{new_task.id}"
    os.makedirs(temp_path, exist_ok=True)

    for file in files:
        file_location = os.path.join(temp_path, file.filename)
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())

    background_tasks.add_task(process_tables, temp_path, new_task.id, [
                              file.filename for file in files], threshold, db)

    return JSONResponse(content={"message": "Task created successfully!"})


@router.get("/mytasks/")
async def get_user_tasks(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        result = await db.execute(
            select(Task).where(Task.user_id == current_user.id)
        )
        tasks = result.scalars().all()

        return tasks

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching tasks: {str(e)}"
        )


@router.get("/crowd_tasks/")
async def get_other_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.user_id != current_user.id))
    tasks = result.scalars().all()

    if not tasks:
        raise HTTPException(status_code=404, detail="There are no Crowd Tasks")

    task_data = []
    for task in tasks:
        user_result = await db.execute(select(User).where(User.id == task.user_id))
        user = user_result.scalar_one_or_none()
        if user:
            task_data.append({
                "task_id": task.id,
                "name": task.name,
                "description": task.description,
                "username": user.username
            })

    response = CrowdTasksResponse(
        tasks=task_data
    )

    return response


@router.delete("/delete/{task_id}")
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )

    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found or you do not have permission to delete this task."
        )

    microtasks_result = await db.execute(
        select(MicroTask).where(MicroTask.task_id == task_id)
    )
    microtasks = microtasks_result.scalars().all()

    for microtask in microtasks:
        await db.delete(microtask)

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

    task_result = await db.execute(select(Task).where(Task.id == task_id))
    task = task_result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    microtask_result = await db.execute(select(MicroTask).where(
        MicroTask.task_id == task_id,
        ~MicroTask.users_ids.contains(str(current_user.id))
    ))

    microtask = microtask_result.scalars().first()

    if not microtask:
        return {"message": "You have completed all available microtasks."}

    microtask.users_ids = f"{microtask.users_ids},{
        current_user.id}" if microtask.users_ids else str(current_user.id)

    db.add(microtask)
    await db.commit()

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
