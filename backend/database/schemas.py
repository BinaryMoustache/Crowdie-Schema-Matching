from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str
    cs_background: str
    study_level: Optional[str] = None
    experience: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str