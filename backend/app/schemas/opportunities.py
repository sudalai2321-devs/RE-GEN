from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any
from app.schemas.evidence import EvidenceResponse
from app.schemas.problems import ProblemResponse
from app.schemas.projects import ProjectResponse

class OpportunityResponse(BaseModel):
    id: int
    project_id: int
    problem_id: Optional[int] = None
    gap_id: Optional[int] = None
    title: Optional[str] = ""
    rationale: Optional[str] = ""
    status: Optional[str] = "identified"
    technology_fit: Optional[float] = 0.0
    environment_fit: Optional[float] = 0.0
    data_fit: Optional[float] = 0.0
    infrastructure_fit: Optional[float] = 0.0
    cost_fit: Optional[float] = 0.0
    evidence_strength: Optional[float] = 0.0
    transferable_capabilities: Optional[List[Any]] = None
    non_transferable_factors: Optional[List[Any]] = None
    uncertainties: Optional[List[Any]] = None
    validation_requirements: Optional[List[Any]] = None
    is_demo: Optional[bool] = False
    created_at: Optional[datetime] = None
    project_name: Optional[str] = ""
    problem_title: Optional[str] = ""
    evidence_count: Optional[int] = 0
    model_config = {'from_attributes': True}

class OpportunityDetailResponse(OpportunityResponse):
    project: Optional[ProjectResponse] = None
    problem: Optional[ProblemResponse] = None
    evidence: List[EvidenceResponse] = []
