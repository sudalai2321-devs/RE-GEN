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
