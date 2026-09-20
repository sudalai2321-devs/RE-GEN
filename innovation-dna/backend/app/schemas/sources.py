from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SourceBase(BaseModel):
    title: str
    publisher: Optional[str] = ""
    source_type: Optional[str] = "other"
    url: Optional[str] = ""
    publication_date: Optional[str] = ""
    description: Optional[str] = ""
    status: Optional[str] = "active"

class SourceCreate(SourceBase):
    pass

class SourceUpdate(BaseModel):
    title: Optional[str] = None
    publisher: Optional[str] = None
    source_type: Optional[str] = None
    url: Optional[str] = None
    publication_date: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class SourceResponse(SourceBase):
    id: int
    is_demo: Optional[bool] = False
    retrieved_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    model_config = {'from_attributes': True}

class SourceImportRequest(BaseModel):
    url: str
