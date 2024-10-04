from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Form, UploadFile, File, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import select
from database.database import get_db
from database.db_models import Task, User, MicroTask
from services.auth_services import get_current_user
from services.tasks_services import process_tables
import os

router = APIRouter()


@router.post("/create/")
async def create_task(
    name: str = Form(...),
    description: str = Form(...),
    threshold: float = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    background_tasks: BackgroundTasks = BackgroundTasks()
):

    new_task = Task(
        user_id=current_user.id,
        name=name,
        description=description,
        threshold=threshold,
        table_names=",".join([file.filename for file in files])
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    def create_temp_dir(folder_path):
     if not os.path.isdir(folder_path):
         os.makedirs(folder_path)

    temp_path = f"assets/{new_task.id}"

    create_temp_dir(temp_path)

    for file in files:
        file_location = os.path.join(temp_path, file.filename)
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())

    background_tasks.add_task(process_tables, temp_path, new_task.id, [
                              file.filename for file in files], threshold, db)

    return JSONResponse(content={"message": "Task created successfully!"})


@router.get("/mytasks/")
def get_user_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):

    tasks = db.execute(select(Task).where(
        Task.user_id == current_user.id)).scalars().all()
    return tasks
