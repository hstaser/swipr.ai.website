import {
  getCollection,
  COLLECTIONS,
  MongoApplication,
  isMongoAvailable,
} from "../lib/mongodb.js";

// Fallback in-memory storage
const fallbackApplications: MongoApplication[] = [];

export class ApplicationService {
  static async create(applicationData: Omit<MongoApplication, "_id">) {
    try {
      const collection = await getCollection(COLLECTIONS.APPLICATIONS);

      let result;
      if (collection) {
        // Use MongoDB
        result = await collection.insertOne(applicationData);
        console.log("🔸 Stored in MongoDB");
      } else {
        // Fallback to in-memory
        fallbackApplications.push(applicationData as MongoApplication);
        result = { insertedId: `fallback-${Date.now()}` };
        console.log("💾 Stored in memory (MongoDB unavailable)");
      }

      console.log("🚨 NEW JOB APPLICATION RECEIVED");
      console.log("=====================================");
      console.log(
        `👤 Name: ${applicationData.firstName} ${applicationData.lastName}`,
      );
      console.log(`📧 Email: ${applicationData.email}`);
      console.log(`📞 Phone: ${applicationData.phone}`);
      console.log(`💼 Position: ${applicationData.position}`);
      console.log(`🆔 Application ID: ${applicationData.id}`);
      console.log(`⏰ Applied At: ${applicationData.appliedAt}`);
      console.log("=====================================");

      return { ...applicationData, _id: result.insertedId };
    } catch (error) {
      console.error("❌ Error creating application:", error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const collection = await getCollection(COLLECTIONS.APPLICATIONS);

      let applications;
      if (collection) {
        applications = await collection
          .find({})
          .sort({ appliedAt: -1 })
          .toArray();
        console.log(
          `📊 Fetching ${applications.length} applications from MongoDB`,
        );
      } else {
        applications = [...fallbackApplications].sort(
          (a, b) =>
            new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
        );
        console.log(
          `📊 Fetching ${applications.length} applications from memory`,
        );
      }

      return applications;
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      throw error;
    }
  }

  static async getById(id: string) {
    try {
      const collection = await getCollection(COLLECTIONS.APPLICATIONS);

      let application;
      if (collection) {
        application = await collection.findOne({ id });
      } else {
        application = fallbackApplications.find((app) => app.id === id) || null;
      }

      if (application) {
        console.log(`✅ Found application: ${id}`);
      } else {
        console.log(`❌ Application not found: ${id}`);
      }

      return application;
    } catch (error) {
      console.error("❌ Error fetching application by ID:", error);
      throw error;
    }
  }

  static async updateStatus(id: string, status: string, notes: string = "") {
    try {
      const collection = await getCollection(COLLECTIONS.APPLICATIONS);
      const updateData: any = {
        status,
        lastUpdated: new Date().toISOString(),
      };

      if (notes) {
        updateData.notes = notes;
      }

      let result;
      if (collection) {
        result = await collection.updateOne({ id }, { $set: updateData });
        if (result.matchedCount === 0) {
          console.log(`❌ Application not found for update: ${id}`);
          return null;
        }
      } else {
        const appIndex = fallbackApplications.findIndex((app) => app.id === id);
        if (appIndex === -1) {
          console.log(`❌ Application not found for update: ${id}`);
          return null;
        }
        Object.assign(fallbackApplications[appIndex], updateData);
      }

      console.log(`✅ Updated application ${id} status to: ${status}`);

      // Return updated application
      return await this.getById(id);
    } catch (error) {
      console.error("❌ Error updating application status:", error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const collection = await getCollection(COLLECTIONS.APPLICATIONS);

      let applications;
      if (collection) {
        applications = await collection.find({}).toArray();
      } else {
        applications = fallbackApplications;
      }

      const stats = {
        total: applications.length,
        pending: applications.filter((app) => app.status === "pending").length,
        reviewing: applications.filter((app) => app.status === "reviewing")
          .length,
        interviewing: applications.filter(
          (app) => app.status === "interviewing",
        ).length,
        rejected: applications.filter((app) => app.status === "rejected")
          .length,
        hired: applications.filter((app) => app.status === "hired").length,
        byPosition: {} as Record<string, number>,
      };

      // Count by position
      applications.forEach((app) => {
        stats.byPosition[app.position] =
          (stats.byPosition[app.position] || 0) + 1;
      });

      const source = collection ? "MongoDB" : "memory";
      console.log(
        `📊 Application Stats from ${source} - Total: ${stats.total}, Pending: ${stats.pending}`,
      );
      return stats;
    } catch (error) {
      console.error("❌ Error fetching application stats:", error);
      return {
        total: 0,
        pending: 0,
        reviewing: 0,
        interviewing: 0,
        rejected: 0,
        hired: 0,
        byPosition: {},
      };
    }
  }
}
