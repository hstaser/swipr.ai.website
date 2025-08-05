"""
Simple Google Sheets sync test with minimal data
"""

import asyncio
import os
from sheets_integration import sheets_manager

async def test_simple_sync():
    """Test syncing minimal data to Google Sheets"""
    print("🧪 Testing Simple Google Sheets Sync...")
    
    try:
        # Test authentication first
        print("🔐 Testing authentication...")
        if not await sheets_manager.authenticate():
            print("❌ Authentication failed")
            return False
        
        print("✅ Authentication successful")
        
        # Check if we have a spreadsheet ID
        if not sheets_manager.spreadsheet_id:
            print("❌ No spreadsheet ID found")
            print("💡 Make sure GOOGLE_SPREADSHEET_ID is set in your .env file")
            return False
        
        print(f"📊 Using spreadsheet: {sheets_manager.spreadsheet_id}")
        
        # Try to sync just waitlist data
        print("🔄 Testing waitlist sync...")
        success = await sheets_manager.sync_waitlist()
        
        if success:
            print("🎉 Waitlist sync successful!")
            print("📈 Check your Google Sheet - you should see the data!")
        else:
            print("❌ Waitlist sync failed")
            
        return success
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_simple_sync()) 