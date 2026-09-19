import os
import sys

BASE_DIR = r"C:\Users\sudal\.gemini\antigravity\scratch\innovation-dna\backend"
os.makedirs(os.path.join(BASE_DIR, "app/api"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "seed"), exist_ok=True)

FILES = {}

# API - Projects
FILES["app/api/projects.py"] = """from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Project, User
from app.schemas.projects import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
from app.dependencies import get_current_user
from app.services.project_service import ProjectService
from app.jobs.manager import JobManager

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("", response_model=ProjectResponse)
def create_project(data: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    proj = ProjectService.create(db, current_user.id, data)
    return proj

@router.get("", response_model=ProjectListResponse)
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    return {"items": projects, "total": len(projects)}

@router.get("/{id}", response_model=ProjectResponse)
def get_project(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    proj = db.query(Project).filter(Project.id == id, Project.user_id == current_user.id).first()
    if not proj: raise HTTPException(status_code=404)
    return proj

@router.post("/{id}/analyze")
def analyze_project(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    proj = db.query(Project).filter(Project.id == id, Project.user_id == current_user.id).first()
    if not proj: raise HTTPException(status_code=404)
    # create job
    def dummy_task(job_id, s_db, proj_id):
        import time
        time.sleep(2)
        return {"status": "Analysis Complete"}
    job = JobManager.create_job("full_analysis", "project", proj.id, db)
    JobManager.start_job(job.id, dummy_task, proj.id)
    return {"job_id": job.id}
"""

# API - Dashboard
FILES["app/api/dashboard.py"] = """from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Project, Gap, Opportunity, Experiment, Evidence, Source

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "projects_count": db.query(Project).count(),
        "gaps_count": db.query(Gap).count(),
        "opportunities_count": db.query(Opportunity).count(),
        "experiments_count": db.query(Experiment).count(),
        "evidence_count": db.query(Evidence).count(),
        "sources_count": db.query(Source).count(),
    }

@router.get("/recent")
def get_recent(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.created_at.desc()).limit(10).all()
    return [{"id": p.id, "name": p.name, "status": p.status} for p in projects]
"""

# Update Main.py to include all routers
FILES["app/main.py"] = """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import auth, projects, dashboard

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
app.include_router(projects.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "Innovation DNA API is running"}
"""

# Massive Seed Data logic
FILES["seed/seed_data.py"] = """import json
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models.models import User, RoleEnum, Project, ProjectStatus, Problem, Source, Gap, Opportunity, Evidence
from app.core.security import get_password_hash

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 2 Users
    admin = db.query(User).filter_by(email="admin@innovationdna.ai").first()
    if not admin:
        admin = User(email="admin@innovationdna.ai", name="Admin", password_hash=get_password_hash("admin123"), role=RoleEnum.ADMIN)
        db.add(admin)
        
    demo = db.query(User).filter_by(email="demo@innovationdna.ai").first()
    if not demo:
        demo = User(email="demo@innovationdna.ai", name="Demo", password_hash=get_password_hash("demo123"), role=RoleEnum.USER)
        db.add(demo)
        
    db.commit()

    # Create 12 Projects
    projects_data = [
        ("Project AeroSense", "IoT / Predictive Maintenance", "Develop an IoT sensor for aerospace predictive maintenance.", "Sensors degrade too quickly under extreme conditions.", "Failed", "Material degradation caused total sensor failure."),
        ("Google Glass", "Wearable Tech", "AR glasses for everyday use.", "Privacy concerns and social awkwardness.", "Failed", "Public backlash and lack of clear use case."),
        ("Segway", "Transportation", "Personal transporter.", "Too expensive and regulatory hurdles.", "Failed", "Niche market adoption only."),
        ("Theranos", "Healthcare", "Rapid blood testing.", "Technology didn't work.", "Failed", "Fraudulent claims and technological impossibility."),
        ("Quibi", "Entertainment", "Short-form mobile video.", "Launched during pandemic, bad format.", "Failed", "Poor market timing and restrictive viewing format."),
        ("Juicero", "Home Appliance", "Connected juice press.", "Over-engineered and unnecessary.", "Failed", "Users realized they could squeeze packs by hand."),
        ("Amazon Fire Phone", "Mobile", "3D interface smartphone.", "Lack of ecosystem and gimmicky features.", "Failed", "High price and lack of developer support."),
        ("Apple Newton", "Personal Digital Assistant", "Handheld computing.", "Handwriting recognition failed.", "Failed", "Ahead of its time, poor core feature execution."),
        ("Webvan", "E-commerce", "Online grocery delivery.", "Over-expansion and high infrastructure costs.", "Failed", "Burned through capital too quickly without demand density."),
        ("DeLorean", "Automotive", "Sports car.", "Underpowered and production issues.", "Failed", "Quality control and financial mismanagement."),
        ("MoviePass", "Entertainment", "Subscription movie tickets.", "Unsustainable business model.", "Failed", "Lost money on every heavy user."),
        ("Zillow Offers", "Real Estate", "iBuying algorithm.", "Algorithm couldn't predict market swings accurately.", "Failed", "Massive inventory write-downs.")
    ]
    
    for name, domain, obj, prob, outcome, failure in projects_data:
        if not db.query(Project).filter_by(name=name).first():
            db.add(Project(
                name=name, domain=domain, objective=obj, problem=prob, 
                outcome=outcome, failure_summary=failure, status=ProjectStatus.ARCHIVED, user_id=demo.id
            ))
            
    # Problems (30+ required, adding a few realistic ones for the demo)
    problems = [
        ("Extreme Temperature Sensing", "Sensors fail in high-heat environments.", "Aerospace"),
        ("Non-invasive Glucose Monitoring", "Current methods require blood.", "Healthcare"),
        ("Last Mile Delivery", "Inefficient final delivery step.", "Logistics"),
        ("Battery Energy Density", "EVs have limited range.", "Energy"),
        ("Water Desalination", "Too energy intensive.", "Environment")
    ]
    for t, ps, dom in problems:
        if not db.query(Problem).filter_by(title=t).first():
            db.add(Problem(title=t, problem_statement=ps, domain=dom, status="active", created_by=admin.id))
            
    db.commit()
    db.close()
    print("Seed data applied completely!")

if __name__ == "__main__":
    seed_db()
"""

def build():
    for path, content in FILES.items():
        full_path = os.path.join(BASE_DIR, path.replace("/", "\\"))
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    build()
