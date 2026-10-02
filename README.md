# 🛡️ CyberShield AI

### AI-Powered Phishing Detection & Cybersecurity Platform

CyberShield AI is a full-stack cybersecurity platform designed to detect and analyze potential phishing threats using **Artificial Intelligence and Machine Learning**.

The platform provides a secure environment where users can scan suspicious URLs, view detection results, access scan history, and monitor security activity through a centralized dashboard.

---

## 🚀 Features

* 🔍 **AI-Based Phishing Detection** — Analyzes URLs and identifies potential phishing threats.
* 🔐 **JWT Authentication** — Secure user authentication and authorization.
* 👤 **User Profiles** — Manage authenticated user information.
* 📊 **Security Dashboard** — View phishing detection activity and security insights.
* 📜 **Scan History** — Store and review previous URL scan results.
* ⚡ **FastAPI Backend** — High-performance REST API for the application.
* ⚛️ **React Frontend** — Interactive and responsive user interface.
* 🗄️ **MongoDB Database** — Stores users, scans, and application data.
* 🤖 **Machine Learning Model** — Uses trained ML models for phishing classification.

---

## 🏗️ Project Structure

```text
CyberShield-AI-Project/
│
└── CyberShieldAI/
    │
    ├── backend/
    │   ├── app/
    │   ├── .env
    │   ├── requirements.txt
    │   └── ...
    │
    ├── frontend/
    │   ├── src/
    │   ├── public/
    │   ├── package.json
    │   └── ...
    │
    └── ml/
        ├── models/
        ├── datasets/
        └── ...
```

> **Note:** Environment variables and sensitive credentials are excluded from the repository using `.gitignore`.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Bootstrap

### Backend

* Python
* FastAPI
* REST APIs
* JWT Authentication

### Database

* MongoDB

### AI / Machine Learning

* Python
* Scikit-learn
* Machine Learning Classification
* URL Feature Analysis

### Development Tools

* Git
* GitHub
* VS Code

---

## 🔄 How It Works

```text
User
  │
  ▼
React Frontend
  │
  ▼
FastAPI Backend
  │
  ├──────────────► JWT Authentication
  │
  ├──────────────► MongoDB
  │
  ▼
ML Phishing Detection Model
  │
  ▼
Prediction Result
  │
  ▼
Dashboard / Scan History
```

The user submits a suspicious URL through the frontend. The request is sent to the FastAPI backend, where the URL is processed and passed to the machine learning model. The model predicts whether the URL is potentially legitimate or phishing. The result is then returned to the frontend and stored for future reference.

---

## 🔐 Authentication

CyberShield AI uses **JWT-based authentication** to protect user-specific resources.

The authentication flow includes:

1. User registration
2. User login
3. JWT token generation
4. Authenticated API requests
5. Protected routes
6. User-specific scan history

---

## 🤖 AI Phishing Detection

The machine learning component analyzes characteristics of URLs to identify suspicious patterns.

The system can be used to classify URLs and provide a security prediction to the user.

Example:

```text
Input:
https://example.com/login

        ↓

Feature Extraction

        ↓

Machine Learning Model

        ↓

Prediction

        ↓

Legitimate / Phishing
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sai24082006/CyberShield-AI-Project.git
cd CyberShield-AI-Project
```

### 2. Backend Setup

```bash
cd CyberShieldAI/backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and configure your environment variables:

```env
DATABASE_NAME=cybershield_ai
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> Never upload your real database credentials or secret keys to GitHub.

Run the backend:

```bash
uvicorn app.main:app --reload
```

The API will run locally at:

```text
http://127.0.0.1:8000
```

---

## 🌐 Frontend Setup

Open another terminal:

```bash
cd CyberShieldAI/frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend will run locally according to the configured React development server.

---

## 📡 API Documentation

When the FastAPI backend is running, interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

This can be used to test and explore the available REST API endpoints.

---

## 🔮 Future Enhancements

* Real-time threat intelligence integration
* Browser extension for URL checking
* Email phishing detection
* QR-code phishing detection
* Advanced security analytics
* Improved ML model accuracy
* Automated threat reporting
* Security notifications and alerts

---

## 👨‍💻 Developer

**Sai Baraskar**

IT Engineering Student

GitHub:
https://github.com/Sai24082006

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**CyberShield AI — Detect Threats. Stay Secure.**
