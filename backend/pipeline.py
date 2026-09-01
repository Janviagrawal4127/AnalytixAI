from langgraph.graph import StateGraph, END
from backend.state import GraphState
from backend.orchestrator import orchestrator_node
from backend.ingestion import ingestion_node
from backend.cleaning import cleaning_node
from backend.preprocessing import preprocessing_node
from backend.nl_query import nl_query_node
from backend.sql_agent import sql_agent_node
from backend.eda import eda_node
from backend.visualization import visualization_node
from backend.predictive import predictive_node
from backend.insight import insight_node
from backend.recommendation import recommendation_node
from backend.report import report_node

def orchestrator_router(state: GraphState) -> str:
    """
    Determines which agent node to execute next based on orchestrator decisions.
    """
    next_agent = state.get("current_agent", "end")
    if next_agent in [
        "ingest", "clean", "preprocessing", "nl_query", "sql_agent",
        "eda", "visualization", "predictive", "insight", "recommendation", "report"
    ]:
        return next_agent
    return "end"

def compile_pipeline():
    """
    Compiles the 12-agent LangGraph workflow in a hub-and-spoke structure.
    """
    # 1. Initialize State Graph
    builder = StateGraph(GraphState)
    
    # 2. Add Nodes
    builder.add_node("orchestrator", orchestrator_node)
    builder.add_node("ingest", ingestion_node)
    builder.add_node("clean", cleaning_node)
    builder.add_node("preprocessing", preprocessing_node)
    builder.add_node("nl_query", nl_query_node)
    builder.add_node("sql_agent", sql_agent_node)
    builder.add_node("eda", eda_node)
    builder.add_node("visualization", visualization_node)
    builder.add_node("predictive", predictive_node)
    builder.add_node("insight", insight_node)
    builder.add_node("recommendation", recommendation_node)
    builder.add_node("report", report_node)
    
    # 3. Define Entry Point
    builder.set_entry_point("orchestrator")
    
    # 4. Define Hub-and-Spoke Routing
    # The orchestrator dynamically routes to spokes or ends
    builder.add_conditional_edges(
        "orchestrator",
        orchestrator_router,
        {
            "ingest": "ingest",
            "clean": "clean",
            "preprocessing": "preprocessing",
            "nl_query": "nl_query",
            "sql_agent": "sql_agent",
            "eda": "eda",
            "visualization": "visualization",
            "predictive": "predictive",
            "insight": "insight",
            "recommendation": "recommendation",
            "report": "report",
            "end": END
        }
    )
    
    # Every spoke node returns back to the orchestrator to check next steps
    builder.add_edge("ingest", "orchestrator")
    builder.add_edge("clean", "orchestrator")
    builder.add_edge("preprocessing", "orchestrator")
    builder.add_edge("nl_query", "orchestrator")
    builder.add_edge("sql_agent", "orchestrator")
    builder.add_edge("eda", "orchestrator")
    builder.add_edge("visualization", "orchestrator")
    builder.add_edge("predictive", "orchestrator")
    builder.add_edge("insight", "orchestrator")
    builder.add_edge("recommendation", "orchestrator")
    builder.add_edge("report", "orchestrator")
    
    # Compile graph
    return builder.compile()
