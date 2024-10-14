from pydantic import BaseModel

class TaskTableCreate(BaseModel):
    task_id: int 
    table_name: str
    
