from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Source, Project, Problem, Evidence, Job, AnalysisRun
from app.dependencies import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/stats")
def stats(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return {
        "sources": db.query(Source).count(),
        "projects": db.query(Project).count(),
        "problems": db.query(Problem).count(),
        "evidence": db.query(Evidence).count(),
        "jobs": db.query(Job).count(),
        "users": db.query(User).count()
    }

@router.get("/sources")
def get_sources(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(Source).all()

@router.get("/projects")
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(Project).all()

@router.get("/problems")
def get_problems(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(Problem).all()

@router.get("/evidence")
def get_evidence(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(Evidence).all()

@router.get("/jobs")
def get_jobs(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(Job).all()

@router.get("/analysis-runs")
def get_analysis_runs(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(AnalysisRun).all()

@router.post("/sources/{id}/verify")
def verify_source(id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    s = db.query(Source).filter(Source.id == id).first()
    if s:
        s.verification_status = "verified"
        db.commit()
    return s

@router.post("/evidence/{id}/verify")
def verify_evidence(id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    e = db.query(Evidence).filter(Evidence.id == id).first()
    if e:
        e.verification_status = "verified"
        db.commit()
    return e

@router.post("/jobs/{id}/retry")
def retry_job(id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    j = db.query(Job).filter(Job.id == id).first()
    if j:
        j.status = "queued"
        db.commit()
    return j
