import { ContactService } from "./lib/contactService.js";

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
          message: "Please fill in all required fields.",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
      }

      // Validate message length
      if (message.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a more detailed message (minimum 10 characters).",
        });
      }

      // Store contact message
      const contactData = {
        id: `CONTACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        status: "new",
        timestamp: new Date().toISOString(),
        readAt: null,
      };

      const contact = await ContactService.create(contactData);

      if (!contact) {
        return res.status(500).json({
          success: false,
          message: "Failed to save your message. Please try again.",
        });
      }

      // Send notification
      await EmailNotifications.notifyNewContact(contact);

      return res.status(200).json({
        success: true,
        message:
          "Thank you for your message! We'll get back to you within 24 hours.",
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
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
