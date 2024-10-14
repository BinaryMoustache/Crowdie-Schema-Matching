from pydantic import BaseModel

class MicrotaskAnswerRequest(BaseModel):
    response: str  
    microtask_id: int 
    time_taken: float 