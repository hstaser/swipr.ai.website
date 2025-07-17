export default async function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { name, email, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Invalid email format",
        });
      }

      // Log the form submission (in production, you'd save to database or send email)
      console.log("New contact form submission:", {
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
      });

      // Here you would typically:
      // - Save to database
      // - Send email notification
      // - Integrate with CRM
      // - etc.

      return res.status(200).json({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
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
