import os
import pandas as pd
from typing import Dict, Any
from agents.state import GraphState

def preprocessing_node(state: GraphState) -> Dict[str, Any]:
    """
    Data Preprocessing Agent (⚙️): Normalizes business features, encodes
    customer segment dimensions, and scales numeric columns for modeling.
    """
    print("\n--- [Data Preprocessing Agent] ---")
    cleaned_path = state.get("cleaned_dataset_path") or state.get("active_dataset_path")
    if not cleaned_path:
        print("Error: No cleaned dataset path in state.")
        return {"error": "Preprocessing failed: No dataset to preprocess."}
        
    print(f"Loading cleaned dataset for preprocessing: {cleaned_path}")
    try:
        df = pd.read_csv(cleaned_path)
        
        numerical_cols = state.get("numerical_columns", [])
        categorical_cols = state.get("categorical_columns", [])
        
        if not numerical_cols:
            numerical_cols = list(df.select_dtypes(include=['number']).columns)
        if not categorical_cols:
            categorical_cols = list(df.select_dtypes(exclude=['number']).columns)
            
        print(f"Numerical variables for scaling: {numerical_cols}")
        print(f"Categorical variables for encoding: {categorical_cols}")
        
        # Create a copy for preprocessing
        processed_df = df.copy()
        
        # 1. Scale Numerical Columns (Min-Max Scaling to [0, 1])
        scaled_features = {}
        for col in numerical_cols:
            if col in processed_df.columns:
                col_min = processed_df[col].min()
                col_max = processed_df[col].max()
                if col_max - col_min > 0:
                    processed_df[col] = (processed_df[col] - col_min) / (col_max - col_min)
                    scaled_features[col] = {"min": float(col_min), "max": float(col_max)}
                    print(f"Scaled column '{col}' to range [0, 1].")
                else:
                    processed_df[col] = 0.0
                    
        # 2. Encode Categorical Columns (One-Hot Encoding)
        # We'll use pandas get_dummies but ensure columns are numeric flags (0 or 1)
        encoded_cols = []
        if categorical_cols:
            cols_to_encode = [c for c in categorical_cols if c in processed_df.columns]
            if cols_to_encode:
                processed_df = pd.get_dummies(processed_df, columns=cols_to_encode, dtype=int)
                # Keep track of newly created dummy columns
                encoded_cols = [c for c in processed_df.columns if not any(c == orig or c.startswith(orig + "_") for orig in numerical_cols)]
                print(f"One-hot encoded categorical columns: {cols_to_encode}")
                
        preproc_path = "data/preprocessed_data.csv"
        processed_df.to_csv(preproc_path, index=False)
        print(f"Saved preprocessed dataset to: {preproc_path}")
        print(f"Preprocessed shape: {processed_df.shape}")
        
        # Update completed steps
        completed = list(state.get("completed_steps", []))
        if "preprocessing" not in completed:
            completed.append("preprocessing")
            
        return {
            "preprocessed_dataset_path": preproc_path,
            "completed_steps": completed
        }
        
    except Exception as e:
        print(f"Error in data preprocessing: {str(e)}")
        return {"error": f"Preprocessing failed: {str(e)}"}
