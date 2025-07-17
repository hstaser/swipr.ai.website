import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleContact } from "./routes/contact";
import { handleWaitlistSignup } from "./routes/waitlist";
import {
  handleJobApplication,
  getApplications,
  updateApplicationStatus,
  upload,
} from "./routes/jobs";

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

  return app;
}
