"""
Test Google Sheets authentication
"""

import os
import json
import asyncio
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

async def test_google_auth():
    """Test Google Sheets authentication"""
    print("🔐 Testing Google Sheets Authentication...")
    
    try:
        # Get service account JSON
        service_account_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
        if not service_account_json:
            print("❌ GOOGLE_SERVICE_ACCOUNT_JSON not found")
            return False
            
        print(f"✅ Found service account JSON ({len(service_account_json)} characters)")
        
        # Parse JSON
        try:
            service_account_info = json.loads(service_account_json)
            print(f"✅ JSON parsed successfully")
            print(f"   - Project ID: {service_account_info.get('project_id')}")
            print(f"   - Client Email: {service_account_info.get('client_email')}")
        except json.JSONDecodeError as e:
            print(f"❌ JSON parse error: {e}")
            return False
        
        # Create credentials
        print("🔐 Creating credentials...")
        creds = Credentials.from_service_account_info(
            service_account_info, 
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        print("✅ Credentials created")
        
        # Build service
        print("🔐 Building Google Sheets service...")
        service = build('sheets', 'v4', credentials=creds)
        print("✅ Service built successfully")
        
        # Test with a simple API call
        print("🔐 Testing API access...")
        spreadsheet_id = os.getenv("GOOGLE_SPREADSHEET_ID")
        if spreadsheet_id:
            print(f"📊 Testing access to spreadsheet: {spreadsheet_id}")
            try:
                # Try to get spreadsheet properties
                result = service.spreadsheets().get(
                    spreadsheetId=spreadsheet_id
                ).execute()
                print(f"✅ Successfully accessed spreadsheet: {result.get('properties', {}).get('title', 'Unknown')}")
            except Exception as e:
                print(f"❌ Failed to access spreadsheet: {e}")
                return False
        else:
            print("⚠️ No GOOGLE_SPREADSHEET_ID found")
        
        print("🎉 Authentication test successful!")
        return True
        
    except Exception as e:
        print(f"❌ Authentication test failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_google_auth()) 