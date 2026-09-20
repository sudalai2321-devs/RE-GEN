from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class ExperimentBase(BaseModel):
    hypothesis: Optional[str] = ""
    objective: Optional[str] = ""
    materials: Optional[str] = ""
    data_required: Optional[str] = ""
    procedure: Optional[str] = ""
    variables: Optional[str] = ""
    metrics: Optional[str] = ""
    success_criteria: Optional[str] = ""
    failure_criteria: Optional[str] = ""
    risks: Optional[str] = ""
    expected_cost: Optional[str] = ""
    expected_duration: Optional[str] = ""
    status: Optional[str] = "planned"

class ExperimentResponse(ExperimentBase):
    id: int
    opportunity_id: int
    is_demo: Optional[bool] = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = {'from_attributes': True}

class ExperimentUpdate(BaseModel):
    hypothesis: Optional[str] = None
    objective: Optional[str] = None
    materials: Optional[str] = None
    data_required: Optional[str] = None
    procedure: Optional[str] = None
    variables: Optional[str] = None
    metrics: Optional[str] = None
    success_criteria: Optional[str] = None
    failure_criteria: Optional[str] = None
    risks: Optional[str] = None
    expected_cost: Optional[str] = None
    expected_duration: Optional[str] = None
    status: Optional[str] = None

class ExperimentResultCreate(BaseModel):
    result_summary: Optional[str] = ""
    metrics_json: Optional[Dict[str, Any]] = None
    notes: Optional[str] = ""
    attachments: Optional[List[Any]] = None
    status: Optional[str] = "recorded"

class ExperimentResultResponse(BaseModel):
    id: int
    experiment_id: int
    result_summary: Optional[str] = ""
    metrics_json: Optional[Dict[str, Any]] = None
    notes: Optional[str] = ""
    attachments: Optional[List[Any]] = None
    status: Optional[str] = "recorded"
    created_at: Optional[datetime] = None
    model_config = {'from_attributes': True}
