import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score, f1_score, classification_report

def evaluate_model(model, X_test, y_test, model_name):
    """Evaluates a model using key metrics for imbalanced data."""
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    y_pred = model.predict(X_test)
    
    print(f"--- Evaluation for {model_name} ---")
    print(f"ROC-AUC Score: {roc_auc_score(y_test, y_pred_proba):.4f}")
    print(f"F1-Score: {f1_score(y_test, y_pred):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    print("-" * 40 + "\n")

# 1. Load the CLEANED Data
print("Loading the cleaned dataset...")
df = pd.read_csv('processed_data/cleaned_customer_churn_data.csv')

# Separate features (X) and target (y)
X = df.drop('churned', axis=1)
y = df['churned']

# Use a stratified split to maintain the churn ratio in train and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training set shape: {X_train.shape}")
print(f"Test set shape: {X_test.shape}")
print(f"Training set churn rate: {y_train.mean():.2%}")
print(f"Test set churn rate: {y_test.mean():.2%}")

# 2. Handle Class Imbalance and Train Models

# Calculate scale_pos_weight for XGBoost (handles imbalance)
scale_pos_weight = y_train.value_counts()[0] / y_train.value_counts()[1]

# Initialize models with imbalance handling
lr_model = LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
rf_model = RandomForestClassifier(class_weight='balanced', random_state=42)
xgb_model = XGBClassifier(scale_pos_weight=scale_pos_weight, random_state=42, use_label_encoder=False, eval_metric='logloss')

# Train models
print("\nTraining Logistic Regression...")
lr_model.fit(X_train, y_train)

print("Training Random Forest...")
rf_model.fit(X_train, y_train)

print("Training XGBoost...")
xgb_model.fit(X_train, y_train)

# 3. Evaluate Models
print("\n--- Model Evaluation ---")
evaluate_model(lr_model, X_test, y_test, "Logistic Regression")
evaluate_model(rf_model, X_test, y_test, "Random Forest")
evaluate_model(xgb_model, X_test, y_test, "XGBoost")

# 4. Save the Best Model
# Let's assume Random Forest is still the best performer for this example.
best_model = rf_model 
feature_names = X_train.columns.tolist()

# Create a models directory if it doesn't exist
import os
os.makedirs('models', exist_ok=True)

# Save the model and feature names
joblib.dump(best_model, 'models/churn_model.pkl')
joblib.dump(feature_names, 'models/feature_names.pkl')

print("Best model (Random Forest) and feature names saved to the 'models' directory.")