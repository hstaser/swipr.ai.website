// API-only serverless function for Vercel
import { createServer } from "../server/index.js";

const app = createServer();

// Only handle API routes, not static files
export default (req, res) => {
  // Only process API routes
  if (req.url.startsWith("/api/")) {
    return app(req, res);
  } else {
    // Let Vercel handle static files
    res.status(404).json({ error: "Not found" });
  }
};
