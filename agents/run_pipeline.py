import os
import sys
from dotenv import load_dotenv

# Load env variables from root .env
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
load_dotenv(dotenv_path=dotenv_path)

from langchain_core.messages import HumanMessage
from agents.generate_sample_data import generate_sample_dataset
from agents.pipeline import compile_pipeline

def run_end_to_end_pipeline(prompt: str = None):
    """
    Runs the multi-agent analytics pipeline end-to-end using LangGraph.
    """
    print("==================================================")
    print("   AnalytixAI Multi-Agent Coordination Pipeline   ")
    print("==================================================")
    
    # 1. Generate sample data if not exists
    dataset_path = "data/sample_transactions.csv"
    if not os.path.exists(dataset_path):
        generate_sample_dataset(dataset_path)
        
    # 2. Compile LangGraph workflow
    print("Compiling LangGraph hub-and-spoke agent network...")
    graph = compile_pipeline()
    
    # 3. Configure Prompt
    if not prompt:
        prompt = (
            "Ingest the transactions dataset, clean missing values and outliers, "
            "perform EDA, forecast revenue sales, identify customer churn risks, "
            "and compile the executive report."
        )
    print(f"Goal Prompt: '{prompt}'")
    
    # 4. Prepare initial state
    initial_state = {
        "messages": [HumanMessage(content=prompt)],
        "active_dataset_path": dataset_path,
        "plan_list": [],
        "completed_steps": [],
        "current_agent": "orchestrator",
        "numerical_columns": [],
        "categorical_columns": [],
        "sql_query": None,
        "sql_result_path": None,
        "eda_stats": {},
        "chart_specs": [],
        "insights": [],
        "predictions_path": None,
        "recommendations": [],
        "report_path": None,
        "error": None
    }
    
    # 5. Execute Graph
    print("\nTriggering pipeline execution...\n")
    try:
        final_state = graph.invoke(initial_state)
        
        print("\n==================================================")
        print("            Pipeline Execution Summary            ")
        print("==================================================")
        print(f"Status: {'Success' if not final_state.get('error') else 'Failed'}")
        if final_state.get("error"):
            print(f"Error: {final_state.get('error')}")
        print(f"Completed Steps: {final_state.get('completed_steps')}")
        print(f"Cleaned Dataset Path: {final_state.get('cleaned_dataset_path')}")
        print(f"Preprocessed Dataset Path: {final_state.get('preprocessed_dataset_path')}")
        print(f"Generated Insights Count: {len(final_state.get('insights', []))}")
        print(f"Recommendations Count: {len(final_state.get('recommendations', []))}")
        print(f"Final Report Path: {final_state.get('report_path')}")
        print("==================================================")
        
    except Exception as e:
        print(f"\nExecution crashed with error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    custom_prompt = sys.argv[1] if len(sys.argv) > 1 else None
    run_end_to_end_pipeline(custom_prompt)
