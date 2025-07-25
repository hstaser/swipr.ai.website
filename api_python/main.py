"""
FastAPI backend for swipr.ai - Python replacement for Node.js backend
"""

import os
import uuid
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import json
import re

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, validator
import jwt
from passlib.context import CryptContext
import asyncio
from collections import defaultdict

# Initialize FastAPI app
app = FastAPI(
    title="swipr.ai API",
    description="Intelligent investment platform backend",
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

# In-memory storage (replace with real database in production)
users: Dict[str, Dict] = {}
waitlist: Dict[str, Dict] = {}
portfolios: Dict[str, Dict] = {}
follows: Dict[str, Dict] = {}
analytics: Dict[str, Dict] = {}
contact_messages: Dict[str, Dict] = {}
job_applications: Dict[str, Dict] = {}
stock_data: Dict[str, Dict] = {}
chat_sessions: Dict[str, Dict] = {}

# Stock data simulation
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
    event: str
    properties: Dict[str, Any] = {}
    userId: Optional[str] = None

class FollowUser(BaseModel):
    targetUserId: str

# Utility Functions
def generate_id() -> str:
    return str(uuid.uuid4())

def get_current_timestamp() -> str:
    return datetime.utcnow().isoformat() + "Z"

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_jwt_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
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
    """Generate portfolio optimization based on risk level and amount"""
    if preferences is None:
        preferences = {}
    
    safe_investment_amount = max(float(investment_amount), 100)
    
    allocations = {
        "conservative": {"stocks": 0.3, "bonds": 0.6, "cash": 0.1},
        "moderate": {"stocks": 0.6, "bonds": 0.3, "cash": 0.1},
        "aggressive": {"stocks": 0.8, "bonds": 0.15, "cash": 0.05},
    }
    
    allocation = allocations.get(risk_level, allocations["moderate"])
    
    stocks = ["AAPL", "NVDA", "TSLA", "GOOGL", "MSFT"]
    portfolio = []
    
    for symbol in stocks:
        stock_allocation = allocation["stocks"] / len(stocks)
        portfolio.append({
            "symbol": symbol,
            "allocation": f"{stock_allocation * 100:.1f}",
            "amount": f"{stock_allocation * safe_investment_amount:.2f}",
            "currentPrice": STOCK_PRICES.get(symbol, {}).get("price", 185.42),
            "expectedReturn": f"{(secrets.randbelow(20) + 5):.1f}%",
        })
    
    expected_return_value = (
        allocation["stocks"] * 12 + allocation["bonds"] * 4 + allocation["cash"] * 1
    )
    
    risk_scores = {"conservative": 3, "moderate": 6, "aggressive": 9}
    
    return {
        "totalValue": safe_investment_amount,
        "expectedReturn": f"{expected_return_value:.1f}%",
        "riskScore": risk_scores.get(risk_level, 6),
        "allocations": allocation,
        "recommendations": portfolio,
        "rebalanceDate": (datetime.utcnow() + timedelta(days=90)).isoformat() + "Z",
        "diversificationScore": 8.5,
    }

def generate_chat_response(message: str, user_id: str = None) -> str:
    """Generate AI chat response"""
    responses = {
        "tech stock": "Based on current analysis, NVDA shows strong fundamentals with AI tailwinds. Your portfolio already has 28% NVDA allocation, which provides good exposure to the AI trend.",
        "diversify": "I recommend diversifying across sectors: 30% tech (AAPL, NVDA), 25% healthcare (JNJ, PFE), 20% finance (JPM, BAC), 15% consumer goods (PG, KO), 10% bonds/cash for stability.",
        "expected return": "With your current allocation (60% stocks, 30% bonds, 10% cash), expected annual return is 8-12%. Tech heavy weighting increases potential but adds volatility.",
        "AAPL": "AAPL is currently trading at $214.46 (+0.14%). Strong buy signals: iOS 18 adoption, services growth, China recovery. Consider accumulating on dips below $210.",
    }
    
    message_lower = message.lower()
    for key, response in responses.items():
        if key.lower() in message_lower:
            return response
    
    return "I'm here to help with investment decisions! Ask me about portfolio allocation, stock analysis, or market trends."

# API Endpoints

@app.get("/")
async def root():
    return {"message": "swipr.ai API v2.0 - Python FastAPI Backend"}

# ==================== AUTHENTICATION ENDPOINTS ====================

@app.post("/api/auth/register")
async def register(user_data: UserRegister):
    if user_data.email in users:
        raise HTTPException(status_code=409, detail="User already exists")
    
    hashed_password = hash_password(user_data.password)
    user_id = generate_id()
    
    user = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "password": hashed_password,
        "createdAt": get_current_timestamp(),
        "verified": False,
        "profile": {
            "riskTolerance": "moderate",
            "investmentGoals": [],
            "experience": "beginner",
        },
    }
    
    users[user_data.email] = user
    
    token = create_jwt_token({"userId": user_id, "email": user_data.email})
    
    return {
        "message": "User created successfully",
        "token": token,
        "user": {"id": user_id, "email": user_data.email, "name": user_data.name},
    }

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    user = users.get(user_data.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token({"userId": user["id"], "email": user_data.email})
    
    return {
        "message": "Login successful",
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user["name"]},
    }

# ==================== WAITLIST ENDPOINTS ====================

@app.post("/api/waitlist")
async def add_to_waitlist(entry: WaitlistEntry):
    if entry.email in waitlist:
        raise HTTPException(status_code=409, detail="Email already on waitlist")
    
    waitlist_entry = {
        "id": generate_id(),
        "email": entry.email,
        "name": entry.name,
        "interests": entry.interests,
        "position": len(waitlist) + 1,
        "joinedAt": get_current_timestamp(),
        "referrals": 0,
        "status": "active",
    }
    
    waitlist[entry.email] = waitlist_entry
    
    return {
        "message": "Successfully added to waitlist",
        "position": waitlist_entry["position"],
        "id": waitlist_entry["id"],
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
        "data": result,
    }

@app.post("/api/portfolio/simulate")
async def simulate_portfolio(simulation: PortfolioSimulation):
    monthly_data = []
    current_value = 10000
    
    for i in range(simulation.timeframe + 1):
        monthly_return = (secrets.randbelow(40) - 20) / 1000 + 0.008  # -2% to +2% monthly, avg 0.8%
        current_value *= 1 + monthly_return
        
        monthly_data.append({
            "month": i,
            "value": round(current_value),
            "return": f"{((current_value - 10000) / 10000) * 100:.2f}",
        })
    
    return {
        "message": "Portfolio simulation completed",
        "data": {
            "simulation": monthly_data,
            "finalValue": current_value,
            "totalReturn": f"{((current_value - 10000) / 10000) * 100:.2f}",
            "volatility": f"{secrets.randbelow(15) + 10:.1f}",  # 10-25% volatility
            "sharpeRatio": f"{secrets.randbelow(20) / 10 + 0.5:.2f}",  # 0.5-2.5 Sharpe ratio
        },
    }

# ==================== STOCK DATA ENDPOINTS ====================

@app.get("/api/stocks/prices")
async def get_stock_prices():
    return {
        "message": "Stock prices retrieved successfully",
        "data": STOCK_PRICES,
        "timestamp": get_current_timestamp(),
    }

@app.get("/api/stocks/{symbol}")
async def get_stock_data(symbol: str):
    symbol_upper = symbol.upper()
    
    if symbol_upper not in STOCK_PRICES:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    stock = STOCK_PRICES[symbol_upper]
    analysis = {
        **stock,
        "symbol": symbol_upper,
        "recommendation": "BUY" if stock["change"] > 0 else "HOLD",
        "targetPrice": f"{stock['price'] * (1 + secrets.randbelow(20) / 100):.2f}",
        "analystRating": "Strong Buy" if secrets.randbelow(2) else "Buy",
        "riskLevel": "High" if secrets.randbelow(10) > 7 else "Medium" if secrets.randbelow(10) > 4 else "Low",
    }
    
    return {
        "message": "Stock data retrieved successfully",
        "data": analysis,
    }

@app.post("/api/stocks/swipe")
async def swipe_stock(swipe: StockSwipe):
    if swipe.symbol.upper() not in STOCK_PRICES:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    swipe_action = {
        "id": generate_id(),
        "symbol": swipe.symbol,
        "direction": swipe.direction,
        "userId": swipe.userId or "anonymous",
        "timestamp": get_current_timestamp(),
        "action": "invest" if swipe.direction == "right" else "pass",
    }
    
    portfolio_update = None
    if swipe.direction == "right" and swipe.symbol.upper() in STOCK_PRICES:
        stock_price = STOCK_PRICES[swipe.symbol.upper()]["price"]
        portfolio_update = {
            "symbol": swipe.symbol,
            "shares": int(1000 / stock_price),
            "amount": 1000,
            "price": stock_price,
        }
    
    action_text = "invested in" if swipe.direction == "right" else "passed on"
    
    return {
        "message": f"Successfully {action_text} {swipe.symbol}",
        "swipe": swipe_action,
        "portfolioUpdate": portfolio_update,
    }

# ==================== SOCIAL FEATURES ====================

@app.post("/api/social/follow")
async def follow_user(follow_data: FollowUser, current_user: dict = Depends(get_current_user)):
    follow_key = f"{current_user['userId']}-{follow_data.targetUserId}"
    
    if follow_key in follows:
        raise HTTPException(status_code=409, detail="Already following this user")
    
    follows[follow_key] = {
        "followerId": current_user["userId"],
        "followingId": follow_data.targetUserId,
        "followedAt": get_current_timestamp(),
    }
    
    return {
        "message": "Successfully followed user",
        "isFollowing": True,
    }

@app.post("/api/social/unfollow")
async def unfollow_user(follow_data: FollowUser, current_user: dict = Depends(get_current_user)):
    follow_key = f"{current_user['userId']}-{follow_data.targetUserId}"
    
    if follow_key not in follows:
        raise HTTPException(status_code=404, detail="Not following this user")
    
    del follows[follow_key]
    
    return {
        "message": "Successfully unfollowed user",
        "isFollowing": False,
    }

# ==================== CHAT/AI ENDPOINTS ====================

@app.post("/api/chat")
async def chat(chat_data: ChatMessage):
    session = chat_data.sessionId or generate_id()
    
    if session not in chat_sessions:
        chat_sessions[session] = {
            "id": session,
            "messages": [],
            "createdAt": get_current_timestamp(),
        }
    
    chat_session = chat_sessions[session]
    response = generate_chat_response(chat_data.message)
    
    chat_session["messages"].extend([
        {"role": "user", "content": chat_data.message, "timestamp": get_current_timestamp()},
        {"role": "assistant", "content": response, "timestamp": get_current_timestamp()},
    ])
    
    return {
        "message": "Chat response generated",
        "response": response,
        "sessionId": session,
    }

# ==================== ANALYTICS ENDPOINTS ====================

@app.post("/api/analytics/track")
async def track_analytics(event: AnalyticsEvent):
    analytics_event = {
        "id": generate_id(),
        "event": event.event,
        "properties": event.properties,
        "userId": event.userId or "anonymous",
        "timestamp": get_current_timestamp(),
    }
    
    analytics[analytics_event["id"]] = analytics_event
    
    return {
        "message": "Event tracked successfully",
        "eventId": analytics_event["id"],
    }

# ==================== CONTACT ENDPOINTS ====================

@app.post("/api/contact")
async def send_contact_message(contact: ContactMessage):
    contact_message = {
        "id": generate_id(),
        "name": contact.name,
        "email": contact.email,
        "message": contact.message,
        "status": "new",
        "createdAt": get_current_timestamp(),
    }
    
    contact_messages[contact_message["id"]] = contact_message
    
    return {
        "message": "Message sent successfully",
        "id": contact_message["id"],
    }

# ==================== JOB APPLICATION ENDPOINTS ====================

@app.post("/api/jobs/apply")
async def submit_job_application(application: JobApplication):
    job_application = {
        "id": generate_id(),
        "position": application.position,
        "name": application.name,
        "email": application.email,
        "phone": application.phone,
        "coverLetter": application.coverLetter,
        "resumeUrl": application.resumeUrl,
        "status": "submitted",
        "appliedAt": get_current_timestamp(),
    }
    
    job_applications[job_application["id"]] = job_application
    
    return {
        "message": "Application submitted successfully",
        "applicationId": job_application["id"],
    }

# ==================== GENERAL ENDPOINTS ====================

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": get_current_timestamp(),
        "version": "2.0.0",
        "framework": "FastAPI",
        "python_version": "3.9+",
        "endpoints": {
            "auth": ["/api/auth/register", "/api/auth/login"],
            "waitlist": ["/api/waitlist"],
            "portfolio": ["/api/portfolio/optimize", "/api/portfolio/simulate"],
            "stocks": ["/api/stocks/prices", "/api/stocks/{symbol}", "/api/stocks/swipe"],
            "social": ["/api/social/follow", "/api/social/unfollow"],
            "chat": ["/api/chat"],
            "analytics": ["/api/analytics/track"],
            "contact": ["/api/contact"],
            "jobs": ["/api/jobs/apply"],
        },
    }

@app.get("/api/test")
async def test_endpoint():
    return {
        "message": "API is working",
        "timestamp": get_current_timestamp(),
        "testPassed": True,
        "framework": "FastAPI Python Backend",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
