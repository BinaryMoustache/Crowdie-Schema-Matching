from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.user_router import router as user_router
from routers.tasks_router import router as tasks_router
from contextlib import asynccontextmanager
from database.database import engine, Base
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully.")
    yield
    print("Shutting down...")
    await engine.dispose()
    print("Cleanup tasks completed.")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
