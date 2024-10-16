from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.db_model import MicroTask, MicroTaskAnswers
from schemas.microtask_schema import MicroTaskCreate
from typing import List



async def get_microtasks(db: AsyncSession, task_id: int) -> List[MicroTask]:
    """
    Retrieve all microtasks associated with a given task ID.
    """

    query = select(MicroTask).where(MicroTask.task_id == task_id)
    microtasks_result = await db.execute(query)

    return microtasks_result.scalars().all()


async def create_microtask(microtask: MicroTaskCreate):
    """
    Create a new microtask.
    """

    new_microtask = MicroTask(**microtask.model_dump())

    return new_microtask


async def get_microtask_without_answer(
    db: AsyncSession, task_id: int, user_id: int
) -> MicroTask:
    """
    Retrieve a microtask that the user has not answered yet.
    """

    query = select(MicroTask).where(
        MicroTask.task_id == task_id,
        MicroTask.is_completed == False,
        ~MicroTask.id.in_(
            select(MicroTaskAnswers.microtask_id).where(
                MicroTaskAnswers.user_id == user_id
            )
        ),
    )
    result = await db.execute(query)

    return result.scalars().first()


async def get_microtask_by_id(db: AsyncSession, microtask_id: int)->MicroTask:
    """
    Retrieve a microtask by its ID from the database.
    """
    query = select(MicroTask).where(MicroTask.id == microtask_id)
    microtask = await db.execute(query)
    return microtask.scalars().first()