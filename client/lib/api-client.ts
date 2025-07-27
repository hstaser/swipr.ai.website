// Comprehensive API client for swipr.ai frontend

interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface WaitlistResponse {
  position: number;
  id: string;
}

interface PortfolioOptimization {
  totalValue: number;
  expectedReturn: string;
  riskScore: number;
  allocations: {
    stocks: number;
    bonds: number;
    cash: number;
  };
  recommendations: Array<{
    symbol: string;
    allocation: string;
    amount: string;
    currentPrice: number;
    expectedReturn: string;
  }>;
  rebalanceDate: string;
  diversificationScore: number;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  marketCap: string;
  recommendation?: string;
  targetPrice?: string;
  analystRating?: string;
  riskLevel?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    // Python FastAPI backend - 100% Python, no JavaScript/Node.js
    this.baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    this.token = localStorage.getItem("swipr_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const configWithAbort = {
      ...config,
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, configWithAbort);
      clearTimeout(timeoutId);

      // Read response as text first, then parse as JSON
      let responseText: string;
      try {
        responseText = await response.text();
      } catch (readError) {
        throw new Error(`Failed to read response: ${readError.message}`);
      }

      // Parse the text as JSON
      let data: any;
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(
            `Expected JSON but received text. Response: ${responseText.substring(0, 100)}...`,
          );
        }
      } else {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("API request failed:", error);

      // Handle different types of network errors
      if (error instanceof TypeError) {
        if (
          error.message.includes("fetch") ||
          error.message.includes("Failed to fetch")
        ) {
          throw new Error(
            "Network error. Please check your connection and try again.",
          );
        }
        if (error.message.includes("NetworkError")) {
          throw new Error(
            "Network error. Please check your connection and try again.",
          );
        }
      }

      // Handle AbortError (request timeout)
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.");
      }

      // Handle other fetch errors
      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        throw new Error("Unable to connect to server. Please try again.");
      }

      throw error;
    }
  }

  // Authentication methods
  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem("swipr_token", this.token);
    }

    return response.data!;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem("swipr_token", this.token);
    }

    return response.data!;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem("swipr_token");
  }

  // Waitlist methods
  async joinWaitlist(
    email: string,
    name: string,
    interests: string[] = [],
  ): Promise<WaitlistResponse> {
    const response = await this.request<WaitlistResponse>("/waitlist", {
      method: "POST",
      body: JSON.stringify({ email, name, interests }),
    });
    return response.data!;
  }

  // Portfolio methods
  async optimizePortfolio(
    riskLevel: "conservative" | "moderate" | "aggressive",
    amount: number,
    preferences: Record<string, any> = {},
  ): Promise<PortfolioOptimization> {
    const response = await this.request<PortfolioOptimization>(
      "/portfolio/optimize",
      {
        method: "POST",
        body: JSON.stringify({ riskLevel, amount, preferences }),
      },
    );
    return response.data!;
  }

  async simulatePortfolio(
    allocation: Record<string, number>,
    timeframe: number = 12,
  ): Promise<any> {
    const response = await this.request("/portfolio/simulate", {
      method: "POST",
      body: JSON.stringify({ allocation, timeframe }),
    });
    return response.data!;
  }

  // Stock data methods
  async getStockPrices(): Promise<Record<string, StockData>> {
    try {
      const response =
        await this.request<Record<string, StockData>>("/stocks/prices");
      return response.data!;
    } catch (error) {
      console.warn(
        "Failed to fetch stock prices from API, using fallback data:",
        error,
      );
      // Return fallback stock data so the app continues to work
      return {
        AAPL: {
          symbol: "AAPL",
          price: 185.42,
          change: 2.4,
          volume: 45289000,
          marketCap: "$2.9T",
        },
        NVDA: {
          symbol: "NVDA",
          price: 432.81,
          change: 3.2,
          volume: 52134000,
          marketCap: "$1.1T",
        },
        TSLA: {
          symbol: "TSLA",
          price: 248.73,
          change: -1.8,
          volume: 78456000,
          marketCap: "$792B",
        },
        GOOGL: {
          symbol: "GOOGL",
          price: 141.52,
          change: 1.1,
          volume: 31245000,
          marketCap: "$1.8T",
        },
        MSFT: {
          symbol: "MSFT",
          price: 414.31,
          change: 0.8,
          volume: 29876000,
          marketCap: "$3.1T",
        },
      };
    }
  }

  async getStockData(symbol: string): Promise<StockData> {
    const response = await this.request<StockData>(`/stocks/${symbol}`);
    return response.data!;
  }

  async swipeStock(
    symbol: string,
    direction: "left" | "right",
    userId?: string,
  ): Promise<any> {
    const response = await this.request("/stocks/swipe", {
      method: "POST",
      body: JSON.stringify({ symbol, direction, userId }),
    });
    return response.data!;
  }

  // Social features
  async followUser(targetUserId: string): Promise<{ isFollowing: boolean }> {
    const response = await this.request<{ isFollowing: boolean }>(
      "/social/follow",
      {
        method: "POST",
        body: JSON.stringify({ targetUserId }),
      },
    );
    return response.data!;
  }

  async unfollowUser(targetUserId: string): Promise<{ isFollowing: boolean }> {
    const response = await this.request<{ isFollowing: boolean }>(
      "/social/unfollow",
      {
        method: "POST",
        body: JSON.stringify({ targetUserId }),
      },
    );
    return response.data!;
  }

  // Chat/AI methods
  async sendChatMessage(
    message: string,
    sessionId?: string,
  ): Promise<{ response: string; sessionId: string }> {
    const response = await this.request<{
      response: string;
      sessionId: string;
    }>("/chat", {
      method: "POST",
      body: JSON.stringify({ message, sessionId }),
    });
    return response.data!;
  }

  // Analytics methods
  async trackEvent(
    event: string,
    properties: Record<string, any> = {},
    userId?: string,
  ): Promise<void> {
    try {
      // Detect embedded environment or FullStory interference
      const isEmbedded =
        window.top !== window.self ||
        window.location.href.includes("reload=") ||
        !!window.FS;

      if (isEmbedded) {
        console.debug(
          "Analytics tracking skipped: embedded environment detected",
        );
        return;
      }

      // Map the event name to valid eventType enum values
      const eventTypeMap: Record<string, string> = {
        page_view: "page_view",
        button_click: "button_click",
        form_submit: "form_submit",
        link_click: "link_click",
        portfolio_optimized: "button_click",
        stock_swiped: "button_click",
        waitlist_joined: "form_submit",
        contact_form_submitted: "form_submit",
        job_application_submitted: "form_submit",
        portfolio_copied: "button_click",
      };

      const eventType = eventTypeMap[event] || "button_click";

      // Generate required fields for analytics schema
      const analyticsData: any = {
        eventType,
        page: properties.page || window.location.pathname || "/",
        sessionId: properties.sessionId || `session_${Date.now()}`,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        location: window.location.href,
      };

      // Only include optional fields if they have valid values
      if (properties.element || event) {
        analyticsData.element = properties.element || event;
      }

      const value =
        properties.value || properties.amount || properties.position;
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        typeof value !== "object"
      ) {
        analyticsData.value = String(value);
      }

      if (document.referrer) {
        analyticsData.referrer = document.referrer;
      }

      await this.request("/analytics/track", {
        method: "POST",
        body: JSON.stringify(analyticsData),
      });
    } catch (error) {
      // Enhanced error handling for FullStory and embedded environments
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        console.debug(
          "Analytics tracking failed due to fetch interference, likely FullStory or embedded environment",
        );
        return;
      }

      // Graceful degradation - log but don't break app
      console.warn("Analytics tracking failed:", error);
    }
  }

  // Contact methods
  async sendContactMessage(
    name: string,
    email: string,
    message: string,
  ): Promise<{ id: string }> {
    const response = await this.request<{ id: string }>("/contact", {
      method: "POST",
      body: JSON.stringify({ name, email, message }),
    });
    return response.data!;
  }

  // Job application methods
  async submitJobApplication(applicationData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    coverLetter?: string;
    resumeUrl?: string;
  }): Promise<{ applicationId: string }> {
    const response = await this.request<{ applicationId: string }>(
      "/jobs/apply",
      {
        method: "POST",
        body: JSON.stringify(applicationData),
      },
    );
    return response.data!;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.request("/health");
    return response.data!;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type {
  User,
  AuthResponse,
  WaitlistResponse,
  PortfolioOptimization,
  StockData,
  ApiResponse,
};
