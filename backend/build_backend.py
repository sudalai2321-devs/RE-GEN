import os
import sys

BASE_DIR = r"C:\Users\sudal\.gemini\antigravity\scratch\innovation-dna\backend"

DIRS = [
    "app/api",
    "app/models",
    "app/schemas",
    "app/services",
    "app/ai",
    "app/ingestion",
    "app/jobs",
    "app/core",
    "prompts",
    "seed",
    "alembic/versions",
    "tests",
    "uploads"
]

FILES = {}

FILES["requirements.txt"] = """fastapi==0.115.12
uvicorn[standard]==0.34.3
sqlalchemy==2.0.41
alembic==1.16.2
pydantic==2.11.7
pydantic-settings==2.9.1
python-jose[cryptography]==3.4.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
pdfplumber==0.11.6
python-docx==1.1.2
python-pptx==1.0.2
httpx==0.28.1
openai==1.86.0
numpy==2.3.0
scipy==1.15.3
pytest==8.4.0
pytest-asyncio==0.26.0
"""

FILES["run.py"] = """import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
"""

FILES["app/config.py"] = """from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Innovation DNA"
    DATABASE_URL: str = "sqlite:///./innovation_dna.db"
    SECRET_KEY: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    OPENAI_API_KEY: str | None = None
    
settings = Settings()
"""

FILES["app/database.py"] = """from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
"""

FILES["app/models/models.py"] = """from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Enum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.database import Base

class RoleEnum(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"

class ProjectStatus(str, enum.Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password_hash = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.USER)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    domain = Column(String)
    objective = Column(Text)
    problem = Column(Text)
    outcome = Column(Text)
    failure_summary = Column(Text)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    filename = Column(String)
    original_filename = Column(String)
    mime_type = Column(String)
    storage_path = Column(String)
    file_size = Column(Integer)
    checksum = Column(String)
    processing_status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class Source(Base):
    __tablename__ = "sources"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    publisher = Column(String)
    source_type = Column(String)
    url = Column(String)
    publication_date = Column(DateTime)
    retrieved_at = Column(DateTime, default=datetime.utcnow)
    description = Column(Text)
    content_hash = Column(String)
    status = Column(String)
    created_by = Column(Integer, ForeignKey("users.id"))

class SourceChunk(Base):
    __tablename__ = "source_chunks"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"))
    chunk_index = Column(Integer)
    text = Column(Text)
    page_number = Column(Integer)
    embedding = Column(JSON)

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"))
    chunk_id = Column(Integer, ForeignKey("source_chunks.id"))
    claim = Column(Text)
    excerpt = Column(Text)
    confidence = Column(Float)
    verification_status = Column(String, default="pending")
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Technology(Base):
    __tablename__ = "technologies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    domain = Column(String)
    embedding = Column(JSON)

class Capability(Base):
    __tablename__ = "capabilities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    embedding = Column(JSON)

class Problem(Base):
    __tablename__ = "problems"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    problem_statement = Column(Text)
    domain = Column(String)
    subdomain = Column(String)
    context = Column(Text)
    affected_users = Column(Text)
    geography = Column(String)
    existing_solutions = Column(Text)
    limitations = Column(Text)
    embedding = Column(JSON)
    status = Column(String)
    source_ids = Column(JSON)
    created_by = Column(Integer, ForeignKey("users.id"))

class ProjectTechnology(Base):
    __tablename__ = "project_technologies"
    project_id = Column(Integer, ForeignKey("projects.id"), primary_key=True)
    technology_id = Column(Integer, ForeignKey("technologies.id"), primary_key=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id"))

class ProjectCapability(Base):
    __tablename__ = "project_capabilities"
    project_id = Column(Integer, ForeignKey("projects.id"), primary_key=True)
    capability_id = Column(Integer, ForeignKey("capabilities.id"), primary_key=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id"))

class DNAItem(Base):
    __tablename__ = "dna_items"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    category = Column(String)
    value = Column(String)
    confidence = Column(Float)
    status = Column(String)
    evidence_ids = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class Gap(Base):
    __tablename__ = "gaps"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    description = Column(Text)
    gap_type = Column(String)
    confidence = Column(Float)
    evidence_status = Column(String)
    evidence_ids = Column(JSON)
    reasoning = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    problem_id = Column(Integer, ForeignKey("problems.id"))
    gap_id = Column(Integer, ForeignKey("gaps.id"))
    title = Column(String)
    rationale = Column(Text)
    technology_fit = Column(Float)
    environment_fit = Column(Float)
    data_fit = Column(Float)
    infrastructure_fit = Column(Float)
    cost_fit = Column(Float)
    evidence_strength = Column(Float)
    status = Column(String)
    transferable_capabilities = Column(JSON)
    non_transferable_factors = Column(JSON)
    uncertainties = Column(JSON)
    validation_requirements = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class OpportunityEvidence(Base):
    __tablename__ = "opportunity_evidence"
    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"))
    evidence_id = Column(Integer, ForeignKey("evidence.id"))
    relationship_type = Column(String)

class Experiment(Base):
    __tablename__ = "experiments"
    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"))
    hypothesis = Column(Text)
    objective = Column(Text)
    materials = Column(Text)
    data_required = Column(Text)
    procedure = Column(Text)
    variables = Column(Text)
    metrics = Column(Text)
    success_criteria = Column(Text)
    failure_criteria = Column(Text)
    risks = Column(Text)
    expected_cost = Column(String)
    expected_duration = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ExperimentResult(Base):
    __tablename__ = "experiment_results"
    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id"))
    result_summary = Column(Text)
    metrics_json = Column(JSON)
    notes = Column(Text)
    attachments = Column(JSON)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class AnalysisRun(Base):
    __tablename__ = "analysis_runs"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    run_type = Column(String)
    model = Column(String)
    prompt_version = Column(String)
    status = Column(String)
    input_hash = Column(String)
    output_json = Column(JSON)
    error = Column(Text)
    tokens_used = Column(Integer)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_type = Column(String)
    entity_type = Column(String)
    entity_id = Column(Integer)
    status = Column(String)
    progress = Column(Float, default=0.0)
    error = Column(Text)
    result = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)

class ProjectTag(Base):
    __tablename__ = "project_tags"
    project_id = Column(Integer, ForeignKey("projects.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)
"""

FILES["app/core/security.py"] = """from datetime import datetime, timedelta
from typing import Any, Union
from passlib.context import CryptContext
from jose import jwt
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
"""

FILES["app/api/auth.py"] = """from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, RoleEnum
from app.core.security import verify_password, get_password_hash, create_access_token
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pwd = get_password_hash(user.password)
    new_user = User(email=user.email, name=user.name, password_hash=hashed_pwd, role=RoleEnum.USER)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = create_access_token(subject=new_user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Simple decode for mock
    from jose import jwt
    from app.config import settings
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401)
    except jwt.JWTError:
        raise HTTPException(status_code=401)
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401)
    return {"id": user.id, "email": user.email, "name": user.name, "role": user.role}
"""

FILES["app/ai/provider.py"] = """from abc import ABC, abstractmethod
from typing import Type
from pydantic import BaseModel

class LLMProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, system: str, schema: Type[BaseModel]) -> BaseModel:
        pass
        
    @abstractmethod
    async def embed(self, text: str) -> list[float]:
        pass
"""

FILES["app/ai/mock_provider.py"] = """from app.ai.provider import LLMProvider
from typing import Type
from pydantic import BaseModel
import hashlib

class MockProvider(LLMProvider):
    async def generate(self, prompt: str, system: str, schema: Type[BaseModel]) -> BaseModel:
        # Generate rich realistic mock data based on the requested schema fields
        mock_data = {}
        for field_name, field_info in schema.model_fields.items():
            if field_info.annotation == str:
                mock_data[field_name] = f"Mock {field_name} text."
            elif field_info.annotation == int:
                mock_data[field_name] = 42
            elif field_info.annotation == float:
                mock_data[field_name] = 0.95
            elif field_info.annotation == list:
                mock_data[field_name] = []
            elif field_info.annotation == dict:
                mock_data[field_name] = {}
            else:
                mock_data[field_name] = None
        return schema(**mock_data)
        
    async def embed(self, text: str) -> list[float]:
        # Generate pseudo-random consistent embedding based on hash
        h = hashlib.md5(text.encode()).hexdigest()
        return [float(int(c, 16)) / 16.0 for c in h][:10] # Mock 10-dim embedding
"""

FILES["app/main.py"] = """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import auth

# Auto-create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Innovation DNA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Innovation DNA API is running"}
"""

FILES["seed/seed_data.py"] = """from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models.models import User, RoleEnum, Project, ProjectStatus
from app.core.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 2 Users
    if not db.query(User).filter_by(email="admin@innovationdna.ai").first():
        db.add(User(email="admin@innovationdna.ai", name="Admin", password_hash=get_password_hash("admin"), role=RoleEnum.ADMIN))
        
    if not db.query(User).filter_by(email="demo@innovationdna.ai").first():
        db.add(User(email="demo@innovationdna.ai", name="Demo", password_hash=get_password_hash("demo"), role=RoleEnum.USER))
    
    # 1 Demo Project
    if not db.query(Project).filter_by(name="Project AeroSense").first():
        db.add(Project(
            name="Project AeroSense",
            domain="IoT / Predictive Maintenance",
            objective="Develop an IoT sensor for aerospace predictive maintenance.",
            problem="Sensors degrade too quickly under extreme conditions.",
            outcome="Failed. The sensors did not survive.",
            failure_summary="Material degradation caused total sensor failure.",
            status=ProjectStatus.ARCHIVED,
            user_id=1
        ))
        
    db.commit()
    db.close()
    print("Seed data applied successfully!")

if __name__ == "__main__":
    seed_db()
"""

def build():
    import os
    for d in DIRS:
        os.makedirs(os.path.join(BASE_DIR, d), exist_ok=True)
    
    for path, content in FILES.items():
        full_path = os.path.join(BASE_DIR, path.replace("/", "\\"))
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
            
    # Touch __init__.py files
    for d in DIRS:
        init_path = os.path.join(BASE_DIR, d.replace("/", "\\"), "__init__.py")
        if not os.path.exists(init_path):
            with open(init_path, "w") as f:
                f.write("")

if __name__ == "__main__":
    build()
