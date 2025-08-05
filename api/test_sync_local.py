"""
Test sync functionality locally without Google Sheets
"""

import asyncio
import os
from database import (
    get_waitlist_collection,
    get_contact_messages_collection,
    get_job_applications_collection
)

async def test_local_sync():
    """Test that we can read data from MongoDB"""
    print("🔍 Testing Local Data Access...")
    
    try:
        # Test waitlist collection
        print("📊 Testing waitlist collection...")
        waitlist_collection = get_waitlist_collection()
        if waitlist_collection is None:
            print("❌ Waitlist collection not available")
            return False
            
        cursor = waitlist_collection.find({})
        waitlist_data = await cursor.to_list(length=10)  # Just get 10 entries
        print(f"✅ Found {len(waitlist_data)} waitlist entries")
        
        # Test contact messages collection
        print("📊 Testing contact messages collection...")
        contact_collection = get_contact_messages_collection()
        if contact_collection is None:
            print("❌ Contact messages collection not available")
            return False
            
        cursor = contact_collection.find({})
        contact_data = await cursor.to_list(length=10)  # Just get 10 entries
        print(f"✅ Found {len(contact_data)} contact messages")
        
        # Test job applications collection
        print("📊 Testing job applications collection...")
        applications_collection = get_job_applications_collection()
        if applications_collection is None:
            print("❌ Job applications collection not available")
            return False
            
        cursor = applications_collection.find({})
        applications_data = await cursor.to_list(length=10)  # Just get 10 entries
        print(f"✅ Found {len(applications_data)} job applications")
        
        print("🎉 Local data access test successful!")
        print(f"📈 Summary: {len(waitlist_data)} waitlist, {len(contact_data)} contacts, {len(applications_data)} applications")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_local_sync()) 