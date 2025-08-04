"""
Test script to verify database connection and basic operations
"""

import asyncio
import os
from database import (
    get_users_collection, get_waitlist_collection, 
    get_contact_messages_collection, get_job_applications_collection,
    init_database
)

async def test_database():
    """Test database connection and basic operations"""
    print("🧪 Testing database connection...")
    
    # Debug: Show connection string (masked)
    mongo_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    if "mongodb+srv://" in mongo_url:
        # Mask the password for security
        parts = mongo_url.split("@")
        if len(parts) == 2:
            user_pass = parts[0].replace("mongodb+srv://", "")
            if ":" in user_pass:
                username = user_pass.split(":")[0]
                masked_url = f"mongodb+srv://{username}:***@{parts[1]}"
                print(f"🔗 Using connection string: {masked_url}")
            else:
                print(f"🔗 Using connection string: {mongo_url}")
        else:
            print(f"🔗 Using connection string: {mongo_url}")
    else:
        print(f"🔗 Using connection string: {mongo_url}")
    
    try:
        # Test database initialization
        await init_database()
        print("✅ Database initialization successful")
        
        # Test collection access
        users_collection = get_users_collection()
        waitlist_collection = get_waitlist_collection()
        contact_collection = get_contact_messages_collection()
        applications_collection = get_job_applications_collection()
        
        collections = [users_collection, waitlist_collection, contact_collection, applications_collection]
        if all(col is not None for col in collections):
            print("✅ All collections accessible")
        else:
            print("❌ Some collections not accessible")
            return False
        
        # Test basic operations
        print("🧪 Testing basic operations...")
        
        # Test waitlist collection
        count = await waitlist_collection.count_documents({})
        print(f"✅ Waitlist collection: {count} documents")
        
        # Test contact messages collection
        count = await contact_collection.count_documents({})
        print(f"✅ Contact messages collection: {count} documents")
        
        # Test job applications collection
        count = await applications_collection.count_documents({})
        print(f"✅ Job applications collection: {count} documents")
        
        # Test users collection
        count = await users_collection.count_documents({})
        print(f"✅ Users collection: {count} documents")
        
        print("🎉 All database tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_database()) 