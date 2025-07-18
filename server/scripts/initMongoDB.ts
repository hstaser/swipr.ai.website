import { ApplicationService } from "../services/applicationService.ts";
import { ContactService } from "../services/contactService.ts";
import { WaitlistService } from "../services/waitlistService.ts";
import { connectToMongoDB } from "../lib/mongodb.ts";

async function initializeData() {
  try {
    console.log("🔧 Initializing MongoDB with sample data...");

    // Connect to MongoDB
    await connectToMongoDB();

    // Check if data already exists
    const existingApps = await ApplicationService.getAll();
    const existingContacts = await ContactService.getAll();
    const existingWaitlist = await WaitlistService.getAll();

    if (
      existingApps.length > 0 ||
      existingContacts.length > 0 ||
      existingWaitlist.length > 0
    ) {
      console.log("📝 Sample data already exists in MongoDB");
      return;
    }

    // Add sample application
    await ApplicationService.create({
      id: "APP-mongo-123",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      phone: "+1-555-0789",
      position: "backend-engineer",
      status: "pending",
      appliedAt: new Date().toISOString(),
      notes: "",
    });

    // Add sample contact
    await ContactService.create({
      id: "CONTACT-mongo-456",
      name: "Bob Wilson",
      email: "bob@example.com",
      message:
        "I'm interested in learning more about your platform and potential partnership opportunities.",
      timestamp: new Date().toISOString(),
      status: "new",
      source: "contact_form",
    });

    // Add sample waitlist entry
    await WaitlistService.create({
      id: "WAITLIST-mongo-789",
      email: "waitlist-mongo@example.com",
      name: "Charlie Brown",
      joinedAt: new Date().toISOString(),
    });

    console.log("✅ Sample data initialized in MongoDB successfully");
  } catch (error) {
    console.error("❌ Error initializing MongoDB data:", error);
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeData().then(() => process.exit(0));
}

export { initializeData };
