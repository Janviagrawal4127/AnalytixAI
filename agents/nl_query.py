import os
import re
from typing import Dict, Any
from agents.state import GraphState

def run_rule_based_fallback(user_query: str) -> str:
    user_query = user_query.lower()
    sql = "SELECT * FROM data_table LIMIT 10"
    
    # Identify fields or metrics requested
    if "total sales" in user_query or "revenue" in user_query or "sum of sales" in user_query:
        if "by region" in user_query:
            sql = "SELECT Region, SUM(Amount) AS TotalSales FROM data_table GROUP BY Region ORDER BY TotalSales DESC"
        elif "by category" in user_query or "by product category" in user_query:
            sql = "SELECT ProductCategory, SUM(Amount) AS TotalSales FROM data_table GROUP BY ProductCategory ORDER BY TotalSales DESC"
        else:
            sql = "SELECT SUM(Amount) AS TotalSales FROM data_table"
            
    elif "average order value" in user_query or "aov" in user_query or "average sales" in user_query:
        if "by region" in user_query:
            sql = "SELECT Region, AVG(Amount) AS AverageSales FROM data_table GROUP BY Region ORDER BY AverageSales DESC"
        elif "by category" in user_query or "by product category" in user_query:
            sql = "SELECT ProductCategory, AVG(Amount) AS AverageSales FROM data_table GROUP BY ProductCategory ORDER BY AverageSales DESC"
        else:
            sql = "SELECT AVG(Amount) AS AverageSales FROM data_table"
            
    elif "churn" in user_query or "attrition" in user_query:
        if "rate" in user_query or "percentage" in user_query:
            sql = "SELECT AVG(Churn) * 100 AS ChurnRatePercentage FROM data_table"
        elif "by region" in user_query:
            sql = "SELECT Region, AVG(Churn) * 100 AS ChurnRatePercentage FROM data_table GROUP BY Region"
        else:
            sql = "SELECT CustomerID, Churn, LTV FROM data_table WHERE Churn = 1"
            
    elif "ltv" in user_query or "lifetime value" in user_query:
        if "average" in user_query:
            sql = "SELECT AVG(LTV) AS AverageLTV FROM data_table"
        else:
            sql = "SELECT CustomerID, LTV, CAC FROM data_table ORDER BY LTV DESC LIMIT 10"
            
    elif "top customers" in user_query or "best customers" in user_query:
        sql = "SELECT CustomerID, LTV, Amount FROM data_table ORDER BY LTV DESC LIMIT 5"
        
    elif "highest margin" in user_query or "profit margin" in user_query:
        sql = "SELECT ProductCategory, AVG(Margin) AS AverageMargin FROM data_table GROUP BY ProductCategory ORDER BY AverageMargin DESC"
        
    elif "count" in user_query or "how many customers" in user_query:
        sql = "SELECT COUNT(DISTINCT CustomerID) AS TotalCustomers FROM data_table"
        
    return sql

def nl_query_node(state: GraphState) -> Dict[str, Any]:
    """
    NL Query Agent (💬): Translates conversational business queries
    into executable SQL statements using Groq API (llama3-70b-8192)
    with a robust rule-based fallback if credentials are not configured.
    """
    print("\n--- [NL Query Agent] ---")
    messages = state.get("messages", [])
    if not messages:
        print("No input message found. Defaulting SQL query.")
        return {"sql_query": "SELECT * FROM data_table LIMIT 10", "completed_steps": list(state.get("completed_steps", [])) + ["nl_query"]}
        
    user_query = messages[-1].content
    print(f"Translating user query to SQL: '{user_query}'")
    
    # Check for Groq API availability
    api_key = os.getenv("Groq_API") or os.getenv("GROQ_API_KEY")
    if api_key:
        api_key = api_key.strip('"').strip("'")
        
    sql = None
    if api_key:
        try:
            from groq import Groq
            client = Groq(api_key=api_key)
            
            schema_info = """
            Table name: data_table
            Columns:
            - TransactionID: Text identifier of transaction (e.g. TX1001)
            - CustomerID: Text identifier of customer (e.g. CUST101)
            - Date: Text date format YYYY-MM-DD
            - ProductCategory: Text category (Electronics, SaaS Subscriptions, Professional Services, Hardware Support)
            - Amount: Numeric/float transaction value
            - Region: Text region name (North America, Europe, Asia-Pacific, Latin America)
            - Quantity: Integer quantity sold
            - Margin: Float profit margin percentage (0.3 to 0.75)
            - LTV: Float Customer Lifetime Value
            - CAC: Float Customer Acquisition Cost
            - Churn: Integer binary (1 if churned, 0 otherwise)
            """
            
            system_prompt = (
                "You are an expert SQL translator. Your task is to translate natural language business queries "
                "into a valid, standard SQLite query on the table 'data_table'.\n\n"
                f"Table Schema:\n{schema_info}\n\n"
                "Constraints:\n"
                "1. Only return the raw SQL code. DO NOT wrap the SQL in markdown blocks (```sql or ```). No explanations, no talk.\n"
                "2. Ensure you query the table 'data_table'.\n"
                "3. Ensure the syntax is correct SQLite."
            )
            
            print("Sending translation request to Groq LLM...")
            completion = client.chat.completions.create(
                model="groq/compound",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_query}
                ],
                temperature=0.0,
                max_tokens=256
            )
            
            sql = completion.choices[0].message.content.strip()
            # Clean up any Markdown wrappers that the model outputted
            sql = sql.replace("```sql", "").replace("```", "").strip()
            sql = re.sub(r'\s+', ' ', sql)
            print(f"Groq Generated SQL Statement: {sql}")
            
        except Exception as e:
            print(f"Groq API call failed or groq package not available: {str(e)}")
            print("Falling back to rule-based parsing.")
            
    if not sql:
        sql = run_rule_based_fallback(user_query)
        print(f"Fallback Generated SQL Statement: {sql}")
        
    completed = list(state.get("completed_steps", []))
    if "nl_query" not in completed:
        completed.append("nl_query")
        
    return {
        "sql_query": sql,
        "completed_steps": completed
    }
