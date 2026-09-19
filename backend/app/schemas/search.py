from pydantic import BaseModel
from typing import List, Optional

class SearchResultItem(BaseModel):
    type: str
    id: int
    title: str
    subtitle: Optional[str] = None

class SearchResponse(BaseModel):
    results: List[SearchResultItem]
