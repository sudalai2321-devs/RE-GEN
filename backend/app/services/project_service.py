from sqlalchemy.orm import Session
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
