import fs from "fs";
import path from "path";

// Use a persistent storage approach for serverless
// In production, this would be replaced with a database
// For now, we'll use a combination of environment variables and simple data aggregation

// Simple in-memory storage that aggregates across requests
let applicationCache = [];
let contactCache = [];
let waitlistCache = [];

// Helper function to get unique ID
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Application storage functions
export const ApplicationStorage = {
  create(application) {
    const newApplication = {
      id: generateId("APP"),
      ...application,
      appliedAt: new Date().toISOString(),
      status: "pending",
      lastUpdated: new Date().toISOString(),
    };

    // Add to cache
    applicationCache.push(newApplication);

    // Also log to console for admin visibility
    console.log("🟢 NEW APPLICATION:", {
      id: newApplication.id,
      name: `${newApplication.firstName} ${newApplication.lastName}`,
      email: newApplication.email,
      position: newApplication.position,
      timestamp: newApplication.appliedAt,
    });

    return newApplication;
  },

  getAll() {
    return [...applicationCache].sort(
      (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt),
    );
  },

  getById(id) {
    return applicationCache.find((app) => app.id === id);
  },

  updateStatus(id, status, notes = "") {
    const appIndex = applicationCache.findIndex((app) => app.id === id);
    if (appIndex === -1) return null;

    applicationCache[appIndex].status = status;
    applicationCache[appIndex].lastUpdated = new Date().toISOString();
    if (notes) applicationCache[appIndex].notes = notes;

    console.log("🔄 APPLICATION STATUS UPDATE:", {
      id,
      status,
      notes,
    });

    return applicationCache[appIndex];
  },

  getStats() {
    const applications = applicationCache;
    const stats = {
      total: applications.length,
      pending: applications.filter((app) => app.status === "pending").length,
      reviewing: applications.filter((app) => app.status === "reviewing")
        .length,
      interviewing: applications.filter((app) => app.status === "interviewing")
        .length,
      rejected: applications.filter((app) => app.status === "rejected").length,
      hired: applications.filter((app) => app.status === "hired").length,
      byPosition: {},
    };

    // Count by position
    applications.forEach((app) => {
      stats.byPosition[app.position] =
        (stats.byPosition[app.position] || 0) + 1;
    });

    return stats;
  },
};

// Contact storage functions
export const ContactStorage = {
  create(contact) {
    const newContact = {
      id: generateId("CONTACT"),
      ...contact,
      submittedAt: new Date().toISOString(),
      status: "new",
    };

    contactCache.push(newContact);

    console.log("📩 NEW CONTACT MESSAGE:", {
      id: newContact.id,
      name: newContact.name,
      email: newContact.email,
      message: newContact.message.substring(0, 100) + "...",
      timestamp: newContact.submittedAt,
    });

    return newContact;
  },

  getAll() {
    return [...contactCache].sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
    );
  },

  markAsRead(id) {
    const contactIndex = contactCache.findIndex((contact) => contact.id === id);
    if (contactIndex === -1) return null;

    contactCache[contactIndex].status = "read";
    contactCache[contactIndex].readAt = new Date().toISOString();

    return contactCache[contactIndex];
  },
};

// Waitlist storage functions
export const WaitlistStorage = {
  create(entry) {
    // Check if email already exists
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

    console.log("📝 NEW WAITLIST SIGNUP:", {
      id: newEntry.id,
      email: newEntry.email,
      name: newEntry.name || "Anonymous",
      timestamp: newEntry.joinedAt,
    });

    return newEntry;
  },

  getAll() {
    return [...waitlistCache].sort(
      (a, b) => new Date(b.joinedAt) - new Date(a.joinedAt),
    );
  },

  getCount() {
    return waitlistCache.length;
  },
};

// Email notification helper
export const EmailNotifications = {
  async notifyNewApplication(application) {
    // Enhanced logging for admin visibility
    console.log("=" * 50);
    console.log("🚨 NEW JOB APPLICATION RECEIVED");
    console.log("=" * 50);
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
    console.log("=" * 50);

    return true;
  },

  async notifyNewContact(contact) {
    console.log("=" * 50);
    console.log("💬 NEW CONTACT MESSAGE RECEIVED");
    console.log("=" * 50);
    console.log(`👤 Name: ${contact.name}`);
    console.log(`📧 Email: ${contact.email}`);
    console.log(`💬 Message: ${contact.message}`);
    console.log(`🆔 Contact ID: ${contact.id}`);
    console.log(`⏰ Submitted At: ${contact.submittedAt}`);
    console.log("=" * 50);

    return true;
  },
};

// Initialize some sample data for testing (remove in production)
if (applicationCache.length === 0) {
  console.log("🔧 Initializing storage system...");
}

// Admin authentication helper
export const AdminAuth = {
  validateToken(token) {
    // Simple token validation - in production, use proper JWT or session management
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
