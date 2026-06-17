
# 📊 Dataset-Studio

A full-stack, AI-powered synthetic dataset schema creator. Dataset-Studio allows developers, data scientists, and machine learning engineers to rapidly design, validate, and generate production-ready dataset schemas using natural language prompts driven by Google Gemini.

**🔗 Live Demo:** [dataset-studio.vercel.app](https://dataset-studio.vercel.app/)  
**⚙️ Backend API:** Hosted on Render

---

## 🚀 Features

- **Natural Language to Schema:** Input simple prompts (e.g., *"Create a fintech fraud detection dataset"*) and receive structured database blueprints.
- **Strict Semantic Type Validation:** Enforces a rigid structure utilizing pre-defined system semantic categories (`person_name`, `income`, `company_name`, etc.) preventing machine learning data parsing anomalies.
- **Dynamic Decoupled Architecture:** Built with a high-performance Python FastAPI backend completely decoupled from a responsive React/Vite user interface.
- **Secure Cloud Execution:** Utilizes protected asynchronous runtime environments ensuring zero client-side API exposure for underlying LLM weights and keys.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios (Configured for dynamic environment routing)
- **Hosting:** Vercel (Edge Network Deployment)

### Backend
- **Framework:** FastAPI (Python 3)
- **ASGI Server:** Uvicorn
- **AI Core:** Google Gemini Pro Engine API (via Structured JSON REST calls)
- **Database Wrapper:** SQLite / Adaptable Postgres Layout
- **Hosting:** Render (Linux Container Instance)

---

## 📐 Architecture & Cloud Data Flow

The application relies on a decoupled, cross-origin architecture optimized for speed and strict payload security:


```

┌─────────────────┐             HTTP Requests             ┌──────────────────────┐
│  Vite Frontend  │ ────────────────────────────────────> │  FastAPI Backend API │
│  (Vercel Edge)  │ <──────────────────────────────────── │    (Render Cloud)    │
└─────────────────┘             JSON Payload              └──────────┬───────────┘
│
│ Asynchronous
│ REST Call
▼
┌──────────────────────┐
│  Google Gemini Core  │
│   (Secure Sandbox)   │
└──────────────────────┘

```

---

## ⚙️ Local Development Setup

To run this full-stack application on your local machine, follow these steps:

### Prerequisites
- Python 3.10+
- Node.js (v18+)
- A Google AI Studio API Key

### 1. Clone the Repository
```bash
git clone [https://github.com/Hemanth-2OOT/Dataset-Studio.git](https://github.com/Hemanth-2OOT/Dataset-Studio.git)
cd Dataset-Studio

```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment variable file
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env

# Start the local development server
PYTHONPATH=backend uvicorn backend.main:app --reload

```

The API server will boot up at `http://127.0.0.1:8000`.

### 3. Frontend Setup

Open a new terminal window at the root folder:

```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install

# Start development build tool
npm run dev

```

The UI will launch locally at `http://localhost:5173` and automatically default its fallback network pipeline requests to your local Python server.

---

## 🔒 Security Posture & Environment Protocols

This repository strictly complies with professional security practices:

* **Zero-Credential Exposure:** No cryptographic tokens or proprietary API secrets are hardcoded in source control.
* **System Isolation:** Environment properties (`.env`, `dist`, `venv`, `__pycache__`) are properly guarded and isolated using rigorous project root `.gitignore` protocols.
* **Dynamic Configuration:** Cross-Origin endpoints dynamically switch contexts between local development modes and production clouds using Vite `import.meta.env` utilities.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

```

```
