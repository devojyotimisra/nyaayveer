---

# 🚀 NyaayVeer – Intelligent Legal Companion

> Making Indian criminal law accessible and understandable, one case at a time.

---

## 📌 Problem Statement

**Problem Statement 1 – Weave AI Magic with Groq**

---

## 🎯 Objective

Understanding and accessing legal help in India is difficult for the common citizen, especially when it comes to criminal law.  
**NyaayVeer** solves this by allowing users to describe their case in simple words and instantly receive relevant sections from the **Bharatiya Nyaya Sanhita (BNS)** — India's new criminal code.

This empowers citizens with knowledge, demystifying the law and enhancing legal awareness without the need for complicated consultations.

---

## 🧠 Team & Approach

### Team Name:  
`Team Sankalp`

### Team Members:  
- Arpit Chakraborty (GitHub: [arpit-chakraborty](https://github.com/arpit-chakraborty) / Role: Frontend & AI/ML Developer )  
- Devojoyti Misra (GitHub: [devojyotimisra](https://github.com/devojyotimisra) / Role: AI/ML Developer & DevOps )  
- Soumyadip Adhikari (GitHub: [mr-infinexus](https://github.com/mr-infinexus) / Role: Backend Developer & DevOps )
- Soudip Mondal (GitHub: [Soudip1750](https://github.com/Soudip1750) / Role: FullStack Developer )

### Your Approach:  
- We selected this problem because access to legal information remains a major hurdle for ordinary citizens, especially with the recent adoption of the Bharatiya Nyaya Sanhita (BNS).

- Challenges included interpreting free-form natural language into accurate legal sections, handling diverse user inputs across multiple languages, and building a fast, responsive mobile interface.

- We used Groq’s high-performance inference APIs to enable multilingual and multimodal understanding of case descriptions, ensuring the app works even when users submit text in mixed languages (e.g., Hinglish).

- We developed our own lightweight model specifically trained to detect and map user descriptions to relevant BNS sections with high accuracy.

---

## 🛠️ Tech Stack

### Core Technologies Used:
- Frontend: React Native (TypeScript)
- Backend: Python Flask (API server)
- Database: PostgreSQL
- APIs: Internal REST API, OpenAI APIs
- Hosting: Render / AWS (future plan)

### Sponsor Technologies Used:
- [✅] **Groq:** Used Groq APIs for fast, efficient model inference.
- [ ] **Monad:**  
- [ ] **Fluvio:**  
- [ ] **Base:**  
- [ ] **Screenpipe:**  
- [ ] **Stellar:**  


---

## ✨ Key Features

- ✅ Users describe criminal cases in their own words and get BNS sections instantly.  
- ✅ Clean and accessible mobile UI (React Native).  
- ✅ Fast, lightweight AI backend with Groq inference.  
- ✅ Secure JWT-based authentication for future expansion (user profiles, saved queries).  
- ✅ Offline caching for previously fetched legal sections.

---

## 📽️ Demo & Deliverables

- **Demo Video Link:** [Insert YouTube/Loom demo link here]  
- **Pitch Deck / PPT Link:** [Insert Google Slides/PDF link here]

---

## ✅ Tasks & Bonus Checklist

- [✅] **Followed 2+ social channels and filled the form**  
- [✅] **Bonus Task 1 - Shared badges and filled the form (2 points)**  
- [✅] **Bonus Task 2 - Signed up on Sprint.dev and filled the form (3 points)**

---

## 🧪 How to Run the Project

### Requirements:
- Node.js (for frontend)
- Python 3.12 and `uv` package manager (for backend)
- Android Studio (for mobile emulator)
- API Keys:  
  - `GROQ_API_KEY` (for backend AI processing)

### Local Setup:

```bash
# Clone the project
git clone https://github.com/team-sankalp/nyaayveer.git
cd nyaayveer

# Set up the backend
cd backend
uv pip install -r requirements.txt
# Create .env file with Flask settings
uv run flask run

# Set up the frontend
cd ../frontend
npm install
# Create .env file with backend BASE_URL
npm run android
```

**Environment Setup:**

- Backend `.env` Example:

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

- Frontend `.env` Example:

    ```env
    REACT_APP_BASE_URL=http://127.0.0.1:5000
    ```

---

## 🧬 Future Scope

- 📈 Expand to civil law, consumer rights, and labor laws.  
- 🛡️ Implement end-to-end encryption for user case descriptions.  
- 🌐 Add multi-language support: Hindi, Marathi, Tamil, etc.  
- 🤖 Enable case prediction using fine-tuned local models (without API dependency).  
- 📲 Launch on Play Store and App Store.

---

## 📎 Resources / Credits

- Groq for providing blazing-fast API endpoints.  
- Flask, SQLAlchemy, and PostgreSQL open source libraries.  
- React Native documentation and Expo community.  
- OpenAI for initial prototype model inspiration.

---

## 🏁 Final Words

Building **NyaayVeer** was an amazing journey of mixing **technology** with **social good**.  
We faced real challenges like limited labeled datasets for BNS but found creative workarounds.  
Proud to contribute to a future where legal help is just a tap away for every Indian citizen.

**Jai Nyaay!**