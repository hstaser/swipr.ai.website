import { debugStorage } from "./lib/storage.js";

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
      const debug = debugStorage();

      return res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        message: "Debug data retrieved successfully",
        storage: debug,
        endpoints: {
          applications: "/api/jobs/apply",
          contacts: "/api/contact",
          waitlist: "/api/waitlist",
          admin: "/api/admin/dashboard",
        },
        instructions: {
          1: "Check this endpoint to see current data counts",
          2: "Submit forms on the website to add real data",
          3: "Check admin dashboard to see data displayed",
          4: "All data persists in global memory",
        },
      });
    } catch (error) {
      console.error("Debug endpoint error:", error);
      return res.status(500).json({
        success: false,
        error: "Debug check failed",
        message: error.message,
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
