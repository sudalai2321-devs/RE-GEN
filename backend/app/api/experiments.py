from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, Experiment, ExperimentResult
from app.dependencies import get_current_user
from app.schemas.experiments import ExperimentResponse, ExperimentUpdate, ExperimentResultCreate, ExperimentResultResponse

router = APIRouter(prefix="/api/experiments", tags=["experiments"])

@router.get("/{id}", response_model=ExperimentResponse)
def get_experiment(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    e = db.query(Experiment).filter(Experiment.id == id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return e

@router.put("/{id}", response_model=ExperimentResponse)
def update_experiment(id: int, req: ExperimentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    e = db.query(Experiment).filter(Experiment.id == id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Experiment not found")
    for key, val in req.model_dump(exclude_unset=True).items():
        setattr(e, key, val)
    db.commit()
    db.refresh(e)
    return e

@router.post("/{id}/results", response_model=ExperimentResultResponse)
def add_result(id: int, req: ExperimentResultCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    r = ExperimentResult(**req.model_dump(), experiment_id=id)
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

@router.get("/{id}/results", response_model=List[ExperimentResultResponse])
def get_results(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ExperimentResult).filter(ExperimentResult.experiment_id == id).all()
