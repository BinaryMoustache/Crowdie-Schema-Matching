from pydantic import BaseModel
from typing import Optional, List


class TaskCreate(BaseModel):
    name: str
    description: Optional[str]
    threshold: float
    required_answers: int
    is_experience_required: bool


class TaskResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    username: str


class CrowdTaskResponse(BaseModel):
    tasks: List[TaskResponse]
