<div align="center">

# 🤖 AnalytixAI
### AI-Powered Multi-Agent Business Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-7c3aed?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange?style=for-the-badge)](https://console.groq.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)

**Upload a CSV. Get a complete business intelligence report in seconds.**  
*Powered by 12 autonomous AI agents that think, analyze, and strategize like your own data science team.*

[🚀 Live Demo](#) · [📖 Docs](#architecture) · [🤖 Agents](#12-ai-agents) · [🛠️ Setup](#quick-start)

</div>

---

## ✨ What is AnalytixAI?

AnalytixAI replaces an entire data analyst team with an autonomous fleet of 12 AI agents. You upload a business dataset (CSV, JSON, Parquet, Excel) and the system automatically:

| Step | Agent | Output |
|------|-------|--------|
| 1 | **Data Ingestor** | Loads and validates your dataset |
| 2 | **Data Cleaner** | Fixes nulls, outliers, duplicates |
| 3 | **Preprocessor** | Encodes features, normalizes, splits data |
| 4 | **EDA Analyst** | Computes statistics, correlations, distributions |
| 5 | **NL Query Agent** | Translates natural language → SQL (Groq Llama 3.3) |
| 6 | **SQL ReAct Agent** | Self-healing SQL with Vectorless RAG |
| 7 | **Visualization Agent** | Generates chart specifications |
| 8 | **Predictive ML** | Revenue forecast (OLS) + Churn model (Logistic) |
| 9 | **Insight Agent** | Derives opportunity & risk business insights |
| 10 | **Recommender** | Ranked strategic recommendations with ROI |
| 11 | **Report Generator** | Compiles executive HTML/PDF report |
| 12 | **Strategy Advisor** | Live AI chatbot for business Q&A (Groq LLM) |

---

## 🖥️ Screenshots

> Dashboard | Strategy AI Chatbot | Predictions | SQL Studio | Agent Monitor

```
┌─────────────────────────────────────────────────────────┐
│  📊 Dashboard     💬 Strategy AI    🔮 Predictions       │
│  📁 Upload        🖥️ SQL Studio      💡 Insights         │
│  📈 Charts        📄 Reports         🤖 Agents           │
│  🔬 EDA           🔌 Chat Terminal                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Next.js 15 Frontend (Port 3000)             │
│  13 pages · Glassmorphic dark UI · TypeScript + Tailwind │
└────────────────────┬────────────────────────────────────┘
                     │ REST + WebSocket
                     ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Server (Port 8000)                  │
│  7 REST endpoints + 1 WebSocket telemetry stream         │
└────────────────────┬────────────────────────────────────┘
                     │ Python
                     ▼
┌─────────────────────────────────────────────────────────┐
│      LangGraph Hub-and-Spoke State Machine               │
│                                                          │
│  orchestrator → ingestion → cleaning → preprocessing     │
│       ↑              ↓ each returns to orchestrator      │
│       └──── eda → predictive → insight → report ────────┘
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  data/cleaned_data.csv · predictions.json · report.html  │
└─────────────────────────────────────────────────────────┘
```

### Key Design Patterns
- **Hub-and-Spoke Routing** — Every agent returns control to the Orchestrator after execution
- **TypedDict State Machine** — Immutable `GraphState` snapshots passed between all 12 agents
- **ReAct Loop** — SQL Agent reasons → acts → observes → self-heals on error
- **Vectorless RAG** — Direct schema injection into LLM prompt instead of vector embeddings (faster, cheaper)
- **Data-Grounded Chatbot** — Live analytics context injected into every LLM conversation

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+ with `uv` package manager
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Supabase project (free at [supabase.com](https://supabase.com))

### 1. Clone & Install

```bash
git clone https://github.com/Janviagrawal4127/Ai-Data-Analytics.git
cd Ai-Data-Analytics

# Install Python dependencies
pip install uv
uv sync

# Install Node dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
# Required — Get free key at https://console.groq.com
Groq_API=gsk_your_groq_api_key_here

# Required — Your Supabase project credentials
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_KEY=your_anon_public_key

# Optional — for production
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run the App

**Terminal 1 — Backend:**
```bash
uv run python -m uvicorn backend.server:app --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:3000** 🎉

### 4. Run the Pipeline (Optional — generate sample data)
```bash
uv run python scripts/run_pipeline.py
```
This generates `data/cleaned_data.csv`, `data/outputs/predictions.json`, and `data/outputs/report.html`.

---

## 🤖 12 AI Agents — Deep Dive

### Agent Pipeline Flow

```
User Query → Orchestrator → Plan List Generated
                ↓
         [ingestion] → Load CSV/JSON/Parquet/Excel
                ↓
         [cleaning] → Impute nulls (median/mode), IQR outlier removal
                ↓
         [preprocessing] → LabelEncoder + StandardScaler + 80/20 split
                ↓
         [eda] → Pearson correlation, describe(), value_counts()
                ↓
         [nl_query] → Groq Llama 3.3 → SQL translation
                ↓
         [sql_agent] → pandasql execution + ReAct self-healing
                ↓
         [predictive] → OLS Revenue Forecast + Logistic Churn Model
                ↓
         [insight] → Rule-based opportunity/risk pattern matching
                ↓
         [recommendation] → Ranked strategy with ROI estimates
                ↓
         [report] → HTML executive report compilation
```

### ML Models Used

| Model | Task | Library | Key Metrics |
|-------|------|---------|-------------|
| OLS Linear Regression | 90-day revenue forecast | scikit-learn | R², MAE, RMSE |
| Logistic Regression | Customer churn scoring | scikit-learn | Accuracy, ROC-AUC, F1 |
| LabelEncoder | Categorical features | scikit-learn | — |
| StandardScaler | Numerical normalization | scikit-learn | — |
| IQR Method | Outlier detection | Pandas/NumPy | — |

### Business Strategy Chatbot (Agent 12)

Powered by **Groq Llama 3.3 70B Versatile** with live analytics context injection:

```
User: "What's our biggest churn risk?"
           ↓
   Load predictions.json → churn_risk_customers
   Load cleaned_data.csv → churn rate, revenue, margins
           ↓
   Build system prompt with REAL numbers:
   "18.2% churn rate · 14 critical accounts · $294,754 projected revenue"
           ↓
   Groq LLM → Data-grounded business strategy response
```

Built-in strategy templates: Revenue Growth · Churn Reduction · P&L Analysis · Market Expansion · Cost Optimization · SWOT Analysis

---

## 📁 Project Structure

```
AnalytixAI/
├── backend/                    # Python FastAPI + LangGraph
│   ├── state.py                # GraphState TypedDict (shared pipeline state)
│   ├── pipeline.py             # LangGraph StateGraph + orchestrator_router()
│   ├── orchestrator.py         # Master agent — plan generation
│   ├── ingestion.py            # Data loading agent
│   ├── cleaning.py             # Data quality agent
│   ├── preprocessing.py        # Feature engineering agent
│   ├── nl_query.py             # NL→SQL translation agent + rule-based fallback
│   ├── sql_agent.py            # SQL ReAct self-healing agent
│   ├── eda.py                  # Exploratory data analysis agent
│   ├── visualization.py        # Chart specification generator
│   ├── predictive.py           # Revenue forecast + churn ML agent
│   ├── insight.py              # Business insight derivation agent
│   ├── recommendation.py       # Strategic recommendation agent
│   ├── report.py               # HTML report compilation agent
│   ├── server.py               # FastAPI app (7 REST + 1 WebSocket)
│   └── chatbot.py              # Strategy AI chatbot (Groq + data context)
│
├── frontend/                   # Next.js 15 + TypeScript + Tailwind
│   └── src/app/
│       ├── page.tsx            # Login (Supabase Auth)
│       ├── signup/             # Sign Up + Email OTP
│       └── dashboard/
│           ├── page.tsx        # KPI Overview
│           ├── upload/         # File Upload → Live Pipeline ✅
│           ├── eda/            # EDA Statistics Viewer
│           ├── charts/         # Visualization Builder
│           ├── sql/            # SQL Studio + Vectorless RAG
│           ├── predictions/    # Revenue Forecast + Churn ✅
│           ├── insights/       # Risk & Opportunity Cards
│           ├── strategy/       # Business Strategy Chatbot ✅
│           ├── reports/        # Executive Report Builder
│           ├── chat/           # WebSocket Telemetry Terminal ✅
│           └── agents/         # Agent Fleet Monitor ✅
│
├── data/
│   ├── raw/                    # Uploaded raw datasets
│   └── outputs/                # Pipeline generated files
│       ├── predictions.json    # Revenue forecast + churn scores
│       └── report.html         # Executive HTML report
│
├── tests/
│   └── test_agents.py          # 30+ pytest unit tests
│
├── scripts/
│   └── run_pipeline.py         # CLI pipeline runner
│
├── docs/
│   ├── PROJECT_EXPLANATION.md  # Technical deep-dive
│   └── PROJECT_SYNOPSIS.md     # Academic synopsis
│
├── Dockerfile                  # Multi-stage backend container
├── docker-compose.yml          # Full-stack orchestration
├── frontend/Dockerfile.frontend # Next.js production container
├── pytest.ini                  # Test configuration
└── pyproject.toml              # Python dependencies (uv)
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Agent fleet status |
| `POST` | `/api/pipeline/run` | Trigger 12-agent pipeline |
| `POST` | `/api/query/sql` | NL→SQL translation + execution |
| `GET` | `/api/data/predictions` | Revenue forecast + churn data |
| `GET` | `/api/data/report` | Download executive HTML report |
| `POST` | `/api/chat` | Business strategy AI chatbot |
| `WS` | `/ws/telemetry` | Real-time agent event stream |

**Interactive API Docs:** http://localhost:8000/docs (Swagger UI auto-generated by FastAPI)

---

## 🧪 Testing

```bash
# Run all unit tests (skip slow E2E)
uv run pytest tests/ -v -m "not slow"

# Run with coverage report
uv run pytest tests/ -v --cov=backend --cov-report=term-missing

# Run full E2E pipeline test
uv run pytest tests/ -v
```

**Test Coverage:**
- ✅ All 12 agent nodes (import + execution)
- ✅ NL Query fallback patterns (revenue, churn, region, top-N)
- ✅ SQL safe execution + aggregation
- ✅ FastAPI endpoint status codes
- ✅ Chatbot module + system prompt
- ✅ GraphState schema validation
- ✅ Pipeline compilation

---

## 🐳 Docker Deployment

```bash
# Full stack — backend + frontend
docker-compose up --build

# Backend only
docker build -t analytixai-backend .
docker run -p 8000:8000 --env-file .env analytixai-backend
```

---

## ☁️ Cloud Deployment

### Backend → Render.com
1. Connect this GitHub repo to Render
2. Set **Build Command:** `pip install uv && uv sync`
3. Set **Start Command:** `uv run python -m uvicorn backend.server:app --host 0.0.0.0 --port $PORT`
4. Add environment variables in Render dashboard: `Groq_API`, `SUPABASE_URL`, `SUPABASE_KEY`

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
```
Add `NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com` in Vercel settings.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **LLM** | Groq API · Llama 3.3 70B Versatile |
| **Agents** | LangGraph · LangChain Core |
| **Backend** | FastAPI · Uvicorn · Python 3.11 |
| **ML** | scikit-learn · Pandas · NumPy |
| **SQL** | pandasql · SQLite in-memory |
| **Frontend** | Next.js 15 · React 19 · TypeScript 5 |
| **Styling** | Tailwind CSS · Glassmorphism · Material Symbols |
| **Auth** | Supabase (Email + OTP) |
| **Testing** | pytest · pytest-cov · FastAPI TestClient |
| **DevOps** | Docker · docker-compose · uv |
| **Deployment** | Vercel (frontend) · Render (backend) |

---

## 📊 Build Status

```
✓ Compiled successfully
✓ Generating static pages (17/17)
✓ Zero ESLint errors
✓ All TypeScript types valid
✓ Exit Code: 0
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ using LangGraph · FastAPI · Next.js · Groq**

⭐ Star this repo if you found it helpful!

</div>
