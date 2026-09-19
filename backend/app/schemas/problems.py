from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any

class ProblemBase(BaseModel):
    title: str
    problem_statement: Optional[str] = ""
    domain: Optional[str] = ""
    subdomain: Optional[str] = ""
    context: Optional[str] = ""
    affected_users: Optional[str] = ""
    geography: Optional[str] = ""
    existing_solutions: Optional[str] = ""
    limitations: Optional[str] = ""
    status: Optional[str] = "active"
    source_ids: Optional[List[Any]] = None
    is_demo: Optional[bool] = False

class ProblemCreate(ProblemBase):
    pass

class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    problem_statement: Optional[str] = None
    domain: Optional[str] = None
    subdomain: Optional[str] = None
    context: Optional[str] = None
    affected_users: Optional[str] = None
    geography: Optional[str] = None
    existing_solutions: Optional[str] = None
    limitations: Optional[str] = None
    status: Optional[str] = None

class ProblemResponse(ProblemBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    evidence_count: Optional[int] = 0
    source_count: Optional[int] = 0
    model_config = {'from_attributes': True}
