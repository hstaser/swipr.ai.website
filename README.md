# swipr.ai - 100% Python Backend

**Complete migration from Node.js/JavaScript to Python FastAPI backend**

## 🐍 Architecture Overview

- **Frontend**: React + TypeScript + Vite (unchanged)
- **Backend**: 100% Python with FastAPI (completely replaced Node.js/Express)
- **No JavaScript/Node.js in backend**: All server-side code is now Python

## 🚀 Quick Start

### Start the Python Backend

```bash
# Navigate to the API directory
cd api

# Make startup script executable
chmod +x start.sh

# Start the Python backend
./start.sh
```

The backend will start on `http://localhost:8000` with:

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health
- **Test Endpoint**: http://localhost:8000/api/test

### Start the Frontend

```bash
# In the root directory (separate terminal)
npm run dev
```

The frontend will start on `http://localhost:5173` and automatically connect to the Python backend.

## 🔄 Migration Summary

### What Was Replaced

✅ **Node.js/Express Server** → **Python FastAPI**  
✅ **JavaScript API Routes** → **Python Endpoints**  
✅ **Node.js Authentication** → **Python JWT Auth**  
✅ **Express Middleware** → **FastAPI Dependencies**  
✅ **JavaScript Validation** → **Pydantic Models**  
✅ **Node.js Error Handling** → **FastAPI Exceptions**

### What Stayed the Same

✅ **All API Endpoints** - Same URLs and functionality  
✅ **Request/Response Formats** - No frontend changes needed  
✅ **Authentication Flow** - JWT tokens work identically  
✅ **Frontend Code** - React app unchanged

## 📁 Directory Structure

```
swipr.ai/
├── api/                     # 🐍 Python FastAPI Backend
│   ├── main.py             # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── start.sh           # Startup script
│   └── README.md          # Migration notice
├── client/                 # ⚛️ React Frontend
│   ├── pages/             # React pages
│   ├── components/        # React components
│   └── lib/               # Client utilities
├── api_python/            # 📁 Backup of Python implementation
├── server/                # 🚫 DEPRECATED Node.js (replaced)
└── package.json          # Frontend-only dependencies
```

## 🛠 Backend Features (100% Python)

### Core Framework

- **FastAPI**: Modern, fast Python web framework
- **Pydantic**: Type validation and serialization
- **Uvicorn**: ASGI server for high performance
- **Passlib**: Secure password hashing
- **PyJWT**: JSON Web Token implementation

### Available Endpoints

All endpoints maintain the same API contract as the original Node.js version:

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

#### Waitlist Management

- `POST /api/waitlist` - Add user to waitlist

#### Portfolio Services

- `POST /api/portfolio/optimize` - Generate optimal portfolio
- `POST /api/portfolio/simulate` - Simulate portfolio performance

#### Stock Data

- `GET /api/stocks/prices` - Real-time stock prices
- `GET /api/stocks/{symbol}` - Individual stock analysis
- `POST /api/stocks/swipe` - Record stock selection

#### Social Features

- `POST /api/social/follow` - Follow users
- `POST /api/social/unfollow` - Unfollow users

#### AI Chat

- `POST /api/chat` - AI investment advisor

#### Analytics

- `POST /api/analytics/track` - User behavior tracking

#### Contact & Jobs

- `POST /api/contact` - Contact form submissions
- `POST /api/jobs/apply` - Job applications

#### Utilities

- `GET /api/health` - Health check
- `GET /api/test` - Test connectivity
- `GET /api/ping` - Simple ping endpoint

## 🔧 Development

### Python Backend Development

```bash
cd api

# Install dependencies
pip install -r requirements.txt

# Start with auto-reload
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# View API documentation
open http://localhost:8000/docs
```

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🚀 Deployment Options

### 1. Local Development

```bash
cd api && ./start.sh
```

### 2. Docker Deployment

```bash
cd api
docker build -t swipr-api .
docker run -p 8000:8000 swipr-api
```

### 3. Production Deployment

```bash
# Install dependencies
pip install -r api/requirements.txt

# Start with production server
uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📊 Performance Improvements

The Python FastAPI backend provides several improvements over the Node.js version:

- **Type Safety**: Full request/response validation with Pydantic
- **Performance**: FastAPI is one of the fastest Python frameworks
- **Documentation**: Automatic OpenAPI/Swagger documentation
- **Error Handling**: Better HTTP exception handling with detailed error messages
- **Security**: Improved JWT and password handling with industry-standard libraries
- **Maintainability**: Cleaner, more readable code structure

## 🔒 Security Features

- **BCrypt Password Hashing**: Secure password storage
- **JWT Authentication**: Stateless authentication tokens
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Automatic request validation with Pydantic
- **Type Safety**: Prevents many runtime errors

## 📝 Environment Variables

```bash
# Optional: Set JWT secret (default: auto-generated)
export JWT_SECRET="your-super-secret-jwt-key"

# Optional: Set API URL for frontend
export VITE_API_URL="http://localhost:8000/api"
```

## 🐛 Troubleshooting

### Backend Issues

1. **Python not found**: Install Python 3.9+ from python.org
2. **Dependencies fail**: Run `pip install --upgrade pip` first
3. **Port 8000 in use**: Change port in `start.sh` or kill existing process

### Frontend Issues

1. **API connection fails**: Ensure Python backend is running on port 8000
2. **CORS errors**: Backend includes CORS middleware for all origins
3. **Auth issues**: Check browser localStorage for `swipr_token`

### Testing the Migration

```bash
# Test Python backend directly
curl http://localhost:8000/api/health

# Test through frontend
curl http://localhost:5173  # Frontend should proxy to Python backend
```

## 📚 Documentation

- **API Docs**: http://localhost:8000/docs (automatically generated)
- **ReDoc**: http://localhost:8000/redoc (alternative API documentation)
- **Health Check**: http://localhost:8000/api/health (backend status)

## ✅ Migration Complete

🎉 **The entire backend is now 100% Python!**

- ❌ No more Node.js server code
- ❌ No more JavaScript backend files
- ❌ No more Express.js dependencies
- ✅ Pure Python FastAPI implementation
- ✅ All functionality preserved
- ✅ Better performance and type safety
- ✅ Automatic API documentation

The frontend remains unchanged and fully compatible with the new Python backend.
