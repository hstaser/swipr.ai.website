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
      const {
        firstName,
        lastName,
        email,
        phone,
        position,
        experience,
        coverLetter,
        linkedinUrl,
        portfolioUrl,
        startDate,
      } = req.body;

      // Validate required fields
      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !position ||
        !experience ||
        !startDate
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Validate position
      const validPositions = [
        "backend-engineer",
        "ai-developer",
        "quantitative-analyst",
        "mobile-app-developer",
      ];

      if (!validPositions.includes(position)) {
        return res.status(400).json({
          success: false,
          message: "Invalid position selected",
        });
      }

      // Generate application ID
      const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Log application (in production, save to database)
      console.log("New job application:", {
        applicationId,
        firstName,
        lastName,
        email,
        phone,
        position,
        experience,
        startDate,
        appliedAt: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message:
          "Application submitted successfully! We'll review your application and get back to you soon.",
        applicationId,
      });
    } catch (error) {
      console.error("Job application error:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }
}
