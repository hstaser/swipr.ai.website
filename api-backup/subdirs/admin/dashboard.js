import { ApplicationService } from "../lib/applicationService.js";
import { ContactService } from "../lib/contactService.js";
import { WaitlistService } from "../lib/waitlistService.js";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Enhanced authentication check
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  const validTokens = [
    "admin-swipr-2025",
    "henry-admin-token",
    process.env.ADMIN_TOKEN || "admin-token",
  ];

  if (!token || !validTokens.includes(token)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access. Admin authentication required.",
    });
  }

  try {
    if (req.method === "GET") {
      const { type, id } = req.query;

      switch (type) {
        case "stats":
          const stats = await ApplicationService.getStats();
          const waitlistCount = await WaitlistService.getCount();
          const contacts = await ContactService.getAll();

          return res.status(200).json({
            success: true,
            data: {
              applications: stats,
              waitlist: { count: waitlistCount },
              contacts: {
                total: contacts.length,
                unread: contacts.filter((c) => c.status === "new").length,
              },
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
            const applications = await ApplicationService.getAll();
            // Sort by most recent first
            applications.sort(
              (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt),
            );
            return res.status(200).json({
              success: true,
              data: applications,
            });
          }

        case "contacts":
          const allContacts = await ContactService.getAll();
          // Sort by most recent first
          allContacts.sort(
            (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
          );
          return res.status(200).json({
            success: true,
            data: allContacts,
          });

        case "waitlist":
          const waitlist = await WaitlistService.getAll();
          // Sort by most recent first
          waitlist.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
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
    }

    if (req.method === "PUT") {
      const { type, id } = req.query;
      const { status, notes } = req.body;

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
    }

    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
