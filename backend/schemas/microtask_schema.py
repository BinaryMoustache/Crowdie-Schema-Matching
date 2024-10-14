from pydantic import BaseModel, Field
from typing import Optional


class MicroTaskBase(BaseModel):
    table_1: str
    table_2: str
    column_1: str
    column_2: str
    rows_1: str
    rows_2: str
    required_answers: Optional[int]


class MicroTaskCreate(MicroTaskBase):
    task_id: int


class MicroTaskResponse(MicroTaskBase):
    id: int
