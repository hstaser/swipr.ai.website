// Production storage system with Supabase database integration
import {
  ApplicationStorage as DbApplicationStorage,
  ContactStorage as DbContactStorage,
  WaitlistStorage as DbWaitlistStorage,
  EmailNotifications as DbEmailNotifications,
  AdminAuth as DbAdminAuth,
  initializeDatabase,
} from "./database.js";

// Initialize database on module load
initializeDatabase();

// In-memory fallback storage (backup if database fails)
let applicationCache = [];
let contactCache = [];
let waitlistCache = [];

// Helper functions
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Hybrid storage system - tries database first, falls back to memory
export const ApplicationStorage = {
  async create(application) {
    try {
      // Try database first
      const dbResult = await DbApplicationStorage.create(application);
      if (dbResult) {
        console.log("✅ Application saved to database");
        return dbResult;
      }

      // Fallback to memory storage
      console.log("⚠️ Database unavailable, using memory storage");
      const newApplication = {
        id: generateId("APP"),
        ...application,
        appliedAt: new Date().toISOString(),
        status: "pending",
        lastUpdated: new Date().toISOString(),
      };

      applicationCache.push(newApplication);
      console.log("📝 Application saved to memory cache");
      return newApplication;
    } catch (error) {
      console.error("❌ Error creating application:", error);
      return null;
    }
  },

  async getAll() {
    try {
      // Try database first
      const dbResults = await DbApplicationStorage.getAll();
      if (dbResults && dbResults.length >= 0) {
        console.log(
          `📊 Fetched ${dbResults.length} applications from database`,
        );
        return dbResults;
      }

      // Fallback to memory storage
      console.log("⚠️ Database unavailable, using memory storage");
      return [...applicationCache].sort(
        (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt),
      );
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      return applicationCache;
    }
  },

  async getById(id) {
    try {
      // Try database first
      const dbResult = await DbApplicationStorage.getById(id);
      if (dbResult) {
        return dbResult;
      }

      // Fallback to memory storage
      return applicationCache.find((app) => app.id === id);
    } catch (error) {
      console.error("❌ Error fetching application by ID:", error);
      return applicationCache.find((app) => app.id === id);
    }
  },

  async updateStatus(id, status, notes = "") {
    try {
      // Try database first
      const dbResult = await DbApplicationStorage.updateStatus(
        id,
        status,
        notes,
      );
      if (dbResult) {
        return dbResult;
      }

      // Fallback to memory storage
      const appIndex = applicationCache.findIndex((app) => app.id === id);
      if (appIndex === -1) return null;

      applicationCache[appIndex].status = status;
      applicationCache[appIndex].lastUpdated = new Date().toISOString();
      if (notes) applicationCache[appIndex].notes = notes;

      return applicationCache[appIndex];
    } catch (error) {
      console.error("❌ Error updating application status:", error);
      return null;
    }
  },

  async getStats() {
    try {
      // Try database first
      const dbStats = await DbApplicationStorage.getStats();
      if (dbStats && dbStats.total >= 0) {
        return dbStats;
      }

      // Fallback to memory storage
      const applications = applicationCache;
      const stats = {
        total: applications.length,
        pending: applications.filter((app) => app.status === "pending").length,
        reviewing: applications.filter((app) => app.status === "reviewing")
          .length,
        interviewing: applications.filter(
          (app) => app.status === "interviewing",
        ).length,
        rejected: applications.filter((app) => app.status === "rejected")
          .length,
        hired: applications.filter((app) => app.status === "hired").length,
        byPosition: {},
      };

      applications.forEach((app) => {
        stats.byPosition[app.position] =
          (stats.byPosition[app.position] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("❌ Error fetching application stats:", error);
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

export const ContactStorage = {
  async create(contact) {
    try {
      // Try database first
      const dbResult = await DbContactStorage.create(contact);
      if (dbResult) {
        console.log("✅ Contact saved to database");
        return dbResult;
      }

      // Fallback to memory storage
      console.log("⚠️ Database unavailable, using memory storage");
      const newContact = {
        id: generateId("CONTACT"),
        ...contact,
        submittedAt: new Date().toISOString(),
        status: "new",
      };

      contactCache.push(newContact);
      console.log("📝 Contact saved to memory cache");
      return newContact;
    } catch (error) {
      console.error("❌ Error creating contact:", error);
      return null;
    }
  },

  async getAll() {
    try {
      // Try database first
      const dbResults = await DbContactStorage.getAll();
      if (dbResults && dbResults.length >= 0) {
        console.log(`📊 Fetched ${dbResults.length} contacts from database`);
        return dbResults;
      }

      // Fallback to memory storage
      console.log("⚠️ Database unavailable, using memory storage");
      return [...contactCache].sort(
        (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
      );
    } catch (error) {
      console.error("❌ Error fetching contacts:", error);
      return contactCache;
    }
  },

  async markAsRead(id) {
    try {
      // Try database first
      const dbResult = await DbContactStorage.markAsRead(id);
      if (dbResult) {
        return dbResult;
      }

      // Fallback to memory storage
      const contactIndex = contactCache.findIndex(
        (contact) => contact.id === id,
      );
      if (contactIndex === -1) return null;

      contactCache[contactIndex].status = "read";
      contactCache[contactIndex].readAt = new Date().toISOString();

      return contactCache[contactIndex];
    } catch (error) {
      console.error("❌ Error marking contact as read:", error);
      return null;
    }
  },
};

export const WaitlistStorage = {
  async create(entry) {
    try {
      // Try database first
      const dbResult = await DbWaitlistStorage.create(entry);
      if (dbResult) {
        console.log("✅ Waitlist entry saved to database");
        return dbResult;
      }

      // Fallback to memory storage
      console.log("⚠️ Database unavailable, using memory storage");

      // Check if email already exists in cache
      const existingEntry = waitlistCache.find(
        (item) => item.email === entry.email,
      );
      if (existingEntry) {
        return { error: "Email already on waitlist", existing: true };
      }

      const newEntry = {
        id: generateId("WAITLIST"),
        ...entry,
        joinedAt: new Date().toISOString(),
      };

      waitlistCache.push(newEntry);
      console.log("📝 Waitlist entry saved to memory cache");
      return newEntry;
    } catch (error) {
      console.error("❌ Error creating waitlist entry:", error);
      return null;
    }
  },

  async getAll() {
    try {
      // Try database first
      const dbResults = await DbWaitlistStorage.getAll();
      if (dbResults && dbResults.length >= 0) {
        console.log(
          `📊 Fetched ${dbResults.length} waitlist entries from database`,
        );
        return dbResults;
      }

      // Fallback to memory storage
      console.log("⚠️ Database unavailable, using memory storage");
      return [...waitlistCache].sort(
        (a, b) => new Date(b.joinedAt) - new Date(a.joinedAt),
      );
    } catch (error) {
      console.error("❌ Error fetching waitlist:", error);
      return waitlistCache;
    }
  },

  async getCount() {
    try {
      // Try database first
      const dbCount = await DbWaitlistStorage.getCount();
      if (typeof dbCount === "number" && dbCount >= 0) {
        return dbCount;
      }

      // Fallback to memory storage
      return waitlistCache.length;
    } catch (error) {
      console.error("❌ Error getting waitlist count:", error);
      return waitlistCache.length;
    }
  },
};

// Email notifications with enhanced logging
export const EmailNotifications = {
  async notifyNewApplication(application) {
    try {
      await DbEmailNotifications.notifyNewApplication(application);
      return true;
    } catch (error) {
      console.error("❌ Email notification error:", error);
      // Fallback logging
      console.log("🚨 NEW JOB APPLICATION RECEIVED");
      console.log("==================================");
      console.log(`👤 Name: ${application.firstName} ${application.lastName}`);
      console.log(`📧 Email: ${application.email}`);
      console.log(`💼 Position: ${application.position}`);
      console.log(`🆔 Application ID: ${application.id}`);
      console.log("==================================");
      return true;
    }
  },

  async notifyNewContact(contact) {
    try {
      await DbEmailNotifications.notifyNewContact(contact);
      return true;
    } catch (error) {
      console.error("❌ Email notification error:", error);
      // Fallback logging
      console.log("💬 NEW CONTACT MESSAGE RECEIVED");
      console.log("===============================");
      console.log(`👤 Name: ${contact.name}`);
      console.log(`📧 Email: ${contact.email}`);
      console.log(`🆔 Contact ID: ${contact.id}`);
      console.log("===============================");
      return true;
    }
  },
};

// Admin authentication
export const AdminAuth = DbAdminAuth;

// Health check function
export async function checkStorageHealth() {
  try {
    const stats = await ApplicationStorage.getStats();
    const contactCount = (await ContactStorage.getAll()).length;
    const waitlistCount = await WaitlistStorage.getCount();

    console.log("📊 Storage Health Check:");
    console.log(`  - Applications: ${stats.total}`);
    console.log(`  - Contacts: ${contactCount}`);
    console.log(`  - Waitlist: ${waitlistCount}`);

    return {
      applications: stats.total,
      contacts: contactCount,
      waitlist: waitlistCount,
      healthy: true,
    };
  } catch (error) {
    console.error("❌ Storage health check failed:", error);
    return {
      applications: 0,
      contacts: 0,
      waitlist: 0,
      healthy: false,
      error: error.message,
    };
  }
}

// Export database schema for admin reference
export { getDatabaseSchema } from "./database.js";
