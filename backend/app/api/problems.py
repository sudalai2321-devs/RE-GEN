from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import User, Problem
from app.dependencies import get_current_user
from app.schemas.problems import ProblemCreate, ProblemUpdate, ProblemResponse

router = APIRouter(prefix="/api/problems", tags=["problems"])

@router.post("", response_model=ProblemResponse)
def create_problem(req: ProblemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    problem = Problem(**req.model_dump())
    db.add(problem)
    db.commit()
    db.refresh(problem)
    return problem

@router.get("", response_model=List[ProblemResponse])
def list_problems(domain: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = db.query(Problem)
    if domain:
        q = q.filter(Problem.domain == domain)
    if search:
        q = q.filter(Problem.title.ilike(f"%{search}%"))
    return q.all()

@router.get("/{id}", response_model=ProblemResponse)
def get_problem(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    problem = db.query(Problem).filter(Problem.id == id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.put("/{id}", response_model=ProblemResponse)
def update_problem(id: int, req: ProblemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    problem = db.query(Problem).filter(Problem.id == id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    for key, val in req.model_dump(exclude_unset=True).items():
        setattr(problem, key, val)
    db.commit()
    db.refresh(problem)
    return problem
