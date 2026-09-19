import os

BASE_DIR = r"C:\Users\sudal\.gemini\antigravity\scratch\innovation-dna\backend"

def write_file(path, content):
    full_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

FILES = {}

FILES["app/jobs/__init__.py"] = ""

FILES["app/jobs/manager.py"] = """
import threading
import time
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import Job, Project, DNAItem, Gap, Opportunity, Evidence, Source

def create_job(db: Session, job_type: str, entity_type: str, entity_id: int) -> Job:
    job = Job(job_type=job_type, entity_type=entity_type, entity_id=entity_id, status="queued")
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

def run_analysis_job(job_id: int, project_id: int):
    thread = threading.Thread(target=_execute_analysis, args=(job_id, project_id), daemon=True)
    thread.start()

def _execute_analysis(job_id: int, project_id: int):
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        job.status = "running"
        job.started_at = datetime.now(timezone.utc)
        db.commit()
        
        project = db.query(Project).filter(Project.id == project_id).first()
        
        # Step 1: DNA extraction (mock)
        job.progress = 0.2
        project.status = "processing"
        db.commit()
        time.sleep(1)
        
        # Create mock DNA items
        _create_mock_dna(db, project_id, project)
        job.progress = 0.4
        project.status = "dna_extracted"
        db.commit()
        time.sleep(1)
        
        # Step 2: Gap analysis
        _create_mock_gaps(db, project_id, project)
        job.progress = 0.6
        project.status = "gap_detected"
        db.commit()
        time.sleep(1)
        
        # Step 3: Opportunity discovery
        _create_mock_opportunities(db, project_id, project)
        job.progress = 0.8
        project.status = "opportunity_discovery"
        db.commit()
        time.sleep(1)
        
        job.progress = 1.0
        job.status = "completed"
        project.status = "validated"
        job.completed_at = datetime.now(timezone.utc)
        db.commit()
    except Exception as e:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = "failed"
            job.error = str(e)
            db.commit()
        project = db.query(Project).filter(Project.id == project_id).first()
        if project:
            project.status = "failed"
            db.commit()
    finally:
        db.close()

def _create_mock_dna(db, project_id, project):
    # Create DNA items based on project info
    categories_and_values = [
        ("technology", f"Core technology used in {project.name}"),
        ("technology", "Machine Learning / Deep Learning models"),
        ("technology", "IoT sensor network infrastructure"),
        ("capability", "Real-time data acquisition and processing"),
        ("capability", "Pattern recognition in complex datasets"),
        ("capability", "Automated anomaly detection"),
        ("constraint", "High deployment cost in distributed environments"),
        ("constraint", "Requires continuous network connectivity"),
        ("constraint", "Limited accuracy in noisy conditions"),
        ("input", "Sensor data streams (vibration, temperature, pressure)"),
        ("input", "Historical maintenance records"),
        ("output", "Predictive maintenance alerts"),
        ("output", "Equipment health scores"),
        ("dependency", "Cloud computing infrastructure"),
        ("dependency", "Trained ML model with domain-specific data"),
        ("assumption", "Sufficient historical failure data available"),
        ("assumption", "Sensors can be retrofitted to existing equipment"),
        ("environment", "Industrial manufacturing facilities"),
        ("environment", "Requires 24/7 power and network"),
        ("failure_condition", "Sensor drift causing false positives"),
        ("failure_condition", "Insufficient training data for rare failure modes"),
        ("failure_condition", "High sensor deployment cost exceeding ROI"),
        ("problem", project.problem or "Predictive maintenance in industrial settings"),
        ("objective", project.objective or "Reduce unplanned equipment downtime"),
        ("outcome", project.outcome or "Partial success limited by deployment costs"),
    ]
    for cat, val in categories_and_values:
        item = DNAItem(
            project_id=project_id,
            category=cat,
            value=val,
            confidence=0.85,
            status="supported"
        )
        db.add(item)
    db.commit()

def _create_mock_gaps(db, project_id, project):
    gaps_data = [
        ("High deployment cost prevents scaling to small/medium facilities", "cost_barrier", 0.9, "strong"),
        ("Requires extensive domain-specific training data not available in new domains", "data_requirement", 0.85, "moderate"),
        ("Network connectivity dependency limits use in remote/harsh environments", "infrastructure_gap", 0.8, "strong"),
        ("Current approach optimized for manufacturing, not tested in other industries", "application_boundary", 0.7, "moderate"),
        ("Sensor technology may be applicable to structural health monitoring", "ai_hypothesis", 0.6, "hypothesis_only"),
    ]
    for desc, gap_type, conf, ev_status in gaps_data:
        gap = Gap(
            project_id=project_id,
            description=desc,
            gap_type=gap_type,
            confidence=conf,
            evidence_status=ev_status,
            reasoning=f"Based on analysis of {project.name}: {desc}"
        )
        db.add(gap)
    db.commit()

def _create_mock_opportunities(db, project_id, project):
    # Find some problems to match with
    from app.models.models import Problem
    problems = db.query(Problem).limit(3).all()
    
    for i, problem in enumerate(problems):
        opp = Opportunity(
            project_id=project_id,
            problem_id=problem.id,
            title=f"Apply {project.name} capabilities to {problem.domain}",
            rationale=f"The core capabilities from {project.name} (pattern recognition, anomaly detection) could potentially address '{problem.title}' if deployment constraints are resolved.",
            technology_fit=0.7 + (i * 0.05),
            environment_fit=0.5 + (i * 0.1),
            data_fit=0.6,
            infrastructure_fit=0.55,
            cost_fit=0.4,
            evidence_strength=0.65,
            status="identified",
            transferable_capabilities=["Pattern recognition", "Anomaly detection", "Real-time monitoring"],
            non_transferable_factors=["Industrial-specific sensor hardware", "Manufacturing-domain training data"],
            uncertainties=["Compatibility with target domain data formats", "Cost-effectiveness in new environment"],
            validation_requirements=["Prototype with target domain data", "Cost-benefit analysis", "Domain expert review"]
        )
        db.add(opp)
    db.commit()

def run_dna_extraction_job(job_id: int, project_id: int):
    thread = threading.Thread(target=_execute_dna_extraction, args=(job_id, project_id), daemon=True)
    thread.start()

def _execute_dna_extraction(job_id: int, project_id: int):
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        job.status = "running"
        job.started_at = datetime.now(timezone.utc)
        db.commit()
        project = db.query(Project).filter(Project.id == project_id).first()
        _create_mock_dna(db, project_id, project)
        project.status = "dna_extracted"
        job.progress = 1.0
        job.status = "completed"
        job.completed_at = datetime.now(timezone.utc)
        db.commit()
    except Exception as e:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job: job.status = "failed"; job.error = str(e)
        db.commit()
    finally:
        db.close()

def run_gap_analysis_job(job_id: int, project_id: int):
    thread = threading.Thread(target=_execute_gap_analysis, args=(job_id, project_id), daemon=True)
    thread.start()

def _execute_gap_analysis(job_id: int, project_id: int):
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        job.status = "running"
        job.started_at = datetime.now(timezone.utc)
        db.commit()
        project = db.query(Project).filter(Project.id == project_id).first()
        _create_mock_gaps(db, project_id, project)
        project.status = "gap_detected"
        job.progress = 1.0
        job.status = "completed"
        job.completed_at = datetime.now(timezone.utc)
        db.commit()
    except Exception as e:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job: job.status = "failed"; job.error = str(e)
        db.commit()
    finally:
        db.close()

def run_opportunity_job(job_id: int, project_id: int):
    thread = threading.Thread(target=_execute_opportunity_discovery, args=(job_id, project_id), daemon=True)
    thread.start()

def _execute_opportunity_discovery(job_id: int, project_id: int):
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        job.status = "running"
        job.started_at = datetime.now(timezone.utc)
        db.commit()
        project = db.query(Project).filter(Project.id == project_id).first()
        _create_mock_opportunities(db, project_id, project)
        project.status = "opportunity_discovery"
        job.progress = 1.0
        job.status = "completed"
        job.completed_at = datetime.now(timezone.utc)
        db.commit()
    except Exception as e:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job: job.status = "failed"; job.error = str(e)
        db.commit()
    finally:
        db.close()
"""

FILES["app/main.py"] = """
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.api import auth, dashboard, projects, documents, sources, evidence, problems, opportunities, experiments, jobs, search, admin
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Innovation DNA", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(projects.router)
app.include_router(documents.router)
app.include_router(sources.router)
app.include_router(evidence.router)
app.include_router(problems.router)
app.include_router(opportunities.router)
app.include_router(experiments.router)
app.include_router(jobs.router)
app.include_router(search.router)
app.include_router(admin.router)

@app.on_event("startup")
def startup():
    db = SessionLocal()
    try:
        from app.models.models import User
        if db.query(User).count() == 0:
            logger.info("Empty database detected. Running seed...")
            from seed.seed_data import seed_database
            seed_database(db)
            logger.info("Seed data loaded successfully.")
    except Exception as e:
        logger.error(f"Seed error: {e}")
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Innovation DNA API", "version": "1.0.0", "status": "running"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}
"""

FILES["seed/__init__.py"] = ""

FILES["seed/seed_data.py"] = """
from app.models.models import User, Project, Problem, Source, Technology, Capability, DNAItem, Gap, Opportunity, Experiment, Evidence, Job
from app.core.security import get_password_hash

def seed_database(db):
    admin = User(email="admin@innovationdna.ai", name="Admin User", password_hash=get_password_hash("admin123"), role="admin")
    demo = User(email="demo@innovationdna.ai", name="Demo User", password_hash=get_password_hash("demo123"), role="user")
    db.add_all([admin, demo])
    db.commit()

    projects_data = [
        ("Project AeroSense IoT", "IoT/Sensors", "Deploy smart sensors", "High cost of data routing", "Validated core capability", "N/A", True, "validated"),
        ("Google Glass", "Consumer Tech", "AR everywhere", "Privacy and social norms", "Failed as consumer product", "Social pushback", False, "failed"),
        ("Segway", "Transportation", "Personal mobility", "Not pedestrian or street friendly", "Niche B2B success", "Price and infrastructure mismatch", False, "failed"),
        ("Theranos Minilab", "Healthcare", "Blood testing revolution", "Scientific impossibility at scale", "Fraudulent failure", "Physics of microfluidics", False, "failed"),
        ("Quibi", "Media", "Short-form mobile video", "Pandemic hit, missing TV casting", "Shut down", "Misread consumer behavior", False, "failed"),
        ("Amazon Fire Phone", "Mobile", "3D UI & Shopping", "Late to market, high price", "Discontinued", "Lack of app ecosystem", False, "failed"),
        ("Microsoft Kinect", "Gaming", "Motion control", "Required large space, few hardcore games", "Discontinued for gaming, used in robotics", "Gimmick perception", False, "archived"),
        ("Nokia N-Gage", "Mobile Gaming", "Combine phone and console", "Awkward design, poor battery", "Discontinued", "Compromised both functions", False, "failed"),
        ("Juicero", "Appliance", "Smart juicing", "Overengineered, squeeze bags by hand", "Bankrupt", "No real value add over manual", False, "failed"),
        ("Solyndra Solar", "Energy", "Cylindrical solar panels", "Silicon prices dropped", "Bankrupt", "Economic model broke", False, "failed"),
        ("Project Ara Modular Phone", "Mobile", "Upgradable phone", "Fragile, heavy, complex", "Cancelled", "Physics and economics of modularity", False, "failed"),
        ("WebOS by Palm", "Software", "Modern mobile OS", "Hardware lagged behind Apple", "Sold to LG for TVs", "Too late to market", False, "archived"),
    ]

    for name, dom, obj, prob, out, fail, is_demo, status in projects_data:
        p = Project(name=name, domain=dom, objective=obj, problem=prob, outcome=out, failure_summary=fail, is_demo=is_demo, status=status, user_id=demo.id)
        db.add(p)
    db.commit()

    probs = [
        Problem(title="Rural healthcare access", domain="Healthcare", description="Lack of doctors in remote areas"),
        Problem(title="Urban traffic congestion", domain="Transportation", description="Too many cars"),
        Problem(title="Water scarcity in farming", domain="Agriculture", description="Droughts reducing crop yield"),
        Problem(title="Factory energy waste", domain="Manufacturing", description="Inefficient motors and HVAC"),
        Problem(title="Grid storage limits", domain="Energy", description="Intermittent renewables"),
        Problem(title="Remote student engagement", domain="Education", description="Zoom fatigue"),
    ]
    db.add_all(probs)
    db.commit()

    sources = [
        Source(title="IEEE Sensor Network Paper", url="http://ieee.org", source_type="paper", publisher="IEEE", is_demo=True, verification_status="verified"),
        Source(title="WHO Rural Health Report", url="http://who.int", source_type="report", publisher="WHO", is_demo=True, verification_status="verified"),
        Source(title="MIT Tech Review on AR", url="http://mit.edu", source_type="article", publisher="MIT", is_demo=True, verification_status="unverified"),
        Source(title="McKinsey Energy Transition", url="http://mckinsey.com", source_type="report", publisher="McKinsey", is_demo=True, verification_status="verified"),
    ]
    db.add_all(sources)
    db.commit()
    
    aero = db.query(Project).filter(Project.name == "Project AeroSense IoT").first()
    
    db.add(DNAItem(project_id=aero.id, category="technology", value="Low-power wide-area network (LPWAN)", status="supported"))
    db.add(Gap(project_id=aero.id, description="Battery life under cold temps", gap_type="environmental", confidence=0.9))
    
    prob_health = db.query(Problem).filter(Problem.title == "Rural healthcare access").first()
    opp = Opportunity(project_id=aero.id, problem_id=prob_health.id, title="LPWAN for remote health monitors", rationale="Reuse IoT for med data", status="identified", technology_fit=0.8, environment_fit=0.7, data_fit=0.9, infrastructure_fit=0.6, cost_fit=0.8, evidence_strength=0.75)
    db.add(opp)
    db.commit()
    
    exp = Experiment(opportunity_id=opp.id, title="Cold weather battery test", methodology="Lab freezer", success_criteria="> 1 week", status="completed")
    db.add(exp)
    db.commit()
    
    ev = Evidence(content="LPWAN reaches 10km", evidence_type="technical", verification_status="verified", source_id=sources[0].id)
    db.add(ev)
    db.commit()
    
    job = Job(job_type="analysis", entity_type="project", entity_id=aero.id, status="completed", progress=1.0)
    db.add(job)
    db.commit()
"""

for path, content in FILES.items():
    write_file(path, content)

print("Batch 3 created successfully.")
