import { RequestHandler } from "express";
import { z } from "zod";

// Analytics Event Schema
const AnalyticsEventSchema = z.object({
  eventType: z.enum([
    "page_view",
    "button_click",
    "form_submit",
    "link_click",
    "scroll_depth",
    "time_on_page",
    "apply_button_click",
    "waitlist_signup_attempt",
    "contact_form_open",
    "learn_more_click",
  ]),
  page: z.string(),
  element: z.string().optional(),
  value: z.union([z.string(), z.number()]).optional(),
  sessionId: z.string(),
  timestamp: z.string(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  location: z.string().optional(),
});

// Contact Message Schema
const ContactMessageSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  timestamp: z.string(),
  status: z.enum(["new", "read", "replied", "archived"]).default("new"),
  source: z
    .enum(["contact_form", "waitlist", "job_inquiry"])
    .default("contact_form"),
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;
export type ContactMessage = z.infer<typeof ContactMessageSchema> & {
  id: string;
};

// In-memory storage (in production, use a database)
const analyticsEvents: (AnalyticsEvent & { id: string })[] = [];
export const contactMessages: ContactMessage[] = [];

// Sample data for demonstration
const initializeSampleData = () => {
  // Add sample analytics events
  const sampleEvents = [
    {
      eventType: "page_view",
      page: "/",
      element: "",
      sessionId: "sess1",
      timestamp: new Date().toISOString(),
    },
    {
      eventType: "button_click",
      page: "/",
      element: "join-waitlist",
      sessionId: "sess1",
      timestamp: new Date().toISOString(),
    },
    {
      eventType: "page_view",
      page: "/learn-more",
      element: "",
      sessionId: "sess2",
      timestamp: new Date().toISOString(),
    },
    {
      eventType: "apply_button_click",
      page: "/",
      element: "backend-engineer",
      sessionId: "sess3",
      timestamp: new Date().toISOString(),
    },
  ];

  sampleEvents.forEach((event, index) => {
    analyticsEvents.push({
      ...(event as any),
      id: `analytics-${Date.now()}-${index}`,
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      referrer: index === 0 ? "https://google.com" : "https://swipr.ai",
    });
  });

  // Add sample contact messages
  const sampleMessages = [
    {
      name: "John Smith",
      email: "john@example.com",
      message:
        "I'm interested in learning more about your investment platform. Can you provide more details about your AI algorithms?",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: "new" as const,
      source: "contact_form" as const,
    },
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      message:
        "When will the mobile app be available? I'm very excited to use swipr.ai for my portfolio management.",
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      status: "read" as const,
      source: "contact_form" as const,
    },
    {
      name: "Mike Davis",
      email: "mike@techcorp.com",
      message:
        "Our company is interested in potential partnerships. Would love to discuss opportunities.",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: "new" as const,
      source: "contact_form" as const,
    },
  ];

  sampleMessages.forEach((msg, index) => {
    contactMessages.push({
      ...msg,
      id: `msg-${Date.now()}-${index}`,
    });
  });
};

// Initialize sample data
initializeSampleData();

// Track analytics event
export const trackAnalyticsEvent: RequestHandler = (req, res) => {
  try {
    const validatedData = AnalyticsEventSchema.parse(req.body);

    const event = {
      ...validatedData,
      id: `analytics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    analyticsEvents.push(event);

    console.log(`📊 Analytics Event: ${event.eventType} on ${event.page}`);

    res.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    res.status(400).json({ success: false, error: "Invalid analytics data" });
  }
};

// Get analytics dashboard data
export const getAnalyticsDashboard: RequestHandler = (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== "swipr-admin-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate metrics
    const totalEvents = analyticsEvents.length;
    const todayEvents = analyticsEvents.filter(
      (event) => new Date(event.timestamp) > oneDayAgo,
    );
    const weekEvents = analyticsEvents.filter(
      (event) => new Date(event.timestamp) > oneWeekAgo,
    );

    const pageViews = analyticsEvents.filter(
      (e) => e.eventType === "page_view",
    );
    const uniqueSessions = new Set(analyticsEvents.map((e) => e.sessionId))
      .size;
    const buttonClicks = analyticsEvents.filter(
      (e) => e.eventType === "button_click",
    );
    const applyClicks = analyticsEvents.filter(
      (e) => e.eventType === "apply_button_click",
    );

    // Page view breakdown
    const pageViewsByPage = pageViews.reduce(
      (acc, event) => {
        acc[event.page] = (acc[event.page] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Traffic sources (referrers)
    const trafficSources = analyticsEvents
      .filter((e) => e.referrer)
      .reduce(
        (acc, event) => {
          const domain = event.referrer
            ? new URL(event.referrer).hostname
            : "direct";
          acc[domain] = (acc[domain] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    // Hourly activity (last 24 hours)
    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const hourStart = new Date(now.getTime() - (23 - hour) * 60 * 60 * 1000);
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

      return {
        hour: hourStart.getHours(),
        events: analyticsEvents.filter((event) => {
          const eventTime = new Date(event.timestamp);
          return eventTime >= hourStart && eventTime < hourEnd;
        }).length,
      };
    });

    res.json({
      overview: {
        totalEvents,
        todayEvents: todayEvents.length,
        weekEvents: weekEvents.length,
        uniqueSessions,
        pageViews: pageViews.length,
        buttonClicks: buttonClicks.length,
        applyClicks: applyClicks.length,
      },
      pageViews: pageViewsByPage,
      trafficSources,
      hourlyActivity,
      recentEvents: analyticsEvents
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, 20),
    });
  } catch (error) {
    console.error("Analytics dashboard error:", error);
    res.status(500).json({ error: "Failed to get analytics data" });
  }
};

// Store contact message (called when contact form is submitted)
export const storeContactMessage: RequestHandler = (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contactMessage: ContactMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      status: "new",
      source: "contact_form",
    };

    contactMessages.push(contactMessage);

    console.log(`📬 New contact message from ${name} (${email})`);

    res.json({ success: true, messageId: contactMessage.id });
  } catch (error) {
    console.error("Contact message storage error:", error);
    res.status(500).json({ success: false, error: "Failed to store message" });
  }
};

// Get all contact messages
export const getContactMessages: RequestHandler = (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== "swipr-admin-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const sortedMessages = contactMessages.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    const stats = {
      total: contactMessages.length,
      new: contactMessages.filter((m) => m.status === "new").length,
      read: contactMessages.filter((m) => m.status === "read").length,
      replied: contactMessages.filter((m) => m.status === "replied").length,
      archived: contactMessages.filter((m) => m.status === "archived").length,
    };

    res.json({
      messages: sortedMessages,
      stats,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

// Update message status
export const updateMessageStatus: RequestHandler = (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== "swipr-admin-2024") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { messageId } = req.params;
    const { status } = req.body;

    const message = contactMessages.find((m) => m.id === messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    message.status = status;

    console.log(`📮 Message ${messageId} status updated to: ${status}`);

    res.json({ success: true });
  } catch (error) {
    console.error("Update message status error:", error);
    res.status(500).json({ error: "Failed to update message status" });
  }
};
