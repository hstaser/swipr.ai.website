"""
FastAPI backend for swipr.ai - Complete Python backend replacement
"""

import os
import uuid
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import json
import re

from fastapi import FastAPI, HTTPException, Depends, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, validator
import jwt
from passlib.context import CryptContext
import asyncio
from collections import defaultdict

# Import database and sheets integration
from database import (
    get_users_collection, get_waitlist_collection, get_contact_messages_collection,
    get_job_applications_collection, get_analytics_collection, get_portfolios_collection,
    get_follows_collection, get_chat_sessions_collection, init_database,
    UserModel, WaitlistModel, ContactMessageModel, JobApplicationModel, AnalyticsModel
)
from sheets_integration import sheets_manager

# Initialize FastAPI app
app = FastAPI(
    title="swipr.ai API",
    description="Intelligent investment platform backend - Complete Python Implementation",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-here")
JWT_ALGORITHM = "HS256"
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "change-this-in-production")

# Stock data simulation - Updated with current prices
STOCK_PRICES = {
    "AAPL": {"price": 214.46, "change": 0.31, "volume": 52000000, "marketCap": "2.9T"},
    "TSLA": {"price": 302.28, "change": -30.28, "volume": 41000000, "marketCap": "778B"},
    "NVDA": {"price": 172.79, "change": 2.01, "volume": 35000000, "marketCap": "1.05T"},
    "GOOGL": {"price": 141.52, "change": 1.1, "volume": 28000000, "marketCap": "1.57T"},
    "AMZN": {"price": 142.75, "change": 1.8, "volume": 33000000, "marketCap": "1.48T"},
    "MSFT": {"price": 414.31, "change": 0.8, "volume": 25000000, "marketCap": "2.71T"},
    "META": {"price": 315.8, "change": -0.5, "volume": 18000000, "marketCap": "798B"},
    "SPY": {"price": 445.6, "change": 1.1, "volume": 85000000, "marketCap": "ETF"},
}

# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class WaitlistEntry(BaseModel):
    email: EmailStr
    name: str
    interests: List[str] = []

class PortfolioOptimization(BaseModel):
    riskLevel: str
    amount: float
    preferences: Dict[str, Any] = {}

    @validator('amount')
    def validate_amount(cls, v):
        if v < 100:
            raise ValueError('Minimum investment amount is $100')
        return v

class PortfolioSimulation(BaseModel):
    allocation: Dict[str, float]
    timeframe: int = 12

class StockSwipe(BaseModel):
    symbol: str
    direction: str
    userId: Optional[str] = None

    @validator('direction')
    def validate_direction(cls, v):
        if v not in ['left', 'right']:
            raise ValueError('Direction must be left or right')
        return v

class ChatMessage(BaseModel):
    message: str
    sessionId: Optional[str] = None

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

class JobApplication(BaseModel):
    position: str
    name: str
    email: EmailStr
    phone: str
    coverLetter: str
    resumeUrl: Optional[str] = ""

class AnalyticsEvent(BaseModel):
    eventType: str
    page: str
    sessionId: str
    timestamp: str
    userAgent: str
    location: str
    element: Optional[str] = None
    value: Optional[str] = None
    referrer: Optional[str] = None

class FollowUser(BaseModel):
    targetUserId: str

# Utility functions
def generate_id() -> str:
    return str(uuid.uuid4())

def get_current_timestamp() -> str:
    return datetime.now().isoformat()

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_jwt_token(data: dict) -> str:
    expiration = datetime.utcnow() + timedelta(days=7)
    to_encode = data.copy()
    to_encode.update({"exp": expiration})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[dict]:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    payload = verify_jwt_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    return payload

def generate_portfolio_optimization(risk_level: str, investment_amount: float, preferences: Dict = None) -> Dict:
    # Portfolio optimization logic (unchanged)
    allocations = {
        "conservative": {"stocks": 0.3, "bonds": 0.6, "cash": 0.1},
        "moderate": {"stocks": 0.6, "bonds": 0.3, "cash": 0.1},
        "aggressive": {"stocks": 0.8, "bonds": 0.15, "cash": 0.05}
    }
    
    allocation = allocations.get(risk_level, allocations["moderate"])
    expected_returns = {
        "conservative": "8.5%",
        "moderate": "11.2%",
        "aggressive": "14.8%"
    }
    
    risk_scores = {"conservative": 3, "moderate": 6, "aggressive": 9}
    
    return {
        "totalValue": investment_amount,
        "expectedReturn": expected_returns.get(risk_level, "11.2%"),
        "riskScore": risk_scores.get(risk_level, 6),
        "allocations": allocation,
        "recommendations": [
            {
                "symbol": "AAPL",
                "allocation": "20.0",
                "amount": str(investment_amount * 0.2),
                "currentPrice": 214.46,
                "expectedReturn": "12.5%"
            },
            {
                "symbol": "NVDA",
                "allocation": "20.0",
                "amount": str(investment_amount * 0.2),
                "currentPrice": 172.79,
                "expectedReturn": "15.2%"
            },
            {
                "symbol": "TSLA",
                "allocation": "20.0",
                "amount": str(investment_amount * 0.2),
                "currentPrice": 302.28,
                "expectedReturn": "18.7%"
            }
        ],
        "rebalanceDate": (datetime.now() + timedelta(days=90)).isoformat(),
        "diversificationScore": 8.5
    }

def generate_chat_response(message: str, user_id: str = None) -> str:
    # Simple AI response generation (unchanged)
    responses = [
        "That's an interesting question about investing!",
        "I'd be happy to help you with your investment strategy.",
        "Let me analyze that for you...",
        "Based on current market conditions...",
        "Here's what I think about that..."
    ]
    return responses[hash(message) % len(responses)]

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database and Google Sheets on startup"""
    try:
        await init_database()
        print("🚀 Swipr.ai API started with persistent storage")
    except Exception as e:
        print(f"⚠️ Database initialization failed: {e}")
        print("📝 The API will run with limited functionality. Set up MongoDB to enable full features.")
        print("🔗 Get a free MongoDB Atlas cluster: https://www.mongodb.com/atlas")

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to swipr.ai API", "version": "2.0.0"}

@app.get("/test_sync.html")
async def test_sync_page():
    """Serve the test sync HTML page"""
    html_content = """
<!DOCTYPE html>
<html>
<head>
    <title>Test Google Sheets Sync</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        button { padding: 10px 20px; margin: 10px; font-size: 16px; }
        #result { margin: 20px; padding: 10px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>Test Google Sheets Sync</h1>
    
    <button onclick="testSync()">Test Sync to Google Sheets</button>
    <button onclick="testDatabase()">Test Database Stats</button>
    
    <div id="result"></div>
    
    <script>
        async function testSync() {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '🔄 Testing sync...';
            
            try {
                const response = await fetch('/api/admin/sync-sheets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    resultDiv.innerHTML = `✅ Success: ${JSON.stringify(data, null, 2)}`;
                } else {
                    resultDiv.innerHTML = `❌ Error: ${JSON.stringify(data, null, 2)}`;
                }
            } catch (error) {
                resultDiv.innerHTML = `❌ Network Error: ${error.message}`;
            }
        }
        
        async function testDatabase() {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '🔄 Testing database...';
            
            try {
                const response = await fetch('/api/admin/stats', {
                    method: 'GET'
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    resultDiv.innerHTML = `📊 Database Stats: ${JSON.stringify(data, null, 2)}`;
                } else {
                    resultDiv.innerHTML = `❌ Error: ${JSON.stringify(data, null, 2)}`;
                }
            } catch (error) {
                resultDiv.innerHTML = `❌ Network Error: ${error.message}`;
            }
        }
    </script>
</body>
</html>
    """
    from fastapi.responses import HTMLResponse
    return HTMLResponse(content=html_content)

@app.get("/api/ping")
async def ping():
    return {"message": "Hello from Python FastAPI server v2.0!", "timestamp": get_current_timestamp()}

# ==================== AUTHENTICATION ENDPOINTS ====================

@app.post("/api/auth/register")
async def register(user_data: UserRegister):
    # Check if user already exists
    users_collection = get_users_collection()
    if users_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=409, detail="User already exists")
    
    hashed_password = hash_password(user_data.password)
    user_id = generate_id()
    
    user = UserModel(
        email=user_data.email,
        name=user_data.name,
        password=hashed_password,
        createdAt=get_current_timestamp(),
        verified=False,
        profile={
            "riskTolerance": "moderate",
            "investmentGoals": [],
            "experience": "beginner",
        }
    )
    
    await users_collection.insert_one(user.dict(by_alias=True))
    
    token = create_jwt_token({"userId": user_id, "email": user_data.email})
    
    return {
        "message": "User created successfully",
        "token": token,
        "user": {"id": user_id, "email": user_data.email, "name": user_data.name},
    }

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    users_collection = get_users_collection()
    if users_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    user = await users_collection.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token({"userId": str(user["_id"]), "email": user_data.email})
    
    return {
        "message": "Login successful",
        "token": token,
        "user": {"id": str(user["_id"]), "email": user["email"], "name": user["name"]},
    }

@app.post("/api/admin/login")
async def admin_login(password: str = Body(..., embed=True)):
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin password")
    token = create_jwt_token({"role": "admin"})
    return {"token": token}

# ==================== WAITLIST ENDPOINTS ====================

@app.post("/api/waitlist")
async def add_to_waitlist(entry: WaitlistEntry):
    waitlist_collection = get_waitlist_collection()
    if waitlist_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    # Check if email already exists
    existing_entry = await waitlist_collection.find_one({"email": entry.email})
    if existing_entry:
        raise HTTPException(status_code=409, detail="Email already on waitlist")
    
    # Get current position
    position = await waitlist_collection.count_documents({}) + 1
    
    waitlist_entry = WaitlistModel(
        email=entry.email,
        name=entry.name,
        interests=entry.interests,
        position=position,
        joinedAt=get_current_timestamp(),
        referrals=0,
        status="active"
    )
    
    await waitlist_collection.insert_one(waitlist_entry.dict(by_alias=True))
    
    # Sync to Google Sheets only in production
    if os.getenv("ENVIRONMENT") == "production":
        print(f"🔄 Attempting to sync waitlist to Google Sheets...")
        print(f"📊 Environment: {os.getenv('ENVIRONMENT')}")
        print(f"📄 Service Account: {'Set' if os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON') else 'Not set'}")
        print(f"📊 Spreadsheet ID: {os.getenv('GOOGLE_SPREADSHEET_ID', 'Not set')}")
        asyncio.create_task(sheets_manager.sync_waitlist())
    else:
        print(f"⏭️ Skipping Google Sheets sync (ENVIRONMENT={os.getenv('ENVIRONMENT', 'not set')})")
    
    return {
        "message": "Successfully added to waitlist",
        "position": position,
        "id": str(waitlist_entry.id),
    }

# ==================== PORTFOLIO ENDPOINTS ====================

@app.post("/api/portfolio/optimize")
async def optimize_portfolio(optimization: PortfolioOptimization):
    result = generate_portfolio_optimization(
        optimization.riskLevel,
        optimization.amount,
        optimization.preferences
    )
    
    return {
        "message": "Portfolio optimized successfully",
        "data": result
    }

@app.post("/api/portfolio/simulate")
async def simulate_portfolio(simulation: PortfolioSimulation):
    # Portfolio simulation logic (unchanged)
    total_allocation = sum(simulation.allocation.values())
    if abs(total_allocation - 1.0) > 0.01:
        raise HTTPException(status_code=400, detail="Allocation must sum to 100%")
    
    # Simulate returns
    simulated_value = 10000  # Starting value
    monthly_return = 0.008  # 0.8% monthly return
    
    for month in range(simulation.timeframe):
        simulated_value *= (1 + monthly_return)
    
    return {
        "message": "Portfolio simulation completed",
        "data": {
            "initialValue": 10000,
            "finalValue": round(simulated_value, 2),
            "totalReturn": round(((simulated_value - 10000) / 10000) * 100, 2),
            "timeframe": simulation.timeframe,
            "allocation": simulation.allocation
        }
    }

# ==================== STOCK ENDPOINTS ====================

@app.get("/api/stocks/prices")
async def get_stock_prices():
    return {
        "message": "Stock prices retrieved successfully",
        "data": STOCK_PRICES
    }

@app.get("/api/stocks/{symbol}")
async def get_stock_data(symbol: str):
    if symbol.upper() not in STOCK_PRICES:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    stock_data = STOCK_PRICES[symbol.upper()].copy()
    stock_data["symbol"] = symbol.upper()
    
    # Add additional data
    stock_data.update({
        "recommendation": "BUY",
        "targetPrice": str(stock_data["price"] * 1.15),
        "analystRating": "4.2/5",
        "riskLevel": "Medium"
    })
    
    return {
        "message": f"Stock data for {symbol} retrieved successfully",
        "data": stock_data
    }

@app.post("/api/stocks/swipe")
async def swipe_stock(swipe: StockSwipe):
    if swipe.symbol.upper() not in STOCK_PRICES:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    action = "invest" if swipe.direction == "right" else "pass"
    
    return {
        "message": f"Successfully {action}ed {swipe.symbol}",
        "data": {
            "swipe": {
                "id": generate_id(),
                "symbol": swipe.symbol.upper(),
                "direction": swipe.direction,
                "userId": swipe.userId,
                "timestamp": get_current_timestamp(),
                "action": action
            },
            "portfolioUpdate": {
                "symbol": swipe.symbol.upper(),
                "shares": 5 if swipe.direction == "right" else 0,
                "amount": 1000 if swipe.direction == "right" else 0,
                "price": STOCK_PRICES[swipe.symbol.upper()]["price"]
            } if swipe.direction == "right" else None
        }
    }

# ==================== SOCIAL ENDPOINTS ====================

@app.post("/api/social/follow")
async def follow_user(follow_data: FollowUser, current_user: dict = Depends(get_current_user)):
    follows_collection = get_follows_collection()
    if follows_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    # Follow logic (simplified)
    follow_record = {
        "followerId": current_user.get("userId"),
        "targetUserId": follow_data.targetUserId,
        "createdAt": get_current_timestamp()
    }
    
    await follows_collection.insert_one(follow_record)
    
    return {
        "message": "User followed successfully",
        "data": {"isFollowing": True}
    }

@app.post("/api/social/unfollow")
async def unfollow_user(follow_data: FollowUser, current_user: dict = Depends(get_current_user)):
    follows_collection = get_follows_collection()
    if follows_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    # Unfollow logic
    result = await follows_collection.delete_one({
        "followerId": current_user.get("userId"),
        "targetUserId": follow_data.targetUserId
    })
    
    return {
        "message": "User unfollowed successfully",
        "data": {"isFollowing": False}
    }

# ==================== CHAT/AI ENDPOINTS ====================

@app.post("/api/chat")
async def chat(chat_data: ChatMessage):
    chat_sessions_collection = get_chat_sessions_collection()
    if chat_sessions_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    session = chat_data.sessionId or generate_id()
    
    # Get or create chat session
    session_data = await chat_sessions_collection.find_one({"id": session})
    if not session_data:
        session_data = {
            "id": session,
            "messages": [],
            "createdAt": get_current_timestamp(),
        }
        await chat_sessions_collection.insert_one(session_data)
    
    response = generate_chat_response(chat_data.message)
    
    # Add messages to session
    new_messages = [
        {"role": "user", "content": chat_data.message, "timestamp": get_current_timestamp()},
        {"role": "assistant", "content": response, "timestamp": get_current_timestamp()},
    ]
    
    await chat_sessions_collection.update_one(
        {"id": session},
        {"$push": {"messages": {"$each": new_messages}}}
    )
    
    return {
        "message": "Chat response generated",
        "data": {
            "response": response,
            "sessionId": session
        }
    }

# ==================== ANALYTICS ENDPOINTS ====================

@app.post("/api/analytics/track")
async def track_analytics(event: AnalyticsEvent):
    analytics_collection = get_analytics_collection()
    if analytics_collection is None:
        # Analytics is optional, don't fail the request
        return {"message": "Analytics tracking skipped - database not available"}
    
    analytics_event = AnalyticsModel(
        eventType=event.eventType,
        page=event.page,
        sessionId=event.sessionId,
        timestamp=event.timestamp,
        userAgent=event.userAgent,
        location=event.location,
        element=event.element,
        value=event.value,
        referrer=event.referrer
    )
    
    await analytics_collection.insert_one(analytics_event.dict(by_alias=True))
    
    return {
        "message": "Analytics event tracked successfully",
        "data": {
            "eventId": str(analytics_event.id)
        }
    }

# ==================== CONTACT ENDPOINTS ====================

@app.post("/api/contact")
async def send_contact_message(contact: ContactMessage):
    contact_messages_collection = get_contact_messages_collection()
    if contact_messages_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    contact_message = ContactMessageModel(
        name=contact.name,
        email=contact.email,
        message=contact.message,
        status="new",
        createdAt=get_current_timestamp()
    )
    
    await contact_messages_collection.insert_one(contact_message.dict(by_alias=True))
    
    # Sync to Google Sheets only in production
    if os.getenv("ENVIRONMENT") == "production":
        print(f"🔄 Attempting to sync contact message to Google Sheets...")
        asyncio.create_task(sheets_manager.sync_contact_messages())
    
    return {
        "message": "Message sent successfully",
        "data": {
            "id": str(contact_message.id)
        }
    }

# ==================== JOB APPLICATION ENDPOINTS ====================

@app.post("/api/jobs/apply")
async def submit_job_application(application: JobApplication):
    job_applications_collection = get_job_applications_collection()
    if job_applications_collection is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    job_application = JobApplicationModel(
        position=application.position,
        name=application.name,
        email=application.email,
        phone=application.phone,
        coverLetter=application.coverLetter,
        resumeUrl=application.resumeUrl or "",
        status="new",
        createdAt=get_current_timestamp()
    )
    
    await job_applications_collection.insert_one(job_application.dict(by_alias=True))
    
    # Sync to Google Sheets only in production
    if os.getenv("ENVIRONMENT") == "production":
        print(f"🔄 Attempting to sync job application to Google Sheets...")
        asyncio.create_task(sheets_manager.sync_job_applications())
    
    return {
        "message": "Job application submitted successfully",
        "data": {
            "applicationId": str(job_application.id)
        }
    }

# ==================== ADMIN ENDPOINTS ====================

@app.get("/api/admin/stats")
async def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        waitlist_collection = get_waitlist_collection()
        contact_messages_collection = get_contact_messages_collection()
        job_applications_collection = get_job_applications_collection()
        users_collection = get_users_collection()
        
        if any(col is None for col in [waitlist_collection, contact_messages_collection, job_applications_collection, users_collection]):
            raise HTTPException(status_code=503, detail="Database not available")
        
        waitlist_count = await waitlist_collection.count_documents({})
        contact_count = await contact_messages_collection.count_documents({})
        applications_count = await job_applications_collection.count_documents({})
        users_count = await users_collection.count_documents({})
        
        return {
            "message": "Admin stats retrieved successfully",
            "data": {
                "waitlist": waitlist_count,
                "contacts": contact_count,
                "applications": applications_count,
                "users": users_count
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get admin stats: {str(e)}")

@app.get("/api/admin/waitlist")
async def get_waitlist_data():
    """Get all waitlist entries"""
    try:
        waitlist_collection = get_waitlist_collection()
        if waitlist_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
            
        cursor = waitlist_collection.find({}).sort("joinedAt", -1)
        waitlist_data = await cursor.to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for entry in waitlist_data:
            entry["_id"] = str(entry["_id"])
        
        return {
            "message": "Waitlist data retrieved successfully",
            "data": waitlist_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get waitlist data: {str(e)}")

@app.get("/api/admin/contacts")
async def get_contact_messages():
    """Get all contact messages"""
    try:
        contact_messages_collection = get_contact_messages_collection()
        if contact_messages_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
            
        cursor = contact_messages_collection.find({}).sort("createdAt", -1)
        messages_data = await cursor.to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for message in messages_data:
            message["_id"] = str(message["_id"])
        
        return {
            "message": "Contact messages retrieved successfully",
            "data": messages_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get contact messages: {str(e)}")

@app.get("/api/admin/applications")
async def get_job_applications():
    """Get all job applications"""
    try:
        job_applications_collection = get_job_applications_collection()
        if job_applications_collection is None:
            raise HTTPException(status_code=503, detail="Database not available")
            
        cursor = job_applications_collection.find({}).sort("createdAt", -1)
        applications_data = await cursor.to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for app in applications_data:
            app["_id"] = str(app["_id"])
        
        return {
            "message": "Job applications retrieved successfully",
            "data": applications_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get job applications: {str(e)}")

@app.post("/api/admin/sync-sheets")
async def sync_to_google_sheets():
    """Manually trigger Google Sheets sync"""
    try:
        success = await sheets_manager.sync_all_data()
        if success:
            return {"message": "Data synced to Google Sheets successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to sync data to Google Sheets")
    except Exception as e:
        print(f"❌ Sync error details: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

# ==================== HEALTH CHECK ENDPOINTS ====================

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        users_collection = get_users_collection()
        if users_collection is None:
            return {
                "status": "unhealthy",
                "message": "Database connection failed",
                "timestamp": get_current_timestamp(),
                "database": "disconnected",
                "version": "2.0.0"
            }
        
        await users_collection.find_one()
        
        return {
            "status": "healthy",
            "message": "All systems operational",
            "timestamp": get_current_timestamp(),
            "database": "connected",
            "version": "2.0.0"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "message": f"Database connection failed: {str(e)}",
            "timestamp": get_current_timestamp(),
            "database": "disconnected",
            "version": "2.0.0"
        }

@app.get("/api/test")
async def test_endpoint():
    """Test endpoint for debugging"""
    return {
        "message": "Test endpoint working",
        "timestamp": get_current_timestamp(),
        "environment": "production" if os.getenv("ENVIRONMENT") else "development"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
