import { RequestHandler } from "express";
import { z } from "zod";

const WaitlistSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().optional(),
});

export type WaitlistRequest = z.infer<typeof WaitlistSchema>;

export interface WaitlistResponse {
  success: boolean;
  message: string;
}

export const handleWaitlistSignup: RequestHandler = async (req, res) => {
  try {
    // Validate the request body
    const validatedData = WaitlistSchema.parse(req.body);

    // In a production environment, you would:
    // 1. Store the email in a database (PostgreSQL, MongoDB, etc.)
    // 2. Send a confirmation email
    // 3. Add to email marketing platform (Mailchimp, ConvertKit, etc.)

    console.log("🚀 New waitlist signup:");
    console.log(`Email: ${validatedData.email}`);
    if (validatedData.name) {
      console.log(`Name: ${validatedData.name}`);
    }
    console.log("---");
    console.log("Would send notification to: team@swipr.ai");
    console.log("Would send confirmation email to user");

    // Simulate database storage and email sending
    const response: WaitlistResponse = {
      success: true,
      message:
        "Thanks for joining our waitlist! We'll notify you when Swipr.ai launches.",
    };

    res.json(response);
  } catch (error) {
    console.error("Waitlist signup error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
