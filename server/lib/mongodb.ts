import { MongoClient, Db, Collection } from "mongodb";

// MongoDB connection string - should be in environment variables in production
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://henrystaser:F6zK0lgzGr9gkIrp@hstaser.tpej2az.mongodb.net/swipr_db?retryWrites=true&w=majority&appName=hstaser&ssl=true&tlsAllowInvalidCertificates=true";
const DB_NAME = "swipr_db";

// Flag to track if MongoDB is available
let mongoAvailable = false;

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongoDB(): Promise<Db | null> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      connectTimeoutMS: 5000,
    });
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    db = client.db(DB_NAME);
    mongoAvailable = true;

    console.log("✅ Connected to MongoDB Atlas");
    return db;
  } catch (error) {
    console.warn(
      "⚠️ MongoDB not available, falling back to in-memory storage:",
      error.message,
    );
    mongoAvailable = false;
    return null;
  }
}

export async function getCollection(
  collectionName: string,
): Promise<Collection | null> {
  const database = await connectToMongoDB();
  if (!database) {
    return null;
  }
  return database.collection(collectionName);
}

export function isMongoAvailable(): boolean {
  return mongoAvailable;
}

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("📴 Disconnected from MongoDB");
  }
}

// Collection names
export const COLLECTIONS = {
  APPLICATIONS: "applications",
  CONTACTS: "contacts",
  WAITLIST: "waitlist",
} as const;

// Data interfaces
export interface MongoApplication {
  _id?: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position:
    | "backend-engineer"
    | "ai-developer"
    | "quantitative-analyst"
    | "mobile-app-developer";
  resumeFilename?: string;
  appliedAt: string;
  status: "pending" | "reviewing" | "interviewing" | "rejected" | "hired";
  notes?: string;
}

export interface MongoContact {
  _id?: string;
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: "new" | "read" | "replied" | "archived";
  source: "contact_form" | "waitlist" | "job_inquiry";
}

export interface MongoWaitlist {
  _id?: string;
  id: string;
  email: string;
  name?: string;
  joinedAt: string;
}
