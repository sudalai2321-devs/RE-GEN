import os
import sys

BASE_DIR = r"C:\Users\sudal\.gemini\antigravity\scratch\innovation-dna\backend"
os.makedirs(os.path.join(BASE_DIR, "app/schemas"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "app/api"), exist_ok=True)

FILES = {}

# Dependencies
FILES["app/dependencies.py"] = """from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, RoleEnum
from app.config import settings
from app.core.security import verify_password
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    return current_user

def get_llm_provider():
    from app.ai.mock_provider import MockProvider
    from app.ai.openai_provider import OpenAIProvider
    if settings.OPENAI_API_KEY:
        return OpenAIProvider()
    return MockProvider()

def get_storage_service():
    from app.services.storage_service import LocalStorageService
    return LocalStorageService()
"""

# Schemas - auth.py
FILES["app/schemas/auth.py"] = """from pydantic import BaseModel

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

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
"""

# Schemas - projects.py
FILES["app/schemas/projects.py"] = """from pydantic import BaseModel
from typing import Optional, List

class ProjectCreate(BaseModel):
    name: str
    domain: str
    objective: str
    problem: str

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None
    objective: Optional[str] = None
    problem: Optional[str] = None
    outcome: Optional[str] = None
    failure_summary: Optional[str] = None
    status: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    name: str
    domain: str
    objective: str
    problem: str
    outcome: Optional[str]
    failure_summary: Optional[str]
    status: str
    dna_items_count: int = 0
    gaps_count: int = 0
    opportunities_count: int = 0

class ProjectListResponse(BaseModel):
    items: List[ProjectResponse]
    total: int
"""

# Schemas - ai.py
FILES["app/schemas/ai.py"] = """from pydantic import BaseModel
from typing import List, Optional

class ProjectDNASchema(BaseModel):
    category: str
    value: str
    confidence: float
    evidence_ids: List[int] = []

class GapAnalysisSchema(BaseModel):
    description: str
    gap_type: str
    confidence: float
    evidence_ids: List[int] = []
    reasoning: str

class ProblemMatchSchema(BaseModel):
    problem_id: int
    match_score: float
    reasoning: str

class OpportunitySchema(BaseModel):
    title: str
    rationale: str
    technology_fit: float
    environment_fit: float
    data_fit: float
    infrastructure_fit: float
    cost_fit: float

class TransferabilitySchema(BaseModel):
    transferable_capabilities: List[str]
    non_transferable_factors: List[str]
    uncertainties: List[str]
    validation_requirements: List[str]

class ExperimentPlanSchema(BaseModel):
    hypothesis: str
    objective: str
    procedure: str
    metrics: str
"""

def build():
    for path, content in FILES.items():
        full_path = os.path.join(BASE_DIR, path.replace("/", "\\"))
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    build()
