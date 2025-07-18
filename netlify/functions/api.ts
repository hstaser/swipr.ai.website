import serverless from "serverless-http";
import express from "express";
import { createServer } from "../../server";

// Create API-only server
const server = createServer();

// Create wrapper that only handles API routes
const apiApp = express();

// Only handle API routes through the serverless function
apiApp.use("/api", server);

// Return 404 for non-API routes (let Vercel handle static files)
apiApp.use("*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

export const handler = serverless(apiApp);
