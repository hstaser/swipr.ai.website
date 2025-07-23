import { getCollection, COLLECTIONS } from "./mongodb.js";

// Fallback in-memory storage
const fallbackContacts = [];

export class ContactService {
  static async create(contactData) {
    try {
      const collection = await getCollection(COLLECTIONS.CONTACTS);

      let result;
      if (collection) {
        result = await collection.insertOne(contactData);
        console.log("🔸 Contact stored in MongoDB");
      } else {
        fallbackContacts.push(contactData);
        result = { insertedId: `fallback-${Date.now()}` };
        console.log("💾 Contact stored in memory");
      }

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

      let contacts;
      if (collection) {
        contacts = await collection.find({}).sort({ timestamp: -1 }).toArray();
        console.log(`📊 Fetching ${contacts.length} contacts from MongoDB`);
      } else {
        contacts = [...fallbackContacts].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        console.log(`📊 Fetching ${contacts.length} contacts from memory`);
      }

      return contacts;
    } catch (error) {
      console.error("❌ Error fetching contacts:", error);
      return [];
    }
  }

  static async markAsRead(id) {
    try {
      const collection = await getCollection(COLLECTIONS.CONTACTS);

      let updatedContact;
      if (collection) {
        const result = await collection.findOneAndUpdate(
          { id },
          {
            $set: {
              status: "read",
              readAt: new Date().toISOString(),
            },
          },
          { returnDocument: "after" },
        );
        updatedContact = result.value;
      } else {
        const contactIndex = fallbackContacts.findIndex(
          (contact) => contact.id === id,
        );
        if (contactIndex === -1) return null;

        fallbackContacts[contactIndex].status = "read";
        fallbackContacts[contactIndex].readAt = new Date().toISOString();
        updatedContact = fallbackContacts[contactIndex];
      }

      if (updatedContact) {
        console.log(`✅ Marked contact ${id} as read`);
      }

      return updatedContact;
    } catch (error) {
      console.error("❌ Error marking contact as read:", error);
      return null;
    }
  }

  static async getStats() {
    try {
      const contacts = await ContactService.getAll();
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
