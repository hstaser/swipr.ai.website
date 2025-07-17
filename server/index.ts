import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleContact } from "./routes/contact";
import { handleWaitlistSignup } from "./routes/waitlist";
import {
  handleJobApplication,
  getApplications,
  getApplicationDetails,
  updateApplicationStatus,
  downloadResume,
  lookupApplication,
  upload,
} from "./routes/jobs";
import {
  trackAnalyticsEvent,
  getAnalyticsDashboard,
  storeContactMessage,
  getContactMessages,
  updateMessageStatus,
} from "./routes/analytics";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Contact and waitlist routes
  app.post("/api/contact", handleContact);
  app.post("/api/waitlist", handleWaitlistSignup);

  // Job application routes
  app.post("/api/jobs/apply", upload.single("resume"), handleJobApplication);
  app.get("/api/jobs/applications", getApplications);
  app.get("/api/jobs/applications/details", getApplicationDetails);
  app.get("/api/jobs/applications/:applicationId/download", downloadResume);
  app.get("/api/jobs/lookup/:applicationId", lookupApplication);
  app.patch(
    "/api/jobs/applications/:applicationId/status",
    updateApplicationStatus,
  );

  // Analytics and messages routes
  app.post("/api/analytics/track", trackAnalyticsEvent);
  app.get("/api/admin/analytics", getAnalyticsDashboard);
  app.post("/api/admin/messages", storeContactMessage);
  app.get("/api/admin/messages", getContactMessages);
  app.patch("/api/admin/messages/:messageId/status", updateMessageStatus);

  return app;
}
