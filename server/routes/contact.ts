import { RequestHandler } from "express";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(1, "Message is required"),
});

export type ContactRequest = z.infer<typeof ContactSchema>;

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const handleContact: RequestHandler = async (req, res) => {
  try {
    // Validate the request body
    const validatedData = ContactSchema.parse(req.body);

    // Store message in admin dashboard (import and call directly to avoid fetch loop)
    try {
      // Import the store function directly to avoid self-referencing fetch
      const { storeContactMessage } = await import("./analytics");
      const mockReq = { body: validatedData } as any;
      const mockRes = { json: () => {} } as any;

      storeContactMessage(mockReq, mockRes, () => {});
      console.log("📧 Contact message stored in admin dashboard");
    } catch (storeError) {
      console.error("Failed to store contact message:", storeError);
      // Don't fail the contact form if storage fails
    }

    // In a production environment, you would integrate with a real email service
    // For now, we'll simulate the email sending process
    console.log("📧 New contact form submission:");
    console.log(`Name: ${validatedData.name}`);
    console.log(`Email: ${validatedData.email}`);
    console.log(`Message: ${validatedData.message}`);
    console.log("---");
    console.log("Would send email to: team@swipr.ai");

    // Simulate email sending (in production, use services like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Postmark)

    const response: ContactResponse = {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    };

    res.json(response);
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid form data",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
