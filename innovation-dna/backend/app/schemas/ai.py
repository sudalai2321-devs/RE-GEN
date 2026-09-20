from pydantic import BaseModel
from typing import List, Optional

class ProjectDNASchema(BaseModel):
    category: str
    value: str
    confidence: float
    evidence_ids: List[int] = []

class GapAnalysisSchema(BaseModel):
    description: str
    gap_type: str
    confidence: float
    evidence_ids: List[int] = []
    reasoning: str

class ProblemMatchSchema(BaseModel):
    problem_id: int
    match_score: float
    reasoning: str

class OpportunitySchema(BaseModel):
    title: str
    rationale: str
    technology_fit: float
    environment_fit: float
    data_fit: float
    infrastructure_fit: float
    cost_fit: float

class TransferabilitySchema(BaseModel):
    transferable_capabilities: List[str]
    non_transferable_factors: List[str]
    uncertainties: List[str]
    validation_requirements: List[str]

class ExperimentPlanSchema(BaseModel):
    hypothesis: str
    objective: str
    procedure: str
    metrics: str
