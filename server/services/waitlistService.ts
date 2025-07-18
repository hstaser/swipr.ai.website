import { getCollection, COLLECTIONS, MongoWaitlist } from "../lib/mongodb.js";

export class WaitlistService {
  static async create(entryData: Omit<MongoWaitlist, "_id">) {
    try {
      const collection = await getCollection(COLLECTIONS.WAITLIST);

      // Check if email already exists
      const existingEntry = await collection.findOne({
        email: entryData.email.toLowerCase(),
      });

      if (existingEntry) {
        console.log(`⚠️ Email already on waitlist: ${entryData.email}`);
        return { error: "Email already on waitlist", existing: true };
      }

      const result = await collection.insertOne(entryData);

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
      const waitlist = await collection
        .find({})
        .sort({ joinedAt: -1 })
        .toArray();

      console.log(
        `📊 Fetching ${waitlist.length} waitlist entries from MongoDB`,
      );
      return waitlist;
    } catch (error) {
      console.error("❌ Error fetching waitlist:", error);
      throw error;
    }
  }

  static async getCount() {
    try {
      const collection = await getCollection(COLLECTIONS.WAITLIST);
      const count = await collection.countDocuments();

      console.log(`📊 Waitlist count from MongoDB: ${count}`);
      return count;
    } catch (error) {
      console.error("❌ Error getting waitlist count:", error);
      return 0;
    }
  }
}
