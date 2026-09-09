"""
Business Strategy AI Chatbot Agent (🧑‍💼)
Powered by Groq LLM (Llama 3.3 70B) with live analytics data injection.
Provides data-grounded business strategy advice, P&L analysis, and decision support.
"""

import os
import json
import pandas as pd
from typing import List, Dict, Any, Optional


def _load_data_context() -> str:
    """Load live analytics data from the latest pipeline run to inject into the system prompt."""
    ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    context_parts = []

    try:
        # Load predictions
        for pred_path in ["data/outputs/predictions.json", "data/predictions.json"]:
            full = os.path.join(ROOT, pred_path)
            if os.path.exists(full):
                with open(full, "r") as f:
                    preds = json.load(f)
                forecast = preds.get("revenue_forecast_90d", [])
                churn = preds.get("churn_risk_customers", [])
                if forecast:
                    total_90d = sum(d.get("predicted_sales", 0) for d in forecast[:90])
                    context_parts.append(f"90-Day Projected Revenue: ${total_90d:,.2f}")
                if churn:
                    high_risk = [c for c in churn if c.get("churn_probability", 0) > 0.7]
                    context_parts.append(f"High-Risk Churn Accounts: {len(high_risk)} customers (>70% probability)")
                break
    except Exception:
        pass

    try:
        # Load cleaned dataset stats
        for csv_path in ["data/cleaned_data.csv", "data/processed/cleaned_data.csv"]:
            full = os.path.join(ROOT, csv_path)
            if os.path.exists(full):
                df = pd.read_csv(full)
                if "Amount" in df.columns:
                    context_parts.append(f"Total Revenue Tracked: ${df['Amount'].sum():,.2f}")
                    context_parts.append(f"Average Order Value: ${df['Amount'].mean():,.2f}")
                    context_parts.append(f"Total Transactions: {len(df)}")
                if "Margin" in df.columns:
                    context_parts.append(f"Average Profit Margin: {df['Margin'].mean()*100:.1f}%")
                if "Churn" in df.columns:
                    context_parts.append(f"Overall Churn Rate: {df['Churn'].mean()*100:.1f}%")
                if "Region" in df.columns and "Amount" in df.columns:
                    region_rev = df.groupby("Region")["Amount"].sum().sort_values(ascending=False)
                    top_regions = ", ".join([f"{r}: ${v:,.0f}" for r, v in region_rev.head(4).items()])
                    context_parts.append(f"Revenue by Region: {top_regions}")
                if "ProductCategory" in df.columns and "Amount" in df.columns:
                    cat_rev = df.groupby("ProductCategory")["Amount"].sum().sort_values(ascending=False)
                    top_cats = ", ".join([f"{c}: ${v:,.0f}" for c, v in cat_rev.head(4).items()])
                    context_parts.append(f"Revenue by Product: {top_cats}")
                if "LTV" in df.columns and "CAC" in df.columns:
                    context_parts.append(f"Average Customer LTV: ${df['LTV'].mean():,.2f}")
                    context_parts.append(f"Average CAC: ${df['CAC'].mean():,.2f}")
                    ltv_cac = df['LTV'].mean() / max(df['CAC'].mean(), 1)
                    context_parts.append(f"LTV/CAC Ratio: {ltv_cac:.2f}x")
                break
    except Exception:
        pass

    return "\n".join(f"  - {p}" for p in context_parts) if context_parts else ""


SYSTEM_PROMPT_TEMPLATE = """You are AnalytixAI Strategy Advisor — a world-class Chief Analytics Officer and Business Intelligence consultant embedded inside the AnalytixAI enterprise analytics platform.

Your job is to help business executives, data analysts, and operations managers:
1. Understand their company financial performance (revenue, profit, loss, margins)
2. Make smart, data-driven strategic decisions
3. Identify growth opportunities and revenue leakage risks
4. Build actionable go-to-market strategies
5. Interpret analytics outputs and ML predictions in plain business language
6. Provide recommendations with clear ROI, timeframe, and risk assessment

Communication style:
- Professional yet conversational — like a trusted advisor
- Always cite specific numbers when available from the data context below
- Be direct and opinionated — give clear recommendations, not vague generalities
- Use business frameworks when helpful (SWOT, BCG Matrix, Porter Five Forces, etc.)
- Structure responses with clear headings and bullets for readability
- When discussing P&L, always frame as actionable: what to cut, what to invest in

{data_context_block}

If the user asks something outside business strategy or analytics, gently redirect them back to business topics and explain how AnalytixAI can help."""


def build_system_prompt(include_data: bool = True) -> str:
    """Build the full system prompt with optional live data context."""
    data_block = ""
    if include_data:
        ctx = _load_data_context()
        if ctx:
            data_block = f"""
=== LIVE BUSINESS ANALYTICS (from latest pipeline run) ===
{ctx}
============================================================
Reference these real figures when answering questions about revenue, profit, loss, churn, or performance."""

    return SYSTEM_PROMPT_TEMPLATE.format(data_context_block=data_block)


def chat_with_groq(
    messages: List[Dict[str, str]],
    include_data_context: bool = True,
) -> Dict[str, str]:
    """
    Send a conversation to Groq LLM and return the assistant response.
    
    Args:
        messages: List of {"role": "user"|"assistant", "content": "..."} dicts
        include_data_context: Whether to inject live analytics data into the system prompt
    
    Returns:
        {"role": "assistant", "content": "..."}
    """
    api_key = os.getenv("Groq_API") or os.getenv("GROQ_API_KEY")
    if not api_key:
        return {
            "role": "assistant",
            "content": (
                "I need a Groq API key to function. Please add `Groq_API=your_key` "
                "to your `.env` file. Get a free key at https://console.groq.com/"
            )
        }
    api_key = api_key.strip('"').strip("'")

    system_prompt = build_system_prompt(include_data=include_data_context)
    payload = [{"role": "system", "content": system_prompt}]
    for msg in messages:
        payload.append({"role": msg["role"], "content": msg["content"]})

    try:
        from groq import Groq
        client = Groq(api_key=api_key)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=payload,
            temperature=0.7,
            max_tokens=1024,
        )
        return {"role": "assistant", "content": response.choices[0].message.content}

    except Exception as e:
        return {
            "role": "assistant",
            "content": f"Connection error: {str(e)}\n\nPlease verify your Groq API key."
        }
