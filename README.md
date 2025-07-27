# swipr.ai - Setup Guide

## 🚀 Fresh Computer Setup

### Prerequisites
- Python 3.9+ installed
- Node.js 18+ installed
- Git installed

### Step 1: Clone and Navigate
```bash
git clone <repository-url>
cd swipr.ai.website
```

### Step 2: Setup Python Backend
```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 3: Start Backend
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --reload-dir .
```

### Step 4: Setup Frontend (New Terminal)
```bash
cd ..
npm install
npm run dev
```

### Step 5: Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📁 Project Structure
```
swipr.ai.website/
├── api/           # Python FastAPI backend
├── client/        # React frontend
└── package.json   # Frontend dependencies
```

## 🔧 Development
- **Backend**: Edit `api/main.py` - auto-reloads
- **Frontend**: Edit files in `client/` - hot reloads
- **API**: View docs at http://localhost:8000/docs
