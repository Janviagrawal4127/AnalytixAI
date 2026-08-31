import os
import pandas as pd
import numpy as np
from typing import Dict, Any
from agents.state import GraphState
from langgraph.graph import StateGraph

def cleaning_node(state: GraphState) -> Dict[str, Any]:
    """
    Data Quality & Cleaning Agent (🧹): Scans for null values, duplicate rows,
    and outliers; performs statistical imputation and value capping.
    """
    print("\n--- [Data Quality & Cleaning Agent] ---")
    active_path = state.get("active_dataset_path")
    if not active_path:
        print("Error: No dataset path available in state.")
        return {"error": "Cleaning failed: No active dataset path."}
        
    print(f"Loading dataset for cleaning: {active_path}")
    try:
        df = pd.read_csv(active_path)
        original_shape = df.shape
        
        # 1. Duplicate Handling
        duplicates_count = df.duplicated().sum()
        df = df.drop_duplicates()
        print(f"Identified and removed {duplicates_count} duplicate rows.")
        
        # 2. Missing Value Imputation
        imputed_counts = {}
        for col in df.columns:
            null_count = df[col].isnull().sum()
            if null_count > 0:
                imputed_counts[col] = int(null_count)
                if df[col].dtype in [np.float64, np.int64, 'float64', 'int64']:
                    # Impute with median
                    median_val = df[col].median()
                    df[col] = df[col].fillna(median_val)
                    print(f"Column '{col}': Imputed {null_count} nulls with median ({median_val}).")
                else:
                    # Impute with mode
                    mode_val = df[col].mode().iloc[0] if not df[col].mode().empty else "Unknown"
                    df[col] = df[col].fillna(mode_val)
                    print(f"Column '{col}': Imputed {null_count} nulls with mode ('{mode_val}').")
                    
        # 3. Outlier Capping (IQR Method)
        capped_counts = {}
        numerical_cols = state.get("numerical_columns", [])
        if not numerical_cols:
            numerical_cols = list(df.select_dtypes(include=['number']).columns)
            
        for col in numerical_cols:
            if col in df.columns and df[col].nunique() > 2: # Ignore binary columns
                q1 = df[col].quantile(0.25)
                q3 = df[col].quantile(0.75)
                iqr = q3 - q1
                lower_bound = q1 - 1.5 * iqr
                upper_bound = q3 + 1.5 * iqr
                
                # Check for outliers
                outliers_mask = (df[col] < lower_bound) | (df[col] > upper_bound)
                outliers_count = outliers_mask.sum()
                
                if outliers_count > 0:
                    capped_counts[col] = int(outliers_count)
                    df[col] = np.clip(df[col], lower_bound, upper_bound)
                    print(f"Column '{col}': Capped {outliers_count} outliers to [{lower_bound:.2f}, {upper_bound:.2f}].")
                    
        cleaned_path = "data/cleaned_data.csv"
        df.to_csv(cleaned_path, index=False)
        print(f"Saved cleaned dataset to: {cleaned_path}")
        print(f"Cleaned shape: {df.shape} (Original shape was {original_shape})")
        
        # Update completed steps
        completed = list(state.get("completed_steps", []))
        if "clean" not in completed:
            completed.append("clean")
            
        # Log clean metrics in messages/history if needed, or return in state
        return {
            "cleaned_dataset_path": cleaned_path,
            "active_dataset_path": cleaned_path, # update active path for subsequent steps
            "completed_steps": completed,
            "eda_stats": {
                "cleaning_audit": {
                    "removed_duplicates": int(duplicates_count),
                    "imputed_missing": imputed_counts,
                    "capped_outliers": capped_counts,
                    "rows_before": original_shape[0],
                    "rows_after": df.shape[0]
                }
            }
        }
        
    except Exception as e:
        print(f"Error in data cleaning: {str(e)}")
        return {"error": f"Cleaning failed: {str(e)}"}
