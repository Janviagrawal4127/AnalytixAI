import os
import sqlite3
import pandas as pd
from typing import Dict, Any
from agents.state import GraphState

def self_heal_sql_query(failed_query: str, error_message: str) -> str:
    """
    Calls the Groq LLM (groq/compound) to debug and correct a failed SQL query.
    Uses the schema to reason about column/syntax corrections.
    """
    api_key = os.getenv("Groq_API") or os.getenv("GROQ_API_KEY")
    if not api_key:
        print("No Groq API key available for SQL self-healing.")
        return failed_query
        
    api_key = api_key.strip('"').strip("'")
    
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
        "You are an expert SQL debugging assistant. A SQL query executed on SQLite/PostgreSQL failed.\n"
        "Analyze the SQL query, the database table schema, and the error message below, "
        "and produce a corrected, valid SQL statement.\n\n"
        f"Table Schema:\n{schema_info}\n\n"
        "Constraints:\n"
        "1. Only return the raw SQL code. DO NOT wrap the SQL in markdown blocks (```sql or ```). No explanations, no talk.\n"
        "2. Ensure you query the table 'data_table'.\n"
        "3. Keep the user's original query intent but fix syntax, column names, or functions."
    )
    
    user_message = (
        f"Failed SQL Query: {failed_query}\n"
        f"Database Error: {error_message}"
    )
    
    try:
        from groq import Groq
        import re
        client = Groq(api_key=api_key)
        
        print("Executing ReAct debugging step: sending failed query & error trace to Groq...")
        completion = client.chat.completions.create(
            model="groq/compound",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.0,
            max_tokens=256
        )
        
        corrected_sql = completion.choices[0].message.content.strip()
        corrected_sql = corrected_sql.replace("```sql", "").replace("```", "").strip()
        corrected_sql = re.sub(r'\s+', ' ', corrected_sql)
        print(f"ReAct Observation: Query corrected to: {corrected_sql}")
        return corrected_sql
    except Exception as e:
        print(f"Failed to call Groq self-healing: {str(e)}")
        return failed_query

def sql_agent_node(state: GraphState) -> Dict[str, Any]:
    """
    SQL Agent (🗃️): Connects to Supabase to run SQL statements if configured.
    Otherwise, loads the local dataset into a temporary SQLite database
    and executes the generated/configured SQL queries.
    Uses a ReAct loop to correct errors if execution fails.
    """
    print("\n--- [SQL Agent] ---")
    dataset_path = state.get("cleaned_dataset_path") or state.get("active_dataset_path")
    sql_query = state.get("sql_query")
    
    if not sql_query:
        print("Error: No SQL query to execute.")
        return {"error": "SQL Agent failed: No query specified."}
        
    print(f"Initial Target SQL Query: {sql_query}")
    
    # 1. Attempt Supabase Execution if Credentials exist
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    max_retries = 3
    current_query = sql_query
    
    if supabase_url and supabase_key:
        print("Supabase credentials detected. Attempting database execution...")
        for attempt in range(max_retries):
            print(f"Supabase Execution Attempt {attempt + 1}/{max_retries} with query: {current_query}")
            try:
                from supabase import create_client, Client
                supabase: Client = create_client(supabase_url.strip(), supabase_key.strip())
                
                # Execute raw SQL on Supabase using custom RPC function 'execute_raw_sql'
                print("Invoking 'execute_raw_sql' RPC function on Supabase...")
                response = supabase.rpc("execute_raw_sql", {"query_text": current_query}).execute()
                
                results = response.data
                if results is None:
                    raise ValueError("RPC execution returned empty/null data.")
                    
                result_df = pd.DataFrame(results)
                print(f"Supabase returned {len(result_df)} rows.")
                print(result_df.head(5))
                
                os.makedirs("data", exist_ok=True)
                result_path = "data/sql_result.csv"
                result_df.to_csv(result_path, index=False)
                print(f"Saved query result to: {result_path}")
                
                completed = list(state.get("completed_steps", []))
                if "sql_agent" not in completed:
                    completed.append("sql_agent")
                    
                return {
                    "sql_query": current_query,
                    "sql_result_path": result_path,
                    "completed_steps": completed
                }
            except Exception as e:
                print(f"Supabase Execution Failed: {str(e)}")
                if attempt < max_retries - 1:
                    print("Initiating ReAct debugging loop to correct query...")
                    current_query = self_heal_sql_query(current_query, str(e))
                else:
                    print("Max retries reached on Supabase. Transitioning to local SQLite fallback execution.")
                    break
            
    # 2. Local SQLite Fallback
    if not dataset_path:
        print("Error: No local dataset path available for fallback execution.")
        return {"error": "SQL Agent failed: No dataset loaded."}
        
    print(f"Executing query on local SQLite database (dataset: {dataset_path})...")
    
    for attempt in range(max_retries):
        print(f"SQLite Execution Attempt {attempt + 1}/{max_retries} with query: {current_query}")
        try:
            df = pd.read_csv(dataset_path)
            
            # Connect to temporary in-memory SQLite DB
            conn = sqlite3.connect(":memory:")
            
            # Load dataframe into database table 'data_table'
            df.to_sql("data_table", conn, index=False, if_exists="replace")
            
            # Run query
            result_df = pd.read_sql_query(current_query, conn)
            
            print(f"Local SQLite query returned {len(result_df)} rows.")
            print(result_df.head(5))
            
            # Save results
            os.makedirs("data", exist_ok=True)
            result_path = "data/sql_result.csv"
            result_df.to_csv(result_path, index=False)
            print(f"Saved query result to: {result_path}")
            
            # Close connection
            conn.close()
            
            completed = list(state.get("completed_steps", []))
            if "sql_agent" not in completed:
                completed.append("sql_agent")
                
            return {
                "sql_query": current_query,
                "sql_result_path": result_path,
                "completed_steps": completed
            }
            
        except Exception as e:
            print(f"SQLite Execution Failed: {str(e)}")
            if attempt < max_retries - 1:
                print("Initiating ReAct debugging loop to correct query...")
                current_query = self_heal_sql_query(current_query, str(e))
            else:
                print("Max retries reached on local SQLite. SQL execution failed.")
                return {"error": f"SQL Agent failed after {max_retries} attempts. Last error: {str(e)}"}
