from app.models.models import DNAItem, Project, Evidence
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
