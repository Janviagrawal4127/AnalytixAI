import os
from typing import Dict, Any
from backend.state import GraphState

def report_node(state: GraphState) -> Dict[str, Any]:
    """
    Report Generator Agent (📄): Assembles EDA metrics, chart configs,
    predictions, insights, and recommendations into an executive HTML summary.
    """
    print("\n--- [Report Generator Agent] ---")
    
    eda_stats = state.get("eda_stats", {})
    chart_specs = state.get("chart_specs", []) or []
    insights = state.get("insights", []) or []
    recommendations = state.get("recommendations", []) or []
    
    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AnalytixAI Executive Analytics Report</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #0f172a;
            color: #e2e8f0;
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
        }}
        .container {{
            max-width: 900px;
            margin: 0 auto;
            background: #1e293b;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #334155;
        }}
        h1, h2, h3 {{
            color: #3b82f6;
            margin-top: 0;
        }}
        h1 {{
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
            text-align: center;
        }}
        .section {{
            margin-bottom: 35px;
            padding-bottom: 20px;
            border-bottom: 1px solid #334155;
        }}
        .section:last-child {{
            border-bottom: none;
        }}
        .grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 15px;
        }}
        .card {{
            background: #0f172a;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #64748b;
        }}
        .card.opportunity {{
            border-left-color: #10b981;
        }}
        .card.risk {{
            border-left-color: #ef4444;
        }}
        .card h4 {{
            margin: 0 0 10px 0;
            color: #f1f5f9;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }}
        th, td {{
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #334155;
        }}
        th {{
            background-color: #0f172a;
            color: #3b82f6;
        }}
        .badge {{
            display: inline-block;
            padding: 3px 8px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: bold;
        }}
        .badge.high {{
            background-color: #065f46;
            color: #34d399;
        }}
        .badge.medium {{
            background-color: #78350f;
            color: #fbbf24;
        }}
        .badge.low {{
            background-color: #1e3a8a;
            color: #60a5fa;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>AnalytixAI Executive Analytics Report</h1>
        <p style="text-align: center; color: #94a3b8; font-style: italic;">Generated Autonomously by the Multi-Agent Coordinator</p>
        
        <div class="section">
            <h2>1. Dataset Integrity & Quality Audit</h2>
            <p>The Ingestion and Quality Cleaning nodes performed a structural audit on the transaction database.</p>
            <ul>
                <li><strong>Total Records Analyzed:</strong> {eda_stats.get("row_count", "N/A")}</li>
                <li><strong>Total Features Map:</strong> {eda_stats.get("column_count", "N/A")} columns detected</li>
                <li><strong>Data Imputation Logs:</strong> Imputed null values using statistical median (numerical) and mode (categorical) mappings.</li>
            </ul>
        </div>
        
        <div class="section">
            <h2>2. Descriptive Stats & Key Variables</h2>
            <p>Primary categorical dimensions and values count distribution list:</p>
            <table>
                <thead>
                    <tr>
                        <th>Categorical Column</th>
                        <th>Top Values & Volume Count</th>
                    </tr>
                </thead>
                <tbody>
"""
    # Populate categorical table
    cat_sums = eda_stats.get("categorical_summaries", {})
    if cat_sums:
        for col, counts in cat_sums.items():
            counts_str = ", ".join([f"'{k}': {v}" for k, v in counts.items()])
            html_content += f"<tr><td><strong>{col}</strong></td><td>{counts_str}</td></tr>"
    else:
        html_content += "<tr><td colspan='2'>No categorical dimensions summaries available.</td></tr>"
        
    html_content += """
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>3. Chart Configurations & Visual Assets Specs</h2>
            <p>The Visualization Agent compiled the following Recharts-JSON component specifications for rendering:</p>
            <ul>
"""
    # Populate chart list
    for spec in chart_specs:
        html_content += f"<li><strong>{spec.get('title')}</strong> ({spec.get('type').upper()} chart, mapping X: '{spec.get('xKey')}', Y: '{spec.get('yKey')}')</li>"
        
    if not chart_specs:
        html_content += "<li>No visual charting specs configured.</li>"
        
    html_content += """
            </ul>
        </div>
        
        <div class="section">
            <h2>4. Strategic Business Insights</h2>
            <p>Opportunity and Risk vectors parsed from correlational distributions and churn prediction arrays:</p>
            <div class="grid">
"""
    # Populate insights grid
    for ins in insights:
        card_class = "opportunity" if ins.get("type") == "opportunity" else "risk"
        icon = "💡" if card_class == "opportunity" else "⚠️"
        html_content += f"""
                <div class="card {card_class}">
                    <h4>{icon} {ins.get('title')}</h4>
                    <p>{ins.get('description')}</p>
                    <p style="margin-top: 10px; font-size: 13px; color: #94a3b8;">
                        <strong>Impact Target:</strong> {ins.get('metric_impact')}<br>
                        <strong>Confidence:</strong> {ins.get('confidence').upper()}
                    </p>
                </div>
"""
    if not insights:
        html_content += "<p>No insights discovered.</p>"
        
    html_content += """
            </div>
        </div>
        
        <div class="section">
            <h2>5. Actionable Priority Recommendations</h2>
            <p>Business operations action checklist based on linked opportunities and risks:</p>
            <table>
                <thead>
                    <tr>
                        <th>Action Item</th>
                        <th>Description</th>
                        <th>ROI Score</th>
                        <th>Timeframe</th>
                        <th>Effort</th>
                    </tr>
                </thead>
                <tbody>
"""
    # Populate recommendations
    for rec in recommendations:
        roi_class = rec.get("roi").lower()
        html_content += f"""
                    <tr>
                        <td><strong>{rec.get('action_item')}</strong></td>
                        <td style="font-size: 14px; color: #cbd5e1;">{rec.get('description')}</td>
                        <td><span class="badge {roi_class}">{rec.get('roi')}</span></td>
                        <td style="font-size: 13px;">{rec.get('timeframe')}</td>
                        <td style="font-size: 13px; color: #94a3b8;">{rec.get('effort')}</td>
                    </tr>
"""
    if not recommendations:
        html_content += "<tr><td colspan='5'>No business action recommendations formulated.</td></tr>"
        
    html_content += """
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
"""
    
    os.makedirs("data", exist_ok=True)
    report_path = "data/report.html"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    print(f"Successfully generated HTML report: {report_path}")
    
    completed = list(state.get("completed_steps", []))
    if "report" not in completed:
        completed.append("report")
        
    return {
        "report_path": report_path,
        "completed_steps": completed
    }
