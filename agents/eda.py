import pandas as pd
from typing import Dict, Any
from agents.state import GraphState

def eda_node(state: GraphState) -> Dict[str, Any]:
    """
    EDA Agent (📊): Calculates business descriptive statistics, computes
    price vs. volume elasticity correlations, and maps feature distributions.
    """
    print("\n--- [EDA Agent] ---")
    dataset_path = state.get("cleaned_dataset_path") or state.get("active_dataset_path")
    if not dataset_path:
        print("Error: No dataset path available for EDA.")
        return {"error": "EDA failed: No dataset loaded."}
        
    print(f"Loading dataset for EDA: {dataset_path}")
    try:
        df = pd.read_csv(dataset_path)
        
        # 1. Row/Col counts
        num_rows, num_cols = df.shape
        
        # 2. Descriptive statistics
        numeric_df = df.select_dtypes(include=['number'])
        describe_dict = {}
        for col in numeric_df.columns:
            desc = numeric_df[col].describe()
            describe_dict[col] = {k: float(v) for k, v in desc.items()}
            
        # 3. Correlation Matrix
        corr_matrix = {}
        if numeric_df.shape[1] > 1:
            corr = numeric_df.corr(method="pearson")
            for col in corr.columns:
                corr_matrix[col] = {k: float(v) for k, v in corr[col].items()}
                
        # 4. Categorical summaries (value counts of top categories)
        categorical_df = df.select_dtypes(exclude=['number'])
        cat_summaries = {}
        for col in categorical_df.columns:
            counts = categorical_df[col].value_counts().head(5)
            cat_summaries[col] = {str(k): int(v) for k, v in counts.items()}
            
        print("EDA analysis completed.")
        print(f"Processed {num_rows} rows. Numeric columns analyzed: {list(numeric_df.columns)}")
        
        # Merge with existing eda_stats (e.g. audit logs from cleaning)
        current_eda = state.get("eda_stats", {}) or {}
        new_eda = {
            **current_eda,
            "row_count": int(num_rows),
            "column_count": int(num_cols),
            "descriptive_stats": describe_dict,
            "correlation_matrix": corr_matrix,
            "categorical_summaries": cat_summaries
        }
        
        completed = list(state.get("completed_steps", []))
        if "eda" not in completed:
            completed.append("eda")
            
        return {
            "eda_stats": new_eda,
            "completed_steps": completed
        }
        
    except Exception as e:
        print(f"Error in EDA: {str(e)}")
        return {"error": f"EDA failed: {str(e)}"}
