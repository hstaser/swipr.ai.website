import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl =
  process.env.SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "your-anon-key";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema helper functions
export const DatabaseTables = {
  APPLICATIONS: "applications",
  CONTACTS: "contacts",
  WAITLIST: "waitlist",
};

// Application storage functions
export const ApplicationStorage = {
  async create(application) {
    try {
      const applicationData = {
        first_name: application.firstName,
        last_name: application.lastName,
        email: application.email,
        phone: application.phone,
        position: application.position,
        experience: application.experience,
        linkedin_url: application.linkedinUrl || null,
        portfolio_url: application.portfolioUrl || null,
        start_date: application.startDate,
        status: "pending",
        applied_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(DatabaseTables.APPLICATIONS)
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        console.error("Database error creating application:", error);
        return null;
      }

      // Convert back to frontend format
      const result = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        experience: data.experience,
        linkedinUrl: data.linkedin_url,
        portfolioUrl: data.portfolio_url,
        startDate: data.start_date,
        status: data.status,
        appliedAt: data.applied_at,
        lastUpdated: data.last_updated,
        notes: data.notes,
      };

      console.log("✅ Application saved to database:", result.id);
      return result;
    } catch (error) {
      console.error("Error creating application:", error);
      return null;
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from(DatabaseTables.APPLICATIONS)
        .select("*")
        .order("applied_at", { ascending: false });

      if (error) {
        console.error("Database error fetching applications:", error);
        return [];
      }

      // Convert to frontend format
      return data.map((app) => ({
        id: app.id,
        firstName: app.first_name,
        lastName: app.last_name,
        email: app.email,
        phone: app.phone,
        position: app.position,
        experience: app.experience,
        linkedinUrl: app.linkedin_url,
        portfolioUrl: app.portfolio_url,
        startDate: app.start_date,
        status: app.status,
        appliedAt: app.applied_at,
        lastUpdated: app.last_updated,
        notes: app.notes,
      }));
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(DatabaseTables.APPLICATIONS)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Database error fetching application:", error);
        return null;
      }

      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        experience: data.experience,
        linkedinUrl: data.linkedin_url,
        portfolioUrl: data.portfolio_url,
        startDate: data.start_date,
        status: data.status,
        appliedAt: data.applied_at,
        lastUpdated: data.last_updated,
        notes: data.notes,
      };
    } catch (error) {
      console.error("Error fetching application by ID:", error);
      return null;
    }
  },

  async updateStatus(id, status, notes = "") {
    try {
      const { data, error } = await supabase
        .from(DatabaseTables.APPLICATIONS)
        .update({
          status,
          notes,
          last_updated: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Database error updating application:", error);
        return null;
      }

      console.log(`✅ Application ${id} status updated to: ${status}`);
      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        experience: data.experience,
        linkedinUrl: data.linkedin_url,
        portfolioUrl: data.portfolio_url,
        startDate: data.start_date,
        status: data.status,
        appliedAt: data.applied_at,
        lastUpdated: data.last_updated,
        notes: data.notes,
      };
    } catch (error) {
      console.error("Error updating application status:", error);
      return null;
    }
  },

  async getStats() {
    try {
      const { data, error } = await supabase
        .from(DatabaseTables.APPLICATIONS)
        .select("status, position");

      if (error) {
        console.error("Database error fetching stats:", error);
        return {
          total: 0,
          pending: 0,
          reviewing: 0,
          interviewing: 0,
          rejected: 0,
          hired: 0,
          byPosition: {},
        };
      }

      const stats = {
        total: data.length,
        pending: data.filter((app) => app.status === "pending").length,
        reviewing: data.filter((app) => app.status === "reviewing").length,
        interviewing: data.filter((app) => app.status === "interviewing")
          .length,
        rejected: data.filter((app) => app.status === "rejected").length,
        hired: data.filter((app) => app.status === "hired").length,
        byPosition: {},
      };

      // Count by position
      data.forEach((app) => {
        stats.byPosition[app.position] =
          (stats.byPosition[app.position] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Error fetching application stats:", error);
      return {
        total: 0,
        pending: 0,
        reviewing: 0,
        interviewing: 0,
        rejected: 0,
        hired: 0,
        byPosition: {},
      };
    }
  },
};

// Contact storage functions
export const ContactStorage = {
  async create(contact) {
    try {
      const contactData = {
        name: contact.name,
        email: contact.email,
        message: contact.message,
        status: "new",
        submitted_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(DatabaseTables.CONTACTS)
        .insert([contactData])
        .select()
        .single();

      if (error) {
        console.error("Database error creating contact:", error);
        return null;
      }

      const result = {
        id: data.id,
        name: data.name,
        email: data.email,
        message: data.message,
        status: data.status,
        submittedAt: data.submitted_at,
        readAt: data.read_at,
      };

      console.log("✅ Contact saved to database:", result.id);
      return result;
    } catch (error) {
      console.error("Error creating contact:", error);
      return null;
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from(DatabaseTables.CONTACTS)
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Database error fetching contacts:", error);
        return [];
      }

      return data.map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        status: contact.status,
        submittedAt: contact.submitted_at,
        readAt: contact.read_at,
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  },

  async markAsRead(id) {
    try {
      const { data, error } = await supabase
        .from(DatabaseTables.CONTACTS)
        .update({
          status: "read",
          read_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Database error marking contact as read:", error);
        return null;
      }

      console.log(`✅ Contact ${id} marked as read`);
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        message: data.message,
        status: data.status,
        submittedAt: data.submitted_at,
        readAt: data.read_at,
      };
    } catch (error) {
      console.error("Error marking contact as read:", error);
      return null;
    }
  },
};

// Waitlist storage functions
export const WaitlistStorage = {
  async create(entry) {
    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from(DatabaseTables.WAITLIST)
        .select("email")
        .eq("email", entry.email.toLowerCase())
        .single();

      if (existing) {
        return { error: "Email already on waitlist", existing: true };
      }

      const waitlistData = {
        email: entry.email.toLowerCase(),
        name: entry.name || null,
        joined_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(DatabaseTables.WAITLIST)
        .insert([waitlistData])
        .select()
        .single();

      if (error) {
        console.error("Database error creating waitlist entry:", error);
        return null;
      }

      const result = {
        id: data.id,
        email: data.email,
        name: data.name,
        joinedAt: data.joined_at,
      };

      console.log("✅ Waitlist entry saved to database:", result.id);
      return result;
    } catch (error) {
      console.error("Error creating waitlist entry:", error);
      return null;
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from(DatabaseTables.WAITLIST)
        .select("*")
        .order("joined_at", { ascending: false });

      if (error) {
        console.error("Database error fetching waitlist:", error);
        return [];
      }

      return data.map((entry) => ({
        id: entry.id,
        email: entry.email,
        name: entry.name,
        joinedAt: entry.joined_at,
      }));
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      return [];
    }
  },

  async getCount() {
    try {
      const { count, error } = await supabase
        .from(DatabaseTables.WAITLIST)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Database error getting waitlist count:", error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error("Error getting waitlist count:", error);
      return 0;
    }
  },
};

// Email notification helper
export const EmailNotifications = {
  async notifyNewApplication(application) {
    console.log("🚨 NEW JOB APPLICATION RECEIVED");
    console.log("==================================");
    console.log(`👤 Name: ${application.firstName} ${application.lastName}`);
    console.log(`📧 Email: ${application.email}`);
    console.log(`📞 Phone: ${application.phone}`);
    console.log(`💼 Position: ${application.position}`);
    console.log(`🎯 Experience: ${application.experience}`);
    console.log(`📅 Start Date: ${application.startDate}`);
    console.log(`🆔 Application ID: ${application.id}`);
    if (application.linkedinUrl)
      console.log(`🔗 LinkedIn: ${application.linkedinUrl}`);
    if (application.portfolioUrl)
      console.log(`🌐 Portfolio: ${application.portfolioUrl}`);
    console.log(`⏰ Applied At: ${application.appliedAt}`);
    console.log("==================================");

    return true;
  },

  async notifyNewContact(contact) {
    console.log("💬 NEW CONTACT MESSAGE RECEIVED");
    console.log("===============================");
    console.log(`👤 Name: ${contact.name}`);
    console.log(`📧 Email: ${contact.email}`);
    console.log(`💬 Message: ${contact.message}`);
    console.log(`🆔 Contact ID: ${contact.id}`);
    console.log(`⏰ Submitted At: ${contact.submittedAt}`);
    console.log("===============================");

    return true;
  },
};

// Admin authentication helper
export const AdminAuth = {
  validateToken(token) {
    const validTokens = [
      "admin-swipr-2025",
      "henry-admin-token",
      process.env.ADMIN_TOKEN || "admin-token",
    ];
    return validTokens.includes(token);
  },

  requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token || !AdminAuth.validateToken(token)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Admin authentication required.",
      });
    }

    return next ? next() : true;
  },
};

// Database initialization
export async function initializeDatabase() {
  try {
    console.log("🔧 Initializing database connection...");

    // Test connection
    const { data, error } = await supabase
      .from(DatabaseTables.APPLICATIONS)
      .select("count")
      .limit(1);

    if (error) {
      console.error("❌ Database connection failed:", error.message);
      console.log(
        "📝 Please set up your Supabase database with the following SQL:",
      );
      console.log(getDatabaseSchema());
    } else {
      console.log("✅ Database connection successful");
    }
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
}

// Database schema for setup
export function getDatabaseSchema() {
  return `
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
`;
}
