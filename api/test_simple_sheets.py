"""
Simple Google Sheets API test
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

async def test_simple_sheets():
    """Test basic Google Sheets API access"""
    print("🔐 Testing Basic Google Sheets API Access...")
    
    try:
        # Get service account JSON
        service_account_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
        if not service_account_json:
            print("❌ GOOGLE_SERVICE_ACCOUNT_JSON not found")
            return False
            
        print(f"✅ Found service account JSON ({len(service_account_json)} characters)")
        
        # Parse JSON
        service_account_info = json.loads(service_account_json)
        print(f"✅ JSON parsed successfully")
        print(f"   - Project ID: {service_account_info.get('project_id')}")
        print(f"   - Client Email: {service_account_info.get('client_email')}")
        
        # Create credentials
        creds = Credentials.from_service_account_info(
            service_account_info, 
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        print("✅ Credentials created")
        
        # Build service
        service = build('sheets', 'v4', credentials=creds)
        print("✅ Service built successfully")
        
        # Test with a simple API call (list spreadsheets)
        print("🔐 Testing API access with a simple call...")
        try:
            # Try to list spreadsheets (this should work if API is accessible)
            result = service.spreadsheets().get(
                spreadsheetId='1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'  # Google's sample spreadsheet
            ).execute()
            print(f"✅ Successfully accessed sample spreadsheet: {result.get('properties', {}).get('title', 'Unknown')}")
        except Exception as e:
            print(f"❌ Failed to access sample spreadsheet: {e}")
            print("💡 This might indicate network connectivity issues")
            return False
        
        print("🎉 Basic API test successful!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_simple_sheets()) 