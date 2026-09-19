import {
  AuthResponse,
  DashboardStats,
  DNAItem,
  Document,
  Evidence,
  Experiment,
  ExperimentResult,
  Gap,
  Job,
  LoginRequest,
  Opportunity,
  Problem,
  Project,
  RecentAnalysis,
  RegisterRequest,
  SearchResult,
  Source,
  User,
  VerificationStatus
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) { this.token = token; if (typeof window !== 'undefined') localStorage.setItem('token', token); }
  getToken() { if (!this.token && typeof window !== 'undefined') this.token = localStorage.getItem('token'); return this.token; }
  clearToken() { this.token = null; if (typeof window !== 'undefined') localStorage.removeItem('token'); }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${res.status}`);
    }
    return res.json();
  }

  // Auth
  login(data: LoginRequest) { return this.request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }); }
  register(data: RegisterRequest) { return this.request<AuthResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }); }
  getMe() { return this.request<User>('/api/auth/me'); }

  // Dashboard
  getDashboardStats() { return this.request<DashboardStats>('/api/dashboard/stats'); }
  getRecentAnalyses() { return this.request<RecentAnalysis[]>('/api/dashboard/recent'); }

  // Projects
  getProjects() { return this.request<Project[]>('/api/projects'); }
  getProject(id: string) { return this.request<Project>(`/api/projects/${id}`); }
  createProject(data: Partial<Project>) { return this.request<Project>('/api/projects', { method: 'POST', body: JSON.stringify(data) }); }
  updateProject(id: string, data: Partial<Project>) { return this.request<Project>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  analyzeProject(id: string) { return this.request<Job>(`/api/projects/${id}/analyze`, { method: 'POST' }); }

  // DNA
  getProjectDNA(id: string) { return this.request<DNAItem[]>(`/api/projects/${id}/dna`); }
  extractDNA(id: string) { return this.request<Job>(`/api/projects/${id}/dna/extract`, { method: 'POST' }); }

  // Gaps
  getProjectGaps(id: string) { return this.request<Gap[]>(`/api/projects/${id}/gaps`); }
  analyzeGaps(id: string) { return this.request<Job>(`/api/projects/${id}/gaps/analyze`, { method: 'POST' }); }

  // Project Opportunities
  getProjectOpportunities(id: string) { return this.request<Opportunity[]>(`/api/projects/${id}/opportunities`); }
  discoverOpportunities(id: string) { return this.request<Job>(`/api/projects/${id}/opportunities/discover`, { method: 'POST' }); }

  // Documents
  async uploadDocument(projectId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const token = this.getToken();
    const res = await fetch(`${API_BASE}/api/projects/${projectId}/documents`, {
      method: 'POST',
      body: formData,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `Upload failed (HTTP ${res.status})` }));
      throw new Error(err.detail || `Upload failed (HTTP ${res.status})`);
    }
    return res.json();
  }

  getDocuments(projectId: string) { return this.request<Document[]>(`/api/projects/${projectId}/documents`); }

  // Sources
  getSources() { return this.request<Source[]>('/api/sources'); }
  getSource(id: string) { return this.request<Source>(`/api/sources/${id}`); }
  createSource(data: Partial<Source>) { return this.request<Source>('/api/sources', { method: 'POST', body: JSON.stringify(data) }); }
  importSource(url: string) { return this.request<Source>('/api/sources/import', { method: 'POST', body: JSON.stringify({ url }) }); }

  // Evidence
  getEvidence(params?: { entity_type?: string; entity_id?: string }) {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request<Evidence[]>(`/api/evidence${qs}`);
  }
  getEvidenceById(id: string) { return this.request<Evidence>(`/api/evidence/${id}`); }
  updateEvidence(id: string, data: { verification_status: VerificationStatus }) { return this.request<Evidence>(`/api/evidence/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }

  // Problems
  getProblems(params?: { domain?: string; search?: string }) {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request<Problem[]>(`/api/problems${qs}`);
  }
  getProblem(id: string) { return this.request<Problem>(`/api/problems/${id}`); }

  // Opportunities
  getOpportunities(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<Opportunity[]>(`/api/opportunities${qs}`);
  }
  getOpportunity(id: string) { return this.request<Opportunity>(`/api/opportunities/${id}`); }
  getOpportunityEvidence(id: string) { return this.request<Evidence[]>(`/api/opportunities/${id}/evidence`); }
  generateExperiment(id: string) { return this.request<Experiment>(`/api/opportunities/${id}/experiment`, { method: 'POST' }); }
  getExperiment(oppId: string) { return this.request<Experiment>(`/api/opportunities/${oppId}/experiment`); }

  // Experiments
  updateExperiment(id: string, data: Partial<Experiment>) { return this.request<Experiment>(`/api/experiments/${id}`, { method: 'PUT', body: JSON.stringify(data) }); }
  addExperimentResult(id: string, data: Partial<ExperimentResult>) { return this.request<ExperimentResult>(`/api/experiments/${id}/results`, { method: 'POST', body: JSON.stringify(data) }); }
  getExperimentResults(id: string) { return this.request<ExperimentResult[]>(`/api/experiments/${id}/results`); }

  // Jobs
  getJob(id: string) { return this.request<Job>(`/api/jobs/${id}`); }

  // Search
  search(q: string, type?: string) {
    const params = new URLSearchParams({ q }); if (type) params.set('type', type);
    return this.request<SearchResult[]>(`/api/search?${params}`);
  }

  // Admin
  getAdminStats() { return this.request<any>('/api/admin/stats'); }
  getAdminSources() { return this.request<Source[]>('/api/admin/sources'); }
  getAdminProjects() { return this.request<Project[]>('/api/admin/projects'); }
  getAdminProblems() { return this.request<Problem[]>('/api/admin/problems'); }
  getAdminEvidence() { return this.request<Evidence[]>('/api/admin/evidence'); }
  getAdminJobs() { return this.request<Job[]>('/api/admin/jobs'); }
  getAdminAnalysisRuns() { return this.request<any[]>('/api/admin/analysis-runs'); }
  verifySource(id: string) { return this.request<Source>(`/api/admin/sources/${id}/verify`, { method: 'POST' }); }
  verifyEvidence(id: string) { return this.request<Evidence>(`/api/admin/evidence/${id}/verify`, { method: 'POST' }); }
  retryJob(id: string) { return this.request<Job>(`/api/admin/jobs/${id}/retry`, { method: 'POST' }); }
}

export const api = new ApiClient();
