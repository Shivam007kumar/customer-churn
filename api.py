import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os # <-- IMPORT THE 'os' MODULE

# --- 1. DEFINE DATA MODELS ---

class CustomerFeatures(BaseModel):
    age: int
    tenure_months: int
    monthly_charges: float
    total_charges: float
    monthly_minutes: float
    data_usage_gb: float
    num_products: int
    feature_adoption_score: float
    last_login_days_ago: int
    logins_last_month: int
    customer_satisfaction: float
    total_transactions: int
    total_failed_transactions: int
    avg_transaction_amount: float
    days_since_last_transaction: int
    failed_transaction_rate: float
    total_tickets: int
    open_tickets: int
    high_priority_tickets: int
    avg_resolution_time: float
    contract_type: str
    payment_method: str
    gender: str

class PredictionResponse(BaseModel):
    prediction: int
    probability: float



app = FastAPI(title="Customer Churn Prediction API")
# --- FIX: USE ABSOLUTE PATHS TO LOAD MODEL AND FEATURES ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "churn_model.pkl")
FEATURES_PATH = os.path.join(MODEL_DIR, "feature_names.pkl")

# Load the model and features using the absolute paths
try:
    model = joblib.load(MODEL_PATH)
    feature_names = joblib.load(FEATURES_PATH)
    print(f"Model and features loaded successfully from: {MODEL_DIR}")
except Exception as e:
    print(f"FATAL: Could not load model files. Error: {e}")
    model = None
    feature_names = None



# --- 3. DEFINE THE PREDICTION LOGIC ---

def preprocess_input(features: CustomerFeatures) -> pd.DataFrame:
    """
    Preprocesses the raw input from the API request to match the format
    the model was trained on.
    """
    input_dict = features.dict()
    df = pd.DataFrame([input_dict])

    df = pd.get_dummies(df, columns=['contract_type', 'payment_method'], prefix=['contract', 'payment'])

    df['gender_encoded'] = df['gender'].apply(lambda x: 1 if x.lower() == 'male' else 0)
    df = df.drop('gender', axis=1)

    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    df = df[feature_names]
    return df


# --- 4. DEFINE API ENDPOINTS ---

@app.get("/")
def read_root():
    """A simple endpoint to test if the API is running."""
    return {"message": "Welcome to the Churn Prediction API!"}

@app.post("/predict", response_model=PredictionResponse)
def predict_churn(customer_features: CustomerFeatures):
    """
    Main prediction endpoint. Receives customer data, preprocesses it,
    and returns the churn prediction and probability.
    """
    if not model or not feature_names:
        raise HTTPException(status_code=500, detail="Model is not loaded. Check server logs for errors.")

    processed_df = preprocess_input(customer_features)
    prediction_proba = model.predict_proba(processed_df)[0]
    prediction = int(prediction_proba.argmax())
    probability = float(prediction_proba[1])

    return {"prediction": prediction, "probability": probability}