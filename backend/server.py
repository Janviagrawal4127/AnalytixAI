import os
import sys
import json
import asyncio
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import pandas as pd

# Add project root to sys.path
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from langchain_core.messages import HumanMessage
from backend.pipeline import compile_pipeline
from backend.nl_query import run_rule_based_fallback
from backend.sql_agent import execute_query_safely

app = FastAPI(
    title="AnalytixAI API Gateway",
    description="REST & WebSocket API bridging Next.js frontend with the 12-agent LangGraph analytics fleet.",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active connected telemetry WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

# Request Models
class PipelineRunRequest(BaseModel):
    prompt: Optional[str] = "Ingest data, clean outliers and nulls, run EDA, forecast revenue, and compile report."
    dataset_path: Optional[str] = "data/raw/sample_transactions.csv"

class QueryRequest(BaseModel):
    query: str
    dataset_path: Optional[str] = "data/cleaned_data.csv"

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    include_data_context: Optional[bool] = True

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "AnalytixAI Multi-Agent Backend",
        "orchestrator_status": "ready",
        "agents_available": 12,
        "fleet": [
            "orchestrator", "ingestion", "cleaning", "preprocessing",
            "nl_query", "sql_agent", "eda", "visualization",
            "predictive", "insight", "recommendation", "report"
        ]
    }

@app.post("/api/pipeline/run")
async def run_pipeline_endpoint(req: PipelineRunRequest, background_tasks: BackgroundTasks):
    """
    Triggers the end-to-end multi-agent LangGraph workflow.
    """
    dataset_path = req.dataset_path or "data/raw/sample_transactions.csv"
    if not os.path.exists(os.path.join(ROOT, dataset_path)):
        # Fallback to sample data
        dataset_path = "data/raw/sample_transactions.csv"

    graph = compile_pipeline()
    
    initial_state = {
        "messages": [HumanMessage(content=req.prompt)],
        "active_dataset_path": dataset_path,
        "plan_list": [],
        "completed_steps": [],
        "current_agent": "orchestrator",
        "numerical_columns": [],
        "categorical_columns": [],
        "sql_query": None,
        "sql_result_path": None,
        "eda_stats": {},
        "chart_specs": [],
        "insights": [],
        "predictions_path": None,
        "recommendations": [],
        "report_path": None,
        "error": None
    }

    # Broadcast start event
    await manager.broadcast({
        "type": "pipeline_started",
        "prompt": req.prompt,
        "timestamp": pd.Timestamp.now().isoformat()
    })

    try:
        final_state = graph.invoke(initial_state)
        
        await manager.broadcast({
            "type": "pipeline_completed",
            "completed_steps": final_state.get("completed_steps", []),
            "insights_count": len(final_state.get("insights", [])),
            "recommendations_count": len(final_state.get("recommendations", []))
        })

        return {
            "status": "success" if not final_state.get("error") else "error",
            "completed_steps": final_state.get("completed_steps", []),
            "cleaned_dataset_path": final_state.get("cleaned_dataset_path"),
            "preprocessed_dataset_path": final_state.get("preprocessed_dataset_path"),
            "insights": final_state.get("insights", []),
            "recommendations": final_state.get("recommendations", []),
            "report_path": final_state.get("report_path")
        }
    except Exception as e:
        await manager.broadcast({
            "type": "pipeline_error",
            "error": str(e)
        })
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/query/sql")
async def execute_nl_sql(req: QueryRequest):
    """
    Translates natural language to SQL and executes with ReAct self-healing.
    """
    raw_query = req.query.strip()
    # Check if direct SQL or natural language
    if raw_query.upper().startswith("SELECT"):
        sql = raw_query
    else:
        sql = run_rule_based_fallback(raw_query)

    dataset_path = os.path.join(ROOT, req.dataset_path or "data/cleaned_data.csv")
    if not os.path.exists(dataset_path):
        dataset_path = os.path.join(ROOT, "data/raw/sample_transactions.csv")

    res = execute_query_safely(sql, dataset_path)
    return res

@app.get("/api/data/predictions")
async def get_predictions():
    """
    Returns the latest 90-day predictions and churn analysis.
    """
    predictions_file = os.path.join(ROOT, "data/outputs/predictions.json")
    if not os.path.exists(predictions_file):
        predictions_file = os.path.join(ROOT, "data/predictions.json")
        
    if os.path.exists(predictions_file):
        with open(predictions_file, "r") as f:
            return json.load(f)
    return {"message": "No predictions generated yet. Run the pipeline first."}

@app.get("/api/data/report", response_class=HTMLResponse)
async def get_report():
    """
    Serves the latest compiled HTML executive report.
    """
    report_file = os.path.join(ROOT, "data/outputs/report.html")
    if not os.path.exists(report_file):
        report_file = os.path.join(ROOT, "data/report.html")
        
    if os.path.exists(report_file):
        with open(report_file, "r", encoding="utf-8") as f:
            return f.read()
    return "<h3>No report generated yet. Run the pipeline first.</h3>"

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint streaming real-time agent telemetry events to the client.
    """
    await manager.connect(websocket)
    try:
        # Send initial handshake message
        await websocket.send_json({
            "type": "handshake",
            "message": "Connected to AnalytixAI Orchestrator Swarm Telemetry Stream",
            "fleet_size": 12,
            "status": "ready"
        })
        while True:
            data = await websocket.receive_text()
            # Echo heartbeat or client ping
            await websocket.send_json({
                "type": "heartbeat",
                "received": data
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.post("/api/chat")
async def business_strategy_chat(req: ChatRequest):
    """Business Strategy AI Chatbot — Groq LLM with live data context."""
    from backend.chatbot import chat_with_groq
    msgs = [{"role": m.role, "content": m.content} for m in req.messages]
    result = chat_with_groq(msgs, include_data_context=req.include_data_context or True)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.server:app", host="0.0.0.0", port=8000, reload=True)
