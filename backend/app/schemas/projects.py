from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProjectBase(BaseModel):
    name: str
    domain: Optional[str] = None
    objective: Optional[str] = None
    problem: Optional[str] = None
    outcome: Optional[str] = None
    failure_summary: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    status: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    is_demo: bool
    documents_count: int = 0
    evidence_count: int = 0
    opportunities_count: int = 0
    model_config = {'from_attributes': True}

class ProjectListResponse(ProjectResponse):
    pass
