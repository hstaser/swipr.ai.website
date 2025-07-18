import { WaitlistStorage } from "./lib/storage.js";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    // Return waitlist count for public display
    try {
      const count = WaitlistStorage.getCount();
      return res.status(200).json({
        success: true,
        count,
      });
    } catch (error) {
      console.error("Waitlist count error:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving waitlist count",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { email, name } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address",
        });
      }

      // Store waitlist entry
      const entry = WaitlistStorage.create({
        email: email.trim().toLowerCase(),
        name: name?.trim() || "",
      });

      if (entry && entry.error && entry.existing) {
        return res.status(409).json({
          success: false,
          message: "This email is already on our waitlist!",
        });
      }

      if (!entry) {
        return res.status(500).json({
          success: false,
          message: "Failed to join waitlist. Please try again.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Thanks for joining our waitlist! We'll notify you when we launch.",
      });
    } catch (error) {
      console.error("Waitlist signup error:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    });
  }
}
