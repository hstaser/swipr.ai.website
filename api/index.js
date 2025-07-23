// Vercel serverless function handler
export default function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { url, method } = req;

  // Route handling
  if (url === "/api/health" && method === "GET") {
    return res.json({ status: "ok", timestamp: new Date().toISOString() });
  }

  if (url === "/api/demo" && method === "POST") {
    console.log("Demo endpoint hit:", req.body);
    return res.json({ message: "Demo endpoint working" });
  }

  if (url === "/api/contact" && method === "POST") {
    console.log("Contact form submission:", req.body);
    return res.json({ message: "Contact form received" });
  }

  if (url === "/api/waitlist" && method === "POST") {
    console.log("Waitlist submission:", req.body);
    return res.json({ message: "Added to waitlist" });
  }

  if (url === "/api/jobs/apply" && method === "POST") {
    console.log("Job application:", req.body);
    return res.json({ message: "Application received" });
  }

  if (url === "/api/analytics/track" && method === "POST") {
    console.log("Analytics event:", req.body);
    return res.json({ message: "Event tracked" });
  }

  // Default 404 for unmatched routes
  res.status(404).json({ error: "API endpoint not found" });
}
