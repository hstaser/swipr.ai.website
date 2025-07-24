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

  // Stock swipe endpoint
  app.post("/api/stocks/swipe", (req, res) => {
    const { symbol, direction, userId } = req.body;

    if (!symbol || !direction) {
      return res.status(400).json({ error: 'Symbol and direction required' });
    }

    res.json({
      message: 'Stock swipe recorded successfully',
      data: {
        symbol,
        direction,
        userId: userId || 'anonymous',
        timestamp: new Date().toISOString(),
        portfolioUpdate: direction === 'right' ? {
          symbol,
          allocation: '5%',
          addedAt: new Date().toISOString()
        } : null
      }
    });
  });

  // Chat endpoint
  app.post("/api/chat", (req, res) => {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const responses = {
      'tech stock': "Based on current analysis, NVDA shows strong fundamentals with AI tailwinds.",
      'diversify': "I recommend diversifying across sectors: 30% tech, 25% healthcare, 20% finance, 15% consumer goods, 10% bonds/cash.",
      'expected return': "With your current allocation, expected annual return is 8-12%. Tech heavy weighting increases potential but adds volatility.",
      'AAPL': "AAPL is currently trading at $185.50 (+2.4%). Strong buy signals: iOS 18 adoption, services growth, China recovery."
    };

    let response = "I'm here to help with investment decisions! Ask me about portfolio allocation, stock analysis, or market trends.";

    for (const [key, defaultResponse] of Object.entries(responses)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        response = defaultResponse;
        break;
      }
    }

    res.json({
      message: 'Chat response generated',
      data: {
        response,
        sessionId: sessionId || `session_${Date.now()}`
      }
    });
  });

  // Portfolio simulation endpoint
  app.post("/api/portfolio/simulate", (req, res) => {
    const { allocation, timeframe = 12 } = req.body;

    if (!allocation) {
      return res.status(400).json({ error: 'Portfolio allocation required' });
    }

    const monthlyData = [];
    let currentValue = 10000;

    for (let i = 0; i <= timeframe; i++) {
      const monthlyReturn = (Math.random() - 0.5) * 0.04 + 0.008; // -2% to +2% monthly, avg 0.8%
      currentValue *= (1 + monthlyReturn);

      monthlyData.push({
        month: i,
        value: Math.round(currentValue),
        return: ((currentValue - 10000) / 10000 * 100).toFixed(2)
      });
    }

    res.json({
      message: 'Portfolio simulation completed',
      data: {
        simulation: monthlyData,
        finalValue: currentValue,
        totalReturn: ((currentValue - 10000) / 10000 * 100).toFixed(2),
        volatility: (Math.random() * 15 + 10).toFixed(1),
        sharpeRatio: (Math.random() * 2 + 0.5).toFixed(2)
      }
    });
  });

  return app;
}
