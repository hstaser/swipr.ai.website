# SwiprAI Deployment Guide

## Architecture Overview

SwiprAI uses a **separated architecture**:

- **Frontend**: React + Vite (deployed to Vercel)
- **Backend**: Python FastAPI (deployed separately)

## Frontend Deployment (Vercel)

The frontend is now configured to deploy successfully to Vercel.

### What's Fixed:

- ✅ Removed Node.js backend from Vercel build
- ✅ Frontend-only deployment configuration
- ✅ Fallback data for embedded environments
- ✅ Enhanced error handling for API connection issues

### Deploy Frontend:

```bash
# Deploy to Vercel
vercel --prod

# Or push to main branch if GitHub integration is set up
git push origin main
```

## Backend Deployment Options

### Option 1: Railway (Recommended for Python)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy Python backend
cd api
railway login
railway init
railway up
```

### Option 2: Render

1. Create new Web Service on Render
2. Connect your GitHub repo
3. Set build command: `cd api && pip install -r requirements.txt`
4. Set start command: `cd api && uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option 3: Heroku

```bash
# Create Procfile in api/ directory
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > api/Procfile

# Deploy
cd api
heroku create swipr-api
git subtree push --prefix api heroku main
```

### Option 4: DigitalOcean App Platform

1. Create new App
2. Connect GitHub repo
3. Set source directory: `/api`
4. Auto-detect Python buildpack

## Environment Variables

### Frontend (Vercel)

```bash
VITE_API_URL=https://your-python-backend.com/api
```

### Backend (Python)

```bash
JWT_SECRET=your-super-secret-jwt-key
PORT=8000  # Or whatever port your host requires
```

## Local Development

### Start Backend:

```bash
cd api
./start.sh
# Backend runs on http://localhost:8000
```

### Start Frontend:

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

## Production Architecture

```
Internet
   ↓
┌─────────────────┐    API Calls    ┌─────────────────┐
│   Vercel        │  ------------->  │   Railway       │
│   (Frontend)    │                 │   (Python API)  │
│   React + Vite  │  <-------------  │   FastAPI       │
└─────────────────┘    Responses    └─────────────────┘
```

## Troubleshooting

### Frontend Issues:

- **Build fails**: Check `npm run build` locally
- **API errors**: Verify `VITE_API_URL` environment variable
- **Embedded environment**: App includes fallback data

### Backend Issues:

- **Port errors**: Use `PORT` environment variable
- **Dependencies**: Ensure `requirements.txt` is complete
- **CORS**: Backend includes CORS middleware for all origins

### Connection Issues:

- **HTTPS required**: Ensure backend URL uses HTTPS in production
- **CORS blocked**: Backend allows all origins, check network policies
- **Timeout**: Increase client timeout or optimize API response times

## Current Status

✅ **Frontend**: Ready for Vercel deployment  
⚠️ **Backend**: Needs deployment to Python-compatible host  
✅ **Fallback**: Works in embedded environments  
✅ **Development**: Full local development setup ready

The Vercel deployment should now succeed for the frontend. The backend needs to be deployed to a Python-compatible platform like Railway, Render, or Heroku.
