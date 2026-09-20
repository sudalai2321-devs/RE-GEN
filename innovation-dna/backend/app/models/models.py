from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="user")  # "user" or "admin"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    projects = relationship("Project", back_populates="user")


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    domain = Column(String, default="")
    objective = Column(Text, default="")
    problem = Column(Text, default="")
    outcome = Column(Text, default="")
    failure_summary = Column(Text, default="")
    status = Column(String, default="draft")  # draft, processing, evidence_review, dna_extracted, gap_detected, opportunity_discovery, validated, failed
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="projects")
    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")
    dna_items = relationship("DNAItem", back_populates="project", cascade="all, delete-orphan")
    gaps = relationship("Gap", back_populates="project", cascade="all, delete-orphan")
    opportunities = relationship("Opportunity", back_populates="project", cascade="all, delete-orphan")
    analysis_runs = relationship("AnalysisRun", back_populates="project", cascade="all, delete-orphan")


class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=True, default="")
    mime_type = Column(String, default="")
    storage_path = Column(String, default="")
    file_size = Column(Integer, default=0)
    checksum = Column(String, default="")
    processing_status = Column(String, default="pending")  # pending, processing, completed, failed
    extracted_text = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="documents")

    def __init__(self, **kwargs):
        if "file_path" in kwargs and "storage_path" not in kwargs:
            kwargs["storage_path"] = kwargs.pop("file_path")
        if "size_bytes" in kwargs and "file_size" not in kwargs:
            kwargs["file_size"] = kwargs.pop("size_bytes")
        if "status" in kwargs and "processing_status" not in kwargs:
            kwargs["processing_status"] = kwargs.pop("status")
        if "content_hash" in kwargs and "checksum" not in kwargs:
            kwargs["checksum"] = kwargs.pop("content_hash")
        if "original_filename" not in kwargs:
            kwargs["original_filename"] = kwargs.get("filename", "")
        super().__init__(**kwargs)

    @property
    def file_path(self):
        return self.storage_path

    @file_path.setter
    def file_path(self, val):
        self.storage_path = val

    @property
    def size_bytes(self):
        return self.file_size

    @size_bytes.setter
    def size_bytes(self, val):
        self.file_size = val

    @property
    def status(self):
        return self.processing_status

    @status.setter
    def status(self, val):
        self.processing_status = val

    @property
    def content_hash(self):
        return self.checksum

    @content_hash.setter
    def content_hash(self, val):
        self.checksum = val



class Source(Base):
    __tablename__ = "sources"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    publisher = Column(String, default="")
    source_type = Column(String, default="other")  # research_paper, government_report, academic_project, company_report, patent, open_source, innovation_challenge, technical_documentation, public_case_study
    url = Column(String, default="")
    publication_date = Column(String, default="")
    retrieved_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    description = Column(Text, default="")
    content_hash = Column(String, default="")
    status = Column(String, default="active")  # active, inactive, needs_review, verified
    is_demo = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    chunks = relationship("SourceChunk", back_populates="source", cascade="all, delete-orphan")
    evidence_records = relationship("Evidence", back_populates="source", cascade="all, delete-orphan")


class SourceChunk(Base):
    __tablename__ = "source_chunks"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=False)
    chunk_index = Column(Integer, default=0)
    text = Column(Text, default="")
    page_number = Column(Integer, nullable=True)
    embedding = Column(JSON, nullable=True)

    source = relationship("Source", back_populates="chunks")


class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("sources.id"), nullable=True)
    chunk_id = Column(Integer, ForeignKey("source_chunks.id"), nullable=True)
    claim = Column(Text, nullable=False)
    excerpt = Column(Text, default="")
    confidence = Column(Float, default=0.0)
    verification_status = Column(String, default="pending")  # pending, verified, needs_review, rejected, conflicting
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    source = relationship("Source", back_populates="evidence_records")


class Technology(Base):
    __tablename__ = "technologies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, default="")
    domain = Column(String, default="")
    embedding = Column(JSON, nullable=True)


class Capability(Base):
    __tablename__ = "capabilities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, default="")
    embedding = Column(JSON, nullable=True)


class Problem(Base):
    __tablename__ = "problems"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    problem_statement = Column(Text, default="")
    domain = Column(String, default="")
    subdomain = Column(String, default="")
    context = Column(Text, default="")
    affected_users = Column(Text, default="")
    geography = Column(String, default="")
    existing_solutions = Column(Text, default="")
    limitations = Column(Text, default="")
    embedding = Column(JSON, nullable=True)
    status = Column(String, default="active")  # active, archived, verified
    source_ids = Column(JSON, default=list)
    is_demo = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    opportunities = relationship("Opportunity", back_populates="problem")


class ProjectTechnology(Base):
    __tablename__ = "project_technologies"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    technology_id = Column(Integer, ForeignKey("technologies.id"), nullable=False)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=True)


class ProjectCapability(Base):
    __tablename__ = "project_capabilities"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    capability_id = Column(Integer, ForeignKey("capabilities.id"), nullable=False)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=True)


class DNAItem(Base):
    __tablename__ = "dna_items"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    category = Column(String, nullable=False)  # problem, objective, technology, capability, input, output, constraint, dependency, assumption, environment, failure_condition, outcome
    value = Column(Text, nullable=False)
    confidence = Column(Float, default=0.0)
    status = Column(String, default="unknown")  # supported, partially_supported, conflicting, unsupported, unknown
    evidence_ids = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="dna_items")


class Gap(Base):
    __tablename__ = "gaps"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    description = Column(Text, nullable=False)
    gap_type = Column(String, default="documented_limitation")  # documented_limitation, application_boundary, infrastructure_gap, cost_barrier, data_requirement, scalability_limitation, market_mismatch, adoption_barrier, technical_constraint, ai_hypothesis
    confidence = Column(Float, default=0.0)
    evidence_status = Column(String, default="unknown")  # strong, moderate, weak, hypothesis_only
    evidence_ids = Column(JSON, default=list)
    reasoning = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="gaps")


class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=True)
    gap_id = Column(Integer, ForeignKey("gaps.id"), nullable=True)
    title = Column(String, default="")
    rationale = Column(Text, default="")
    technology_fit = Column(Float, default=0.0)
    environment_fit = Column(Float, default=0.0)
    data_fit = Column(Float, default=0.0)
    infrastructure_fit = Column(Float, default=0.0)
    cost_fit = Column(Float, default=0.0)
    evidence_strength = Column(Float, default=0.0)
    status = Column(String, default="identified")  # identified, analyzing, evidence_review, validated, rejected, archived
    transferable_capabilities = Column(JSON, default=list)
    non_transferable_factors = Column(JSON, default=list)
    uncertainties = Column(JSON, default=list)
    validation_requirements = Column(JSON, default=list)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="opportunities")
    problem = relationship("Problem", back_populates="opportunities")
    evidence_links = relationship("OpportunityEvidence", back_populates="opportunity", cascade="all, delete-orphan")
    experiments = relationship("Experiment", back_populates="opportunity", cascade="all, delete-orphan")


class OpportunityEvidence(Base):
    __tablename__ = "opportunity_evidence"
    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=False)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=False)
    relationship_type = Column(String, default="supports")  # supports, contradicts, partially_supports

    opportunity = relationship("Opportunity", back_populates="evidence_links")


class Experiment(Base):
    __tablename__ = "experiments"
    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=False)
    hypothesis = Column(Text, default="")
    objective = Column(Text, default="")
    materials = Column(Text, default="")
    data_required = Column(Text, default="")
    procedure = Column(Text, default="")
    variables = Column(Text, default="")
    metrics = Column(Text, default="")
    success_criteria = Column(Text, default="")
    failure_criteria = Column(Text, default="")
    risks = Column(Text, default="")
    expected_cost = Column(String, default="")
    expected_duration = Column(String, default="")
    status = Column(String, default="planned")  # planned, in_progress, completed, validated, needs_revision, rejected
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    opportunity = relationship("Opportunity", back_populates="experiments")
    results = relationship("ExperimentResult", back_populates="experiment", cascade="all, delete-orphan")


class ExperimentResult(Base):
    __tablename__ = "experiment_results"
    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id"), nullable=False)
    result_summary = Column(Text, default="")
    metrics_json = Column(JSON, default=dict)
    notes = Column(Text, default="")
    attachments = Column(JSON, default=list)
    status = Column(String, default="recorded")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    experiment = relationship("Experiment", back_populates="results")


class AnalysisRun(Base):
    __tablename__ = "analysis_runs"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    run_type = Column(String, default="")  # dna_extraction, gap_analysis, opportunity_matching, experiment_generation
    model = Column(String, default="")
    prompt_version = Column(String, default="v1.0")
    status = Column(String, default="pending")  # pending, running, completed, failed
    input_hash = Column(String, default="")
    output_json = Column(JSON, nullable=True)
    error = Column(Text, default="")
    tokens_used = Column(Integer, default=0)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="analysis_runs")


class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_type = Column(String, nullable=False)  # document_processing, dna_extraction, embedding_generation, gap_analysis, opportunity_matching, experiment_generation
    entity_type = Column(String, default="")
    entity_id = Column(Integer, default=0)
    status = Column(String, default="queued")  # queued, running, completed, failed, cancelled
    progress = Column(Float, default=0.0)
    error = Column(Text, default="")
    result = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)


class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, default="")


class ProjectTag(Base):
    __tablename__ = "project_tags"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id"), nullable=False)
