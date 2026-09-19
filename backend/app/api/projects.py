from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, Project, DNAItem, Gap, Opportunity
from app.dependencies import get_current_user
from app.schemas.projects import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
from app.schemas.jobs import JobResponse
from app.jobs.manager import create_job, run_analysis_job, run_dna_extraction_job, run_gap_analysis_job, run_opportunity_job

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("", response_model=ProjectResponse)
def create_project(req: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = Project(**req.model_dump(), user_id=current_user.id, status="draft")
    db.add(project)
    db.commit()
    db.refresh(project)
    project.documents_count = 0
    project.evidence_count = 0
    project.opportunities_count = 0
    return project

@router.get("", response_model=List[ProjectListResponse])
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    for p in projects:
        p.documents_count = 0
        p.evidence_count = 0
        p.opportunities_count = db.query(Opportunity).filter(Opportunity.project_id == p.id).count()
    return projects

@router.get("/{id}", response_model=ProjectResponse)
def get_project(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.documents_count = 0
    project.evidence_count = 0
    project.opportunities_count = db.query(Opportunity).filter(Opportunity.project_id == project.id).count()
    return project

@router.put("/{id}", response_model=ProjectResponse)
def update_project(id: int, req: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, val in req.model_dump(exclude_unset=True).items():
        setattr(project, key, val)
    db.commit()
    db.refresh(project)
    project.documents_count = 0
    project.evidence_count = 0
    project.opportunities_count = db.query(Opportunity).filter(Opportunity.project_id == project.id).count()
    return project

@router.delete("/{id}", status_code=204)
def delete_project(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return None

@router.post("/{id}/analyze", response_model=JobResponse)
def analyze_project(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    job = create_job(db, "analysis", "project", id)
    # Run synchronously so the response only returns after analysis completes
    from app.jobs.manager import run_analysis_sync
    run_analysis_sync(job.id, project.id)
    # Re-fetch the job to get the updated status
    db.refresh(job)
    return job

@router.get("/{id}/dna")
def get_dna(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(DNAItem).filter(DNAItem.project_id == id).all()
    return items

@router.post("/{id}/dna/extract", response_model=JobResponse)
def extract_dna(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = create_job(db, "dna_extraction", "project", id)
    run_dna_extraction_job(job.id, id)
    return job

@router.get("/{id}/gaps")
def get_gaps(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    gaps = db.query(Gap).filter(Gap.project_id == id).all()
    return gaps

@router.post("/{id}/gaps/analyze", response_model=JobResponse)
def analyze_gaps(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = create_job(db, "gap_analysis", "project", id)
    run_gap_analysis_job(job.id, id)
    return job

@router.get("/{id}/opportunities")
def get_opportunities(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    opps = db.query(Opportunity).filter(Opportunity.project_id == id).all()
    return opps

@router.post("/{id}/opportunities/discover", response_model=JobResponse)
def discover_opportunities(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = create_job(db, "opportunity_discovery", "project", id)
    run_opportunity_job(job.id, id)
    return job
