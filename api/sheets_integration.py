"""
Google Sheets integration for swipr.ai
"""

import os
import json
from typing import List, Dict, Any
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from database import (
    get_waitlist_collection,
    get_contact_messages_collection,
    get_job_applications_collection
)

# Google Sheets configuration
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = os.getenv("GOOGLE_SPREADSHEET_ID")

class GoogleSheetsManager:
    def __init__(self):
        self.creds = None
        self.service = None
        self.spreadsheet_id = SPREADSHEET_ID
        
    async def authenticate(self):
        """Authenticate with Google Sheets API"""
        try:
            print("🔐 Attempting Google Sheets authentication...")
            
            # Only use environment variable (no file fallback)
            service_account_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
            if not service_account_json:
                print("❌ GOOGLE_SERVICE_ACCOUNT_JSON environment variable not found")
                print("💡 Set GOOGLE_SERVICE_ACCOUNT_JSON environment variable with your service account JSON")
                return False
                
            print(f"✅ Found service account JSON ({len(service_account_json)} characters)")
            
            try:
                service_account_info = json.loads(service_account_json)
                print(f"✅ JSON parsed successfully")
                print(f"   - Project ID: {service_account_info.get('project_id')}")
                print(f"   - Client Email: {service_account_info.get('client_email')}")
            except json.JSONDecodeError as e:
                print(f"❌ Failed to parse service account JSON: {e}")
                return False
            
            self.creds = Credentials.from_service_account_info(
                service_account_info, scopes=SCOPES
            )
            print("✅ Credentials created successfully")
            
            print("🔐 Building Google Sheets service...")
            self.service = build('sheets', 'v4', credentials=self.creds)
            print("✅ Google Sheets authentication successful")
            return True
        except Exception as e:
            print(f"❌ Google Sheets authentication failed: {e}")
            return False

    async def create_spreadsheet(self, title: str = "Swipr.ai Data"):
        """Create a new Google Spreadsheet"""
        try:
            if not self.service:
                if not await self.authenticate():
                    return None
                
            spreadsheet = {
                'properties': {
                    'title': title
                },
                'sheets': [
                    {
                        'properties': {
                            'title': 'Waitlist',
                            'gridProperties': {
                                'rowCount': 1000,
                                'columnCount': 6
                            }
                        }
                    },
                    {
                        'properties': {
                            'title': 'Contact Messages',
                            'gridProperties': {
                                'rowCount': 1000,
                                'columnCount': 5
                            }
                        }
                    },
                    {
                        'properties': {
                            'title': 'Job Applications',
                            'gridProperties': {
                                'rowCount': 1000,
                                'columnCount': 8
                            }
                        }
                    }
                ]
            }
            
            spreadsheet = self.service.spreadsheets().create(body=spreadsheet).execute()
            self.spreadsheet_id = spreadsheet['spreadsheetId']
            print(f"✅ Created new spreadsheet: {self.spreadsheet_id}")
            
            # Set up headers
            await self.setup_headers()
            
            return self.spreadsheet_id
        except Exception as e:
            print(f"❌ Failed to create spreadsheet: {e}")
            return None

    async def setup_headers(self):
        """Set up headers for all sheets"""
        if not self.spreadsheet_id:
            return
            
        headers = {
            'Waitlist': ['Email', 'Name', 'Interests', 'Position', 'Joined At', 'Status'],
            'Contact Messages': ['Name', 'Email', 'Message', 'Status', 'Created At'],
            'Job Applications': ['Name', 'Email', 'Phone', 'Position', 'Cover Letter', 'Resume URL', 'Status', 'Created At']
        }
        
        for sheet_name, header_row in headers.items():
            range_name = f"{sheet_name}!A1:{chr(65 + len(header_row) - 1)}1"
            body = {
                'values': [header_row]
            }
            try:
                self.service.spreadsheets().values().update(
                    spreadsheetId=self.spreadsheet_id,
                    range=range_name,
                    valueInputOption='RAW',
                    body=body
                ).execute()
            except Exception as e:
                print(f"❌ Failed to set headers for {sheet_name}: {e}")

    async def sync_waitlist(self):
        """Sync waitlist data to Google Sheets"""
        if not self.spreadsheet_id or not self.service:
            print("❌ No spreadsheet ID or service available, attempting authentication...")
            if not await self.authenticate():
                print("❌ Authentication failed")
                return False
            if not self.spreadsheet_id:
                print("❌ No spreadsheet ID available")
                return False
            
        try:
            # Get all waitlist entries from MongoDB
            waitlist_collection = get_waitlist_collection()
            if waitlist_collection is None:
                print("❌ Waitlist collection not available")
                return False
                
            cursor = waitlist_collection.find({})
            waitlist_data = await cursor.to_list(length=1000)  # Limit to 1000 entries to prevent timeout
            
            if not waitlist_data:
                print("ℹ️ No waitlist data to sync")
                return True
                
            # Prepare data for sheets
            values = []
            for entry in waitlist_data:
                values.append([
                    entry.get('email', ''),
                    entry.get('name', ''),
                    ', '.join(entry.get('interests', [])),
                    str(entry.get('position', '')),
                    entry.get('joinedAt', ''),
                    entry.get('status', '')
                ])
            
            # Clear existing data and add new data
            range_name = 'Waitlist!A2:F1000'
            body = {'values': values}
            
            try:
                self.service.spreadsheets().values().update(
                    spreadsheetId=self.spreadsheet_id,
                    range=range_name,
                    valueInputOption='RAW',
                    body=body
                ).execute()
            except HttpError as e:
                print(f"❌ Google Sheets API error: {e}")
                return False
            
            print(f"✅ Synced {len(values)} waitlist entries to Google Sheets")
            return True
        except Exception as e:
            print(f"❌ Failed to sync waitlist: {e}")
            return False

    async def sync_contact_messages(self):
        """Sync contact messages to Google Sheets"""
        if not self.spreadsheet_id or not self.service:
            print("❌ No spreadsheet ID or service available, attempting authentication...")
            if not await self.authenticate():
                print("❌ Authentication failed")
                return False
            if not self.spreadsheet_id:
                print("❌ No spreadsheet ID available")
                return False
            
        try:
            # Get all contact messages from MongoDB
            contact_messages_collection = get_contact_messages_collection()
            if contact_messages_collection is None:
                print("❌ Contact messages collection not available")
                return False
                
            cursor = contact_messages_collection.find({})
            messages_data = await cursor.to_list(length=1000)  # Limit to 1000 entries to prevent timeout
            
            if not messages_data:
                print("ℹ️ No contact messages to sync")
                return True
                
            # Prepare data for sheets
            values = []
            for message in messages_data:
                values.append([
                    message.get('name', ''),
                    message.get('email', ''),
                    message.get('message', ''),
                    message.get('status', ''),
                    message.get('createdAt', '')
                ])
            
            # Clear existing data and add new data
            range_name = 'Contact Messages!A2:E1000'
            body = {'values': values}
            
            try:
                self.service.spreadsheets().values().update(
                    spreadsheetId=self.spreadsheet_id,
                    range=range_name,
                    valueInputOption='RAW',
                    body=body
                ).execute()
            except HttpError as e:
                print(f"❌ Google Sheets API error: {e}")
                return False
            
            print(f"✅ Synced {len(values)} contact messages to Google Sheets")
            return True
        except Exception as e:
            print(f"❌ Failed to sync contact messages: {e}")
            return False

    async def sync_job_applications(self):
        """Sync job applications to Google Sheets"""
        if not self.spreadsheet_id or not self.service:
            print("❌ No spreadsheet ID or service available, attempting authentication...")
            if not await self.authenticate():
                print("❌ Authentication failed")
                return False
            if not self.spreadsheet_id:
                print("❌ No spreadsheet ID available")
                return False
            
        try:
            # Get all job applications from MongoDB
            job_applications_collection = get_job_applications_collection()
            if job_applications_collection is None:
                print("❌ Job applications collection not available")
                return False
                
            cursor = job_applications_collection.find({})
            applications_data = await cursor.to_list(length=1000)  # Limit to 1000 entries to prevent timeout
            
            if not applications_data:
                print("ℹ️ No job applications to sync")
                return True
                
            # Prepare data for sheets
            values = []
            for app in applications_data:
                values.append([
                    app.get('name', ''),
                    app.get('email', ''),
                    app.get('phone', ''),
                    app.get('position', ''),
                    app.get('coverLetter', ''),
                    app.get('resumeUrl', ''),
                    app.get('status', ''),
                    app.get('createdAt', '')
                ])
            
            # Clear existing data and add new data
            range_name = 'Job Applications!A2:H1000'
            body = {'values': values}
            
            try:
                self.service.spreadsheets().values().update(
                    spreadsheetId=self.spreadsheet_id,
                    range=range_name,
                    valueInputOption='RAW',
                    body=body
                ).execute()
            except HttpError as e:
                print(f"❌ Google Sheets API error: {e}")
                return False
            
            print(f"✅ Synced {len(values)} job applications to Google Sheets")
            return True
        except Exception as e:
            print(f"❌ Failed to sync job applications: {e}")
            return False

    async def sync_all_data(self):
        """Sync all data to Google Sheets"""
        print("🔄 Starting Google Sheets sync...")
        
        # Check if we have credentials
        if not self.service:
            print("🔐 No service available, attempting authentication...")
            if not await self.authenticate():
                print("❌ Authentication failed")
                return False
        
        if not self.spreadsheet_id:
            print("📊 No spreadsheet ID, attempting to create new spreadsheet...")
            # Try to create a new spreadsheet
            await self.create_spreadsheet()
            
        if not self.spreadsheet_id:
            print("❌ No spreadsheet ID available")
            return False
            
        print(f"📊 Using spreadsheet ID: {self.spreadsheet_id}")
        
        success = True
        print("🔄 Syncing waitlist...")
        success &= await self.sync_waitlist()
        print("🔄 Syncing contact messages...")
        success &= await self.sync_contact_messages()
        print("🔄 Syncing job applications...")
        success &= await self.sync_job_applications()
        
        if success:
            print("✅ All data synced to Google Sheets successfully")
        else:
            print("⚠️ Some data sync operations failed")
            
        return success

# Global instance
sheets_manager = GoogleSheetsManager() 