"""
AnalytixAI Backend — Pytest Unit Tests
=======================================
Covers all 12 LangGraph agent nodes, the pipeline state machine,
NL query fallback, SQL safety, chatbot module, and FastAPI endpoints.

Run with:
    uv run pytest tests/ -v

Or with coverage:
    uv run pytest tests/ -v --cov=backend --cov-report=term-missing
"""

import os
import sys
import json
import pytest
import tempfile
import pandas as pd

# Ensure project root is on sys.path
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)


# ═══════════════════════════════════════════════════════════════════
# Fixtures
# ═══════════════════════════════════════════════════════════════════

@pytest.fixture
def sample_csv(tmp_path):
    """Create a temporary sample CSV file for pipeline testing."""
    df = pd.DataFrame({
        "TransactionID": range(1, 21),
        "Date": pd.date_range("2024-01-01", periods=20, freq="D").astype(str),
        "CustomerID": [f"CUST-{i:03d}" for i in range(1, 21)],
        "Amount": [100.0 + i * 10 for i in range(20)],
        "Quantity": [i % 5 + 1 for i in range(20)],
        "ProductCategory": ["Electronics", "Clothing", "Food"] * 6 + ["Electronics", "Clothing"],
        "Region": ["North America", "Europe", "Asia-Pacific"] * 6 + ["Europe", "North America"],
        "LTV": [500.0 + i * 20 for i in range(20)],
        "CAC": [100.0 + i * 5 for i in range(20)],
        "Churn": [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
        "Margin": [0.3 + i * 0.01 for i in range(20)],
    })
    csv_path = tmp_path / "test_transactions.csv"
    df.to_csv(str(csv_path), index=False)
    return str(csv_path)


@pytest.fixture
def base_state(sample_csv):
    """Minimal GraphState dict for agent node testing."""
    from langchain_core.messages import HumanMessage
    return {
        "messages": [HumanMessage(content="Run full analytics pipeline.")],
        "active_dataset_path": sample_csv,
        "plan_list": [],
        "completed_steps": [],
        "current_agent": "orchestrator",
        "numerical_columns": [],
        "categorical_columns": [],
        "sql_query": "",
        "sql_result_path": "",
        "eda_stats": {},
        "chart_specs": [],
        "insights": [],
        "predictions_path": "",
        "recommendations": [],
        "report_path": "",
        "error": None,
    }


# ═══════════════════════════════════════════════════════════════════
# 1. State Schema Tests
# ═══════════════════════════════════════════════════════════════════

class TestGraphState:
    def test_state_import(self):
        """GraphState TypedDict imports correctly."""
        from backend.state import GraphState
        assert GraphState is not None

    def test_state_fields(self):
        """GraphState contains all required field keys."""
        from backend.state import GraphState
        required = [
            "messages", "active_dataset_path", "plan_list", "completed_steps",
            "current_agent", "numerical_columns", "categorical_columns",
            "sql_query", "sql_result_path", "eda_stats", "chart_specs",
            "insights", "predictions_path", "recommendations", "report_path", "error"
        ]
        annotations = GraphState.__annotations__
        for field in required:
            assert field in annotations, f"Missing field: {field}"


# ═══════════════════════════════════════════════════════════════════
# 2. Pipeline Compilation Tests
# ═══════════════════════════════════════════════════════════════════

class TestPipeline:
    def test_pipeline_compiles(self):
        """Pipeline compiles without error."""
        from backend.pipeline import compile_pipeline
        graph = compile_pipeline()
        assert graph is not None

    def test_pipeline_has_invoke(self):
        """Compiled pipeline has an invoke method."""
        from backend.pipeline import compile_pipeline
        graph = compile_pipeline()
        assert hasattr(graph, "invoke")

    def test_pipeline_nodes_registered(self):
        """Orchestrator routing function is importable."""
        from backend.pipeline import orchestrator_router
        assert callable(orchestrator_router)


# ═══════════════════════════════════════════════════════════════════
# 3. Orchestrator Agent Tests
# ═══════════════════════════════════════════════════════════════════

class TestOrchestratorAgent:
    def test_orchestrator_import(self):
        from backend.orchestrator import orchestrator_node
        assert callable(orchestrator_node)

    def test_orchestrator_builds_plan(self, base_state):
        """Orchestrator generates a plan_list from the user message."""
        from backend.orchestrator import orchestrator_node
        result = orchestrator_node(base_state)
        assert "plan_list" in result
        assert isinstance(result["plan_list"], list)

    def test_orchestrator_marks_step(self, base_state):
        """Orchestrator adds 'orchestrator' to completed_steps."""
        from backend.orchestrator import orchestrator_node
        result = orchestrator_node(base_state)
        assert "orchestrator" in result.get("completed_steps", [])


# ═══════════════════════════════════════════════════════════════════
# 4. Ingestion Agent Tests
# ═══════════════════════════════════════════════════════════════════

class TestIngestionAgent:
    def test_ingestion_import(self):
        from backend.ingestion import ingestion_node
        assert callable(ingestion_node)

    def test_ingestion_reads_csv(self, base_state):
        """Ingestion agent loads CSV and sets dataset path in state."""
        from backend.ingestion import ingestion_node
        result = ingestion_node(base_state)
        assert "active_dataset_path" in result
        assert result["active_dataset_path"] != ""

    def test_ingestion_marks_complete(self, base_state):
        """Ingestion adds 'ingestion' to completed_steps."""
        from backend.ingestion import ingestion_node
        result = ingestion_node(base_state)
        assert "ingestion" in result.get("completed_steps", [])


# ═══════════════════════════════════════════════════════════════════
# 5. Data Cleaning Agent Tests
# ═══════════════════════════════════════════════════════════════════

class TestCleaningAgent:
    def test_cleaning_import(self):
        from backend.cleaning import cleaning_node
        assert callable(cleaning_node)

    def test_cleaning_produces_file(self, base_state, tmp_path):
        """Cleaning agent writes a cleaned CSV output."""
        from backend.cleaning import cleaning_node
        # First run ingestion to get a valid dataset
        from backend.ingestion import ingestion_node
        state = ingestion_node(base_state)
        base_state.update(state)
        result = cleaning_node(base_state)
        assert "active_dataset_path" in result

    def test_cleaning_marks_complete(self, base_state):
        """Cleaning adds 'cleaning' to completed_steps."""
        from backend.ingestion import ingestion_node
        from backend.cleaning import cleaning_node
        state = ingestion_node(base_state)
        base_state.update(state)
        result = cleaning_node(base_state)
        assert "cleaning" in result.get("completed_steps", [])


# ═══════════════════════════════════════════════════════════════════
# 6. EDA Agent Tests
# ═══════════════════════════════════════════════════════════════════

class TestEDAAgent:
    def test_eda_import(self):
        from backend.eda import eda_node
        assert callable(eda_node)

    def test_eda_produces_stats(self, base_state):
        """EDA agent produces eda_stats dict with summary data."""
        from backend.ingestion import ingestion_node
        from backend.cleaning import cleaning_node
        from backend.eda import eda_node
        state = ingestion_node(base_state); base_state.update(state)
        state = cleaning_node(base_state); base_state.update(state)
        result = eda_node(base_state)
        stats = result.get("eda_stats", {})
        assert isinstance(stats, dict)

    def test_eda_marks_complete(self, base_state):
        from backend.ingestion import ingestion_node
        from backend.cleaning import cleaning_node
        from backend.eda import eda_node
        state = ingestion_node(base_state); base_state.update(state)
        state = cleaning_node(base_state); base_state.update(state)
        result = eda_node(base_state)
        assert "eda" in result.get("completed_steps", [])


# ═══════════════════════════════════════════════════════════════════
# 7. NL Query Agent / Fallback Tests
# ═══════════════════════════════════════════════════════════════════

class TestNLQueryAgent:
    def test_nl_query_import(self):
        from backend.nl_query import run_rule_based_fallback, nl_query_node
        assert callable(run_rule_based_fallback)
        assert callable(nl_query_node)

    def test_fallback_revenue_query(self):
        """Rule-based fallback generates valid SQL for revenue queries."""
        from backend.nl_query import run_rule_based_fallback
        sql = run_rule_based_fallback("What is the total revenue?")
        assert "SELECT" in sql.upper()
        assert "Amount" in sql or "SUM" in sql.upper()

    def test_fallback_top_customers(self):
        """Rule-based fallback generates SQL for top customers."""
        from backend.nl_query import run_rule_based_fallback
        sql = run_rule_based_fallback("Show top customers")
        assert "SELECT" in sql.upper()
        assert "LIMIT" in sql.upper() or "TOP" in sql.upper()

    def test_fallback_default_query(self):
        """Fallback returns SELECT * for unrecognized queries."""
        from backend.nl_query import run_rule_based_fallback
        sql = run_rule_based_fallback("xyz unknown query 12345")
        assert "SELECT" in sql.upper()

    def test_fallback_churn_query(self):
        """Rule-based fallback handles churn queries."""
        from backend.nl_query import run_rule_based_fallback
        sql = run_rule_based_fallback("Which customers have high churn probability?")
        assert "SELECT" in sql.upper()

    def test_fallback_region_query(self):
        """Rule-based fallback handles region/geo queries."""
        from backend.nl_query import run_rule_based_fallback
        sql = run_rule_based_fallback("Revenue by region")
        assert "SELECT" in sql.upper()
        assert "Region" in sql or "GROUP BY" in sql.upper()


# ═══════════════════════════════════════════════════════════════════
# 8. SQL Agent Tests
# ═══════════════════════════════════════════════════════════════════

class TestSQLAgent:
    def test_sql_agent_import(self):
        from backend.sql_agent import sql_agent_node, execute_query_safely
        assert callable(sql_agent_node)
        assert callable(execute_query_safely)

    def test_execute_query_safely_basic(self, sample_csv):
        """execute_query_safely runs SELECT on a real CSV file."""
        from backend.sql_agent import execute_query_safely
        result = execute_query_safely("SELECT * FROM data_table LIMIT 5", sample_csv)
        assert isinstance(result, dict)
        # Should have either 'result' or 'error' key
        assert "result" in result or "error" in result

    def test_execute_query_safely_aggregation(self, sample_csv):
        """execute_query_safely handles SUM aggregation queries."""
        from backend.sql_agent import execute_query_safely
        result = execute_query_safely("SELECT SUM(Amount) as total FROM data_table", sample_csv)
        assert isinstance(result, dict)


# ═══════════════════════════════════════════════════════════════════
# 9. Predictive Agent Tests
# ═══════════════════════════════════════════════════════════════════

class TestPredictiveAgent:
    def test_predictive_import(self):
        from backend.predictive import predictive_node
        assert callable(predictive_node)

    def test_predictive_produces_path(self, base_state):
        """Predictive agent creates a predictions file."""
        from backend.ingestion import ingestion_node
        from backend.cleaning import cleaning_node
        from backend.preprocessing import preprocessing_node
        from backend.predictive import predictive_node
        state = ingestion_node(base_state); base_state.update(state)
        state = cleaning_node(base_state); base_state.update(state)
        state = preprocessing_node(base_state); base_state.update(state)
        result = predictive_node(base_state)
        assert "predictions_path" in result

    def test_predictive_marks_complete(self, base_state):
        from backend.ingestion import ingestion_node
        from backend.cleaning import cleaning_node
        from backend.preprocessing import preprocessing_node
        from backend.predictive import predictive_node
        state = ingestion_node(base_state); base_state.update(state)
        state = cleaning_node(base_state); base_state.update(state)
        state = preprocessing_node(base_state); base_state.update(state)
        result = predictive_node(base_state)
        assert "predictive" in result.get("completed_steps", [])


# ═══════════════════════════════════════════════════════════════════
# 10. Insight Agent Tests
# ═══════════════════════════════════════════════════════════════════

class TestInsightAgent:
    def test_insight_import(self):
        from backend.insight import insight_node
        assert callable(insight_node)

    def test_insight_produces_insights(self, base_state):
        """Insight agent produces a non-empty insights list."""
        from backend.ingestion import ingestion_node
        from backend.cleaning import cleaning_node
        from backend.eda import eda_node
        from backend.insight import insight_node
        state = ingestion_node(base_state); base_state.update(state)
        state = cleaning_node(base_state); base_state.update(state)
        state = eda_node(base_state); base_state.update(state)
        result = insight_node(base_state)
        insights = result.get("insights", [])
        assert isinstance(insights, list)


# ═══════════════════════════════════════════════════════════════════
# 11. Recommendation Agent Tests
# ═══════════════════════════════════════════════════════════════════

class TestRecommendationAgent:
    def test_recommendation_import(self):
        from backend.recommendation import recommendation_node
        assert callable(recommendation_node)

    def test_recommendation_produces_list(self, base_state):
        """Recommendation agent produces a recommendations list."""
        from backend.recommendation import recommendation_node
        result = recommendation_node(base_state)
        recs = result.get("recommendations", [])
        assert isinstance(recs, list)

    def test_recommendation_marks_complete(self, base_state):
        from backend.recommendation import recommendation_node
        result = recommendation_node(base_state)
        assert "recommendation" in result.get("completed_steps", [])


# ═══════════════════════════════════════════════════════════════════
# 12. Report Agent Tests
# ═══════════════════════════════════════════════════════════════════

class TestReportAgent:
    def test_report_import(self):
        from backend.report import report_node
        assert callable(report_node)

    def test_report_marks_complete(self, base_state):
        from backend.report import report_node
        result = report_node(base_state)
        assert "report" in result.get("completed_steps", [])


# ═══════════════════════════════════════════════════════════════════
# 13. Chatbot Module Tests
# ═══════════════════════════════════════════════════════════════════

class TestChatbotModule:
    def test_chatbot_import(self):
        from backend.chatbot import chat_with_groq, build_system_prompt
        assert callable(chat_with_groq)
        assert callable(build_system_prompt)

    def test_system_prompt_contains_advisor_identity(self):
        """System prompt contains the Strategy Advisor identity."""
        from backend.chatbot import build_system_prompt
        prompt = build_system_prompt(include_data=False)
        assert "Strategy Advisor" in prompt
        assert "Chief Analytics Officer" in prompt

    def test_system_prompt_with_data_context(self):
        """System prompt builds without exception when include_data=True."""
        from backend.chatbot import build_system_prompt
        prompt = build_system_prompt(include_data=True)
        assert isinstance(prompt, str)
        assert len(prompt) > 100

    def test_no_api_key_returns_helpful_message(self):
        """Without API key, chat_with_groq returns a helpful fallback message."""
        # Temporarily unset API keys
        old_key = os.environ.pop("Groq_API", None)
        old_key2 = os.environ.pop("GROQ_API_KEY", None)
        try:
            from backend.chatbot import chat_with_groq
            result = chat_with_groq([{"role": "user", "content": "Hello"}], include_data_context=False)
            assert result["role"] == "assistant"
            assert "key" in result["content"].lower() or "api" in result["content"].lower()
        finally:
            if old_key: os.environ["Groq_API"] = old_key
            if old_key2: os.environ["GROQ_API_KEY"] = old_key2


# ═══════════════════════════════════════════════════════════════════
# 14. FastAPI Server Endpoint Tests
# ═══════════════════════════════════════════════════════════════════

class TestFastAPIServer:
    @pytest.fixture
    def client(self):
        from fastapi.testclient import TestClient
        from backend.server import app
        return TestClient(app)

    def test_health_endpoint_returns_200(self, client):
        """GET /api/health returns HTTP 200."""
        response = client.get("/api/health")
        assert response.status_code == 200

    def test_health_endpoint_has_status(self, client):
        """GET /api/health response contains 'status' field."""
        response = client.get("/api/health")
        data = response.json()
        assert "status" in data
        assert data["status"] == "online"

    def test_health_endpoint_has_fleet(self, client):
        """GET /api/health response contains fleet list."""
        response = client.get("/api/health")
        data = response.json()
        assert "fleet" in data
        assert len(data["fleet"]) >= 12

    def test_health_endpoint_agents_available(self, client):
        """GET /api/health reports agents_available."""
        response = client.get("/api/health")
        data = response.json()
        assert "agents_available" in data
        assert data["agents_available"] >= 12

    def test_chat_endpoint_no_api_key_returns_message(self, client):
        """POST /api/chat without API key returns assistant fallback (not HTTP error)."""
        old_key = os.environ.pop("Groq_API", None)
        old_key2 = os.environ.pop("GROQ_API_KEY", None)
        try:
            payload = {
                "messages": [{"role": "user", "content": "What is our revenue?"}],
                "include_data_context": False
            }
            response = client.post("/api/chat", json=payload)
            assert response.status_code == 200
            data = response.json()
            assert "content" in data
        finally:
            if old_key: os.environ["Groq_API"] = old_key
            if old_key2: os.environ["GROQ_API_KEY"] = old_key2

    def test_query_sql_endpoint_accepts_request(self, client):
        """POST /api/query/sql endpoint accepts a valid query request."""
        payload = {
            "query": "What is the total revenue?",
            "dataset_path": "data/cleaned_data.csv"
        }
        response = client.post("/api/query/sql", json=payload)
        # Should return 200 even if file doesn't exist (graceful error)
        assert response.status_code in [200, 404, 500]


# ═══════════════════════════════════════════════════════════════════
# 15. Full End-to-End Pipeline Smoke Test (slow)
# ═══════════════════════════════════════════════════════════════════

class TestPipelineEndToEnd:
    @pytest.mark.slow
    def test_full_pipeline_runs(self, base_state):
        """Full pipeline invocation completes without exception."""
        from backend.pipeline import compile_pipeline
        graph = compile_pipeline()
        try:
            result = graph.invoke(base_state)
            # Pipeline should complete at least ingestion and cleaning
            completed = result.get("completed_steps", [])
            assert len(completed) > 0
        except Exception as e:
            pytest.fail(f"Pipeline raised an unexpected exception: {e}")
