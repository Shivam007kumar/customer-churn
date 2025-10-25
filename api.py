import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os

# --- 1. DEFINE DATA MODELS ---

# This defines the structure of the input data for a single customer
# It should match the features your model was trained on, except for the target.
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
    contract_type: str  # We'll receive this as text
    payment_method: str # We'll receive this as text
    gender: str         # We'll receive this as text

# This defines the structure of the API's response
class PredictionResponse(BaseModel):
    prediction: int
    probability: float

# --- 2. LOAD MODEL AND FEATURE NAMES ---

# Create the FastAPI app instance
app = FastAPI(title="Customer Churn Prediction API")

# Load the trained model and the list of feature names
try:
    model = joblib.load('models/churn_model.pkl')
    feature_names = joblib.load('models/feature_names.pkl')
    print("Model and feature names loaded successfully.")
except FileNotFoundError:
    print("Error: Model files not found. Please ensure 'churn_model.pkl' and 'feature_names.pkl' are in the 'models' directory.")
    model = None
    feature_names = None

# --- 3. DEFINE THE PREDICTION LOGIC ---

def preprocess_input(features: CustomerFeatures) -> pd.DataFrame:
    """
    Preprocesses the raw input from the API request to match the format
    the model was trained on.
    """
    # Convert the input Pydantic model to a dictionary, then to a DataFrame
    input_dict = features.dict()
    df = pd.DataFrame([input_dict])

    # One-Hot Encode contract_type and payment_method
    df = pd.get_dummies(df, columns=['contract_type', 'payment_method'], prefix=['contract', 'payment'])

    # Label Encode gender
    df['gender_encoded'] = df['gender'].apply(lambda x: 1 if x.lower() == 'male' else 0)
    df = df.drop('gender', axis=1)

    # Ensure all columns from training are present, adding any that are missing with a value of 0
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    # Reorder columns to match the order during training
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
        raise HTTPException(status_code=500, detail="Model not loaded. Please check server logs.")

    # Preprocess the input data
    processed_df = preprocess_input(customer_features)

    # Make predictions
    prediction_proba = model.predict_proba(processed_df)[0]
    prediction = int(prediction_proba.argmax())
    probability = float(prediction_proba[1]) # Probability of churning (class 1)

    return {"prediction": prediction, "probability": probability}