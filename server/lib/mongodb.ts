import { MongoClient, Db, Collection } from "mongodb";

// MongoDB connection string - should be in environment variables in production
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://henrystaser:F6zK0lgzGr9gkIrp@hstaser.tpej2az.mongodb.net/?retryWrites=true&w=majority&appName=hstaser";
const DB_NAME = "swipr_db";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);

    console.log("✅ Connected to MongoDB Atlas");
    return db;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function getCollection(
  collectionName: string,
): Promise<Collection> {
  const database = await connectToMongoDB();
  return database.collection(collectionName);
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
