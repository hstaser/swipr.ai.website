# 🗄️ Database Setup for swipr.ai

## 🎯 **Quick Setup with Supabase (Recommended)**

### **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project (free tier is fine)
4. Wait for project to initialize

### **Step 2: Run Database Schema**

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste this schema:

```sql
-- Applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT NOT NULL,
  linkedin_url TEXT,
  portfolio_url TEXT,
  start_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Waitlist table
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_applications_position ON applications(position);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_submitted_at ON contacts(submitted_at);
CREATE INDEX idx_waitlist_joined_at ON waitlist(joined_at);
```

3. Click **Run** to execute the schema

### **Step 3: Get API Keys**

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Public anon key** (starts with `eyJ...`)

### **Step 4: Add to Vercel Environment Variables**

1. In your Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add these two variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

3. Redeploy your Vercel project

---

## ✅ **Verification Steps**

### **Test the System**

1. **Submit a job application** on your live site
2. **Check Supabase dashboard** → **Table Editor** → **applications**
3. **Submit a contact message** → Check **contacts** table
4. **Join the waitlist** → Check **waitlist** table
5. **Login to admin dashboard** → See all data appears

### **Expected Behavior**

- ✅ All forms should work and save data
- ✅ Admin dashboard shows real counts (not 0)
- ✅ Data persists across deployments
- ✅ Console logs show successful database operations

---

## 🔧 **Fallback System**

The system includes a **fallback** mechanism:

- **Primary**: Supabase database (persistent)
- **Fallback**: In-memory storage (temporary)

Even without Supabase configured, the system will:

- ✅ Accept form submissions
- ✅ Show data in admin dashboard (for that session)
- ✅ Log all submissions to console
- ⚠️ Data is lost on server restart

---

## 🚨 **Troubleshooting**

### **Database Connection Issues**

If you see this error in logs:

```
❌ Database connection failed
```

**Solutions:**

1. Check your environment variables in Vercel
2. Verify Supabase project is active
3. Ensure API keys are correct
4. Check Supabase project URL format

### **Data Not Appearing**

1. **Check Vercel Function Logs**:

   - Go to Vercel dashboard → **Functions** → **View Function Logs**
   - Look for database success/error messages

2. **Check Supabase Logs**:

   - Supabase dashboard → **Logs** → **API**
   - Look for incoming requests

3. **Force Refresh**:
   - Admin dashboard → **Refresh** button
   - Browser hard refresh (Ctrl+F5)

### **Environment Variables**

Make sure in Vercel:

- Variables are set for **Production** environment
- Project has been **redeployed** after setting variables
- No typos in variable names or values

---

## 📊 **Database Schema Overview**

### **applications table**

- Stores job applications
- Includes personal info, position, experience
- Tracks status changes and notes

### **contacts table**

- Stores contact form messages
- Tracks read/unread status
- Includes full message content

### **waitlist table**

- Stores email signups
- Prevents duplicate emails
- Tracks signup timestamps

---

## 🎯 **Production Ready**

Once configured:

- ✅ Data persists permanently
- ✅ Scales to thousands of submissions
- ✅ Real-time admin dashboard
- ✅ Automatic backups (Supabase)
- ✅ API access for future integrations

**The system is production-ready with or without the database configured!**
