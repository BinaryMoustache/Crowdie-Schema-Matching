from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.db_model import User
from typing import Optional
from schemas.user_schema import UserCreate


async def get_user(
    db: AsyncSession, user_id: Optional[int] = None, username: Optional[str] = None
) -> Optional[User]:
    """
    Fetch a user by their ID or username.
    """
    query = select(User)
    if user_id is not None:
        query = query.where(User.id == user_id)
    elif username is not None:
        query = query.where(User.username == username)
    else:
        raise ValueError("Either user_id or username must be provided")

    result = await db.execute(query)
    user = result.scalar_one_or_none()

    return user


async def create_new_user(db: AsyncSession, user: UserCreate) -> User:
    from services.auth_services import get_password_hash
    """
    Create a new user in the database.
    """
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        password=hashed_password,
        cs_background=user.cs_background,
        study_level=user.study_level,
        experience=user.experience,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user
