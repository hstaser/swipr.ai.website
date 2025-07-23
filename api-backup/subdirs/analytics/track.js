export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const event = req.body;

      // Basic validation
      if (!event.eventType || !event.page || !event.sessionId) {
        return res.status(400).json({
          success: false,
          error: "Missing required analytics fields",
        });
      }

      // Log analytics event (in production, save to analytics service)
      console.log("Analytics event:", {
        ...event,
        timestamp: new Date().toISOString(),
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Analytics tracking error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to track event",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
    });
  }
}
