"""
Database models and connection for swipr.ai
"""

import os
from datetime import datetime
from typing import Optional, List, Any
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from bson import ObjectId

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "swipr_ai")

print(f"🔗 Using MongoDB URL: {MONGODB_URL}")

# Database client - lazy initialization
_client = None
_db = None

def get_client():
    """Get MongoDB client with lazy initialization"""
    global _client
    if _client is None:
        try:
            _client = AsyncIOMotorClient(MONGODB_URL)
        except Exception as e:
            print(f"⚠️ MongoDB connection failed: {e}")
            return None
    return _client

def get_db():
    """Get database with lazy initialization"""
    global _db
    if _db is None:
        client = get_client()
        if client is not None:
            _db = client[DATABASE_NAME]
    return _db

# Collections - lazy initialization
def get_collection(collection_name):
    """Get collection with lazy initialization"""
    db = get_db()
    if db is not None:
        return db[collection_name]
    return None

# Collection getters
def get_users_collection():
    return get_collection("users")

def get_waitlist_collection():
    return get_collection("waitlist")

def get_contact_messages_collection():
    return get_collection("contact_messages")

def get_job_applications_collection():
    return get_collection("job_applications")

def get_analytics_collection():
    return get_collection("analytics")

def get_portfolios_collection():
    return get_collection("portfolios")

def get_follows_collection():
    return get_collection("follows")

def get_chat_sessions_collection():
    return get_collection("chat_sessions")

# Pydantic models for database documents
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema: dict, field: Any) -> None:
        field_schema.update(type="string")

class UserModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    name: str
    password: str
    createdAt: str
    verified: bool = False
    profile: dict = Field(default_factory=dict)

class WaitlistModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    name: str
    interests: List[str] = []
    position: int
    joinedAt: str
    referrals: int = 0
    status: str = "active"

class ContactMessageModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: EmailStr
    message: str
    status: str = "new"
    createdAt: str

class JobApplicationModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    position: str
    name: str
    email: EmailStr
    phone: str
    coverLetter: str
    resumeUrl: Optional[str] = ""
    status: str = "new"
    createdAt: str

class AnalyticsModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    eventType: str
    page: str
    sessionId: str
    timestamp: str
    userAgent: str
    location: str
    element: Optional[str] = None
    value: Optional[str] = None
    referrer: Optional[str] = None

# Database utility functions
async def get_collection_count(collection):
    """Get the count of documents in a collection"""
    if collection is None:
        return 0
    return await collection.count_documents({})

async def create_indexes():
    """Create indexes for better performance"""
    try:
        # Users collection
        users_collection = get_users_collection()
        if users_collection is not None:
            await users_collection.create_index("email", unique=True)
        
        # Waitlist collection
        waitlist_collection = get_waitlist_collection()
        if waitlist_collection is not None:
            await waitlist_collection.create_index("email", unique=True)
        
        # Contact messages collection
        contact_messages_collection = get_contact_messages_collection()
        if contact_messages_collection is not None:
            await contact_messages_collection.create_index("email")
            await contact_messages_collection.create_index("createdAt")
        
        # Job applications collection
        job_applications_collection = get_job_applications_collection()
        if job_applications_collection is not None:
            await job_applications_collection.create_index("email")
            await job_applications_collection.create_index("position")
            await job_applications_collection.create_index("createdAt")
        
        # Analytics collection
        analytics_collection = get_analytics_collection()
        if analytics_collection is not None:
            await analytics_collection.create_index("timestamp")
            await analytics_collection.create_index("eventType")
    except Exception as e:
        print(f"❌ Error creating database indexes: {e}")
        raise

async def init_database():
    """Initialize database with indexes"""
    try:
        # Test connection first
        client = get_client()
        if client is None:
            raise Exception("MongoDB connection failed")
        
        # Test database access
        db = get_db()
        if db is None:
            raise Exception("Database access failed")
        
        await create_indexes()
        print("✅ Database indexes created successfully")
    except Exception as e:
        print(f"❌ Error creating database indexes: {e}")
        raise 