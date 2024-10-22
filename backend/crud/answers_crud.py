from models.db_model import MicroTaskAnswers
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


async def get_current_user_answer(db: AsyncSession, microtask_id: int, user_id:int, query = False):
    """
    Retrieve the current answer of a user for a specific microtask.
    """

    query = select(MicroTaskAnswers).where(
        MicroTaskAnswers.microtask_id == microtask_id,
        MicroTaskAnswers.user_id == user_id,
    )
    if query:
        return query
    result = await db.execute(query)

    return result.scalars().first()
