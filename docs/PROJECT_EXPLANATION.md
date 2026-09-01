# AnalytixAI — Project Explanation & Architecture Guide

Welcome to the **AnalytixAI** documentation. This document provides a complete guide to the platform's architecture, agent fleet, directory structure, page routes, and operations.

---

## 1. Overview
**AnalytixAI** is a SaaS-level, production-grade AI-powered Business Analytics platform designed to function as an autonomous virtual Data Analyst team. It coordinates **12 specialized AI agents** under a Master Orchestrator to automate the entire business analytics lifecycle — from raw financial and transactional data ingestion, cleaning, and preprocessing, to SQL query execution, predictive revenue modeling, and strategic business recommendation reports.

---

## 2. Technical Stack
- **Framework**: Next.js 15+ (App Router) with TypeScript
- **Styling**: Vanilla CSS with custom utility classes & design tokens defined in [globals.css](file:///C:/Users/janvi/multi-agent-analytics-platform/analytixai/src/app/globals.css) (dark mode primary, glassmorphism, glowing accents, and animated backgrounds).
- **Visualization**: Recharts (for responsive sales forecasts, churn distributions, LTV analysis, and profit margin breakdowns).
- **Backend Scaffold**: FastAPI (Python) mapped to LangGraph-based agent coordination workflows.

---

## 3. Multi-Agent System Architecture

The platform operates on a hub-and-spoke agent coordination model:

```
                  ┌───────────────────────────┐
                  │    Master Orchestrator    │ (Directs objectives & shares memory)
                  └─────┬───────────────┬─────┘
                        │               │
        ┌───────────────┼───────────────┼───────────────┐
        ▼               ▼               ▼               ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│  Ingestion   ││ Data Quality ││Preprocessing ││  SQL Agent   │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘
        ┌───────────────┼───────────────┼───────────────┐
        ▼               ▼               ▼               ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│  EDA Agent   ││Visualization ││   Insight    ││  Predictive  │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘
        ┌───────────────┼───────────────┼───────────────┐
        ▼               ▼               ▼               ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│    Report    ││   NL Query   ││Recommend-    ││   AutoML     │
│  Generator   ││    Agent     ││  ation       ││  Classifier  │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘
```

### The 12 Specialized Agents
1. **Master Orchestrator Agent (🧠)**: Directs the active session state, breaks down user business queries, schedules agent execution loops, and synchronizes shared context memory.
2. **Data Ingestion Agent (📥)**: Reads raw business uploads (sales transaction CSVs, customer CRM Excel files, financial JSON logs, or SQL database connections) and maps them into optimized dataframes.
3. **Data Quality & Cleaning Agent (🧹)**: Audits data completeness, removes transaction duplicates, handles anomalous outliers, and statistically imputes missing values (e.g., missing purchase locations or product categories).
4. **Data Preprocessing Agent (⚙️)**: Normalizes variables, encodes categorical customer segments, and scales numeric financial metrics (like Customer Lifetime Value or Average Order Value) for predictive modeling.
5. **SQL Agent (🗃️)**: Generates optimized SQL queries to extract business metrics, runs schema validation, and retrieves data tables.
6. **EDA Agent (📊)**: Calculates business descriptive statistics, correlation matrices (e.g., price vs. demand), and identifies key transaction distributions.
7. **Visualization Agent (📈)**: Generates plot layouts for business charts (cohort retention heatmaps, revenue trend lines, and CAC vs. LTV scatter plots).
8. **Insight Generation Agent (💡)**: Analyzes financial and operational metrics changes to isolate growth opportunities, revenue leakages, and cost-saving opportunities.
9. **Predictive Analytics Agent (🔮)**: Builds future revenue forecasting outputs (ARIMA/Prophet) and calculates customer retention risks or attrition probabilities.
10. **Report Generation Agent (📄)**: Exports corporate PDF/HTML reports containing charts, executive summaries, and transaction tables.
11. **NL Query Agent (💬)**: Translates natural business language queries (e.g., "What was our highest margin product region last month?") into PostgreSQL statements.
12. **Recommendation Agent (🎯)**: Formulates strategic operational actions (pricing optimization, inventory restocking plans, or target marketing budget shifts) with cost-benefit, timeframe, and effort estimates.

---

## 4. Frontend Structure & Routes

All routes are located under the Next.js `app` folder:

### Key Views & Pages
- **Landing / Login Page (`/`)**: Entry login screen with credentials inputs, high-level business success metrics, and a quick launcher button for the preloaded demo dataset.
- **Main Dashboard (`/dashboard`)**: Central executive view featuring animated KPI counters (Revenue, Gross Margin, Churn, Active Agents), trend charts, and high-priority business alerts.
- **Data Ingestion (`/dashboard/upload`)**: Drag-and-drop connection screen showing transaction ingestion logs, null-value analysis, and database schema mappings.
- **AI Chat (`/dashboard/chat`)**: Direct workspace dialogue terminal with the orchestrator, displaying real-time agent coordination paths and streaming logs.
- **EDA Profiler (`/dashboard/eda`)**: Dataset statistics grid highlighting transaction distributions, feature correlation matrices, and missing column lists.
- **Visualizations (`/dashboard/visualizations`)**: Responsive gallery showing customer segment distributions, sales trends, and correlation scatters.
- **SQL Playground (`/dashboard/sql`)**: Query textarea with sample queries selection sidebar, history logs, and automated English-to-SQL helper.
- **Predictions (`/dashboard/predictions`)**: Machine learning dashboard showing monthly sales/revenue forecasting, customer churn risks, and customer segmentation outputs.
- **Insights Dashboard (`/dashboard/insights`)**: OPPORTUNITIES and RISKS panels highlighting profit margin expansion possibilities, inventory warnings, and customer retention triggers.
- **Report Builder (`/dashboard/reports`)**: Form selections checklist showing active preview cards, format type, style selectors, and a compilation progress tracker.
- **Agent Monitor (`/dashboard/agents`)**: Agent fleet grid showing CPU/memory usage, controls (pause/restart), and a real-time comms terminal logs output.

---

## 5. Codebase Layout

```
analytixai/
├── public/                 # Static assets and favicons
└── src/
    ├── app/
    │   ├── globals.css     # Global styling rules, dark mode HSL variables
    │   ├── layout.tsx      # Main wrapper (fonts and SEO elements)
    │   ├── page.tsx        # Landing/login entry point
    │   └── dashboard/
    │       ├── layout.tsx  # Persistent navigation sidebar and top bar
    │       ├── page.tsx    # Primary Dashboard KPIs and graphs
    │       ├── upload/     # Data ingestion page
    │       ├── chat/       # Orchestrator conversation page
    │       ├── eda/        # Exploratory analysis page
    │       ├── visualizations/ # Recharts visual gallery page
    │       ├── sql/        # SQL editor and NL compiler page
    │       ├── predictions/# ML model and forecasting page
    │       ├── insights/   # opportunity and risk cards view
    │       ├── reports/    # PDF custom builder layout
    │       └── agents/     # CPU stats & CLI logs console page
    └── lib/
        ├── index.ts        # Central library exports
        ├── utils.ts        # Tailwind merge class names and formatting utils
        └── mock-data.ts    # Rich demo metrics, chat logs, and agent structures
```

---

## 6. How to Run and Verify

### Running the Development Server
To launch the hot-reloading Next.js dev server on your system:
```bash
cd analytixai
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to interact with the application.

### Building for Production
To perform a complete static export compilation and type-check:
```bash
cd analytixai
npm run build
```
This command checks TypeScript types, resolves routes, compiles page assets, and bundles dependencies into an optimized release version.
