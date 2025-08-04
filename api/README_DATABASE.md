# Database Setup Guide for swipr.ai

## Overview
This guide will help you set up persistent storage for swipr.ai using MongoDB and Google Sheets integration.

## Prerequisites
- Python 3.9+
- MongoDB (local or cloud)
- Google Cloud Project (for Google Sheets integration)

## Step 1: Install Dependencies

```bash
cd api
pip install -r requirements.txt
```

## Step 2: Set Up MongoDB

### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Set environment variable:
```bash
export MONGODB_URL="mongodb://localhost:27017"
```

### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Set environment variable:
```bash
export MONGODB_URL="mongodb+srv://username:password@cluster.mongodb.net/swipr_ai"
```

## Step 3: Set Up Google Sheets Integration (Optional)

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sheets API

### 2. Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Download the JSON key file
4. Set environment variable:
```bash
export GOOGLE_SERVICE_ACCOUNT_JSON='{"type": "service_account", ...}'
```

### 3. Create Google Spreadsheet
1. Create a new Google Spreadsheet
2. Share it with your service account email
3. Set environment variable:
```bash
export GOOGLE_SPREADSHEET_ID="demo database"
```

## Step 4: Environment Variables

Create a `.env` file in the `api/` directory:

```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=swipr_ai

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Admin Password
ADMIN_PASSWORD=your-secure-admin-password

# Google Sheets (optional)
GOOGLE_SERVICE_ACCOUNT_JSON={"type": "service_account", ...}
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
```

## Step 5: Initialize Database

```bash
cd api
python setup_database.py
```

## Step 6: Test the Setup

1. Start the backend:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --reload-dir .
```

2. Test endpoints:
- Health check: `GET /api/health`
- Admin stats: `GET /api/admin/stats`
- Sync sheets: `POST /api/admin/sync-sheets`

## Data Structure

The database will create these collections:
- `users` - User accounts and authentication
- `waitlist` - Waitlist signups
- `contact_messages` - Contact form submissions
- `job_applications` - Job application submissions
- `analytics` - User analytics events

## Google Sheets Integration

When enabled, data will automatically sync to these sheets:
- **Waitlist** - Email, Name, Interests, Position, Joined At, Status
- **Contact Messages** - Name, Email, Message, Status, Created At
- **Job Applications** - Name, Email, Phone, Position, Cover Letter, Resume URL, Status, Created At

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running
- Verify connection string
- Check network connectivity

### Google Sheets Issues
- Verify service account JSON is correct
- Check if spreadsheet is shared with service account
- Ensure Google Sheets API is enabled

### Data Not Persisting
- Check MongoDB connection
- Verify database name is correct
- Check for any error messages in logs

## Production Deployment

For production, consider:
- Using MongoDB Atlas for managed database
- Setting up proper backups
- Using environment variables for all secrets
- Setting up monitoring and logging 