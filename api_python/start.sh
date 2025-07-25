#!/bin/bash

# Install dependencies if not already installed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/upgrade dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Start the server
echo "Starting swipr.ai Python backend..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
