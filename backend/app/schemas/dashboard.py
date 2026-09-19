from pydantic import BaseModel
from typing import List
from app.schemas.projects import ProjectResponse

class DashboardStatsResponse(BaseModel):
    projects_count: int
    gaps_count: int
    opportunities_count: int
    experiments_count: int
    evidence_count: int
    verified_sources_count: int
    # Frontend aliases
    projects_analyzed: int
    innovation_gaps: int
    opportunities_discovered: int
    experiments: int
    evidence_records: int
    verified_sources: int

class RecentAnalysisResponse(BaseModel):
    projects: List[ProjectResponse]
