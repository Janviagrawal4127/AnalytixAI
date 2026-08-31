import re
from typing import Dict, Any, List
from langchain_core.messages import AIMessage
from agents.state import GraphState

def orchestrator_node(state: GraphState) -> Dict[str, Any]:
    """
    Master Orchestrator Agent (🧠): Parses user queries, schedules agent execution loops,
    and synchronizes shared context memory.
    """
    print("\n--- [Master Orchestrator Agent] ---")
    
    messages = state.get("messages", [])
    plan_list = state.get("plan_list", [])
    completed_steps = state.get("completed_steps", [])
    
    # If plan is empty, let's parse the last user message and create a plan
    if not plan_list:
        print("Plan list is empty. Analyzing user request to construct execution plan...")
        user_query = ""
        if messages:
            user_query = messages[-1].content.lower()
        
        plan = []
        
        # Check for Ingestion
        if any(w in user_query for w in ["ingest", "load", "import", "read", "dataset", "csv", "json", "excel", "file"]):
            plan.append("ingest")
        
        # Check for Cleaning
        if any(w in user_query for w in ["clean", "null", "missing", "impute", "quality", "outlier", "dedup"]):
            # Ingestion must precede cleaning if not already planned
            if "ingest" not in plan:
                plan.append("ingest")
            plan.append("clean")
            
        # Check for Preprocessing
        if any(w in user_query for w in ["preprocess", "scale", "encode", "one-hot", "normalize", "prepare"]):
            if "ingest" not in plan:
                plan.append("ingest")
            if "clean" not in plan and "clean" in user_query:
                plan.append("clean")
            plan.append("preprocessing")
            
        # Check for SQL/NL Query
        if any(w in user_query for w in ["sql", "query", "select", "database", "find in table", "how many", "what is the average", "highest"]):
            # Direct database query requested
            if "ingest" not in plan:
                plan.append("ingest")
            plan.append("nl_query")
            plan.append("sql_agent")
            
        # Check for EDA
        if any(w in user_query for w in ["eda", "stats", "correlation", "describe", "summary", "distribution"]):
            if "ingest" not in plan:
                plan.append("ingest")
            plan.append("eda")
            
        # Check for Predictive
        if any(w in user_query for w in ["forecast", "predict", "model", "churn", "regression", "ml", "machine learning"]):
            if "ingest" not in plan:
                plan.append("ingest")
            if "clean" not in plan:
                plan.append("clean")
            if "preprocessing" not in plan:
                plan.append("preprocessing")
            plan.append("predictive")
            
        # Check for Insights
        if any(w in user_query for w in ["insight", "opportunity", "risk", "anomaly", "leakage"]):
            if "ingest" not in plan:
                plan.append("ingest")
            if "eda" not in plan:
                plan.append("eda")
            plan.append("insight")
            
        # Check for Recommendation
        if any(w in user_query for w in ["recommend", "action", "roi", "priority", "suggest"]):
            if "ingest" not in plan:
                plan.append("ingest")
            if "insight" not in plan:
                plan.append("insight")
            plan.append("recommendation")
            
        # Check for Report Compilation
        if any(w in user_query for w in ["report", "pdf", "html", "compile", "export", "download"]):
            plan.append("report")
            
        # If no specific patterns matched, schedule the full pipeline
        if not plan:
            print("No specific commands detected. Scheduling full end-to-end analytics workflow.")
            plan = ["ingest", "clean", "preprocessing", "eda", "predictive", "insight", "recommendation", "report"]
            
        plan_list = plan
        print(f"Generated execution plan: {plan_list}")

    # Determine next agent to call
    next_agent = "end"
    for step in plan_list:
        if step not in completed_steps:
            next_agent = step
            break
            
    print(f"Current Completed Steps: {completed_steps}")
    print(f"Routing to next agent: {next_agent}")
    
    # Return state updates
    return {
        "plan_list": plan_list,
        "current_agent": next_agent
    }
