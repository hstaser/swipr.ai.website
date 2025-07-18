import { getCollection, COLLECTIONS } from "./mongodb.js";

// Fallback in-memory storage
const fallbackWaitlist = [];

export class WaitlistService {
  static async create(entryData) {
    try {
      const collection = await getCollection(COLLECTIONS.WAITLIST);

      let existingEntry;
      if (collection) {
        existingEntry = await collection.findOne({
          email: entryData.email.toLowerCase(),
        });
      } else {
        existingEntry = fallbackWaitlist.find(
          (entry) =>
            entry.email.toLowerCase() === entryData.email.toLowerCase(),
        );
      }

      if (existingEntry) {
        console.log(`⚠️ Email already on waitlist: ${entryData.email}`);
        return { error: "Email already on waitlist", existing: true };
      }

      let result;
      if (collection) {
        result = await collection.insertOne(entryData);
        console.log("🔸 Waitlist entry stored in MongoDB");
      } else {
        fallbackWaitlist.push(entryData);
        result = { insertedId: `fallback-${Date.now()}` };
        console.log("💾 Waitlist entry stored in memory");
      }

      console.log("📝 NEW WAITLIST SIGNUP");
      console.log("=======================");
      console.log(`📧 Email: ${entryData.email}`);
      console.log(`👤 Name: ${entryData.name || "Anonymous"}`);
      console.log(`🆔 Entry ID: ${entryData.id}`);
      console.log(`⏰ Joined At: ${entryData.joinedAt}`);
      console.log("=======================");

      return { ...entryData, _id: result.insertedId };
    } catch (error) {
      console.error("❌ Error creating waitlist entry:", error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const collection = await getCollection(COLLECTIONS.WAITLIST);

      let waitlist;
      if (collection) {
        waitlist = await collection.find({}).sort({ joinedAt: -1 }).toArray();
        console.log(
          `📊 Fetching ${waitlist.length} waitlist entries from MongoDB`,
        );
      } else {
        waitlist = [...fallbackWaitlist].sort(
          (a, b) =>
            new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
        );
        console.log(
          `📊 Fetching ${waitlist.length} waitlist entries from memory`,
        );
      }

      return waitlist;
    } catch (error) {
      console.error("❌ Error fetching waitlist:", error);
      throw error;
    }
  }

  static async getCount() {
    try {
      const collection = await getCollection(COLLECTIONS.WAITLIST);

      let count;
      if (collection) {
        count = await collection.countDocuments();
        console.log(`📊 Waitlist count from MongoDB: ${count}`);
      } else {
        count = fallbackWaitlist.length;
        console.log(`📊 Waitlist count from memory: ${count}`);
      }

      return count;
    } catch (error) {
      console.error("❌ Error getting waitlist count:", error);
      return 0;
    }
  }
}
