// Auth
export interface User { id: string; email: string; name: string; role: 'USER' | 'ADMIN'; }
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { email: string; name: string; password: string; }
export interface AuthResponse { access_token: string; user: User; }

// Projects
export type ProjectStatus = 'draft' | 'processing' | 'evidence_review' | 'dna_extracted' | 'gap_detected' | 'opportunity_discovery' | 'validated' | 'failed';
export interface Project {
  id: string; user_id: string; name: string; domain: string;
  objective: string; problem: string; outcome: string;
  failure_summary: string; status: ProjectStatus;
  created_at: string; updated_at: string;
  documents_count?: number; evidence_count?: number;
  opportunities_count?: number;
}

// Documents
export interface Document {
  id: string; project_id: string; filename: string;
  original_filename: string; mime_type: string;
  file_size: number; processing_status: string; created_at: string;
}

// Sources
export type SourceType = 'research_paper' | 'government_report' | 'academic_project' | 'company_report' | 'patent' | 'open_source' | 'innovation_challenge' | 'technical_documentation' | 'public_case_study';
export interface Source {
  id: string; title: string; publisher: string;
  source_type: SourceType; url: string;
  publication_date: string | null; retrieved_at: string;
  description: string; status: string;
}

// Evidence
export type VerificationStatus = 'pending' | 'verified' | 'needs_review' | 'rejected' | 'conflicting';
export interface Evidence {
  id: string; source_id: string; chunk_id: string | null;
  claim: string; excerpt: string; confidence: number;
  verification_status: VerificationStatus;
  source?: Source; created_at: string;
}

// DNA
export type DNACategory = 'problem' | 'objective' | 'technology' | 'capability' | 'input' | 'output' | 'constraint' | 'dependency' | 'assumption' | 'environment' | 'failure_condition' | 'outcome' | 'document_type' | 'status_assessment' | 'required_input' | 'opportunity_potential';
export type DNAStatus = 'supported' | 'partially_supported' | 'conflicting' | 'unsupported' | 'unknown';
export interface DNAItem {
  id: string; project_id: string; category: DNACategory;
  value: string; confidence: number; status: DNAStatus;
  evidence_ids: string[]; created_at: string;
}

// Gaps
export interface Gap {
  id: string; project_id: string; description: string;
  gap_type: string; confidence: number;
  evidence_status: string; evidence_ids: string[];
  reasoning: string; created_at: string;
}

// Problems
export interface Problem {
  id: string; title: string; problem_statement: string;
  domain: string; subdomain: string; context: string;
  affected_users: string; geography: string;
  existing_solutions: string; limitations: string;
  status: string; source_ids: string[];
  evidence_count?: number; source_count?: number;
}

// Opportunities
export type OpportunityStatus = 'identified' | 'analyzing' | 'evidence_review' | 'validated' | 'rejected' | 'archived';
export interface Opportunity {
  id: string; project_id: string; problem_id: string;
  gap_id: string | null; title: string; rationale: string;
  technology_fit: number; environment_fit: number;
  data_fit: number; infrastructure_fit: number;
  cost_fit: number; evidence_strength: number;
  status: OpportunityStatus;
  transferable_capabilities: string[];
  non_transferable_factors: string[];
  uncertainties: string[];
  validation_requirements: string[];
  project?: Project; problem?: Problem;
  project_name?: string;
  problem_title?: string;
  evidence_count?: number;
  created_at: string;
}

// Experiments
export type ExperimentStatus = 'planned' | 'in_progress' | 'completed' | 'validated' | 'needs_revision' | 'rejected';
export interface Experiment {
  id: string; opportunity_id: string; hypothesis: string;
  objective: string; materials: string; data_required: string;
  procedure: string; variables: string; metrics: string;
  success_criteria: string; failure_criteria: string;
  risks: string; expected_cost: string; expected_duration: string;
  status: ExperimentStatus; created_at: string; updated_at: string;
}

export interface ExperimentResult {
  id: string; experiment_id: string; result_summary: string;
  metrics_json: Record<string, any>; notes: string;
  status: string; created_at: string;
}

// Jobs
export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
export interface Job {
  id: string; job_type: string; entity_type: string;
  entity_id: string; status: JobStatus;
  progress: number; error: string | null;
  created_at: string; started_at: string | null;
  completed_at: string | null;
}

// Dashboard
export interface DashboardStats {
  projects_analyzed: number; innovation_gaps: number;
  opportunities_discovered: number; experiments: number;
  evidence_records: number; verified_sources: number;
}

export interface RecentAnalysis {
  id: string; project_name: string; domain: string;
  status: ProjectStatus; evidence_count: number;
  opportunities_count: number; updated_at: string;
}

// Search
export interface SearchResult {
  type: 'project' | 'problem' | 'technology' | 'source' | 'opportunity';
  id: string; title: string; description: string;
  domain?: string; relevance?: number;
}

// Transferability
export interface TransferabilityDimension {
  dimension: string;
  assessment: 'High' | 'Medium' | 'Low';
  rationale: string;
}
