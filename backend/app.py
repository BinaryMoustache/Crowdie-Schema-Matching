import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.user_router import router as user_router
from routers.tasks_router import router as tasks_router
from contextlib import asynccontextmanager
from dependencies import engine, Base
from utils.utils import create_temp_dir, remove_temp_dir
from utils.model import EmbeddingsEncoder
from concurrent.futures import ProcessPoolExecutor
import torch
import uvicorn


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        logger.info("Creating tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info(f"Tables created: {Base.metadata.tables.keys()}")

        if torch.cuda.is_available():
            device = "cuda"
            logger.info(f"GPU detected: {torch.cuda.get_device_name(0)}")
            app.state.gpu_available = True
            app.state.device = device
            app.state.executor = None
        else:
            device = "cpu"
            logger.info("No GPU detected, using CPU.")
            app.state.gpu_available = False
            app.state.device = device
            app.state.executor = ProcessPoolExecutor(max_workers=1)

        app.state.embeddings_encoder = EmbeddingsEncoder(
            model_name="all-MiniLM-L6-v2", device=device
        )
        temp_dir_path = "temp"
        logger.info("Creating temporary directory...")
        create_temp_dir(temp_dir_path)

    except Exception as e:
        logger.error(f"Failed to create tables: {e}")
        raise

    yield

    executor = app.state.executor
    if executor:
        executor.shutdown(wait=True)

    logger.info("Shutting down...")
    await engine.dispose()

    logger.info("Removing temporary directory...")
    try:
        remove_temp_dir(temp_dir_path)
        logger.info("Temporary directory removed successfully.")
    except Exception as e:
        logger.error(f"Failed to remove temporary directory: {e}")

    logger.info("Cleanup tasks completed.")


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
