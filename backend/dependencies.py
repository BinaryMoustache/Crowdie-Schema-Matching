from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os 


os.environ["ENV"] = os.getenv("ENV", "development")

if os.environ["ENV"] == "development":
    print("Running in development mode.")
    DATABASE_URL = "sqlite+aiosqlite:///./test.db"
else:
    print("Running in production mode.")
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@db:5432/mydatabase")



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