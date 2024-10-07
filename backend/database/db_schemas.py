from pydantic import BaseModel
from typing import List, Optional


class UserCreate(BaseModel):
    username: str
    password: str
    cs_background: str
    study_level: Optional[str] = None
    experience: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str


class TaskCreate(BaseModel):
    name: str
    description: Optional[str] = None
    threshold: float
    table_names: str


class MicroTaskCreate(BaseModel):
    table_1: str
    table_2: str
    column_1: str
    column_2: str
    rows_1: str
    rows_2: str
    users_ids: Optional[int] = None


class CrowdTaskResponse(BaseModel):
    task_id: int
    name: str
    description: str
    username: str


class CrowdTasksResponse(BaseModel):
    tasks: List[CrowdTaskResponse]
