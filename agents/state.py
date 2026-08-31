from typing import List, Dict, Any, Optional, TypedDict
from langchain_core.messages import BaseMessage

class GraphState(TypedDict):
    """
    Shared state schema representing the workspace context and history
    for the 12 specialized agents of AnalytixAI.
    """
    messages: List[BaseMessage]
    active_dataset_path: Optional[str]
    cleaned_dataset_path: Optional[str]
    preprocessed_dataset_path: Optional[str]
    plan_list: List[str]
    completed_steps: List[str]
    current_agent: str
    numerical_columns: List[str]
    categorical_columns: List[str]
    sql_query: Optional[str]
    sql_result_path: Optional[str]
    eda_stats: Optional[Dict[str, Any]]
    chart_specs: Optional[List[Dict[str, Any]]]
    insights: Optional[List[Dict[str, Any]]]
    predictions_path: Optional[str]
    recommendations: Optional[List[Dict[str, Any]]]
    report_path: Optional[str]
    error: Optional[str]
