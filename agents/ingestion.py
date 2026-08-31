import os
import pandas as pd
from typing import Dict, Any
from agents.state import GraphState

def ingestion_node(state: GraphState) -> Dict[str, Any]:
    """
    Data Ingestion Agent (📥): Reads raw business uploads (CSV/Excel/JSON)
    and maps them into pandas DataFrames, identifying schema features.
    """
    print("\n--- [Data Ingestion Agent] ---")
    active_path = state.get("active_dataset_path")
    if not active_path:
        print("Error: No active dataset path provided.")
        return {"error": "Ingestion failed: No active dataset path in state."}
        
    print(f"Loading dataset from: {active_path}")
    try:
        # Determine file type and load
        if active_path.endswith('.csv'):
            df = pd.read_csv(active_path)
        elif active_path.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(active_path)
        elif active_path.endswith('.json'):
            df = pd.read_json(active_path)
        else:
            # Fallback to csv
            df = pd.read_csv(active_path)
            
        print(f"Successfully loaded dataset with {df.shape[0]} rows and {df.shape[1]} columns.")
        
        # Ensure directories exist
        os.makedirs("data", exist_ok=True)
        raw_path = "data/raw_data.csv"
        df.to_csv(raw_path, index=False)
        print(f"Saved raw dataset copy to: {raw_path}")
        
        # Identify columns
        numerical_cols = list(df.select_dtypes(include=['number']).columns)
        categorical_cols = list(df.select_dtypes(exclude=['number']).columns)
        
        print(f"Numerical columns detected: {numerical_cols}")
        print(f"Categorical columns detected: {categorical_cols}")
        
        # Update completed steps
        completed = list(state.get("completed_steps", []))
        if "ingest" not in completed:
            completed.append("ingest")
            
        return {
            "active_dataset_path": raw_path,
            "numerical_columns": numerical_cols,
            "categorical_columns": categorical_cols,
            "completed_steps": completed
        }
        
    except Exception as e:
        print(f"Error in data ingestion: {str(e)}")
        return {"error": f"Ingestion failed: {str(e)}"}
