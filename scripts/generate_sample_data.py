import os
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_sample_dataset(output_path: str = "data/raw/sample_transactions.csv"):
    """
    Generates a realistic transaction dataset with missing values, duplicate entries,
    and statistical outliers to test and verify the multi-agent pipeline.
    """
    print("Generating sample dataset...")
    np.random.seed(42)
    random.seed(42)
    
    num_records = 200
    start_date = datetime(2026, 1, 1)
    
    categories = ["Electronics", "SaaS Subscriptions", "Professional Services", "Hardware Support"]
    regions = ["North America", "Europe", "Asia-Pacific", "Latin America"]
    
    data = []
    
    for i in range(num_records):
        tx_id = f"TX{1000 + i}"
        cust_id = f"CUST{100 + random.randint(1, 40)}" # 40 unique customers
        days_offset = random.randint(0, 180) # 6 months range
        date = (start_date + timedelta(days=days_offset)).strftime("%Y-%m-%d")
        
        category = random.choice(categories)
        region = random.choice(regions)
        quantity = random.randint(1, 5)
        
        # Base pricing
        if category == "Electronics":
            base_price = 450.0
        elif category == "SaaS Subscriptions":
            base_price = 99.0
        elif category == "Professional Services":
            base_price = 1200.0
        else:
            base_price = 250.0
            
        amount = base_price * quantity + np.random.normal(0, base_price * 0.1)
        margin = random.uniform(0.3, 0.75)
        
        # Calculate high LTV for repeat customers
        cust_num = int(cust_id.replace("CUST", ""))
        ltv = cust_num * 150.0 + random.uniform(100, 500)
        cac = random.uniform(50.0, 150.0)
        
        # Churn logic: higher churn for low LTV or high CAC
        churn_prob = 0.8 if (ltv < 1500 or cac > 120) else 0.1
        churn = 1 if random.random() < churn_prob else 0
        
        data.append({
            "TransactionID": tx_id,
            "CustomerID": cust_id,
            "Date": date,
            "ProductCategory": category,
            "Amount": round(amount, 2),
            "Region": region,
            "Quantity": quantity,
            "Margin": round(margin, 3),
            "LTV": round(ltv, 2),
            "CAC": round(cac, 2),
            "Churn": churn
        })
        
    df = pd.DataFrame(data)
    
    # --- Inject Anomalies & Dirty Data ---
    
    # 1. Introduce duplicate records (about 5)
    dup_indices = [12, 45, 78, 112, 160]
    for idx in dup_indices:
        df = pd.concat([df, df.iloc[[idx]]], ignore_index=True)
        
    # 2. Inject missing values (nulls)
    # Amount missing in 8 records
    null_amount_indices = [5, 23, 67, 88, 142, 180, 201, 203]
    df.loc[null_amount_indices, "Amount"] = np.nan
    
    # ProductCategory missing in 5 records
    null_cat_indices = [15, 72, 110, 154, 192]
    df.loc[null_cat_indices, "ProductCategory"] = np.nan
    
    # Region missing in 4 records
    null_region_indices = [31, 85, 128, 175]
    df.loc[null_region_indices, "Region"] = np.nan
    
    # 3. Inject outliers
    # Extremely large amount outliers (2 records)
    df.loc[50, "Amount"] = 15000.0
    df.loc[120, "Amount"] = 25000.0
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated dirty transactions dataset at: {output_path} with {len(df)} rows.")
    
if __name__ == "__main__":
    generate_sample_dataset()
