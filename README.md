# Innovation DNA — RE:GEN

### From Failed Ideas to New Possibilities

An AI-powered open innovation intelligence platform that turns documented innovation attempts into evidence-backed opportunities in other domains.

## 🧬 What is Innovation DNA?

Innovation DNA doesn't simply generate new ideas. Instead, it follows a rigorous process:

1. **Collect** — Gather documented projects, technologies, and innovation attempts
2. **Understand** — Analyze what the innovation tried to achieve
3. **Decode** — Extract the Innovation DNA (technologies, capabilities, constraints, dependencies)
4. **Detect Gaps** — Identify limitations and unresolved needs
5. **Discover** — Match capabilities with real-world problems in other domains
6. **Verify** — Show evidence behind every claim
7. **Validate** — Generate testable experiments

Every claim is traceable to evidence. AI interpretations are clearly labeled.

## 🏗 Architecture

```
├── frontend/          # Next.js 15, React 19, TypeScript, Tailwind CSS
├── backend/           # Python, FastAPI, SQLAlchemy, SQLite
├── prompts/           # Versioned AI prompt templates
├── seed/              # Demo data
├── .env.example       # Environment variable template
└── README.md
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS v4, Lucide Icons, TanStack Query, Recharts |
| Backend | Python 3.14, FastAPI, Pydantic v2, SQLAlchemy 2.0 |
| Database | SQLite (dev) — PostgreSQL-ready via SQLAlchemy |
| AI | OpenAI API (optional), Mock AI mode for demos |
| Auth | JWT with bcrypt password hashing |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Python 3.10+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server (auto-creates DB and seeds demo data)
python run.py
```

The backend will start at **http://localhost:8000**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at **http://localhost:3000**

### Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@innovationdna.ai | admin123 | Admin |
| demo@innovationdna.ai | demo123 | User |

## 🔧 Environment Variables

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | sqlite:///./innovation_dna.db | Database connection |
| AUTH_SECRET | (see .env.example) | JWT signing secret |
| MOCK_AI_MODE | true | Use mock AI (no API key needed) |
| LLM_API_KEY | | OpenAI API key (when MOCK_AI_MODE=false) |
| LLM_MODEL | gpt-4o | LLM model to use |
| STORAGE_PATH | ./uploads | File storage directory |

## 📚 API Documentation

With the backend running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎯 Key Features

- **Project Analysis** — Upload documents or enter project details manually
- **Innovation DNA Extraction** — Structured extraction of technologies, capabilities, constraints
- **Evidence Tracking** — Every claim linked to sources with verification status
- **Gap Detection** — Identify limitations and unmet needs
- **Cross-Domain Matching** — Match capabilities with real-world problems
- **Opportunity Discovery** — Evidence-backed opportunity analysis
- **Transferability Analysis** — Multi-dimensional fit assessment
- **Experiment Generation** — Testable validation experiments
- **Admin Panel** — Source, evidence, and job management

## 🧪 Demo Mode

The app works without an LLM API key using `MOCK_AI_MODE=true` (default). Demo data is auto-seeded on first run and labeled as "Demonstration Analysis".

### Golden Demo Workflow

1. Login → Dashboard
2. Click "Analyze a Failed Innovation"
3. Select "Project AeroSense" (pre-loaded demo)
4. View Innovation DNA extraction
5. Inspect evidence for each claim
6. Detect innovation gaps
7. Find cross-domain opportunities
8. Open an opportunity
9. View transferability matrix
10. Generate validation experiment

## 🔒 Security

- JWT authentication with bcrypt password hashing
- Server-side authorization enforcement
- Input validation on all endpoints
- File upload validation (type, size, extension)
- CORS configuration
- No secrets in client code

## 📁 Database

SQLite for development. The SQLAlchemy ORM makes switching to PostgreSQL trivial:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/innovation_dna
```

### Tables

users, projects, documents, sources, source_chunks, evidence, technologies, capabilities, problems, project_technologies, project_capabilities, dna_items, gaps, opportunities, opportunity_evidence, experiments, experiment_results, analysis_runs, jobs, tags, project_tags

## 🧠 AI Pipeline

7-stage pipeline with versioned prompts:

1. **Document → Claims** — Extract evidence claims from text
2. **Claims → Project DNA** — Structured DNA extraction
3. **Project DNA → Gaps** — Gap detection
4. **Gap → Candidate Problems** — Semantic retrieval + matching
5. **Candidates → Opportunity Analysis** — Cross-domain matching
6. **Opportunity → Transferability** — Multi-dimensional analysis
7. **Opportunity → Experiment Plan** — Validation experiment generation

## 🧪 Testing

```bash
# Backend tests
cd backend
python -m pytest tests/ -v

# Frontend build check
cd frontend
npm run build
```

## 📄 License

MIT

## 🏆 Built for RE:GEN Hackathon
