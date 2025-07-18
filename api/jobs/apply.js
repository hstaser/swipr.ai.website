import { ApplicationStorage, EmailNotifications } from "../lib/storage.js";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    // Handle application status checks
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
    }

    try {
      const application = ApplicationStorage.getById(id);

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      // Return safe application data (without sensitive info)
      return res.status(200).json({
        success: true,
        application: {
          id: application.id,
          position: application.position,
          status: application.status,
          appliedAt: application.appliedAt,
          lastUpdated: application.lastUpdated,
        },
      });
    } catch (error) {
      console.error("Application lookup error:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving application status",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        position,
        experience,
        coverLetter,
        linkedinUrl,
        portfolioUrl,
        startDate,
      } = req.body;

      // Validate required fields
      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !position ||
        !experience ||
        !startDate
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields. Please fill in all required information.",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
      }

      // Validate position
      const validPositions = [
        "backend-engineer",
        "ai-developer",
        "quantitative-analyst",
        "mobile-app-developer",
      ];

      if (!validPositions.includes(position)) {
        return res.status(400).json({
          success: false,
          message: "Invalid position selected",
        });
      }

      // Create application record
      const application = ApplicationStorage.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        position,
        experience,
        coverLetter: coverLetter?.trim() || "",
        linkedinUrl: linkedinUrl?.trim() || "",
        portfolioUrl: portfolioUrl?.trim() || "",
        startDate,
      });

      if (!application) {
        return res.status(500).json({
          success: false,
          message: "Failed to save application. Please try again.",
        });
      }

      // Send notification email
      await EmailNotifications.notifyNewApplication(application);

      return res.status(200).json({
        success: true,
        message:
          "Application submitted successfully! We'll review your application and get back to you within 3-5 business days.",
        applicationId: application.id,
      });
    } catch (error) {
      console.error("Job application error:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }
}
