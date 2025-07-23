import { getCollection, COLLECTIONS } from "./mongodb.js";

// Fallback in-memory storage
const fallbackApplications = [];

export class ApplicationService {
  static async create(applicationData) {
    try {
      const collection = await getCollection(COLLECTIONS.APPLICATIONS);

      let result;
      if (collection) {
        result = await collection.insertOne(applicationData);
        console.log("🔸 Application stored in MongoDB");
      } else {
        fallbackApplications.push(applicationData);
        result = { insertedId: `fallback-${Date.now()}` };
        console.log("💾 Application stored in memory");
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
      return [];
    }
  }

  static async getById(id) {
    try {
      const collection = await getCollection(COLLECTIONS.APPLICATIONS);

      let application;
      if (collection) {
        application = await collection.findOne({ id });
      } else {
        application = fallbackApplications.find((app) => app.id === id);
      }

      return application || null;
    } catch (error) {
      console.error("❌ Error fetching application by ID:", error);
      return null;
    }
  }

  static async updateStatus(id, status, notes = "") {
    try {
      const collection = await getCollection(COLLECTIONS.APPLICATIONS);

      let updatedApplication;
      if (collection) {
        const result = await collection.findOneAndUpdate(
          { id },
          {
            $set: {
              status,
              notes,
              lastUpdated: new Date().toISOString(),
            },
          },
          { returnDocument: "after" },
        );
        updatedApplication = result.value;
      } else {
        const appIndex = fallbackApplications.findIndex((app) => app.id === id);
        if (appIndex === -1) return null;

        fallbackApplications[appIndex].status = status;
        fallbackApplications[appIndex].lastUpdated = new Date().toISOString();
        if (notes) fallbackApplications[appIndex].notes = notes;
        updatedApplication = fallbackApplications[appIndex];
      }

      if (updatedApplication) {
        console.log(`✅ Updated application ${id} status to: ${status}`);
      }

      return updatedApplication;
    } catch (error) {
      console.error("❌ Error updating application status:", error);
      return null;
    }
  }

  static async getStats() {
    try {
      const applications = await ApplicationService.getAll();
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
        byPosition: {},
      };

      applications.forEach((app) => {
        stats.byPosition[app.position] =
          (stats.byPosition[app.position] || 0) + 1;
      });

      console.log(
        `📊 Application Stats - Total: ${stats.total}, Pending: ${stats.pending}`,
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
