import os
import sys

BASE_DIR = r"C:\Users\sudal\.gemini\antigravity\scratch\innovation-dna\backend"
os.makedirs(os.path.join(BASE_DIR, "app/services"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "app/ai"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "app/jobs"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "app/ingestion"), exist_ok=True)

FILES = {}

# Job Manager
FILES["app/jobs/manager.py"] = """import threading
import uuid
import time
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.models import Job
from datetime import datetime

class JobManager:
    @staticmethod
    def create_job(job_type: str, entity_type: str, entity_id: int, db: Session):
        job = Job(job_type=job_type, entity_type=entity_type, entity_id=entity_id, status="pending")
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def start_job(job_id: int, target_func, *args):
        def run_in_thread():
            db = SessionLocal()
            job = db.query(Job).filter(Job.id == job_id).first()
            if not job:
                db.close()
                return
            job.status = "running"
            job.started_at = datetime.utcnow()
            db.commit()
            try:
                result = target_func(job_id, db, *args)
                job.status = "completed"
                job.progress = 100.0
                job.result = result
            except Exception as e:
                job.status = "failed"
                job.error = str(e)
            finally:
                job.completed_at = datetime.utcnow()
                db.commit()
                db.close()

        thread = threading.Thread(target=run_in_thread)
        thread.start()
        
    @staticmethod
    def update_progress(job_id: int, progress: float, db: Session):
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.progress = progress
            db.commit()
"""

# AI pipeline
FILES["app/ai/extraction.py"] = """from app.models.models import DNAItem, Project, Evidence
from sqlalchemy.orm import Session
from app.schemas.ai import ProjectDNASchema
from typing import List

class ExtractionPipeline:
    def __init__(self, provider):
        self.provider = provider
        
    async def extract_dna(self, project_id: int, db: Session) -> List[DNAItem]:
        # Mock logic
        project = db.query(Project).filter(Project.id == project_id).first()
        prompt = f"Extract DNA for project {project.name}"
        res = await self.provider.generate(prompt, "System", ProjectDNASchema)
        
        item = DNAItem(
            project_id=project_id,
            category=res.category,
            value=res.value,
            confidence=res.confidence,
            status="extracted",
            evidence_ids=res.evidence_ids
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return [item]
"""

# Services
FILES["app/services/storage_service.py"] = """import os
import shutil
import uuid

class LocalStorageService:
    def __init__(self, base_dir="uploads"):
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)
        
    def save(self, file_content: bytes, original_filename: str) -> str:
        ext = original_filename.split('.')[-1] if '.' in original_filename else ''
        filename = f"{uuid.uuid4()}.{ext}"
        path = os.path.join(self.base_dir, filename)
        with open(path, "wb") as f:
            f.write(file_content)
        return path
        
    def get(self, path: str) -> bytes:
        with open(path, "rb") as f:
            return f.read()
            
    def delete(self, path: str) -> None:
        if os.path.exists(path):
            os.remove(path)
"""

FILES["app/services/project_service.py"] = """from sqlalchemy.orm import Session
from app.models.models import Project, ProjectStatus
from app.schemas.projects import ProjectCreate, ProjectUpdate

class ProjectService:
    @staticmethod
    def create(db: Session, user_id: int, data: ProjectCreate) -> Project:
        proj = Project(**data.model_dump(), user_id=user_id)
        db.add(proj)
        db.commit()
        db.refresh(proj)
        return proj
        
    @staticmethod
    def update(db: Session, project_id: int, data: ProjectUpdate) -> Project:
        proj = db.query(Project).filter(Project.id == project_id).first()
        if not proj: return None
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(proj, key, value)
        db.commit()
        db.refresh(proj)
        return proj
"""

FILES["app/ai/openai_provider.py"] = """from app.ai.provider import LLMProvider
from typing import Type
from pydantic import BaseModel
import openai
from app.config import settings

class OpenAIProvider(LLMProvider):
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
    async def generate(self, prompt: str, system: str, schema: Type[BaseModel]) -> BaseModel:
        # Full integration to structured outputs
        response = await self.client.beta.chat.completions.parse(
            model="gpt-4o-2024-08-06",
            messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
            response_format=schema
        )
        return response.choices[0].message.parsed
        
    async def embed(self, text: str) -> list[float]:
        response = await self.client.embeddings.create(input=[text], model="text-embedding-3-small")
        return response.data[0].embedding
"""

def build():
    for path, content in FILES.items():
        full_path = os.path.join(BASE_DIR, path.replace("/", "\\"))
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)

if __name__ == "__main__":
    build()
