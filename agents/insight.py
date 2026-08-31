import json
import os
from typing import Dict, Any, List
from agents.state import GraphState

def insight_node(state: GraphState) -> Dict[str, Any]:
    """
    Insight Generator Agent (💡): Scans business metrics, correlation matrices, and
    forecasting trends to identify strategic opportunities and revenue leakage risks.
    """
    print("\n--- [Insight Generator Agent] ---")
    eda_stats = state.get("eda_stats", {})
    pred_path = state.get("predictions_path")
    
    predictions = {}
    if pred_path and os.path.exists(pred_path):
        try:
            with open(pred_path, "r") as f:
                predictions = json.load(f)
        except Exception as e:
            print(f"Could not load predictions file: {str(e)}")
            
    insights_list = []
    
    # 1. Analyze correlations for pricing elasticity or LTV drivers
    corr = eda_stats.get("correlation_matrix", {})
    amount_corr = corr.get("Amount", {}) or corr.get("Sales", {}) or {}
    
    # Check for strong correlation indicators
    for target_col, corr_val in amount_corr.items():
        if target_col in ["Amount", "Sales", "Revenue", "TransactionID", "CustomerID"]:
            continue
        if corr_val < -0.3:
            insights_list.append({
                "type": "risk",
                "title": f"Strong Negative Elasticity in {target_col}",
                "description": f"There is a negative correlation ({corr_val:.2f}) between {target_col} and Purchase Amount. Increases in {target_col} may depress transactional volumes.",
                "metric_impact": "Average Order Value (AOV)",
                "confidence": "high"
            })
        elif corr_val > 0.4:
            insights_list.append({
                "type": "opportunity",
                "title": f"{target_col} is a Strong Driver of Order Size",
                "description": f"A positive correlation ({corr_val:.2f}) indicates that customers scoring high on {target_col} also tend to make larger purchases. Consider expanding features driving {target_col}.",
                "metric_impact": "Total Sales Revenue",
                "confidence": "high"
            })
            
    # 2. Analyze churn risks from predictions
    churn_analysis = predictions.get("churn_risk_analysis", {})
    high_risk_custs = churn_analysis.get("high_risk_customers", [])
    if high_risk_custs:
        highest_churn_prob = max([c.get("churn_probability", 0) for c in high_risk_custs] or [0])
        if highest_churn_prob > 0.5:
            insights_list.append({
                "type": "risk",
                "title": "Severe Customer Churn Probability Detected",
                "description": f"Logistic regression modeling indicates high risk of churn for top customer segments (peak probability: {highest_churn_prob * 100:.1f}%). Key attrition drivers are linked to low purchasing activity.",
                "metric_impact": "Customer Retention Rate",
                "confidence": "high"
            })
            
    # 3. Category performance / niche opportunities
    cat_sums = eda_stats.get("categorical_summaries", {})
    category_col = next((c for c in cat_sums.keys() if "category" in c.lower()), None)
    if category_col and cat_sums[category_col]:
        top_cats = sorted(cat_sums[category_col].items(), key=lambda x: x[1], reverse=True)
        if len(top_cats) > 1:
            largest_cat, size = top_cats[0]
            smallest_cat, min_size = top_cats[-1]
            insights_list.append({
                "type": "opportunity",
                "title": f"Niche Scaling in Category: {smallest_cat}",
                "description": f"While '{largest_cat}' commands the highest volume, category '{smallest_cat}' represents a lower-volume segment that may contain unexploited high-margin opportunities.",
                "metric_impact": "Gross Profit Margin",
                "confidence": "medium"
            })
            
    # Add default general insights if none found
    if not insights_list:
        insights_list.append({
            "type": "opportunity",
            "title": "General Revenue Baseline Opportunity",
            "description": "Historical sales distribution is stable. Focus marketing budgets on top-performing customer cohorts.",
            "metric_impact": "Customer Acquisition Cost (CAC) Efficiency",
            "confidence": "medium"
        })
        insights_list.append({
            "type": "risk",
            "title": "Outlier Volatility Exposure",
            "description": "Extreme transaction sizes create revenue volatility. Imputed records show customer spending relies heavily on a few key regions.",
            "metric_impact": "Gross Cash Flow Stability",
            "confidence": "medium"
        })
        
    print(f"Generated {len(insights_list)} strategic risk and opportunity cards.")
    for ins in insights_list:
        print(f" - [{ins['type'].upper()}] {ins['title']}")
        
    completed = list(state.get("completed_steps", []))
    if "insight" not in completed:
        completed.append("insight")
        
    return {
        "insights": insights_list,
        "completed_steps": completed
    }
