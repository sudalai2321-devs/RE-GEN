from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, Opportunity, Project, Problem, Evidence, OpportunityEvidence, Experiment
from app.dependencies import get_current_user
from app.schemas.opportunities import OpportunityResponse, OpportunityDetailResponse
from app.schemas.experiments import ExperimentResponse

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])

@router.get("", response_model=List[OpportunityResponse])
def list_opportunities(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    opps = db.query(Opportunity).all()
    for o in opps:
        p = db.query(Project).filter(Project.id == o.project_id).first()
        pr = db.query(Problem).filter(Problem.id == o.problem_id).first()
        o.project_name = p.name if p else ""
        o.problem_title = pr.title if pr else ""
        o.evidence_count = db.query(OpportunityEvidence).filter(OpportunityEvidence.opportunity_id == o.id).count()
    return opps

@router.get("/{id}", response_model=OpportunityResponse)
def get_opportunity(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    o = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    p = db.query(Project).filter(Project.id == o.project_id).first()
    pr = db.query(Problem).filter(Problem.id == o.problem_id).first()
    o.project_name = p.name if p else ""
    o.problem_title = pr.title if pr else ""
    o.evidence_count = db.query(OpportunityEvidence).filter(OpportunityEvidence.opportunity_id == o.id).count()
    return o

@router.get("/{id}/evidence")
def get_evidence_for_opp(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    o = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    links = db.query(OpportunityEvidence).filter(OpportunityEvidence.opportunity_id == id).all()
    evidence_ids = [l.evidence_id for l in links]
    return db.query(Evidence).filter(Evidence.id.in_(evidence_ids)).all()

@router.post("/{id}/experiment", response_model=ExperimentResponse)
def create_experiment(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    o = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    e = Experiment(opportunity_id=id, title=f"Experiment for {o.title}", methodology="A/B Testing", success_criteria="Statistically significant improvement", status="planned")
    db.add(e)
    db.commit()
    db.refresh(e)
    return e

@router.get("/{id}/experiment", response_model=List[ExperimentResponse])
def get_experiments(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Experiment).filter(Experiment.opportunity_id == id).all()
