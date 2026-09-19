from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import User, Evidence, Source
from app.dependencies import get_current_user
from app.schemas.evidence import EvidenceResponse, EvidenceUpdateRequest

router = APIRouter(prefix="/api/evidence", tags=["evidence"])

@router.get("", response_model=List[EvidenceResponse])
def list_evidence(verification_status: Optional[str] = None, source_id: Optional[int] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    q = db.query(Evidence)
    if verification_status:
        q = q.filter(Evidence.verification_status == verification_status)
    if source_id:
        q = q.filter(Evidence.source_id == source_id)
    items = q.all()
    for item in items:
        if item.source_id:
            item.source = db.query(Source).filter(Source.id == item.source_id).first()
    return items

@router.get("/{id}", response_model=EvidenceResponse)
def get_evidence(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    evidence = db.query(Evidence).filter(Evidence.id == id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    if evidence.source_id:
        evidence.source = db.query(Source).filter(Source.id == evidence.source_id).first()
    return evidence

@router.put("/{id}", response_model=EvidenceResponse)
def update_evidence(id: int, req: EvidenceUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    evidence = db.query(Evidence).filter(Evidence.id == id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    evidence.verification_status = req.verification_status
    db.commit()
    db.refresh(evidence)
    if evidence.source_id:
        evidence.source = db.query(Source).filter(Source.id == evidence.source_id).first()
    return evidence
