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
  private analyticsEnabled: boolean = true;

  constructor() {
    this.baseUrl = '/api';
    this.token = localStorage.getItem('swipr_token');

    // Allow disabling analytics via localStorage for debugging
    this.analyticsEnabled = localStorage.getItem('disable_analytics') !== 'true';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('swipr_token', this.token);
    }
    
    return response.data!;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('swipr_token', this.token);
    }
    
    return response.data!;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('swipr_token');
  }

  // Waitlist methods
  async joinWaitlist(email: string, name: string, interests: string[] = []): Promise<WaitlistResponse> {
    const response = await this.request<WaitlistResponse>('/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email, name, interests }),
    });
    return response.data!;
  }

  // Portfolio methods
  async optimizePortfolio(
    riskLevel: 'conservative' | 'moderate' | 'aggressive',
    amount: number,
    preferences: Record<string, any> = {}
  ): Promise<PortfolioOptimization> {
    const response = await this.request<PortfolioOptimization>('/portfolio/optimize', {
      method: 'POST',
      body: JSON.stringify({ riskLevel, amount, preferences }),
    });
    return response.data!;
  }

  async simulatePortfolio(allocation: Record<string, number>, timeframe: number = 12): Promise<any> {
    const response = await this.request('/portfolio/simulate', {
      method: 'POST',
      body: JSON.stringify({ allocation, timeframe }),
    });
    return response.data!;
  }

  // Stock data methods
  async getStockPrices(): Promise<Record<string, StockData>> {
    const response = await this.request<Record<string, StockData>>('/stocks/prices');
    return response.data!;
  }

  async getStockData(symbol: string): Promise<StockData> {
    const response = await this.request<StockData>(`/stocks/${symbol}`);
    return response.data!;
  }

  async swipeStock(symbol: string, direction: 'left' | 'right', userId?: string): Promise<any> {
    const response = await this.request('/stocks/swipe', {
      method: 'POST',
      body: JSON.stringify({ symbol, direction, userId }),
    });
    return response.data!;
  }

  // Social features
  async followUser(targetUserId: string): Promise<{ isFollowing: boolean }> {
    const response = await this.request<{ isFollowing: boolean }>('/social/follow', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    });
    return response.data!;
  }

  async unfollowUser(targetUserId: string): Promise<{ isFollowing: boolean }> {
    const response = await this.request<{ isFollowing: boolean }>('/social/unfollow', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    });
    return response.data!;
  }

  // Chat/AI methods
  async sendChatMessage(message: string, sessionId?: string): Promise<{ response: string; sessionId: string }> {
    const response = await this.request<{ response: string; sessionId: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    });
    return response.data!;
  }

  // Analytics methods
  async trackEvent(event: string, properties: Record<string, any> = {}, userId?: string): Promise<void> {
    // Simple analytics implementation that never throws errors
    if (!event) return;

    try {
      await this.request('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ event, properties, userId }),
      });
    } catch (error) {
      // Silently ignore analytics errors
    }
  }

  // Contact methods
  async sendContactMessage(name: string, email: string, message: string): Promise<{ id: string }> {
    const response = await this.request<{ id: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, message }),
    });
    return response.data!;
  }

  // Job application methods
  async submitJobApplication(applicationData: {
    position: string;
    name: string;
    email: string;
    phone?: string;
    coverLetter: string;
    resumeUrl?: string;
  }): Promise<{ applicationId: string }> {
    const response = await this.request<{ applicationId: string }>('/jobs/apply', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
    return response.data!;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.request('/health');
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
