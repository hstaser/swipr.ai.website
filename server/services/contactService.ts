import { getCollection, COLLECTIONS, MongoContact } from "../lib/mongodb.js";

export class ContactService {
  static async create(contactData: Omit<MongoContact, "_id">) {
    try {
      const collection = await getCollection(COLLECTIONS.CONTACTS);
      const result = await collection.insertOne(contactData);

      console.log("💬 NEW CONTACT MESSAGE RECEIVED");
      console.log("=================================");
      console.log(`👤 Name: ${contactData.name}`);
      console.log(`📧 Email: ${contactData.email}`);
      console.log(`💬 Message: ${contactData.message.substring(0, 100)}...`);
      console.log(`🆔 Contact ID: ${contactData.id}`);
      console.log(`⏰ Submitted At: ${contactData.timestamp}`);
      console.log("=================================");

      return { ...contactData, _id: result.insertedId };
    } catch (error) {
      console.error("❌ Error creating contact:", error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const collection = await getCollection(COLLECTIONS.CONTACTS);
      const contacts = await collection
        .find({})
        .sort({ timestamp: -1 })
        .toArray();

      console.log(`📊 Fetching ${contacts.length} contacts from MongoDB`);
      return contacts;
    } catch (error) {
      console.error("❌ Error fetching contacts:", error);
      throw error;
    }
  }

  static async markAsRead(id: string) {
    try {
      const collection = await getCollection(COLLECTIONS.CONTACTS);
      const result = await collection.updateOne(
        { id },
        {
          $set: {
            status: "read",
            readAt: new Date().toISOString(),
          },
        },
      );

      if (result.matchedCount === 0) {
        console.log(`❌ Contact not found for marking as read: ${id}`);
        return null;
      }

      console.log(`✅ Marked contact ${id} as read`);

      // Return updated contact
      const updatedContact = await collection.findOne({ id });
      return updatedContact;
    } catch (error) {
      console.error("❌ Error marking contact as read:", error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const collection = await getCollection(COLLECTIONS.CONTACTS);
      const contacts = await collection.find({}).toArray();

      return {
        total: contacts.length,
        unread: contacts.filter((c) => c.status === "new").length,
      };
    } catch (error) {
      console.error("❌ Error fetching contact stats:", error);
      return { total: 0, unread: 0 };
    }
  }
}
