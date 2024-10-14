from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from models.db_model import TaskTable
from schemas.task_table_schema import TaskTableCreate
from fastapi import HTTPException


async def create_task_table(db: AsyncSession, task_table: TaskTableCreate):

    new_task_table = TaskTable(
        **task_table.model_dump()
    )

    db.add(new_task_table)
    await db.commit()
    await db.refresh(new_task_table)

    return new_task_table

