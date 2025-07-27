#!/bin/bash

echo "🐍 Starting swipr.ai Python Backend (100% Python - No JavaScript/Node.js)"
echo "========================================================================="

# Install dependencies if not already installed
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/upgrade dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Start the server
echo "Starting swipr.ai Python FastAPI backend on http://localhost:8000..."
echo "API Documentation: http://localhost:8000/docs"
echo "Health Check: http://localhost:8000/api/health"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
