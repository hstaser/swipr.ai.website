import { RequestHandler } from "express";
import { z } from "zod";
import { WaitlistService } from "../services/waitlistService.ts";

const WaitlistSchema = z.object({
  email: z.string().email("Valid email is required"),
  name: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export type WaitlistRequest = z.infer<typeof WaitlistSchema>;

export interface WaitlistResponse {
  success: boolean;
  message: string;
}

interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  interests?: string[];
  joinedAt: string;
}

// In-memory storage for demo (in production, use a database)
export const waitlistEntries: WaitlistEntry[] = [];

export const handleWaitlistSignup: RequestHandler = async (req, res) => {
  try {
    // Validate the request body
    const validatedData = WaitlistSchema.parse(req.body);

    // Create waitlist entry
    const waitlistEntry: WaitlistEntry = {
      id: `WAITLIST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: validatedData.email.toLowerCase(),
      name: validatedData.name || "",
      interests: validatedData.interests || [],
      joinedAt: new Date().toISOString(),
    };

    // Store in MongoDB
    const result = await WaitlistService.create(waitlistEntry);

    if (result && result.error && result.existing) {
      return res.status(409).json({
        success: false,
        message: "This email is already on our waitlist!",
      });
    }

    // Also store in memory for backwards compatibility
    waitlistEntries.push(waitlistEntry);

    console.log("📝 NEW WAITLIST SIGNUP");
    console.log("=======================");
    console.log(`📧 Email: ${waitlistEntry.email}`);
    console.log(`👤 Name: ${waitlistEntry.name || "Anonymous"}`);
    console.log(
      `🎯 Interests: ${waitlistEntry.interests?.join(", ") || "None"}`,
    );
    console.log(`🆔 Entry ID: ${waitlistEntry.id}`);
    console.log(`⏰ Joined At: ${waitlistEntry.joinedAt}`);
    console.log(`📊 Total Waitlist: ${waitlistEntries.length}`);
    console.log("=======================");

    const response = {
      success: true,
      message:
        "Thanks for joining our waitlist! We'll notify you when Swipr.ai launches.",
      position: waitlistEntries.length,
      id: waitlistEntry.id,
      data: {
        position: waitlistEntries.length,
        id: waitlistEntry.id,
      },
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
