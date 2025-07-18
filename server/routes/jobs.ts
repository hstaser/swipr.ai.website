import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { ApplicationService } from "../services/applicationService.js";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads", "resumes");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9.-]/g,
      "_",
    );
    cb(null, `${uniqueSuffix}-${sanitizedOriginalName}`);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Allow common resume file types
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only.",
      ),
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const JobApplicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  position: z.enum([
    "backend-engineer",
    "ai-developer",
    "quantitative-analyst",
    "mobile-app-developer",
  ]),
});

export type JobApplication = z.infer<typeof JobApplicationSchema> & {
  id: string;
  resumeFilename?: string;
  appliedAt: string;
  status: "pending" | "reviewing" | "interviewing" | "rejected" | "hired";
};

// MongoDB storage is now handled by ApplicationService
// Keep this export for backwards compatibility with admin routes
export const applications: JobApplication[] = [];

export interface JobApplicationResponse {
  success: boolean;
  message: string;
  applicationId?: string;
}

export const handleJobApplication: RequestHandler = async (req, res) => {
  try {
    // Validate the request body
    const validatedData = JobApplicationSchema.parse(req.body);

    // Generate unique application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create application record
    const application: JobApplication = {
      id: applicationId,
      ...validatedData,
      resumeFilename: req.file?.filename,
      appliedAt: new Date().toISOString(),
      status: "pending",
    };

    // Store application in MongoDB
    await ApplicationService.create(application);

    // Also add to in-memory array for backwards compatibility
    applications.push(application);

    // Log application for team notification
    console.log("🎯 New job application received!");
    console.log(`Application ID: ${applicationId}`);
    console.log(`Position: ${validatedData.position}`);
    console.log(
      `Applicant: ${validatedData.firstName} ${validatedData.lastName}`,
    );
    console.log(`Email: ${validatedData.email}`);
    console.log(`Resume: ${req.file?.filename || "Not provided"}`);
    console.log("---");
    console.log("Would send notification to: team@swipr.ai");

    const response: JobApplicationResponse = {
      success: true,
      message:
        "Application submitted successfully! We'll review your application and get back to you soon.",
      applicationId,
    };

    res.json(response);
  } catch (error) {
    console.error("Job application error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid application data",
        errors: error.errors,
      });
    }

    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "File too large. Please upload a file smaller than 5MB."
            : "File upload error: " + error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export const getApplications: RequestHandler = (req, res) => {
  // Simple authentication check (in production, use proper auth)
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== "swipr-admin-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({
    applications: applications.map((app) => ({
      ...app,
      // Don't expose sensitive file paths in API
      resumeFilename: app.resumeFilename ? "uploaded" : undefined,
    })),
    total: applications.length,
  });
};

export const updateApplicationStatus: RequestHandler = (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== "swipr-admin-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { applicationId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "reviewing",
    "interviewing",
    "rejected",
    "hired",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const application = applications.find((app) => app.id === applicationId);
  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

  application.status = status;

  console.log(`📋 Application ${applicationId} status updated to: ${status}`);

  res.json({ success: true, message: "Status updated successfully" });
};

export const downloadResume: RequestHandler = (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== "swipr-admin-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { applicationId } = req.params;
  const application = applications.find((app) => app.id === applicationId);

  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

  if (!application.resumeFilename) {
    return res
      .status(404)
      .json({ error: "No resume file found for this application" });
  }

  const filePath = path.join(uploadsDir, application.resumeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Resume file not found on server" });
  }

  // Set appropriate headers for file download
  const originalName =
    application.resumeFilename.split("-").slice(2).join("-") ||
    application.resumeFilename;
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${application.firstName}_${application.lastName}_resume_${originalName}"`,
  );
  res.setHeader("Content-Type", "application/octet-stream");

  // Stream the file to the response
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  fileStream.on("error", (error) => {
    console.error("File streaming error:", error);
    res.status(500).json({ error: "Error downloading file" });
  });
};

export const getApplicationDetails: RequestHandler = (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== "swipr-admin-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.json({
    applications: applications.map((app) => ({
      ...app,
      // Include the actual filename for download functionality
      resumeFilename: app.resumeFilename,
    })),
    total: applications.length,
  });
};

export const lookupApplication: RequestHandler = (req, res) => {
  const { applicationId } = req.params;

  const application = applications.find((app) => app.id === applicationId);

  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

  // Return application data without sensitive information
  res.json({
    id: application.id,
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    phone: application.phone,
    position: application.position,
    status: application.status,
    appliedAt: application.appliedAt,
    experience: application.experience,
  });
};
