from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JobResponse(BaseModel):
    id: int
    job_type: str
    entity_type: str
    entity_id: int
    status: str
    progress: float
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    model_config = {'from_attributes': True}
