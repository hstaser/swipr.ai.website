import fs from "fs";
import path from "path";

// Simple file-based storage that can be easily upgraded to a database
const DATA_DIR = "/tmp";
const APPLICATIONS_FILE = path.join(DATA_DIR, "applications.json");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");

// Ensure data files exist
function ensureDataFiles() {
  try {
    if (!fs.existsSync(APPLICATIONS_FILE)) {
      fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify([]));
    }
    if (!fs.existsSync(CONTACTS_FILE)) {
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify([]));
    }
    if (!fs.existsSync(WAITLIST_FILE)) {
      fs.writeFileSync(WAITLIST_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error("Error ensuring data files:", error);
  }
}

// Read data from file
function readData(filename) {
  try {
    ensureDataFiles();
    const data = fs.readFileSync(filename, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

// Write data to file
function writeData(filename, data) {
  try {
    ensureDataFiles();
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing data:", error);
    return false;
  }
}

// Application storage functions
export const ApplicationStorage = {
  create(application) {
    const applications = readData(APPLICATIONS_FILE);
    const newApplication = {
      id: `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...application,
      appliedAt: new Date().toISOString(),
      status: "pending",
      lastUpdated: new Date().toISOString(),
    };

    applications.push(newApplication);
    const success = writeData(APPLICATIONS_FILE, applications);
    return success ? newApplication : null;
  },

  getAll() {
    return readData(APPLICATIONS_FILE);
  },

  getById(id) {
    const applications = readData(APPLICATIONS_FILE);
    return applications.find((app) => app.id === id);
  },

  updateStatus(id, status, notes = "") {
    const applications = readData(APPLICATIONS_FILE);
    const appIndex = applications.findIndex((app) => app.id === id);

    if (appIndex === -1) return null;

    applications[appIndex].status = status;
    applications[appIndex].lastUpdated = new Date().toISOString();
    if (notes) applications[appIndex].notes = notes;

    const success = writeData(APPLICATIONS_FILE, applications);
    return success ? applications[appIndex] : null;
  },

  getStats() {
    const applications = readData(APPLICATIONS_FILE);
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
    const contacts = readData(CONTACTS_FILE);
    const newContact = {
      id: `CONTACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...contact,
      submittedAt: new Date().toISOString(),
      status: "new",
    };

    contacts.push(newContact);
    const success = writeData(CONTACTS_FILE, contacts);
    return success ? newContact : null;
  },

  getAll() {
    return readData(CONTACTS_FILE);
  },

  markAsRead(id) {
    const contacts = readData(CONTACTS_FILE);
    const contactIndex = contacts.findIndex((contact) => contact.id === id);

    if (contactIndex === -1) return null;

    contacts[contactIndex].status = "read";
    contacts[contactIndex].readAt = new Date().toISOString();

    const success = writeData(CONTACTS_FILE, contacts);
    return success ? contacts[contactIndex] : null;
  },
};

// Waitlist storage functions
export const WaitlistStorage = {
  create(entry) {
    const waitlist = readData(WAITLIST_FILE);

    // Check if email already exists
    const existingEntry = waitlist.find((item) => item.email === entry.email);
    if (existingEntry) {
      return { error: "Email already on waitlist", existing: true };
    }

    const newEntry = {
      id: `WAITLIST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...entry,
      joinedAt: new Date().toISOString(),
    };

    waitlist.push(newEntry);
    const success = writeData(WAITLIST_FILE, waitlist);
    return success ? newEntry : null;
  },

  getAll() {
    return readData(WAITLIST_FILE);
  },

  getCount() {
    const waitlist = readData(WAITLIST_FILE);
    return waitlist.length;
  },
};

// Email notification helper (can be extended with actual email service)
export const EmailNotifications = {
  async notifyNewApplication(application) {
    // In production, integrate with email service like SendGrid, Mailgun, etc.
    console.log("New application received:", {
      id: application.id,
      name: `${application.firstName} ${application.lastName}`,
      email: application.email,
      position: application.position,
    });

    // For now, just log. In production, send email to team@swipr.ai
    return true;
  },

  async notifyNewContact(contact) {
    console.log("New contact message:", {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      subject: contact.message.substring(0, 50) + "...",
    });

    return true;
  },
};
