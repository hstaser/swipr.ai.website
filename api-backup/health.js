import { checkStorageHealth, getDatabaseSchema } from "./lib/storage.js";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const health = await checkStorageHealth();

      const response = {
        success: true,
        timestamp: new Date().toISOString(),
        storage: health,
        environment: {
          hasSupabaseUrl: !!process.env.SUPABASE_URL,
          hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
          nodeEnv: process.env.NODE_ENV || "development",
        },
        endpoints: {
          applications: "/api/jobs/apply",
          contacts: "/api/contact",
          waitlist: "/api/waitlist",
          admin: "/api/admin/dashboard",
        },
      };

      // Include database schema if requested
      if (req.query.schema === "true") {
        response.schema = getDatabaseSchema();
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error("Health check error:", error);
      return res.status(500).json({
        success: false,
        error: "Health check failed",
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }
}
