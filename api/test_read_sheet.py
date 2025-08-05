"""
Test reading from Google Sheet to verify connectivity
"""

import asyncio
import os
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

async def test_read_sheet():
    """Test reading from Google Sheet"""
    print("📖 Testing Google Sheet Read Access...")
    
    try:
        # Get service account JSON
        service_account_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
        if not service_account_json:
            print("❌ GOOGLE_SERVICE_ACCOUNT_JSON not found")
            return False
            
        # Parse JSON
        service_account_info = json.loads(service_account_json)
        
        # Create credentials
        creds = Credentials.from_service_account_info(
            service_account_info, 
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        
        # Build service
        service = build('sheets', 'v4', credentials=creds)
        
        # Get spreadsheet ID
        spreadsheet_id = os.getenv("GOOGLE_SPREADSHEET_ID")
        if not spreadsheet_id:
            print("❌ GOOGLE_SPREADSHEET_ID not found")
            return False
        
        print(f"📊 Attempting to read from spreadsheet: {spreadsheet_id}")
        
        # Try to read just the first few cells
        try:
            result = service.spreadsheets().values().get(
                spreadsheetId=spreadsheet_id,
                range='A1:D5'  # Just read first 5 rows, 4 columns
            ).execute()
            
            values = result.get('values', [])
            print(f"✅ Successfully read {len(values)} rows from spreadsheet")
            
            if values:
                print("📋 First few rows:")
                for i, row in enumerate(values[:3]):  # Show first 3 rows
                    print(f"   Row {i+1}: {row}")
            else:
                print("📋 Spreadsheet appears to be empty")
                
            return True
            
        except Exception as e:
            print(f"❌ Failed to read from spreadsheet: {e}")
            return False
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    import json
    asyncio.run(test_read_sheet()) 