import { RequestHandler } from "express";

// Import the existing storage from other routes
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

export const getAdminDashboard: RequestHandler = (req, res) => {
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
        // Calculate application stats
        const appStats = {
          total: applications.length,
          pending: applications.filter((app) => app.status === "pending")
            .length,
          reviewing: applications.filter((app) => app.status === "reviewing")
            .length,
          interviewing: applications.filter(
            (app) => app.status === "interviewing",
          ).length,
          rejected: applications.filter((app) => app.status === "rejected")
            .length,
          hired: applications.filter((app) => app.status === "hired").length,
          byPosition: {} as Record<string, number>,
        };

        // Count by position
        applications.forEach((app) => {
          appStats.byPosition[app.position] =
            (appStats.byPosition[app.position] || 0) + 1;
        });

        return res.status(200).json({
          success: true,
          data: {
            applications: appStats,
            waitlist: { count: waitlistEntries.length },
            contacts: {
              total: contactMessages.length,
              unread: contactMessages.filter((c) => c.status === "new").length,
            },
          },
        });

      case "applications":
        if (id) {
          const application = applications.find((app) => app.id === id);
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
          // Return all applications sorted by most recent
          const sortedApps = [...applications].sort(
            (a, b) =>
              new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
          );
          return res.status(200).json({
            success: true,
            data: sortedApps,
          });
        }

      case "contacts":
        // Return all contacts sorted by most recent
        const sortedContacts = [...contactMessages].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        return res.status(200).json({
          success: true,
          data: sortedContacts.map((contact) => ({
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
        // Return all waitlist entries sorted by most recent
        const sortedWaitlist = [...waitlistEntries].sort(
          (a, b) =>
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
        );
        return res.status(200).json({
          success: true,
          data: sortedWaitlist,
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

export const updateAdminDashboard: RequestHandler = (req, res) => {
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

      const applicationIndex = applications.findIndex((app) => app.id === id);
      if (applicationIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      // Update application
      applications[applicationIndex].status = status;

      console.log(`✅ Updated application ${id} status to: ${status}`);

      return res.status(200).json({
        success: true,
        data: applications[applicationIndex],
        message: "Application status updated successfully",
      });
    }

    if (type === "contact" && id) {
      const contactIndex = contactMessages.findIndex(
        (contact) => contact.id === id,
      );
      if (contactIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Contact not found",
        });
      }

      contactMessages[contactIndex].status = "read";

      console.log(`✅ Marked contact ${id} as read`);

      return res.status(200).json({
        success: true,
        data: contactMessages[contactIndex],
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
