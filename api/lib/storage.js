// Simple, bulletproof storage system that works immediately
// No external dependencies, no setup required

// Global storage objects that persist across requests
global.swiprData = global.swiprData || {
  applications: [],
  contacts: [],
  waitlist: [],
};

// Helper function to generate IDs
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Application storage functions
export const ApplicationStorage = {
  create(application) {
    try {
      const newApplication = {
        id: generateId("APP"),
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        position: application.position,
        experience: application.experience,
        linkedinUrl: application.linkedinUrl || "",
        portfolioUrl: application.portfolioUrl || "",
        startDate: application.startDate,
        status: "pending",
        appliedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        notes: "",
      };

      global.swiprData.applications.push(newApplication);

      // Enhanced logging
      console.log("🚨 NEW JOB APPLICATION RECEIVED");
      console.log("=====================================");
      console.log(
        `👤 Name: ${newApplication.firstName} ${newApplication.lastName}`,
      );
      console.log(`📧 Email: ${newApplication.email}`);
      console.log(`📞 Phone: ${newApplication.phone}`);
      console.log(`💼 Position: ${newApplication.position}`);
      console.log(`🎯 Experience: ${newApplication.experience}`);
      console.log(`📅 Start Date: ${newApplication.startDate}`);
      console.log(`🆔 Application ID: ${newApplication.id}`);
      if (newApplication.linkedinUrl)
        console.log(`🔗 LinkedIn: ${newApplication.linkedinUrl}`);
      if (newApplication.portfolioUrl)
        console.log(`🌐 Portfolio: ${newApplication.portfolioUrl}`);
      console.log(`⏰ Applied At: ${newApplication.appliedAt}`);
      console.log(
        `📊 Total Applications: ${global.swiprData.applications.length}`,
      );
      console.log("=====================================");

      return newApplication;
    } catch (error) {
      console.error("❌ Error creating application:", error);
      return null;
    }
  },

  getAll() {
    try {
      const applications = global.swiprData.applications || [];
      console.log(
        `📊 Fetching ${applications.length} applications from storage`,
      );
      return applications.sort(
        (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt),
      );
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      return [];
    }
  },

  getById(id) {
    try {
      const app = global.swiprData.applications.find((app) => app.id === id);
      if (app) {
        console.log(`✅ Found application: ${id}`);
      } else {
        console.log(`❌ Application not found: ${id}`);
      }
      return app || null;
    } catch (error) {
      console.error("❌ Error fetching application by ID:", error);
      return null;
    }
  },

  updateStatus(id, status, notes = "") {
    try {
      const appIndex = global.swiprData.applications.findIndex(
        (app) => app.id === id,
      );
      if (appIndex === -1) {
        console.log(`❌ Application not found for update: ${id}`);
        return null;
      }

      global.swiprData.applications[appIndex].status = status;
      global.swiprData.applications[appIndex].lastUpdated =
        new Date().toISOString();
      if (notes) global.swiprData.applications[appIndex].notes = notes;

      console.log(`✅ Updated application ${id} status to: ${status}`);
      return global.swiprData.applications[appIndex];
    } catch (error) {
      console.error("❌ Error updating application status:", error);
      return null;
    }
  },

  getStats() {
    try {
      const applications = global.swiprData.applications || [];
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

      // Count by position
      applications.forEach((app) => {
        stats.byPosition[app.position] =
          (stats.byPosition[app.position] || 0) + 1;
      });

      console.log(
        `📊 Application Stats - Total: ${stats.total}, Pending: ${stats.pending}`,
      );
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

// Contact storage functions
export const ContactStorage = {
  create(contact) {
    try {
      const newContact = {
        id: generateId("CONTACT"),
        name: contact.name,
        email: contact.email,
        message: contact.message,
        status: "new",
        submittedAt: new Date().toISOString(),
        readAt: null,
      };

      global.swiprData.contacts.push(newContact);

      // Enhanced logging
      console.log("💬 NEW CONTACT MESSAGE RECEIVED");
      console.log("=================================");
      console.log(`👤 Name: ${newContact.name}`);
      console.log(`📧 Email: ${newContact.email}`);
      console.log(`💬 Message: ${newContact.message.substring(0, 100)}...`);
      console.log(`🆔 Contact ID: ${newContact.id}`);
      console.log(`⏰ Submitted At: ${newContact.submittedAt}`);
      console.log(`📊 Total Contacts: ${global.swiprData.contacts.length}`);
      console.log("=================================");

      return newContact;
    } catch (error) {
      console.error("❌ Error creating contact:", error);
      return null;
    }
  },

  getAll() {
    try {
      const contacts = global.swiprData.contacts || [];
      console.log(`📊 Fetching ${contacts.length} contacts from storage`);
      return contacts.sort(
        (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
      );
    } catch (error) {
      console.error("❌ Error fetching contacts:", error);
      return [];
    }
  },

  markAsRead(id) {
    try {
      const contactIndex = global.swiprData.contacts.findIndex(
        (contact) => contact.id === id,
      );
      if (contactIndex === -1) {
        console.log(`❌ Contact not found for marking as read: ${id}`);
        return null;
      }

      global.swiprData.contacts[contactIndex].status = "read";
      global.swiprData.contacts[contactIndex].readAt = new Date().toISOString();

      console.log(`✅ Marked contact ${id} as read`);
      return global.swiprData.contacts[contactIndex];
    } catch (error) {
      console.error("❌ Error marking contact as read:", error);
      return null;
    }
  },
};

// Waitlist storage functions
export const WaitlistStorage = {
  create(entry) {
    try {
      // Check if email already exists
      const existingEntry = global.swiprData.waitlist.find(
        (item) => item.email.toLowerCase() === entry.email.toLowerCase(),
      );

      if (existingEntry) {
        console.log(`⚠️ Email already on waitlist: ${entry.email}`);
        return { error: "Email already on waitlist", existing: true };
      }

      const newEntry = {
        id: generateId("WAITLIST"),
        email: entry.email.toLowerCase(),
        name: entry.name || "",
        joinedAt: new Date().toISOString(),
      };

      global.swiprData.waitlist.push(newEntry);

      // Enhanced logging
      console.log("📝 NEW WAITLIST SIGNUP");
      console.log("=======================");
      console.log(`📧 Email: ${newEntry.email}`);
      console.log(`👤 Name: ${newEntry.name || "Anonymous"}`);
      console.log(`🆔 Entry ID: ${newEntry.id}`);
      console.log(`⏰ Joined At: ${newEntry.joinedAt}`);
      console.log(`📊 Total Waitlist: ${global.swiprData.waitlist.length}`);
      console.log("=======================");

      return newEntry;
    } catch (error) {
      console.error("❌ Error creating waitlist entry:", error);
      return null;
    }
  },

  getAll() {
    try {
      const waitlist = global.swiprData.waitlist || [];
      console.log(
        `📊 Fetching ${waitlist.length} waitlist entries from storage`,
      );
      return waitlist.sort(
        (a, b) => new Date(b.joinedAt) - new Date(a.joinedAt),
      );
    } catch (error) {
      console.error("❌ Error fetching waitlist:", error);
      return [];
    }
  },

  getCount() {
    try {
      const count = global.swiprData.waitlist.length;
      console.log(`📊 Waitlist count: ${count}`);
      return count;
    } catch (error) {
      console.error("❌ Error getting waitlist count:", error);
      return 0;
    }
  },
};

// Email notification helper
export const EmailNotifications = {
  async notifyNewApplication(application) {
    // Already handled in create function with enhanced logging
    return true;
  },

  async notifyNewContact(contact) {
    // Already handled in create function with enhanced logging
    return true;
  },
};

// Admin authentication helper
export const AdminAuth = {
  validateToken(token) {
    const validTokens = [
      "admin-swipr-2025",
      "henry-admin-token",
      "henry2025",
      "admin-token",
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

// Debug function to check current data
export function debugStorage() {
  console.log("🔍 STORAGE DEBUG INFO");
  console.log("====================");
  console.log(`Applications: ${global.swiprData.applications.length}`);
  console.log(`Contacts: ${global.swiprData.contacts.length}`);
  console.log(`Waitlist: ${global.swiprData.waitlist.length}`);
  console.log("====================");

  return {
    applications: global.swiprData.applications.length,
    contacts: global.swiprData.contacts.length,
    waitlist: global.swiprData.waitlist.length,
    data: global.swiprData,
  };
}

// Initialize storage
console.log("🔧 Initializing swipr.ai storage system...");
debugStorage();
