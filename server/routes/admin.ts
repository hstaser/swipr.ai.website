import { RequestHandler } from "express";
import { ApplicationService } from "../services/applicationService.ts";
import { ContactService } from "../services/contactService.ts";
import { WaitlistService } from "../services/waitlistService.ts";

// Import the existing storage from other routes for backwards compatibility
import { applications } from "./jobs";
import { contactMessages } from "./analytics";
import { waitlistEntries } from "./waitlist";

// Admin authentication helper
const validateAdminAuth = (req: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  const validTokens = [
    "admin-swipr-2025",
    "henry-admin-token",
    "henry2025",
    "admin-token",
  ];

  return validTokens.includes(token);
};

export const getAdminDashboard: RequestHandler = async (req, res) => {
  // Check authentication
  if (!validateAdminAuth(req)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Admin authentication required.",
    });
  }

  const { type, id } = req.query;

  try {
    switch (type) {
      case "stats":
        // Get stats from MongoDB
        const appStats = await ApplicationService.getStats();
        const contactStats = await ContactService.getStats();
        const waitlistCount = await WaitlistService.getCount();

        return res.status(200).json({
          success: true,
          data: {
            applications: appStats,
            waitlist: { count: waitlistCount },
            contacts: contactStats,
          },
        });

      case "applications":
        if (id) {
          const application = await ApplicationService.getById(id);
          if (!application) {
            return res.status(404).json({
              success: false,
              message: "Application not found",
            });
          }
          return res.status(200).json({
            success: true,
            data: application,
          });
        } else {
          // Return all applications from MongoDB
          const applications = await ApplicationService.getAll();
          return res.status(200).json({
            success: true,
            data: applications,
          });
        }

      case "contacts":
        // Return all contacts from MongoDB
        const contacts = await ContactService.getAll();
        return res.status(200).json({
          success: true,
          data: contacts.map((contact) => ({
            id: contact.id,
            name: contact.name,
            email: contact.email,
            message: contact.message,
            submittedAt: contact.timestamp,
            status: contact.status,
            readAt: contact.status === "read" ? contact.timestamp : undefined,
          })),
        });

      case "waitlist":
        // Return all waitlist entries from MongoDB
        const waitlist = await WaitlistService.getAll();
        return res.status(200).json({
          success: true,
          data: waitlist,
        });

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid type parameter",
        });
    }
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateAdminDashboard: RequestHandler = async (req, res) => {
  // Check authentication
  if (!validateAdminAuth(req)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Admin authentication required.",
    });
  }

  const { type, id } = req.query;
  const { status, notes } = req.body;

  try {
    if (type === "application" && id) {
      const validStatuses = [
        "pending",
        "reviewing",
        "interviewing",
        "rejected",
        "hired",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const updatedApplication = await ApplicationService.updateStatus(
        id,
        status,
        notes,
      );

      if (!updatedApplication) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedApplication,
        message: "Application status updated successfully",
      });
    }

    if (type === "contact" && id) {
      const updatedContact = await ContactService.markAsRead(id);

      if (!updatedContact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedContact,
        message: "Contact marked as read",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid request parameters",
    });
  } catch (error) {
    console.error("Admin dashboard update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
