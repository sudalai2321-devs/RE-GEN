import os
import textwrap

BASE_DIR = r"C:\Users\sudal\.gemini\antigravity\scratch\innovation-dna\backend"

def write_file(path, content):
    full_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

FILES = {}

FILES["app/schemas/__init__.py"] = ""

FILES["app/schemas/base.py"] = """
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BaseResponse(BaseModel):
    model_config = {'from_attributes': True}
"""

FILES["app/schemas/auth.py"] = """
from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    model_config = {'from_attributes': True}

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
"""

FILES["app/schemas/projects.py"] = """
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProjectBase(BaseModel):
    name: str
    domain: Optional[str] = None
    objective: Optional[str] = None
    problem: Optional[str] = None
    outcome: Optional[str] = None
    failure_summary: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    status: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    is_demo: bool
    documents_count: int = 0
    evidence_count: int = 0
    opportunities_count: int = 0
    model_config = {'from_attributes': True}

class ProjectListResponse(ProjectResponse):
    pass
"""

FILES["app/schemas/documents.py"] = """
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentResponse(BaseModel):
    id: int
    project_id: int
    filename: str
    file_path: str
    mime_type: Optional[str]
    size_bytes: Optional[int]
    status: str
    created_at: datetime
    model_config = {'from_attributes': True}
"""

FILES["app/schemas/sources.py"] = """
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SourceBase(BaseModel):
    title: str
    url: Optional[str] = None
    source_type: str
    publisher: Optional[str] = None
    publication_date: Optional[datetime] = None

class SourceCreate(SourceBase):
    pass

class SourceUpdate(SourceBase):
    pass

class SourceResponse(SourceBase):
    id: int
    verification_status: str
    created_at: datetime
    is_demo: bool
    model_config = {'from_attributes': True}

class SourceImportRequest(BaseModel):
    url: str
"""

FILES["app/schemas/evidence.py"] = """
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.sources import SourceResponse

class EvidenceResponse(BaseModel):
    id: int
    content: str
    evidence_type: str
    verification_status: str
    source_id: Optional[int] = None
    source: Optional[SourceResponse] = None
    created_at: datetime
    model_config = {'from_attributes': True}

class EvidenceUpdateRequest(BaseModel):
    verification_status: str
"""

FILES["app/schemas/problems.py"] = """
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProblemBase(BaseModel):
    title: str
    domain: str
    description: Optional[str] = None

class ProblemCreate(ProblemBase):
    pass

class ProblemUpdate(ProblemBase):
    pass

class ProblemResponse(ProblemBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = {'from_attributes': True}
"""

FILES["app/schemas/opportunities.py"] = """
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.evidence import EvidenceResponse

class OpportunityResponse(BaseModel):
    id: int
    project_id: int
    problem_id: int
    title: str
    rationale: str
    status: str
    technology_fit: float
    environment_fit: float
    data_fit: float
    infrastructure_fit: float
    cost_fit: float
    evidence_strength: float
    created_at: datetime
    project_name: str = ""
    problem_title: str = ""
    evidence_count: int = 0
    model_config = {'from_attributes': True}

class OpportunityDetailResponse(OpportunityResponse):
    evidence: List[EvidenceResponse] = []
"""

FILES["app/schemas/experiments.py"] = """
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class ExperimentBase(BaseModel):
    title: str
    methodology: str
    success_criteria: str
    status: str

class ExperimentResponse(ExperimentBase):
    id: int
    opportunity_id: int
    created_at: datetime
    model_config = {'from_attributes': True}

class ExperimentUpdate(BaseModel):
    title: Optional[str] = None
    methodology: Optional[str] = None
    success_criteria: Optional[str] = None
    status: Optional[str] = None

class ExperimentResultCreate(BaseModel):
    metric_name: str
    metric_value: float
    notes: Optional[str] = None
    raw_data: Optional[Dict[str, Any]] = None

class ExperimentResultResponse(BaseModel):
    id: int
    experiment_id: int
    metric_name: str
    metric_value: float
    notes: Optional[str] = None
    raw_data: Optional[Dict[str, Any]] = None
    recorded_at: datetime
    model_config = {'from_attributes': True}
"""

FILES["app/schemas/jobs.py"] = """
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JobResponse(BaseModel):
    id: int
    job_type: str
    entity_type: str
    entity_id: int
    status: str
    progress: float
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    model_config = {'from_attributes': True}
"""

FILES["app/schemas/dashboard.py"] = """
from pydantic import BaseModel
from typing import List
from app.schemas.projects import ProjectResponse

class DashboardStatsResponse(BaseModel):
    projects_count: int
    gaps_count: int
    opportunities_count: int
    experiments_count: int
    evidence_count: int
    verified_sources_count: int

class RecentAnalysisResponse(BaseModel):
    projects: List[ProjectResponse]
"""

FILES["app/schemas/search.py"] = """
from pydantic import BaseModel
from typing import List, Optional

class SearchResultItem(BaseModel):
    type: str
    id: int
    title: str
    subtitle: Optional[str] = None

class SearchResponse(BaseModel):
    results: List[SearchResultItem]
"""

FILES["app/api/__init__.py"] = ""

FILES["app/api/auth.py"] = """
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.core.security import verify_password, get_password_hash, create_access_token
from app.dependencies import get_current_user
from pydantic import BaseModel
from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse, UserResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=AuthResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=req.email, name=req.name, password_hash=get_password_hash(req.password), role="user")
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(subject=user.id)
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name, "role": user.role}}

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = create_access_token(subject=user.id)
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name, "role": user.role}}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "name": current_user.name, "role": current_user.role}
"""

FILES["app/api/dashboard.py"] = """
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
    
    # We can approximate experiments/evidence count, or do proper joins
    experiments_count = db.query(Experiment).join(Opportunity).join(Project).filter(Project.user_id == current_user.id).count()
    
    evidence_count = db.query(Evidence).count()
    verified_sources_count = db.query(Source).filter(Source.verification_status == 'verified').count()
    
    return DashboardStatsResponse(
        projects_count=projects_count,
        gaps_count=gaps_count,
        opportunities_count=opportunities_count,
        experiments_count=experiments_count,
        evidence_count=evidence_count,
        verified_sources_count=verified_sources_count
    )

@router.get("/recent", response_model=RecentAnalysisResponse)
def get_recent(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.user_id == current_user.id).order_by(Project.created_at.desc()).limit(10).all()
    
    for p in projects:
        p.documents_count = 0
        p.evidence_count = 0
        p.opportunities_count = db.query(Opportunity).filter(Opportunity.project_id == p.id).count()
        
    return RecentAnalysisResponse(projects=projects)
"""

FILES["app/api/projects.py"] = """
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
    run_analysis_job(job.id, project.id)
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
"""

FILES["app/api/documents.py"] = """
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import User, Project, Document
from app.dependencies import get_current_user
from app.schemas.documents import DocumentResponse
from app.services.storage_service import LocalStorageService

router = APIRouter(prefix="/api/projects", tags=["documents"])
storage = LocalStorageService()

@router.post("/{id}/documents", response_model=DocumentResponse)
async def upload_document(id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    content = await file.read()
    filepath, checksum = storage.save(content, file.filename)
    
    doc = Document(
        project_id=project.id,
        filename=file.filename,
        file_path=filepath,
        mime_type=file.content_type,
        size_bytes=len(content),
        content_hash=checksum,
        status="uploaded"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.get("/{id}/documents", response_model=List[DocumentResponse])
def list_documents(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    docs = db.query(Document).filter(Document.project_id == id).all()
    return docs
"""

FILES["app/api/sources.py"] = """
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
"""

for path, content in FILES.items():
    write_file(path, content)

print("Batch 1 created successfully.")
