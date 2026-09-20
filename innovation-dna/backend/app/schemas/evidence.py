from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.sources import SourceResponse

class EvidenceResponse(BaseModel):
    id: int
    source_id: Optional[int] = None
    chunk_id: Optional[int] = None
    claim: str
    excerpt: Optional[str] = ""
    confidence: Optional[float] = 0.0
    verification_status: Optional[str] = "pending"
    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    source: Optional[SourceResponse] = None
    model_config = {'from_attributes': True}

class EvidenceUpdateRequest(BaseModel):
    verification_status: str
