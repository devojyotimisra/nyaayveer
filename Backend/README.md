# 🧠 NyaayVeer – Backend

Welcome to the official backend for **NyaayVeer**, a mobile application designed to assist users in understanding criminal law by providing relevant sections from the **Bharatiya Nyaya Sanhita (BNS)** based on user-submitted case descriptions.

This repository hosts the AI logic and Flask API that powers the smart legal suggestion system of the NyaayVeer app.

---

## ✅ Prerequisites

Before setting up, ensure you have the following installed:

- **Python 3.12**
- **[uv](https://docs.astral.sh/uv/getting-started/installation/)** (Python package and project manager)

---

## 🚀 Setup Instructions

Follow these steps to get the backend running on your local system:

### 1. Clone the Repository

```bash
git clone https://github.com/team-sankalp/nyaayveer-backend-apis.git
cd nyaayveer-backend-apis
```

### 2. Environment Configuration

Before running the application, you need to create a `.env` file in the root directory of the project. This file will store your environment variables securely.

- **📄 Create a `.env` file with the following content:**
  
    ```env
    FLASK_DEBUG = False
    FLASK_RUN_HOST = 0.0.0.0
    FLASK_RUN_PORT = 5000
    SECRET_KEY = <your-secret-key>
    CACHE_TYPE = ...
    SQLALCHEMY_DATABASE_URI = ...
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = <your-jwt-secret-key>
    GROQ_API_KEY = <your-groq-api-key>
    ```

> ⚠️ Replace the placeholder values (`your-secret-key`, `your-jwt-secret-key`, `your-groq-api-key`) with your actual credentials.

This `.env` file ensures Flask and other components function correctly during development and securely handle sensitive keys.


### 3. Run the Flask Server

```bash
uv run flask run
```

---

## 🌐 API Endpoint

Once the Flask development server is running, the backend will be available at:

```
http://127.0.0.1:5000/
```

This URL can now accept API requests from the mobile application and return the relevant legal sections based on the input description.

---

## 🧩 How It Fits In

This backend is integrated into the main system of the NyaayVeer application and is essential for the core functionality. It provides intelligent legal mapping that enhances user experience by offering direct references to relevant BNS sections.

---

## ⚖️ Jai Nyaay!

Bringing accessible legal guidance to all, one case at a time.