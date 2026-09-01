import pandas as pd
from typing import Dict, Any, List
from backend.state import GraphState

def visualization_node(state: GraphState) -> Dict[str, Any]:
    """
    Visualization Agent (📈): Formulates plotting specifications for Recharts-JSON
    to render cohort retention, sales trend lines, and margin breakdown charts.
    """
    print("\n--- [Visualization Agent] ---")
    dataset_path = state.get("cleaned_dataset_path") or state.get("active_dataset_path")
    if not dataset_path:
        print("Error: No dataset path available for visualization.")
        return {"error": "Visualization failed: No dataset loaded."}
        
    print(f"Loading dataset for visualization: {dataset_path}")
    try:
        df = pd.read_csv(dataset_path)
        chart_specs = []
        
        # 1. Monthly Revenue Trend Chart (if Date and Amount/Sales exist)
        date_col = next((c for c in df.columns if any(w in c.lower() for w in ["date", "month", "year"])), None)
        amount_col = next((c for c in df.columns if any(w in c.lower() for w in ["amount", "sales", "revenue"])), None)
        
        if date_col and amount_col:
            # Group by date/month and sum amounts
            # First ensure date format
            df_temp = df.copy()
            df_temp[date_col] = pd.to_datetime(df_temp[date_col], errors='coerce')
            df_temp = df_temp.dropna(subset=[date_col])
            
            # Group by Month
            df_temp['Month'] = df_temp[date_col].dt.strftime('%Y-%m')
            monthly_trend = df_temp.groupby('Month')[amount_col].sum().reset_index()
            # Sort chronologically
            monthly_trend = monthly_trend.sort_values('Month')
            
            chart_specs.append({
                "type": "line",
                "title": "Monthly Revenue Trend",
                "xKey": "Month",
                "yKey": "Revenue",
                "data": monthly_trend.rename(columns={amount_col: "Revenue"}).to_dict(orient="records")
            })
            print("Generated Line Chart spec: Monthly Revenue Trend")
            
        # 2. ProductCategory breakdown Bar Chart (if category exist)
        cat_col = next((c for c in df.columns if any(w in c.lower() for w in ["category", "segment", "region"])), None)
        if cat_col and amount_col:
            category_breakdown = df.groupby(cat_col)[amount_col].sum().reset_index()
            category_breakdown = category_breakdown.sort_values(amount_col, ascending=False).head(8)
            
            chart_specs.append({
                "type": "bar",
                "title": f"Revenue by {cat_col}",
                "xKey": cat_col,
                "yKey": "Revenue",
                "data": category_breakdown.rename(columns={amount_col: "Revenue"}).to_dict(orient="records")
            })
            print(f"Generated Bar Chart spec: Revenue by {cat_col}")
            
        # 3. Customer Churn Distribution (if Churn and CustomerID/Segment exist)
        churn_col = next((c for c in df.columns if "churn" in c.lower()), None)
        if churn_col:
            churn_counts = df[churn_col].value_counts().reset_index()
            churn_counts.columns = ["Status", "Count"]
            churn_counts["Status"] = churn_counts["Status"].map({1: "Churned", 0: "Active"})
            
            chart_specs.append({
                "type": "pie",
                "title": "Customer Retention vs Churn Distribution",
                "xKey": "Status",
                "yKey": "Count",
                "data": churn_counts.to_dict(orient="records")
            })
            print("Generated Pie Chart spec: Churn Distribution")
            
        # 4. Correlation scatter (LTV vs Amount / Sales if both exist)
        ltv_col = next((c for c in df.columns if "ltv" in c.lower()), None)
        if ltv_col and amount_col:
            scatter_data = df[[ltv_col, amount_col]].dropna().head(100) # limit to 100 points
            chart_specs.append({
                "type": "scatter",
                "title": "Customer Lifetime Value (LTV) vs Purchase Amount",
                "xKey": ltv_col,
                "yKey": amount_col,
                "data": scatter_data.to_dict(orient="records")
            })
            print("Generated Scatter Plot spec: LTV vs Purchase Amount")
            
        # If no charts generated, add a default placeholder
        if not chart_specs:
            chart_specs.append({
                "type": "bar",
                "title": "Dataset Row Count Summary",
                "xKey": "Dataset",
                "yKey": "Rows",
                "data": [{"Dataset": "Records", "Rows": len(df)}]
            })
            
        completed = list(state.get("completed_steps", []))
        if "visualization" not in completed:
            completed.append("visualization")
            
        return {
            "chart_specs": chart_specs,
            "completed_steps": completed
        }
        
    except Exception as e:
        print(f"Error in Visualization: {str(e)}")
        return {"error": f"Visualization failed: {str(e)}"}
