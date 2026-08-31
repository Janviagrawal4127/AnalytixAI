import os
import json
import numpy as np
import pandas as pd
from typing import Dict, Any
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import train_test_split
from agents.state import GraphState

def predictive_node(state: GraphState) -> Dict[str, Any]:
    """
    Predictive Analytics Agent (🔮): Forecasts future quarterly revenues and
    classifies customer churn probabilities using light ML wrappers.
    """
    print("\n--- [Predictive Analytics Agent] ---")
    dataset_path = state.get("cleaned_dataset_path") or state.get("active_dataset_path")
    if not dataset_path:
        print("Error: No dataset path available for predictions.")
        return {"error": "Predictive analytics failed: No dataset loaded."}
        
    print(f"Loading dataset for predictive modeling: {dataset_path}")
    try:
        df = pd.read_csv(dataset_path)
        predictions_output = {}
        
        # 1. 90-Day Time Series Revenue Forecast
        date_col = next((c for c in df.columns if any(w in c.lower() for w in ["date", "month", "year"])), None)
        amount_col = next((c for c in df.columns if any(w in c.lower() for w in ["amount", "sales", "revenue"])), None)
        
        if date_col and amount_col:
            df_ts = df.copy()
            df_ts[date_col] = pd.to_datetime(df_ts[date_col], errors='coerce')
            df_ts = df_ts.dropna(subset=[date_col, amount_col])
            
            # Group by date (daily or monthly)
            daily_sales = df_ts.groupby(df_ts[date_col].dt.date)[amount_col].sum().reset_index()
            daily_sales.columns = ["Date", "Sales"]
            daily_sales = daily_sales.sort_values("Date")
            
            if len(daily_sales) > 3:
                # Fit linear regression model
                # X: days as integers starting from 0
                dates = pd.to_datetime(daily_sales["Date"])
                start_date = dates.min()
                X = (dates - start_date).dt.days.values.reshape(-1, 1)
                y = daily_sales["Sales"].values
                
                model = LinearRegression()
                model.fit(X, y)
                
                # Predict 90 days into the future
                last_day = int(X.max())
                future_days = np.arange(last_day + 1, last_day + 91).reshape(-1, 1)
                future_preds = model.predict(future_days)
                
                future_dates = pd.date_range(start=dates.max() + pd.Timedelta(days=1), periods=90)
                
                forecast_list = []
                for d, val in zip(future_dates, future_preds):
                    forecast_list.append({
                        "date": d.strftime("%Y-%m-%d"),
                        "predicted_sales": float(max(0.0, val)) # no negative sales
                    })
                    
                predictions_output["revenue_forecast_90d"] = forecast_list
                print(f"Generated 90-day sales forecast. Projected total revenue: {sum(future_preds):.2f}")
                
        # 2. Churn Classification Risk Mapping
        churn_col = next((c for c in df.columns if "churn" in c.lower()), None)
        cust_col = next((c for c in df.columns if "customerid" in c.lower() or "customer_id" in c.lower()), "CustomerID")
        
        if churn_col and churn_col in df.columns:
            # We want to identify churn indicators. Let's select numeric features as features
            exclude_cols = [churn_col, cust_col, date_col]
            feature_cols = [c for c in df.columns if df[c].dtype in [np.float64, np.int64, 'float64', 'int64'] and c not in exclude_cols]
            
            if feature_cols:
                df_churn = df[[churn_col] + feature_cols].dropna()
                X_churn = df_churn[feature_cols]
                y_churn = df_churn[churn_col]
                
                # Only train model if we have sufficient samples of both classes
                if y_churn.nunique() > 1 and len(df_churn) > 10:
                    clf = LogisticRegression(max_iter=1000)
                    clf.fit(X_churn, y_churn)
                    
                    # Compute probabilities for all customers
                    full_features = df[feature_cols].fillna(0)
                    probs = clf.predict_proba(full_features)[:, 1] # prob of churn
                    
                    df_risks = df.copy()
                    df_risks["churn_probability"] = probs
                    
                    # Extract top 10 high-risk customers
                    high_risk = df_risks[[cust_col, "churn_probability"]].sort_values("churn_probability", ascending=False).head(10)
                    
                    predictions_output["churn_risk_analysis"] = {
                        "feature_importances": {col: float(coef) for col, coef in zip(feature_cols, clf.coef_[0])},
                        "high_risk_customers": high_risk.to_dict(orient="records")
                    }
                    print(f"Churn classification model trained on features: {feature_cols}")
                    print("Identified top churn risk customers.")
                    
        # Write predictions to disk
        os.makedirs("data", exist_ok=True)
        pred_path = "data/predictions.json"
        with open(pred_path, "w") as f:
            json.dump(predictions_output, f, indent=2)
            
        print(f"Saved prediction results to: {pred_path}")
        
        completed = list(state.get("completed_steps", []))
        if "predictive" not in completed:
            completed.append("predictive")
            
        return {
            "predictions_path": pred_path,
            "completed_steps": completed
        }
        
    except Exception as e:
        print(f"Error in Predictive Agent: {str(e)}")
        return {"error": f"Predictive analytics failed: {str(e)}"}
