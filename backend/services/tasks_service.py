from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Request
from typing import List
import pandas as pd
import asyncio
import os

from utils.utils import generate_unique_pairs, remove_temp_dir
from utils.text_preprocess import SchemaProcessor
from utils.schema_mapping import check_column_types
from utils.model import cosine_similarity
from schemas.microtask_schema import MicroTaskCreate
from crud.task_crud import get_task_by_id
from crud.microtasks_crud import create_microtask


async def encode_in_background(
    executor, encoder, texts: List[str], device: str
) -> List[float]:
    """
    Run text encoding in the background, utilizing an executor for CPU-bound tasks.
    """
    loop = asyncio.get_running_loop()

    if device == "cpu":
        return await loop.run_in_executor(executor, encoder.encode, texts)
    else:
        return encoder.encode(texts)


async def generate_embeddings(
    schema_processor: SchemaProcessor,
    encoder,
    unique_columns: set,
    executor,
    device: str,
) -> dict:
    """
    Generate embeddings for unique columns by preprocessing and encoding them.
    """
    processed_names = [
        schema_processor.get_processed_text(col) for col in unique_columns
    ]
    embeddings = await encode_in_background(executor, encoder, processed_names, device)
    embedding_mapping = {
        col: embedding for col, embedding in zip(unique_columns, embeddings)
    }

    return embedding_mapping


async def process_pair(
    folder_path: str,
    pair: tuple,
    schema_processor: SchemaProcessor,
    encoder,
    task_id: int,
    threshold: float,
    required_answers: int,
    microtasks_to_add: List,
    device: str,
    executor,
) -> None:
    """
    Process a pair of tables by comparing columns and generating microtasks based on column similarities.
    """
    file_path_1 = os.path.join(folder_path, pair[0])
    file_path_2 = os.path.join(folder_path, pair[1])

    try:
        df1 = pd.read_csv(file_path_1, nrows=5)
        df2 = pd.read_csv(file_path_2, nrows=5)

        unique_columns = set(df1.columns).union(set(df2.columns))

        if threshold != 0:
            embedding_mapping = await generate_embeddings(
                schema_processor, encoder, unique_columns, device, executor
            )

        matches = check_column_types(df1, df2)

        for col1, col2 in matches:
            if (
                threshold != 0
                and cosine_similarity(embedding_mapping[col1], embedding_mapping[col2])
                < threshold
            ):
                continue

            microtask = MicroTaskCreate(
                table_1=pair[0],
                table_2=pair[1],
                column_1=col1,
                column_2=col2,
                rows_1=",".join(df1[col1].astype(str).tolist()),
                rows_2=",".join(df2[col2].astype(str).tolist()),
                required_answers=required_answers,
                task_id=task_id,
            )
            microtask = await create_microtask(microtask)
            microtasks_to_add.append(microtask)

    except FileNotFoundError as e:
        print(f"Error: {e}")


async def process_tables(
    folder_path: str,
    task_id: int,
    table_names: List[str],
    threshold: float,
    required_answers: int,
    user_id: int,
    db: AsyncSession,
    request: Request,
) -> None:
    """
    Process a list of tables, generating microtasks by comparing table columns.
    """
    table_pairs = generate_unique_pairs(table_names)
    schema_processor = SchemaProcessor()
    encoder = request.app.state.embeddings_encoder
    device = request.app.state.device
    executor = request.app.state.executor

    print(f"Encoder Type: {type(encoder)}")
    microtasks_to_add: List[MicroTaskCreate] = []

    for pair in table_pairs:
        await process_pair(
            folder_path,
            pair,
            schema_processor,
            encoder,
            task_id,
            threshold,
            required_answers,
            microtasks_to_add,
            device,
            executor,
        )

    if microtasks_to_add:
        try:
            async with db.begin():
                db.add_all(microtasks_to_add)
                print("Microtasks added successfully")

                task = await get_task_by_id(db, task_id=task_id)
                if task:
                    task.status = "active"
                    task.num_microtasks = len(microtasks_to_add)
                    await db.commit()
                    print("Task status updated to 'active'.")
        except Exception as e:
            print(f"Error while adding microtasks: {e}")
        finally:
            remove_temp_dir(folder_path)
