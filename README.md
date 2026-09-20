# RE-GEN — Innovation Intelligence Platform

> **From Failed Ideas to New Possibilities**

RE-GEN (featuring **Innovation DNA**) is an AI-powered open innovation intelligence platform that turns documented innovation attempts, past research, and technical architectures into evidence-backed opportunities across adjacent domains.

---

## 📁 Repository Structure

`	ext
RE-GEN/
├── innovation-dna/                 # Complete Innovation DNA Platform
│   ├── backend/                   # FastAPI, SQLAlchemy, SQLite/PostgreSQL, AI Pipeline
│   ├── frontend/                  # Next.js 15, React 19, Tailwind CSS, Lucide Icons
│   ├── prompts/                   # AI System Prompts & Extraction Templates
│   ├── START_APP.bat              # One-click startup script for Windows
│   ├── STOP_APP.bat               # Clean shutdown script
│   ├── CREATE_DESKTOP_SHORTCUTS.bat # Desktop shortcut generator
│   ├── .env.example               # Environment configuration template
│   └── README.md                  # Comprehensive platform documentation
└── README.md                      # Repository root guide
`

---

## 🧬 Innovation DNA Overview

Innovation DNA doesn't just generate generic ideas. It follows a rigorous 7-stage evidence pipeline:

1. **Collect** — Gather documented projects, technical specs, and innovation attempts.
2. **Understand** — Parse documents, extract metadata, and identify problem statements.
3. **Decode** — Extract the project's DNA (core capabilities, mechanisms, constraints, dependencies).
4. **Detect Gaps** — Pinpoint why past attempts stalled and what unsolved bottlenecks remain.
5. **Cross-Domain Match** — Map capabilities to active problems across alternative industries using a **Dimensional Transferability Matrix**.
6. **Verify Evidence** — Back every generated opportunity with bidirectional citation chains.
7. **Validate** — Auto-generate structured validation experiments with measurable falsification criteria.

---

## 🚀 Getting Started

Navigate to the innovation-dna directory:

`ash
cd innovation-dna
`

### Option A: Instant Windows Startup
Simply run:
`cmd
START_APP.bat
`
This automatically sets up the Python virtual environment, installs backend dependencies, initializes database seeds, installs npm packages, and starts both backend (http://localhost:8000) and frontend (http://localhost:3000).

### Option B: Manual Setup
See detailed instructions inside [innovation-dna/README.md](./innovation-dna/README.md).
