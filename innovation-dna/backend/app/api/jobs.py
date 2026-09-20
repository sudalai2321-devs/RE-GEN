from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, Job
from app.dependencies import get_current_user
from app.schemas.jobs import JobResponse

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.get("/{id}", response_model=JobResponse)
def get_job(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("", response_model=List[JobResponse])
def list_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Simple returning all for now, or filter by user projects
    return db.query(Job).all()
