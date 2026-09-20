from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Project, Gap, Opportunity, Experiment, Evidence, Source
from app.dependencies import get_current_user
from app.schemas.dashboard import DashboardStatsResponse, RecentAnalysisResponse

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStatsResponse)
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects_count = db.query(Project).filter(Project.user_id == current_user.id).count()
    gaps_count = db.query(Gap).join(Project).filter(Project.user_id == current_user.id).count()
    opportunities_count = db.query(Opportunity).join(Project).filter(Project.user_id == current_user.id).count()
    experiments_count = db.query(Experiment).join(Opportunity).join(Project).filter(Project.user_id == current_user.id).count()
    evidence_count = db.query(Evidence).count()
    verified_sources_count = db.query(Source).filter(Source.status == 'verified').count()

    return DashboardStatsResponse(
        projects_count=projects_count,
        gaps_count=gaps_count,
        opportunities_count=opportunities_count,
        experiments_count=experiments_count,
        evidence_count=evidence_count,
        verified_sources_count=verified_sources_count,
        projects_analyzed=projects_count,
        innovation_gaps=gaps_count,
        opportunities_discovered=opportunities_count,
        experiments=experiments_count,
        evidence_records=evidence_count,
        verified_sources=verified_sources_count
    )

@router.get("/recent")
def get_recent(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.user_id == current_user.id).order_by(Project.created_at.desc()).limit(10).all()
    result = []
    for p in projects:
        opp_count = db.query(Opportunity).filter(Opportunity.project_id == p.id).count()
        dna_count = len(p.dna_items) if p.dna_items else 0
        result.append({
            "id": p.id,
            "name": p.name,
            "project_name": p.name,
            "domain": p.domain,
            "status": p.status,
            "evidence_count": dna_count,
            "opportunities_count": opp_count,
            "updated_at": p.updated_at.isoformat() if p.updated_at else p.created_at.isoformat() if p.created_at else "",
            "created_at": p.created_at.isoformat() if p.created_at else ""
        })
    return result
