from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentResponse(BaseModel):
    id: int
    project_id: int
    filename: str
    file_path: Optional[str] = ""
    storage_path: Optional[str] = ""
    mime_type: Optional[str] = None
    size_bytes: Optional[int] = 0
    file_size: Optional[int] = 0
    status: Optional[str] = "uploaded"
    processing_status: Optional[str] = "completed"
    extracted_text: Optional[str] = ""
    created_at: datetime
    model_config = {'from_attributes': True}
