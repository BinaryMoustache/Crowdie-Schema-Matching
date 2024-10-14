from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.db_model import Task
from schemas.task_schema import TaskCreate
from datetime import datetime, timezone
from typing import Optional, List, Union

async def create_task(db: AsyncSession, task: TaskCreate, user_id: int) -> Task:
    """
    Create a new task for the specified user and commit it to the database.
    """
    
    new_task = Task(
        user_id=user_id,
        **task,
        created_at=datetime.now(timezone.utc)  # Setting the current time for task creation
    )

    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)

    return new_task


async def get_tasks(
    db: AsyncSession, user_id: int, exclude: bool = False
) -> Union[List[Task], Optional[Task]]:
    """
    Get tasks either by user ID or excluding the user ID based on the `exclude` flag.
    Optionally, fetch a specific task by ID for the user.

    - If `exclude` is False (default), it will fetch tasks that belong to the user.
    - If `exclude` is True, it will fetch tasks that do not belong to the user.
    """
    query = select(Task)

    if exclude:
          query = query.where(Task.user_id != user_id, Task.status != 'completed')
    else:
        query = query.where(Task.user_id == user_id)

    result = await db.execute(query)
    tasks = result.scalars().all()

    return tasks


async def get_task_by_id(db: AsyncSession, task_id: int) -> Optional[Task]:
    """
    Fetch a task by its ID.
    """
    
    query = select(Task).where(Task.id == task_id)

    result = await db.execute(query)
    task = result.scalars().first()

    return task


