import { MongoClient } from "mongodb";

// MongoDB connection string
const MONGO_URI =
  "mongodb+srv://henrystaser:F6zK0lgzGr9gkIrp@hstaser.tpej2az.mongodb.net/swipr_db?retryWrites=true&w=majority&appName=hstaser&ssl=true&tlsAllowInvalidCertificates=true";
const DB_NAME = "swipr_db";

let client = null;
let db = null;
let mongoAvailable = false;

export async function connectToMongoDB() {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    db = client.db(DB_NAME);
    mongoAvailable = true;

    console.log("✅ Connected to MongoDB Atlas");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    mongoAvailable = false;
    return null;
  }
}

export async function getCollection(collectionName) {
  try {
    const database = await connectToMongoDB();
    if (!database) {
      console.log(`⚠️ MongoDB not available for collection: ${collectionName}`);
      return null;
    }
    return database.collection(collectionName);
  } catch (error) {
    console.error(`❌ Error getting collection ${collectionName}:`, error);
    return null;
  }
}

export const COLLECTIONS = {
  APPLICATIONS: "applications",
  CONTACTS: "contacts",
  WAITLIST: "waitlist",
};

export function isMongoAvailable() {
  return mongoAvailable;
}
