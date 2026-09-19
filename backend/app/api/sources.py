from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import User, Source
from app.dependencies import get_current_user
from app.schemas.sources import SourceCreate, SourceUpdate, SourceResponse, SourceImportRequest

router = APIRouter(prefix="/api/sources", tags=["sources"])

@router.post("", response_model=SourceResponse)
def create_source(req: SourceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    source = Source(**req.model_dump(), verification_status="unverified")
    db.add(source)
    db.commit()
    db.refresh(source)
    return source

@router.get("", response_model=List[SourceResponse])
def list_sources(type: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = db.query(Source)
    if type:
        q = q.filter(Source.source_type == type)
    return q.all()

@router.get("/{id}", response_model=SourceResponse)
def get_source(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    source = db.query(Source).filter(Source.id == id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    return source

@router.put("/{id}", response_model=SourceResponse)
def update_source(id: int, req: SourceUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    source = db.query(Source).filter(Source.id == id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    for key, val in req.model_dump(exclude_unset=True).items():
        setattr(source, key, val)
    db.commit()
    db.refresh(source)
    return source

@router.post("/import", response_model=SourceResponse)
def import_source(req: SourceImportRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    source = Source(title=f"Imported from {req.url}", url=req.url, source_type="web", verification_status="unverified")
    db.add(source)
    db.commit()
    db.refresh(source)
    return source
