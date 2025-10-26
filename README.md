---

# Customer Churn Prediction - Full Stack MLOps Project

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)![FastAPI](https://img.shields.io/badge/FastAPI-0.103-green?logo=fastapi)![React](https://img.shields.io/badge/React-18-blue?logo=react)![Docker](https://img.shields.io/badge/Docker-20.10-blue?logo=docker)![AWS](https://img.shields.io/badge/AWS-Deployed-orange?logo=amazon-aws)

This repository contains a production-grade, end-to-end solution for predicting customer churn. It features a complete machine learning pipeline, a containerized FastAPI backend, and a modern React frontend, all deployed on a scalable AWS cloud architecture.

### **[🚀 Live Application Demo 🚀](https://main.d8tihjwkkmisl.amplifyapp.com)**

---
<p align="center">
  <img src="sample/Screenshot 2025-10-26 at 10.07.16 AM.png" alt="Live Application Screenshot" width="800"/>
</p>

---

## ✨ Features

-   **End-to-End ML Pipeline:** From data cleaning and feature engineering in Jupyter to training and saving a production-ready `scikit-learn` model.
-   **High-Performance REST API:** A robust backend built with **FastAPI** to serve model predictions asynchronously, containerized with **Docker** for perfect environment consistency.
-   **Interactive Frontend:** A polished and responsive user interface built with **React**, featuring modern UI components like sliders and custom radio cards for an intuitive user experience.
-   **Scalable Cloud Deployment:** The entire stack is deployed on AWS, with the FastAPI backend on **AWS App Runner** and the React frontend on **AWS Amplify**, showcasing a modern, decoupled cloud architecture.
-   **CI/CD Automation:** The frontend is configured for continuous deployment from GitHub using AWS Amplify's build pipeline.

---

## 🛠️ Tech Stack

| Category           | Technology                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| **Data Science**   | `Python`, `Pandas`, `Jupyter`, `Scikit-learn`, `XGBoost`, `Joblib`        |
| **Backend API**    | `FastAPI`, `Uvicorn`                                                    |
| **Frontend**       | `React.js`, `Node.js`, `Express.js`, `CSS3`                             |
| **Cloud & DevOps** | `Docker`, `AWS ECR`, `AWS App Runner`, `AWS Amplify`                      |

---

## 🏛️ Project Architecture

This project follows a modern, decoupled architecture, ensuring scalability and maintainability.

```
+----------------+      +--------------------+      +------------------------------------------+
|   User Browser |----->|  React Frontend    |----->|     AWS Amplify (Proxy Redirect)         |
|                |      | (AWS Amplify)      |      | (Forwards /api/... requests)             |
+----------------+      +--------------------+      +------------------------------------------+
                                                                        |
                                                                        | (HTTP Request)
                                                                        |
                                                   +-----------------------------------------+
                                                   |    Python FastAPI on AWS App Runner     |
                                                   |-----------------------------------------|
                                                   | - Cross-platform Docker Image (x86)     |
                                                   | - Loads the trained model (.pkl)        |
                                                   | - Returns JSON prediction & probability |
                                                   +-----------------------------------------+
```

---

## 🔗 Deployed URLs

-   **Live Frontend Application:** [**https://main.d8tihjwkkmisl.amplifyapp.com**](https://main.d8tihjwkkmisl.amplifyapp.com)
-   **Live Backend API Endpoint:** [**https://biutmmjpd7.us-east-1.awsapprunner.com**](https://biutmmjpd7.us-east-1.awsapprunner.com)

---

## 🏁 Getting Started Locally

To run the entire application on your local machine, follow these steps.

### Prerequisites

-   Python 3.9+
-   Node.js v18+ and npm
-   Docker Desktop

### 1. Clone the Repository

```bash
git clone https://github.com/Shivam007kumar/customer-churn.git
cd H2h
```

### 2. Run the Backend API (via Docker)

This is the recommended method as it mirrors the production environment.

```bash
# Build the Docker image
docker build -t churn-prediction-api .

# Run the container
docker run --rm -p 8000:8000 churn-prediction-api
```
The API will be available at `http://localhost:8000`.

### 3. Run the Frontend Application

This will start the React UI and the local Node.js proxy server.

```bash
# Navigate to the frontend directory
cd churn-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will be available at `http://localhost:3000`.

---

## 📖 API Endpoints

The deployed FastAPI provides the following endpoints.

### Health Check

-   **Endpoint:** `GET /`
-   **Description:** A simple health check endpoint to verify that the service is running.
-   **Live URL:** [https://biutmmjpd7.us-east-1.awsapprunner.com/](https://biutmmjpd7.us-east-1.awsapprunner.com/)
-   **Success Response (200 OK):**
    ```json
    {
      "message": "Welcome to the Churn Prediction API!"
    }
    ```

### Predict Churn

-   **Endpoint:** `POST /predict`
-   **Description:** Predicts the churn probability for a single customer.
-   **Live URL:** [https://biutmmjpd7.us-east-1.awsapprunner.com/predict](https://biutmmjpd7.us-east-1.awsapprunner.com/predict)
-   **Success Response (200 OK):**
    ```json
    {
      "prediction": 0,
      "probability": 0.0872
    }
    ```
    -   `prediction`: `1` if the customer is likely to churn, `0` otherwise.
    -   `probability`: The model's calculated probability of the customer churning.

---

## 💡 Key Challenges & Solutions

This project involved overcoming several real-world deployment challenges:

-   **Cross-Platform Docker Builds:** The model was developed on an Apple Silicon (ARM) machine, but the AWS deployment target was Linux (x86). This was solved by using the `docker build --platform linux/amd64` command to create a compatible image, preventing a low-level architecture crash on App Runner.
-   **Monorepo CI/CD Configuration:** The initial AWS Amplify builds failed because the React app was in a sub-directory. This was resolved by creating a detailed `amplify.yml` file with explicit, full paths for all build commands and artifacts, making the build process robust.
-   **Dependency Synchronization:** The strict `npm ci` command failed in the cloud due to a mismatch between `package.json` and `package-lock.json`. The issue was solved by switching to the more flexible `npm install` in the build configuration, which correctly resolved the minor dependency conflicts.

---

## 📄 License

This project is licensed under the MIT License.