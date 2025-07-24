import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./lib/mongodb.ts";
import { initializeData } from "./scripts/initMongoDB.ts";
import { handleDemo } from "./routes/demo";
import { handleContact } from "./routes/contact";
import { handleWaitlistSignup } from "./routes/waitlist";
import {
  handleJobApplication,
  getApplications,
  getApplicationDetails,
  updateApplicationStatus,
  downloadResume,
  lookupApplication,
  upload,
} from "./routes/jobs";
import {
  trackAnalyticsEvent,
  getAnalyticsDashboard,
  storeContactMessage,
  getContactMessages,
  updateMessageStatus,
} from "./routes/analytics";
import { getAdminDashboard, updateAdminDashboard } from "./routes/admin";

export function createServer() {
  const app = express();

  // Initialize MongoDB connection and sample data
  connectToMongoDB()
    .then(() => {
      console.log("📚 MongoDB connected, initializing sample data...");
      return initializeData();
    })
    .catch((error) => {
      console.error("❌ MongoDB initialization failed:", error);
    });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from dist in production
  if (process.env.NODE_ENV === "production") {
    // Import path and serve static files
    const path = require("path");
    app.use(express.static(path.join(__dirname, "../..")));

    // Handle client-side routing - send index.html for non-API routes
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) {
        return next();
      }
      res.sendFile(path.join(__dirname, "../../index.html"));
    });
  }

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Contact and waitlist routes
  app.post("/api/contact", handleContact);
  app.post("/api/waitlist", handleWaitlistSignup);

  // Job application routes
  app.post("/api/jobs/apply", upload.single("resume"), handleJobApplication);
  app.get("/api/jobs/applications", getApplications);
  app.get("/api/jobs/applications/details", getApplicationDetails);
  app.get("/api/jobs/applications/:applicationId/download", downloadResume);
  app.get("/api/jobs/lookup/:applicationId", lookupApplication);
  app.patch(
    "/api/jobs/applications/:applicationId/status",
    updateApplicationStatus,
  );

  // Analytics and messages routes
  app.post("/api/analytics/track", trackAnalyticsEvent);
  app.get("/api/admin/analytics", getAnalyticsDashboard);
  app.post("/api/admin/messages", storeContactMessage);
  app.get("/api/admin/messages", getContactMessages);
  app.patch("/api/admin/messages/:messageId/status", updateMessageStatus);

  // Admin dashboard routes
  app.get("/api/admin/dashboard", getAdminDashboard);
  app.put("/api/admin/dashboard", updateAdminDashboard);

  // Stock data endpoints - adding missing endpoints
  const stockPrices = {
    AAPL: { symbol: 'AAPL', price: 185.42, change: 2.4, volume: 45289000, marketCap: '$2.9T' },
    NVDA: { symbol: 'NVDA', price: 432.81, change: 3.2, volume: 52134000, marketCap: '$1.1T' },
    TSLA: { symbol: 'TSLA', price: 248.73, change: -1.8, volume: 78456000, marketCap: '$792B' },
    GOOGL: { symbol: 'GOOGL', price: 141.52, change: 1.1, volume: 31245000, marketCap: '$1.8T' },
    MSFT: { symbol: 'MSFT', price: 414.31, change: 0.8, volume: 29876000, marketCap: '$3.1T' }
  };

  app.get("/api/stocks/prices", (_req, res) => {
    res.json({
      message: 'Stock prices retrieved successfully',
      data: stockPrices,
      timestamp: new Date().toISOString()
    });
  });

  app.get("/api/stocks/:symbol", (req, res) => {
    const symbol = req.params.symbol?.toUpperCase();
    if (!symbol || !stockPrices[symbol]) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json({
      message: 'Stock data retrieved successfully',
      data: stockPrices[symbol]
    });
  });

  // Portfolio optimization endpoint - basic implementation
  app.post("/api/portfolio/optimize", (req, res) => {
    const { riskLevel, amount, preferences } = req.body;

    if (!riskLevel || !amount) {
      return res.status(400).json({ error: 'Risk level and amount required' });
    }

    const allocations = {
      conservative: { stocks: 0.3, bonds: 0.6, cash: 0.1 },
      moderate: { stocks: 0.6, bonds: 0.3, cash: 0.1 },
      aggressive: { stocks: 0.8, bonds: 0.15, cash: 0.05 }
    };

    const allocation = allocations[riskLevel] || allocations.moderate;
    const safeAmount = Math.max(Number(amount) || 100, 100);

    const stocks = ['AAPL', 'NVDA', 'TSLA', 'GOOGL', 'MSFT'];
    const portfolio = stocks.map(symbol => ({
      symbol,
      allocation: (allocation.stocks / stocks.length * 100).toFixed(1),
      amount: ((allocation.stocks / stocks.length) * safeAmount).toFixed(2),
      currentPrice: stockPrices[symbol]?.price || 185.42,
      expectedReturn: (Math.random() * 20 + 5).toFixed(1) + '%'
    }));

    const expectedReturnValue = (allocation.stocks * 12 + allocation.bonds * 4 + allocation.cash * 1);

    res.json({
      message: 'Portfolio optimized successfully',
      data: {
        totalValue: safeAmount,
        expectedReturn: (expectedReturnValue || 10).toFixed(1) + '%',
        riskScore: riskLevel === 'conservative' ? 3 : riskLevel === 'moderate' ? 6 : 9,
        allocations: allocation,
        recommendations: portfolio,
        rebalanceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        diversificationScore: 8.5
      }
    });
  });

  return app;
}
