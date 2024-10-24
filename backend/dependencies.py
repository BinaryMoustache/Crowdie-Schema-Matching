from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import logging
import os

logger = logging.getLogger(__name__)


os.environ["ENV"] = os.getenv("ENV", "development")

if os.environ["ENV"] == "development":
    logger.info("Running in development mode.")
    DATABASE_URL = "sqlite+aiosqlite:///./test.db"
else:
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL must be set in production environment.")


Base = declarative_base()

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
