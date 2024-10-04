from sqlalchemy.orm import Session
from helpers.utils import generate_unique_pairs, generate_pairs
from database.db_models import Task, MicroTask
from helpers.text_preprocess import SchemaProcessor
from helpers.model import EmbeddingsEncoder
from helpers.utils import remove_temp_dir
from typing import List
import pandas as pd
import os



def create_microtask(pair, col1, col2, df1, df2, task_id):
    return MicroTask(
        task_id=task_id,
        table_1=pair[0],
        table_2=pair[1],
        column_1=col1,
        column_2=col2,
        rows_1=",".join(df1[col1].astype(str).tolist()),
        rows_2=",".join(df2[col2].astype(str).tolist()),
    )

async def process_pair(folder_path, pair, schema_processor, encoder, task_id, threshold, microtasks_to_add):
   
    file_path_1 = os.path.join(folder_path, pair[0])
    file_path_2 = os.path.join(folder_path, pair[1])

    try:
        df1 = pd.read_csv(file_path_1, nrows=5)
        df2 = pd.read_csv(file_path_2, nrows=5)
        column_pairs = generate_pairs(df1.columns, df2.columns)

        for col1, col2 in column_pairs:
            if threshold and encoder.similarity(schema_processor.get_processed_text(col1), 
                                                schema_processor.get_processed_text(col2)) < threshold:
                continue

            microtask = create_microtask(pair, col1, col2, df1, df2, task_id)
            microtasks_to_add.append(microtask)

    except FileNotFoundError as e:
        print(f"Error: {e}")

async def process_tables(folder_path, task_id: int, table_names: List[str], threshold: float, db: Session): 
    table_pairs = generate_unique_pairs(table_names)
    schema_processor = SchemaProcessor()
    encoder = EmbeddingsEncoder()
    microtasks_to_add = []

    for pair in table_pairs:
        await process_pair( folder_path, pair, schema_processor, encoder, task_id, threshold, microtasks_to_add)

    if microtasks_to_add:
        db.add_all(microtasks_to_add)
        db.commit()
     
        task_to_update = db.query(Task).filter(Task.id == task_id).first()
        if task_to_update:
            task_to_update.status = 'active'
            task_to_update.num_microtasks = len(microtasks_to_add)
            db.commit()  
         

 

    remove_temp_dir(folder_path)

