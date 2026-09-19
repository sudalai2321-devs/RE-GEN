from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import User, Project, Problem, Source, Opportunity
from app.dependencies import get_current_user
from app.schemas.search import SearchResponse, SearchResultItem

router = APIRouter(prefix="/api/search", tags=["search"])

@router.get("", response_model=SearchResponse)
def search(q: str, type: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = []
    if not type or type == "project":
        ps = db.query(Project).filter(Project.name.ilike(f"%{q}%")).all()
        for p in ps:
            results.append(SearchResultItem(type="project", id=p.id, title=p.name, subtitle=p.domain))
    if not type or type == "problem":
        pr = db.query(Problem).filter(Problem.title.ilike(f"%{q}%") | Problem.domain.ilike(f"%{q}%")).all()
        for p in pr:
            results.append(SearchResultItem(type="problem", id=p.id, title=p.title, subtitle=p.domain))
    if not type or type == "source":
        ss = db.query(Source).filter(Source.title.ilike(f"%{q}%")).all()
        for s in ss:
            results.append(SearchResultItem(type="source", id=s.id, title=s.title, subtitle=s.publisher))
    if not type or type == "opportunity":
        ops = db.query(Opportunity).filter(Opportunity.title.ilike(f"%{q}%")).all()
        for o in ops:
            results.append(SearchResultItem(type="opportunity", id=o.id, title=o.title, subtitle=o.status))
            
    return SearchResponse(results=results)
