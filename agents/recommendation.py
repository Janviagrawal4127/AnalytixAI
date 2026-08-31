from typing import Dict, Any, List
from agents.state import GraphState

def recommendation_node(state: GraphState) -> Dict[str, Any]:
    """
    Recommendation Agent (🎯): Formulates strategic operational actions
    prioritized by cost-benefit scoring, effort metrics, and implementation timeframe.
    """
    print("\n--- [Recommendation Agent] ---")
    insights = state.get("insights", [])
    recommendations = []
    
    for ins in insights:
        title = ins.get("title", "")
        ins_type = ins.get("type", "")
        
        if "elasticity" in title.lower() or "price" in title.lower():
            recommendations.append({
                "action_item": "Implement Dynamic Price Thresholds",
                "description": "Adjust pricing configurations dynamically in sensitive brackets. Test price promotions during low-volume days to offset negative elasticity trends.",
                "roi": "High",
                "timeframe": "Medium (2-4 weeks)",
                "effort": "Medium",
                "linked_insight": title
            })
        elif "churn" in title.lower() or "retention" in title.lower():
            recommendations.append({
                "action_item": "Trigger Customer Re-engagement Campaigns",
                "description": "Establish automated email incentives (discounts/loyalty updates) for customers flagged in the top 10% churn probability bracket.",
                "roi": "Medium",
                "timeframe": "Short (1-2 weeks)",
                "effort": "Low",
                "linked_insight": title
            })
        elif "niche" in title.lower() or "category" in title.lower():
            recommendations.append({
                "action_item": "Allocate Targeted Marketing to High-Margin Niches",
                "description": "Shift 10% of standard ad spend towards the low-volume, high-margin categories identified in the categorical audit.",
                "roi": "High",
                "timeframe": "Short (1 week)",
                "effort": "Low",
                "linked_insight": title
            })
            
    # Add a fallback recommendation to ensure we always have items
    if not recommendations:
        recommendations.append({
            "action_item": "Audit High-Volatility Transaction Regions",
            "description": "Examine region-specific transaction sizes to identify localized sales drops. Conduct a survey among active users.",
            "roi": "Medium",
            "timeframe": "Medium (3 weeks)",
            "effort": "Medium",
            "linked_insight": "General Outlier Volatility Exposure"
        })
        recommendations.append({
            "action_item": "Establish VIP Customer Retention Incentives",
            "description": "Offer VIP loyalty benefits to high-value cohorts to boost order frequencies and lifetime value (LTV).",
            "roi": "High",
            "timeframe": "Short (1-2 weeks)",
            "effort": "Low",
            "linked_insight": "General Revenue Baseline Opportunity"
        })
        
    print(f"Formulated {len(recommendations)} prioritized recommendation items.")
    for rec in recommendations:
        print(f" - Recommended: '{rec['action_item']}' (ROI: {rec['roi']}, Timeframe: {rec['timeframe']})")
        
    completed = list(state.get("completed_steps", []))
    if "recommendation" not in completed:
        completed.append("recommendation")
        
    return {
        "recommendations": recommendations,
        "completed_steps": completed
    }
