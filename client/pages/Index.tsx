import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/lib/analytics";
import { Navigation } from "@/components/Navigation";
import { Logo } from "@/components/Logo";
import {
  apiClient,
  type PortfolioOptimization,
  type StockData,
} from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowRight,
  Brain,
  TrendingUp,
  Users,
  Mail,
  MapPin,
  Loader2,
  Settings,
  Sparkles,
  Zap,
  Smartphone,
  BarChart3,
  Shield,
  DollarSign,
  Target,
  Rocket,
  Linkedin,
  PlayCircle,
  ChevronDown,
  Eye,
  PieChart as PieChartIcon,
  Activity,
  MessageSquare,
  ArrowLeft,
  ArrowUp,
  Check,
  X,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  TrendingDown,
  Plus,
  Minus,
  RefreshCw,
  BookOpen,
  Heart,
  Star,
  Clock,
  Calendar,
  Globe,
  Briefcase,
} from "lucide-react";
import {
  ContactRequest,
  ContactResponse,
  WaitlistRequest,
  WaitlistResponse,
} from "@shared/api";

// Portfolio simulation data
const generatePortfolioData = (riskLevel: number) => {
  const baseData = [
    { month: "Jan", value: 10000, growth: 0 },
    { month: "Feb", value: 10200, growth: 2 },
    { month: "Mar", value: 10150, growth: 1.5 },
    { month: "Apr", value: 10400, growth: 4 },
    { month: "May", value: 10380, growth: 3.8 },
    { month: "Jun", value: 10650, growth: 6.5 },
    { month: "Jul", value: 10580, growth: 5.8 },
    { month: "Aug", value: 10820, growth: 8.2 },
    { month: "Sep", value: 10750, growth: 7.5 },
    { month: "Oct", value: 11050, growth: 10.5 },
    { month: "Nov", value: 11100, growth: 11 },
    { month: "Dec", value: 11350, growth: 13.5 },
  ];

  return baseData.map((item, index) => {
    const safeRiskLevel = typeof riskLevel === "number" ? riskLevel : 0.5;
    const growthMultiplier =
      (item.growth / 100) * 10000 * (1 + safeRiskLevel * 0.5);
    const calculatedValue = 10000 + growthMultiplier;
    const calculatedGrowth = item.growth * (1 + safeRiskLevel * 0.5);

    // S&P 500 baseline performance (typically 8-10% annually)
    const sp500Growth = item.growth * 0.7; // Slightly lower than optimized portfolio
    const sp500Value = 10000 + (sp500Growth / 100) * 10000;

    return {
      ...item,
      value: Math.floor(isNaN(calculatedValue) ? 10000 : calculatedValue),
      growth: isNaN(calculatedGrowth) ? item.growth : calculatedGrowth,
      sp500: Math.floor(isNaN(sp500Value) ? 10000 : sp500Value),
    };
  });
};

const stockAllocations = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    value: 25,
    color: "#3B82F6",
    logo: "https://logo.clearbit.com/apple.com",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    value: 20,
    color: "#10B981",
    logo: "https://logo.clearbit.com/nvidia.com",
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    value: 15,
    color: "#8B5CF6",
    logo: "https://logo.clearbit.com/tesla.com",
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    value: 12,
    color: "#F59E0B",
    logo: "https://logo.clearbit.com/microsoft.com",
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    value: 10,
    color: "#EF4444",
    logo: "https://logo.clearbit.com/google.com",
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    value: 8,
    color: "#EC4899",
    logo: "https://logo.clearbit.com/amazon.com",
  },
  {
    ticker: "CASH",
    name: "Cash (4.8% APY)",
    value: 10,
    color: "#14B8A6",
    logo: "",
  },
];

// For backward compatibility with pie charts
const pieData = stockAllocations.filter((item) => item.ticker !== "CASH");

// Company information database
const companyData = {
  AAPL: {
    name: "Apple Inc.",
    ticker: "AAPL",
    price: 185.42,
    change: 4.32,
    changePercent: 2.4,
    logo: "https://logo.clearbit.com/apple.com",
    sector: "Technology",
    industry: "Consumer Electronics",
    marketCap: "2.9T",
    peRatio: 28.5,
    dividendYield: 0.5,
    yearPerformance: 12.8,
    description:
      "Apple Inc. designs, manufactures, and markets consumer electronics, computer software, and online services worldwide.",
    news: [
      {
        title: "Apple Reports Record Q4 Earnings",
        summary: "iPhone sales exceed expectations with strong services growth",
        time: "2 hours ago",
      },
      {
        title: "New Vision Pro Updates Released",
        summary: "Enhanced productivity features and app ecosystem expansion",
        time: "1 day ago",
      },
      {
        title: "AI Integration Roadmap Announced",
        summary: "Machine learning capabilities coming to all Apple devices",
        time: "3 days ago",
      },
    ],
  },
  NVDA: {
    name: "NVIDIA Corporation",
    ticker: "NVDA",
    price: 145.25,
    change: 4.67,
    changePercent: 3.3,
    logo: "https://logo.clearbit.com/nvidia.com",
    sector: "Technology",
    industry: "Semiconductors",
    marketCap: "3.5T",
    peRatio: 52.8,
    dividendYield: 0.2,
    yearPerformance: 178.5,
    description:
      "NVIDIA Corporation provides graphics, computing and networking solutions for gaming, professional markets, and data centers.",
    news: [
      {
        title: "AI Chip Demand Surges",
        summary: "Data center revenue up 200% year-over-year",
        time: "4 hours ago",
      },
      {
        title: "New H200 GPU Launch",
        summary: "Next-generation AI accelerator for enterprise customers",
        time: "2 days ago",
      },
      {
        title: "Partnership with Major Cloud Providers",
        summary: "Expanding infrastructure for AI workloads globally",
        time: "1 week ago",
      },
    ],
  },
  TSLA: {
    name: "Tesla, Inc.",
    ticker: "TSLA",
    price: 412.87,
    change: 15.23,
    changePercent: 3.8,
    logo: "https://logo.clearbit.com/tesla.com",
    sector: "Consumer Cyclical",
    industry: "Auto Manufacturers",
    marketCap: "1.3T",
    peRatio: 65.4,
    dividendYield: 0.0,
    yearPerformance: 68.2,
    description:
      "Tesla, Inc. designs, develops, manufactures, and sells electric vehicles and energy generation and storage systems.",
    news: [
      {
        title: "Model Y Production Milestone",
        summary: "Reaches 2 million units produced globally",
        time: "6 hours ago",
      },
      {
        title: "Supercharger Network Expansion",
        summary: "Opening 500 new charging stations across North America",
        time: "1 day ago",
      },
      {
        title: "Full Self-Driving Update",
        summary: "Beta version 12.0 released to select customers",
        time: "4 days ago",
      },
    ],
  },
  MSFT: {
    name: "Microsoft Corporation",
    ticker: "MSFT",
    price: 378.91,
    change: 8.45,
    changePercent: 2.3,
    logo: "https://logo.clearbit.com/microsoft.com",
    sector: "Technology",
    industry: "Software - Infrastructure",
    marketCap: "2.8T",
    peRatio: 32.1,
    dividendYield: 0.7,
    yearPerformance: 18.9,
    description:
      "Microsoft Corporation develops and supports software, services, devices and solutions worldwide.",
    news: [
      {
        title: "Azure Cloud Revenue Jumps",
        summary: "40% growth in cloud services this quarter",
        time: "1 hour ago",
      },
      {
        title: "Copilot AI Integration",
        summary: "AI assistant now available across Office 365 suite",
        time: "2 days ago",
      },
      {
        title: "Gaming Division Strong Performance",
        summary: "Xbox Game Pass reaches 30 million subscribers",
        time: "5 days ago",
      },
    ],
  },
  AMZN: {
    name: "Amazon.com, Inc.",
    ticker: "AMZN",
    price: 158.72,
    change: 2.35,
    changePercent: 1.5,
    logo: "https://logo.clearbit.com/amazon.com",
    sector: "Consumer Discretionary",
    industry: "Internet Retail",
    marketCap: "1.7T",
    peRatio: 38.4,
    dividendYield: 0.0,
    yearPerformance: 42.8,
    description: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores.",
    news: [
      { title: "AWS Revenue Growth Accelerates", summary: "Cloud division shows strong enterprise adoption", time: "3 hours ago" },
      { title: "Prime Day Records Broken", summary: "Biggest shopping event in company history", time: "1 day ago" },
      { title: "Logistics Network Expansion", summary: "Opening 50 new fulfillment centers globally", time: "1 week ago" }
    ]
  }
};

// Reduced to 3 stocks for faster optimization
const stockCards = [
  {
    id: 1,
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "$185.42",
    change: "+2.4%",
    changeValue: "+$4.32",
    logo: "https://logo.clearbit.com/apple.com",
    sector: "Technology",
    marketCap: "$2.9T",
    description: "Consumer electronics and software company",
    recommendation: "BUY",
    aiScore: 92,
  },
  {
    id: 2,
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: "$248.73",
    change: "+5.7%",
    changeValue: "+$13.41",
    logo: "https://logo.clearbit.com/tesla.com",
    sector: "Automotive",
    marketCap: "$789B",
    description: "Electric vehicles and clean energy",
    recommendation: "BUY",
    aiScore: 88,
  },
  {
    id: 3,
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: "$721.33",
    change: "+3.2%",
    changeValue: "+$22.41",
    logo: "https://logo.clearbit.com/nvidia.com",
    sector: "Technology",
    marketCap: "$1.8T",
    description: "AI and graphics processing chips",
    recommendation: "STRONG BUY",
    aiScore: 95,
  },
];

export default function Index() {
  // Form and UI state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [waitlistData, setWaitlistData] = useState({
    name: "",
    email: "",
    interests: [] as string[],
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [waitlistMessage, setWaitlistMessage] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Backend-integrated state
  const [stockPrices, setStockPrices] = useState<Record<string, StockData>>({});
  const [portfolioOptimization, setPortfolioOptimization] =
    useState<PortfolioOptimization | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [riskLevel, setRiskLevel] = useState<
    "conservative" | "moderate" | "aggressive"
  >("moderate");
  const [investmentAmount, setInvestmentAmount] = useState(10000);

  // Portfolio and trading state
  const [portfolioData, setPortfolioData] = useState(
    generatePortfolioData(0.5),
  );
  const [userPortfolio, setUserPortfolio] = useState<any[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);

  // MVP Demo States
  const [mvpStep, setMvpStep] = useState(0);
  const [currentStockIndex, setCurrentStockIndex] = useState(0);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [swipedStocks, setSwipedStocks] = useState<{
    [key: number]: "left" | "right";
  }>({});
  const [portfolio, setPortfolio] = useState<typeof stockCards>([]);
  const [portfolioCopied, setPortfolioCopied] = useState(false);
  const [showExecutionScreen, setShowExecutionScreen] = useState(false);
  const [manualOverrides, setManualOverrides] = useState<
    Record<string, number>
  >({});

  // Interactive Chart States
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");
  const [comparedStocks, setComparedStocks] = useState<string[]>(["AAPL"]);

  // Company Drawer States
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [companyDrawerOpen, setCompanyDrawerOpen] = useState(false);

  // Chat and AI state
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      message: "Hi! I'm AlphaCue. Ask me anything about the market!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // Loading and error states
  const [isLoadingStocks, setIsLoadingStocks] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessages, setSuccessMessages] = useState<
    Record<string, string>
  >({});

  const {
    trackApplyClick,
    trackWaitlistSignup,
    trackFormSubmit,
    trackContactFormOpen,
    trackLearnMoreClick,
  } = useAnalytics();

  // Backend integration functions
  const loadStockPrices = async () => {
    setIsLoadingStocks(true);
    try {
      const prices = await apiClient.getStockPrices();
      setStockPrices(prices);
      // Track analytics (non-blocking)
      apiClient.trackEvent("stock_prices_loaded", {
        count: Object.keys(prices).length,
      });
      setSuccessMessages((prev) => ({
        ...prev,
        stocks: "Stock prices loaded",
      }));
    } catch (error) {
      console.warn("Failed to load stock prices, using offline data:", error);
      // Use fallback data so app continues to work
      setStockPrices({
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
      });
      setSuccessMessages((prev) => ({
        ...prev,
        stocks: "Using offline stock data",
      }));
    } finally {
      setIsLoadingStocks(false);
    }
  };

  const handlePortfolioOptimization = async () => {
    setIsOptimizing(true);
    try {
      const optimization = await apiClient.optimizePortfolio(
        riskLevel,
        investmentAmount,
      );
      setPortfolioOptimization(optimization);
      setPortfolioValue(optimization.totalValue);
      // Track analytics (non-blocking)
      apiClient.trackEvent("portfolio_optimized", {
        riskLevel,
        amount: investmentAmount,
        expectedReturn: optimization.expectedReturn,
      });
      setSuccessMessages((prev) => ({
        ...prev,
        portfolio: "Portfolio optimized successfully!",
      }));
    } catch (error) {
      console.error("Portfolio optimization failed:", error);
      setErrors((prev) => ({
        ...prev,
        portfolio: "Failed to optimize portfolio",
      }));
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleStockSwipe = async (direction: "left" | "right") => {
    const currentStock = stockCards[currentStockIndex];
    if (!currentStock) return;

    try {
      const result = await apiClient.swipeStock(currentStock.symbol, direction);

      setSwipedStocks((prev) => ({
        ...prev,
        [currentStockIndex]: direction,
      }));

      if (direction === "right" && result.portfolioUpdate) {
        setPortfolio((prev) => [...prev, currentStock]);
        setUserPortfolio((prev) => [...prev, result.portfolioUpdate]);
      }

      await apiClient.trackEvent("stock_swiped", {
        symbol: currentStock.symbol,
        direction,
        step: currentStockIndex + 1,
      });

      setCurrentStockIndex((prev) => prev + 1);
    } catch (error) {
      console.error("Stock swipe failed:", error);
      setErrors((prev) => ({ ...prev, swipe: "Failed to process swipe" }));
    }
  };

  const handleFollowUser = async (userId: string) => {
    try {
      if (followedUsers.has(userId)) {
        await apiClient.unfollowUser(userId);
        setFollowedUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        await apiClient.trackEvent("user_unfollowed", { targetUserId: userId });
      } else {
        await apiClient.followUser(userId);
        setFollowedUsers((prev) => new Set(prev).add(userId));
        await apiClient.trackEvent("user_followed", { targetUserId: userId });
      }
    } catch (error) {
      console.error("Follow action failed:", error);
      setErrors((prev) => ({
        ...prev,
        follow: "Failed to update follow status",
      }));
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setIsLoadingResponse(true);
    const userMessage = chatInput;
    setChatInput("");

    // Add user message immediately
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", message: userMessage },
    ]);

    try {
      const response = await apiClient.sendChatMessage(
        userMessage,
        chatSessionId,
      );
      setChatSessionId(response.sessionId);

      // Add bot response
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", message: response.response },
      ]);

      await apiClient.trackEvent("chat_message_sent", {
        messageLength: userMessage.length,
        sessionId: response.sessionId,
      });
    } catch (error) {
      console.error("Chat failed:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          message:
            "Sorry, I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingWaitlist(true);
    setErrors((prev) => ({ ...prev, waitlist: "" }));

    try {
      const result = await apiClient.joinWaitlist(
        waitlistData.email,
        waitlistData.name,
        waitlistData.interests,
      );

      setWaitlistMessage("Success! You've joined the waitlist.");
      setWaitlistData({ name: "", email: "", interests: [] });

      await apiClient.trackEvent("waitlist_joined", {
        position: result.position,
        interests: waitlistData.interests,
      });
      trackWaitlistSignup();
    } catch (error: any) {
      if (error.message?.includes("already on our waitlist")) {
        setWaitlistMessage("You're already on the waitlist!");
      } else {
        setErrors((prev) => ({
          ...prev,
          waitlist: error.message || "Failed to join waitlist",
        }));
      }
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setErrors((prev) => ({ ...prev, contact: "" }));

    try {
      const result = await apiClient.sendContactMessage(
        formData.name,
        formData.email,
        formData.message,
      );

      setContactMessage(
        "Message sent successfully! We'll get back to you soon.",
      );
      setFormData({ name: "", email: "", message: "" });

      await apiClient.trackEvent("contact_form_submitted", {
        messageId: result.id,
        messageLength: formData.message.length,
      });
      trackFormSubmit();
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        contact: error.message || "Failed to send message",
      }));
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update portfolio data when risk level changes
  useEffect(() => {
    const riskValue =
      riskLevel === "conservative" ? 0.3 : riskLevel === "moderate" ? 0.6 : 0.8;
    setPortfolioData(generatePortfolioData(riskValue));
  }, [riskLevel]);

  // Portfolio data remains static - no fake real-time updates

  // Initialize backend data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await loadStockPrices();
      } catch (error) {
        console.error("Failed to load stock prices:", error);
      }

      // Page view tracking disabled to prevent API errors
      console.log("App initialized successfully");
    };

    initializeData();

    // Set up live stock price updates every 10 seconds
    const stockUpdateInterval = setInterval(async () => {
      try {
        await loadStockPrices();
      } catch (error) {
        console.error("Failed to update stock prices:", error);
      }
    }, 10000);

    return () => clearInterval(stockUpdateInterval);
  }, []);

  // Auto-optimize portfolio when in demo mode
  useEffect(() => {
    if (mvpStep === 2) {
      setOptimizationProgress(0);
      const interval = setInterval(() => {
        setOptimizationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      const timer = setTimeout(() => {
        handlePortfolioOptimization();
      }, 2500);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [mvpStep, riskLevel, investmentAmount]);

  // Clear messages after some time
  useEffect(() => {
    Object.keys(successMessages).forEach((key) => {
      if (successMessages[key]) {
        const timer = setTimeout(() => {
          setSuccessMessages((prev) => ({ ...prev, [key]: "" }));
        }, 5000);
        return () => clearTimeout(timer);
      }
    });
  }, [successMessages]);

  useEffect(() => {
    Object.keys(errors).forEach((key) => {
      if (errors[key]) {
        const timer = setTimeout(() => {
          setErrors((prev) => ({ ...prev, [key]: "" }));
        }, 5000);
        return () => clearTimeout(timer);
      }
    });
  }, [errors]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getRiskMetrics = () => {
    const baseReturn = 13.5;
    const baseRisk = 12;

    // Convert string risk level to number with fallback
    let riskNumeric = 0.6; // default to moderate
    if (riskLevel === "conservative") riskNumeric = 0.3;
    else if (riskLevel === "moderate") riskNumeric = 0.6;
    else if (riskLevel === "aggressive") riskNumeric = 0.8;

    const expectedReturnCalc = baseReturn * (1 + riskNumeric * 0.8);
    const riskScoreCalc = baseRisk * (1 + riskNumeric * 0.6);
    const diversificationCalc = 95 - riskNumeric * 15;

    const expectedReturn = (
      isNaN(expectedReturnCalc) ? baseReturn : expectedReturnCalc
    ).toFixed(1);
    const riskScore = (isNaN(riskScoreCalc) ? baseRisk : riskScoreCalc).toFixed(
      1,
    );
    const diversification = (
      isNaN(diversificationCalc) ? 85 : diversificationCalc
    ).toFixed(0);

    return { expectedReturn, riskScore, diversification };
  };

  const mvpSteps = [
    "Welcome",
    "Swipe Stocks",
    "Optimization",
    "Portfolio",
    "Social",
    "Sign Up",
  ];

  const metrics = getRiskMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float-slow" />
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="group-hover:scale-110 transition-all duration-300">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  className="text-white"
                >
                  {/* Stylized arrow/diamond shape inspired by the logo */}
                  <path
                    d="M20 4 L36 20 L20 36 L4 20 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M20 4 L28 20 L20 36 L12 20 Z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                  <path d="M20 12 L28 20 L20 28 L12 20 Z" fill="currentColor" />
                  {/* Arrow pointing up and right */}
                  <path
                    d="M16 24 L20 20 L24 24 M20 20 L20 16"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">swipr.ai</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#hero"
                className="text-white/80 hover:text-white transition-all duration-300 font-medium relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 group-hover:w-full transition-all duration-300" />
              </a>
              <a
                href="#features"
                className="text-white/80 hover:text-white transition-all duration-300 font-medium relative group"
              >
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 group-hover:w-full transition-all duration-300" />
              </a>
              <a
                href="#mvp-demo"
                className="text-white/80 hover:text-white transition-all duration-300 font-medium relative group"
              >
                Try Demo
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 group-hover:w-full transition-all duration-300" />
              </a>
              <a
                href="#open-roles"
                className="text-white/80 hover:text-white transition-all duration-300 font-medium relative group"
              >
                Careers
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 group-hover:w-full transition-all duration-300" />
              </a>
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  const waitlistForm =
                    document.querySelector(".max-w-lg.mx-auto");
                  if (waitlistForm) {
                    waitlistForm.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent leading-tight animate-fade-in">
              swipr.ai
            </h1>
            <p className="text-2xl md:text-3xl font-bold mb-4 text-cyan-300 animate-fade-in-delayed">
              Swipe. Optimize. Grow.
            </p>
            <p className="text-xl md:text-2xl mb-12 text-slate-200 max-w-4xl mx-auto leading-relaxed animate-fade-in-slow">
              Smarter investing in seconds. Swipe through stocks like social
              media and let AI optimize your portfolio.
            </p>

            {/* Interactive Preview */}
            <div className="mb-12 relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md mx-auto">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-4">
                    <PlayCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">AAPL</span>
                      <span className="text-green-400">+2.4%</span>
                    </div>
                    <div className="text-sm text-white/70">Apple Inc.</div>
                  </div>
                  <div className="text-center text-white/60 text-sm">
                    Swipe to build your portfolio
                  </div>
                </div>
              </div>
            </div>

            {/* Hero CTA */}
            <div className="flex justify-center items-center mb-16">
              <Button
                onClick={() =>
                  document
                    .getElementById("mvp-demo")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 border-2 border-blue-400/50 hover:border-blue-300 group h-16"
              >
                <Eye className="mr-3 h-6 w-6" />
                See Demo
              </Button>
            </div>

            {/* Waitlist Form */}
            <div className="max-w-lg mx-auto">
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={waitlistData.name}
                    onChange={(e) =>
                      setWaitlistData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                    className="bg-white/10 backdrop-blur-lg border-white/30 text-white placeholder-white/60 h-14 rounded-xl flex-1"
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={waitlistData.email}
                    onChange={(e) =>
                      setWaitlistData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                    className="bg-white/10 backdrop-blur-lg border-white/30 text-white placeholder-white/60 h-14 rounded-xl flex-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmittingWaitlist}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 h-14 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  {isSubmittingWaitlist ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>
              </form>
              {waitlistMessage && (
                <p className="text-cyan-200 text-center mt-4 animate-fade-in">
                  {waitlistMessage}
                </p>
              )}
              {errors.waitlist && (
                <p className="text-red-400 text-center mt-4 animate-fade-in">
                  {errors.waitlist}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-16 md:py-24 lg:py-32 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8">
              Revolutionary
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Features
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed px-4">
              Experience the next generation of intelligent investing
            </p>
          </div>

          <div className="space-y-12 md:space-y-16 lg:space-y-20 max-w-7xl mx-auto">
            {/* Feature 1: Swipe to Invest */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-500 group">
                  <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-cyan-500/25">
                      <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                      Swipe to Invest
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-6">
                    Make investing as intuitive as swiping right. Explore
                    stocks, ETFs, and AI-picked assets with the familiar gesture
                    you know and love.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-slate-200">
                        Swipe right to invest, left to pass
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-slate-200">
                        AI curates personalized recommendations
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-slate-200">
                        Instant access to detailed analysis
                      </span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      document
                        .getElementById("mvp-demo")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                  >
                    See It In Action
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
              <div className="order-1 lg:order-2 mb-8 lg:mb-0">
                <div className="relative">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-cyan-400/30">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div
                        className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105"
                        onClick={() => {
                          setSelectedCompany("AAPL");
                          setCompanyDrawerOpen(true);
                        }}
                      >
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded mb-2 flex items-center justify-center">
                          <img
                            src="https://logo.clearbit.com/apple.com"
                            alt="AAPL"
                            className="w-4 h-4 md:w-6 md:h-6"
                          />
                        </div>
                        <div className="text-white font-semibold text-sm md:text-base">
                          AAPL
                        </div>
                        <div className="text-green-400 text-xs md:text-sm">
                          +2.4%
                        </div>
                      </div>
                      <div
                        className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105"
                        onClick={() => {
                          setSelectedCompany("TSLA");
                          setCompanyDrawerOpen(true);
                        }}
                      >
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded mb-2 flex items-center justify-center">
                          <img
                            src="https://logo.clearbit.com/tesla.com"
                            alt="TSLA"
                            className="w-4 h-4 md:w-6 md:h-6"
                          />
                        </div>
                        <div className="text-white font-semibold text-sm md:text-base">
                          TSLA
                        </div>
                        <div className="text-green-400 text-xs md:text-sm">
                          +5.7%
                        </div>
                      </div>
                      <div
                        className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 col-span-2 cursor-pointer hover:bg-white/20 transition-all duration-200 hover:scale-105"
                        onClick={() => {
                          setSelectedCompany('NVDA');
                          setCompanyDrawerOpen(true);
                        }}
                      >
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-white rounded mb-2 flex items-center justify-center">
                          <img
                            src="https://logo.clearbit.com/nvidia.com"
                            alt="NVDA"
                            className="w-4 h-4 md:w-6 md:h-6"
                          />
                        </div>
                        <div className="text-white font-semibold text-sm md:text-base">
                          NVDA
                        </div>
                        <div className="text-green-400 text-xs md:text-sm">
                          +3.3%
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-4 md:mt-6 text-white/60 text-xs md:text-sm">
                      ← Swipe left to pass • Swipe right to invest →
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Portfolio Optimization */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-1 mb-8 lg:mb-0">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-purple-400/30">
                    <div className="h-56 md:h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                            label={(entry) => `${entry.name} ${entry.value}%`}
                            labelLine={false}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(15, 23, 42, 0.95)",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              borderRadius: "12px",
                              color: "white",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4 text-white/60 text-xs md:text-sm">
                      Automatically balanced portfolio
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-500 group">
                  <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-purple-500/25">
                      <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                      Portfolio Optimization
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-6">
                    Our algorithm allocates for you — balancing risk, growth,
                    and diversification automatically based on modern portfolio
                    theory.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-slate-200">
                        Automatic rebalancing
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-slate-200">
                        Risk-adjusted optimization
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-slate-200">
                        Tax-loss harvesting
                      </span>
                    </li>
                  </ul>
                  <Button
                    onClick={async () => {
                      try {
                        // Start portfolio simulation
                        await handlePortfolioOptimization();

                        // Track simulator usage
                        await apiClient.trackEvent("simulator_accessed", {
                          source: "features_section",
                          riskLevel: riskLevel,
                          amount: investmentAmount,
                        });

                        // Navigate to simulator
                        document
                          .getElementById("simulator")
                          ?.scrollIntoView({ behavior: "smooth" });

                        setMvpStep(2); // Go to simulation step

                        setSuccessMessages((prev) => ({
                          ...prev,
                          simulator: "Portfolio simulation started!",
                        }));
                      } catch (error) {
                        setErrors((prev) => ({
                          ...prev,
                          simulator: "Failed to start simulation",
                        }));
                      }
                    }}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Try Simulator
                    <BarChart3 className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature 3: Real-time Analytics */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 hover:border-emerald-400/50 transition-all duration-500 group">
                  <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-emerald-500/25">
                      <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                      Real-time Analytics
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-6">
                    See your performance live. Watch how each swipe shifts your
                    future with instant portfolio impact visualization.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-slate-200">
                        Live performance tracking
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-slate-200">
                        Instant portfolio impact
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-slate-200">
                        Predictive analytics
                      </span>
                    </li>
                  </ul>
                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                    onClick={async () => {
                      try {
                        // Simulate fetching real analytics data
                        await loadStockPrices();

                        // Track analytics view
                        await apiClient.trackEvent("analytics_viewed", {
                          source: "features_section",
                          portfolioValue: portfolioValue || 11350,
                        });

                        // Scroll to analytics section in demo
                        document
                          .getElementById("mvp-demo")
                          ?.scrollIntoView({ behavior: "smooth" });
                        setMvpStep(5); // Go to analytics demo step

                        setSuccessMessages((prev) => ({
                          ...prev,
                          analytics: "Loading real-time analytics...",
                        }));
                      } catch (error) {
                        setErrors((prev) => ({
                          ...prev,
                          analytics: "Failed to load analytics",
                        }));
                      }
                    }}
                  >
                    View Analytics
                    <div className="ml-2">
                      <Logo variant="transparent" size="sm" showText={false} />
                    </div>
                  </Button>
                </div>
              </div>
              <div className="order-1 lg:order-2 mb-8 lg:mb-0">
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl md:rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-emerald-400/30">
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-center justify-between p-3 md:p-4 bg-white/10 rounded-lg md:rounded-xl">
                        <span className="text-white text-sm md:text-base">
                          Portfolio Value
                        </span>
                        <span className="text-emerald-400 font-bold text-sm md:text-base">
                          $11,350
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 md:p-4 bg-white/10 rounded-lg md:rounded-xl">
                        <span className="text-white text-sm md:text-base">
                          Total Return
                        </span>
                        <span className="text-emerald-400 font-bold text-sm md:text-base">
                          +13.5%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 md:p-4 bg-white/10 rounded-lg md:rounded-xl">
                        <span className="text-white text-sm md:text-base">
                          Today's Gain
                        </span>
                        <span className="text-emerald-400 font-bold text-sm md:text-base">
                          +$142.30
                        </span>
                      </div>
                      <div className="h-32 bg-white/10 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-white text-sm">
                            Portfolio updated
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 text-sm font-medium">
                            +2.1%
                          </div>
                          <div className="text-white/60 text-xs">Last 24h</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Smart Chatbot */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-orange-400/50 transition-all duration-500 group">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-orange-500/25">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      AlphaCue (Coming Soon)
                    </h3>
                  </div>
                  <p className="text-lg text-slate-200 leading-relaxed mb-6">
                    Ask our AI any market question. Built on real-time data and
                    LLM intelligence to provide instant, accurate investment
                    insights.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Real-time market data
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Personalized recommendations
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">24/7 availability</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="order-2">
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl p-6 backdrop-blur-sm border border-orange-400/30 max-w-md">
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      <div className="flex justify-start">
                        <div className="bg-white/20 rounded-lg p-2 max-w-xs">
                          <div className="text-white text-sm">
                            Hi! I'm AlphaCue. Ask me about the market!
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-blue-600 rounded-lg p-2 max-w-xs">
                          <div className="text-white text-sm">
                            What's the best tech stock right now?
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white/20 rounded-lg p-2 max-w-xs">
                          <div className="text-white text-sm">
                            Based on current data, NVDA shows strong momentum
                            with AI tailwinds.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center p-2 bg-white/10 rounded-lg">
                      <input
                        placeholder="Ask AlphaCue... (Coming Feature)"
                        className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-sm"
                        disabled
                      />
                      <MessageSquare className="h-4 w-4 text-white/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5: Social Trading */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-pink-400/50 transition-all duration-500 group">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-pink-500/25">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      Social Trading
                    </h3>
                  </div>
                  <p className="text-lg text-slate-200 leading-relaxed mb-6">
                    See what your friends are swiping on. Build or clone
                    portfolios together and learn from successful investors.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Follow top performers
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Copy successful portfolios
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">Share your wins</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => {
                      setMvpStep(5);
                      document
                        .getElementById("mvp-demo")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Explore Social
                    <Users className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-3xl p-8 backdrop-blur-sm border border-pink-400/30">
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-white/10 rounded-xl">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">M</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold">
                            Michael Rodriguez
                          </div>
                          <div className="text-green-400 text-sm">
                            +24.7% this year
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className={
                            followedUsers.has("michael-rodriguez")
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }
                          onClick={() => handleFollowUser("michael-rodriguez")}
                        >
                          {followedUsers.has("michael-rodriguez")
                            ? "Following"
                            : "Follow"}
                        </Button>
                      </div>
                      <div className="flex items-center p-4 bg-white/10 rounded-xl">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">S</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold">
                            Sarah Kim
                          </div>
                          <div className="text-green-400 text-sm">
                            +18.3% this year
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className={
                            followedUsers.has("sarah-kim")
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }
                          onClick={() => handleFollowUser("sarah-kim")}
                        >
                          {followedUsers.has("sarah-kim")
                            ? "Following"
                            : "Follow"}
                        </Button>
                      </div>
                      <div className="flex items-center p-4 bg-white/10 rounded-xl">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold">J</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold">
                            Jake Thompson
                          </div>
                          <div className="text-green-400 text-sm">
                            +15.9% this year
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className={
                            followedUsers.has("jake-thompson")
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }
                          onClick={() => handleFollowUser("jake-thompson")}
                        >
                          {followedUsers.has("jake-thompson")
                            ? "Following"
                            : "Follow"}
                        </Button>
                      </div>
                      <div className="p-4 bg-white/10 rounded-xl">
                        <div className="text-white/60 text-sm mb-2">
                          Popular swipes today:
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                            AAPL
                          </span>
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                            NVDA
                          </span>
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                            TSLA
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive MVP Demo Section */}
      <section id="mvp-demo" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Experience Swipr
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                Before You Sign Up
              </span>
            </h2>
            <p className="text-xl text-slate-200 leading-relaxed">
              Take a full walkthrough of our platform with this interactive demo
            </p>
          </div>

          {/* MVP Demo Container */}
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {mvpSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${index < mvpSteps.length - 1 ? "flex-1" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        index <= mvpStep
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                          : "bg-white/20 text-white/60"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < mvpSteps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                          index < mvpStep
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                            : "bg-white/20"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center text-white/60">
                Step {mvpStep + 1} of {mvpSteps.length}: {mvpSteps[mvpStep]}
              </div>
            </div>

            {/* Demo Content */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/20 min-h-[600px] flex flex-col">
              {/* Step 0: Welcome */}
              {mvpStep === 0 && (
                <div className="flex-1 flex items-center justify-center p-12 text-center">
                  <div>
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/25">
                      <Rocket className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-6">
                      Welcome to swipr.ai
                    </h3>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl">
                      Ready to revolutionize your investing experience? Let's
                      take a quick tour through our platform.
                    </p>
                    <Button
                      onClick={() => setMvpStep(1)}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-12 py-4 rounded-xl text-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                    >
                      Try Demo
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1: Swipe Screen */}
              {mvpStep === 1 && (
                <div className="flex-1 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <Button
                      onClick={() => setMvpStep(0)}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <div className="text-center flex-1">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Swipe Through Stocks
                      </h3>
                      <p className="text-white/80">
                        Swipe right to invest, left to pass • 3 stocks total
                      </p>
                    </div>
                    <div className="w-20"></div>
                  </div>
                  {currentStockIndex < stockCards.length ? (
                    <div className="max-w-md mx-auto">
                      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center">
                            <img
                              src={stockCards[currentStockIndex].logo}
                              alt={stockCards[currentStockIndex].symbol}
                              className="w-12 h-12"
                            />
                          </div>
                          <div className="text-2xl font-bold text-white mb-2">
                            {stockCards[currentStockIndex].symbol}
                          </div>
                          <div className="text-white/80 mb-2">
                            {stockCards[currentStockIndex].name}
                          </div>
                          <div className="text-3xl font-bold text-white mb-1">
                            {stockCards[currentStockIndex].price}
                          </div>
                          <div
                            className={`text-lg font-semibold ${stockCards[currentStockIndex].change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                          >
                            {stockCards[currentStockIndex].change} (
                            {stockCards[currentStockIndex].changeValue})
                          </div>
                        </div>
                        <div className="space-y-4 mb-8">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Sector:</span>
                            <span className="text-white">
                              {stockCards[currentStockIndex].sector}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Market Cap:</span>
                            <span className="text-white">
                              {stockCards[currentStockIndex].marketCap}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">AI Score:</span>
                            <span className="text-cyan-400 font-bold">
                              {stockCards[currentStockIndex].aiScore}/100
                            </span>
                          </div>
                          <div className="text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                stockCards[currentStockIndex].recommendation ===
                                "STRONG BUY"
                                  ? "bg-green-500/20 text-green-400"
                                  : stockCards[currentStockIndex]
                                        .recommendation === "BUY"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {stockCards[currentStockIndex].recommendation}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => handleStockSwipe("left")}
                            variant="outline"
                            className="flex-1 border-red-400 text-red-400 hover:bg-red-400/10 h-14 rounded-xl"
                          >
                            <X className="mr-2 h-6 w-6" />
                            Pass
                          </Button>
                          <Button
                            onClick={() => handleStockSwipe("right")}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-14 rounded-xl"
                          >
                            <Check className="mr-2 h-6 w-6" />
                            Invest
                          </Button>
                        </div>
                      </div>
                      <div className="text-center mt-6 space-y-2">
                        <div className="text-white/60 text-sm">
                          {currentStockIndex + 1} of {stockCards.length} stocks
                        </div>
                        <div className="text-white/50 text-xs">
                          Tip: Choose stocks you'd actually want to invest in
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-white mb-4">
                        Great job! You've reviewed all stocks.
                      </div>
                      <Button
                        onClick={() => setMvpStep(2)}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold"
                      >
                        Continue to Portfolio
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Optimization Preview - Faster */}
              {mvpStep === 2 && (
                <div className="flex-1 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <Button
                      onClick={() => setMvpStep(1)}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <div className="text-center flex-1">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        AI Portfolio Optimization
                      </h3>
                      <p className="text-white/80">
                        Our AI creates your perfect portfolio balance
                      </p>
                    </div>
                    <div className="w-20"></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-4">
                        Your Selections
                      </h4>
                      <div className="space-y-3">
                        {portfolio.map((stock, index) => (
                          <div
                            key={stock.id}
                            className="flex items-center justify-between p-3 bg-white/10 rounded-xl"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-white rounded mr-3 flex items-center justify-center">
                                <img
                                  src={stock.logo}
                                  alt={stock.symbol}
                                  className="w-6 h-6"
                                />
                              </div>
                              <div>
                                <div className="text-white font-semibold">
                                  {stock.symbol}
                                </div>
                                <div className="text-white/60 text-sm">
                                  {stock.name}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-semibold">
                                {stock.price}
                              </div>
                              <div
                                className={`text-sm ${stock.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                              >
                                {stock.change}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-4">
                        Optimized Allocation
                      </h4>
                      <div className="bg-white/10 rounded-xl p-6">
                        {optimizationProgress < 100 ? (
                          <div className="h-48 flex flex-col items-center justify-center">
                            <RefreshCw className="h-12 w-12 text-cyan-400 mx-auto mb-4 animate-spin" />
                            <div className="text-white/80 mb-4">
                              Optimizing portfolio...
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${optimizationProgress}%` }}
                              />
                            </div>
                            <div className="text-cyan-400 font-bold">
                              {optimizationProgress}%
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 flex flex-col justify-center">
                            <div className="text-center mb-6">
                              <Check className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
                              <div className="text-emerald-400 font-bold">
                                Optimization Complete!
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-300">
                              Expected Return:
                            </span>
                            <span className="text-emerald-400 font-bold">
                              +12.8%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Risk Score:</span>
                            <span className="text-orange-400 font-bold">
                              Medium
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">
                              Diversification:
                            </span>
                            <span className="text-blue-400 font-bold">78%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {optimizationProgress >= 100 && (
                    <div className="text-center mt-8">
                      <Button
                        onClick={() => setMvpStep(3)}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold"
                      >
                        View Your Portfolio
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Portfolio Breakdown */}
              {mvpStep === 3 && (
                <div className="flex-1 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <Button
                      onClick={() => setMvpStep(2)}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <div className="text-center flex-1">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Your Optimized Portfolio
                      </h3>
                      <p className="text-white/80">
                        Perfectly balanced for risk and return
                      </p>
                    </div>
                    <div className="w-20"></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart
                            margin={{
                              top: 40,
                              right: 40,
                              bottom: 40,
                              left: 40,
                            }}
                          >
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={(entry) => `${entry.name} ${entry.value}%`}
                              labelLine={false}
                            >
                              {pieData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                border: "1px solid rgba(255, 255, 255, 0.2)",
                                borderRadius: "12px",
                                color: "white",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                        <h4 className="text-xl font-semibold text-white mb-4">
                          Portfolio Metrics
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 text-sm">
                              Total Value:
                            </span>
                            <span className="text-white font-bold text-lg">
                              $10,000
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 text-sm">
                              Expected Return (Annual):
                            </span>
                            <span className="text-emerald-400 font-bold text-lg">
                              +12.8%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 text-sm">
                              Risk Level:
                            </span>
                            <span className="text-orange-400 font-bold">
                              Medium
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 text-sm">
                              Sharpe Ratio:
                            </span>
                            <span className="text-blue-400 font-bold">
                              0.89
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
                        <h4 className="text-xl font-semibold text-white mb-4">
                          Watchlist
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-white font-semibold">
                                AAPL
                              </span>
                              <span className="text-slate-300 text-sm">
                                Apple Inc.
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">
                                $185.{Math.floor(Math.random() * 100)}
                              </div>
                              <div className="text-green-400 text-sm">
                                +
                                {(2.4 + (Math.random() - 0.5) * 0.5).toFixed(1)}
                                %
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-white font-semibold">
                                NVDA
                              </span>
                              <span className="text-slate-300 text-sm">
                                NVIDIA Corp.
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">
                                $432.{Math.floor(Math.random() * 100)}
                              </div>
                              <div className="text-green-400 text-sm">
                                +
                                {(3.2 + (Math.random() - 0.5) * 0.7).toFixed(1)}
                                %
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-white font-semibold">
                                TSLA
                              </span>
                              <span className="text-slate-300 text-sm">
                                Tesla Inc.
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">
                                $248.{Math.floor(Math.random() * 100)}
                              </div>
                              <div className="text-red-400 text-sm">
                                -
                                {(1.8 + (Math.random() - 0.5) * 0.3).toFixed(1)}
                                %
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-6">
                        <h4 className="text-xl font-semibold text-white mb-4">
                          Top Holdings
                        </h4>
                        <div className="space-y-3">
                          {portfolio.slice(0, 3).map((stock, index) => {
                            const allocations = ["32%", "28%", "25%"]; // Tech total: 60%, Auto: 25%, Others: 15%
                            return (
                              <div
                                key={stock.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-white rounded mr-3 flex items-center justify-center">
                                    <img
                                      src={stock.logo}
                                      alt={stock.symbol}
                                      className="w-4 h-4"
                                    />
                                  </div>
                                  <span className="text-white">
                                    {stock.symbol}
                                  </span>
                                </div>
                                <span className="text-white/60">
                                  {allocations[index]}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-8">
                    <Button
                      onClick={() => setMvpStep(4)}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold"
                    >
                      Explore Social Trading
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Social Features */}
              {mvpStep === 4 && (
                <div className="flex-1 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <Button
                      onClick={() => setMvpStep(3)}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <div className="text-center flex-1">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Social Trading
                      </h3>
                      <p className="text-white/80">
                        See what your network is investing in
                      </p>
                    </div>
                    <div className="w-20"></div>
                  </div>
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-white/10 rounded-xl p-6">
                      <h4 className="text-xl font-semibold text-white mb-4">
                        Featured Investor
                      </h4>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-lg">
                            M
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-semibold">
                            Michael Rodriguez
                          </div>
                          <div className="text-emerald-400">
                            +24.7% this year �� 2.1k followers
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-white rounded mr-3 flex items-center justify-center">
                              <img
                                src="https://logo.clearbit.com/apple.com"
                                alt="AAPL"
                                className="w-4 h-4"
                              />
                            </div>
                            <span className="text-white">AAPL</span>
                          </div>
                          <span className="text-white/60">32%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-white rounded mr-3 flex items-center justify-center">
                              <img
                                src="https://logo.clearbit.com/nvidia.com"
                                alt="NVDA"
                                className="w-4 h-4"
                              />
                            </div>
                            <span className="text-white">NVDA</span>
                          </div>
                          <span className="text-white/60">28%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-white rounded mr-3 flex items-center justify-center">
                              <img
                                src="https://logo.clearbit.com/tesla.com"
                                alt="TSLA"
                                className="w-4 h-4"
                              />
                            </div>
                            <span className="text-white">TSLA</span>
                          </div>
                          <span className="text-white/60">25%</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          className={`flex-1 ${
                            portfolioCopied
                              ? "bg-gradient-to-r from-green-600 to-emerald-600"
                              : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                          } text-white rounded-xl transition-all duration-300`}
                          disabled={portfolioCopied}
                          onClick={async () => {
                            try {
                              // Simulate copying a featured user's portfolio
                              const portfolioData = {
                                riskLevel: "moderate" as const,
                                amount: 10000,
                                preferences: { copyFrom: "featured-user" },
                              };

                              await handlePortfolioOptimization();
                              await apiClient.trackEvent("portfolio_copied", {
                                sourceUser: "featured-user",
                                amount: 10000,
                              });

                              setPortfolioCopied(true);
                              setShowExecutionScreen(true);
                              setSuccessMessages((prev) => ({
                                ...prev,
                                portfolio: "Portfolio copied successfully!",
                              }));

                              // Reset the button after 3 seconds
                              setTimeout(() => {
                                setPortfolioCopied(false);
                              }, 3000);
                            } catch (error) {
                              setErrors((prev) => ({
                                ...prev,
                                portfolio: "Failed to copy portfolio",
                              }));
                            }
                          }}
                        >
                          {portfolioCopied ? (
                            <>
                              <Check className="mr-2 h-5 w-5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-5 w-5" />
                              Copy Portfolio
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          className={
                            followedUsers.has("featured-user")
                              ? "flex-1 border-green-400 text-green-300 bg-green-400/10 rounded-xl"
                              : "flex-1 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 rounded-xl"
                          }
                          onClick={() => handleFollowUser("featured-user")}
                        >
                          {followedUsers.has("featured-user") ? (
                            <>
                              <svg
                                className="mr-2 h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              Following
                            </>
                          ) : (
                            <>
                              <Heart className="mr-2 h-5 w-5" />
                              Follow
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-6">
                      <h4 className="text-xl font-semibold text-white mb-4">
                        Trending Today
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-white/10 rounded-lg">
                          <div className="w-8 h-8 bg-white rounded mb-2 mx-auto flex items-center justify-center">
                            <img
                              src="https://logo.clearbit.com/apple.com"
                              alt="AAPL"
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="text-white font-semibold">AAPL</div>
                          <div className="text-green-400 text-sm">
                            453 swipes
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white/10 rounded-lg">
                          <div className="w-8 h-8 bg-white rounded mb-2 mx-auto flex items-center justify-center">
                            <img
                              src="https://logo.clearbit.com/nvidia.com"
                              alt="NVDA"
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="text-white font-semibold">NVDA</div>
                          <div className="text-green-400 text-sm">
                            392 swipes
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white/10 rounded-lg">
                          <div className="w-8 h-8 bg-white rounded mb-2 mx-auto flex items-center justify-center">
                            <img
                              src="https://logo.clearbit.com/tesla.com"
                              alt="TSLA"
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="text-white font-semibold">TSLA</div>
                          <div className="text-green-400 text-sm">
                            287 swipes
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button
                        onClick={() => setMvpStep(5)}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold"
                      >
                        Ready to Get Started?
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Final CTA */}
              {mvpStep === 5 && (
                <div className="flex-1 flex items-center justify-center p-12 text-center">
                  <div>
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/25">
                      <Check className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-6">
                      Ready to Build Your Real Portfolio?
                    </h3>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl">
                      You've seen how easy and powerful swipr.ai can be. Join
                      thousands of smart investors already building wealth with
                      our platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() =>
                          document
                            .getElementById("hero")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-4 rounded-xl text-xl font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                      >
                        Sign Up Free
                        <Rocket className="ml-3 h-6 w-6" />
                      </Button>
                      <Button
                        onClick={() => {
                          setMvpStep(0);
                          setCurrentStockIndex(0);
                          setPortfolio([]);
                          setSwipedStocks({});
                          setOptimizationProgress(0);
                        }}
                        variant="outline"
                        className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 px-12 py-4 rounded-xl text-xl font-bold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-sm"
                      >
                        <RefreshCw className="mr-3 h-6 w-6" />
                        Try Demo Again
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Execution Screen */}
      {showExecutionScreen && (
        <section className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-600">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Execute Portfolio
              </h2>
              <Button
                onClick={() => setShowExecutionScreen(false)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Portfolio Overview */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Stock Allocation
                </h3>
                <div className="space-y-4">
                  {stockAllocations.map((stock, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {stock.logo ? (
                          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <img
                              src={stock.logo}
                              alt={stock.ticker}
                              className="w-4 h-4"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: stock.color }}
                          >
                            $
                          </div>
                        )}
                        <div>
                          <div className="text-slate-200 font-medium">
                            {stock.ticker}
                          </div>
                          {stock.ticker === "CASH" && (
                            <div className="text-emerald-400 text-xs">
                              Earn 4.8% overnight yield
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-white font-semibold w-12 text-right">
                          {manualOverrides[stock.ticker] ?? stock.value}%
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={manualOverrides[stock.ticker] ?? stock.value}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value);
                            const currentTotal = stockAllocations.reduce(
                              (sum, s) =>
                                sum + (manualOverrides[s.ticker] ?? s.value),
                              0,
                            );
                            const currentStock =
                              manualOverrides[stock.ticker] ?? stock.value;
                            const newTotal =
                              currentTotal - currentStock + newValue;

                            if (newTotal <= 100) {
                              setManualOverrides((prev) => ({
                                ...prev,
                                [stock.ticker]: newValue,
                              }));
                            }
                          }}
                          className="w-24 h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer slider hover:bg-slate-500 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Allocation Warning */}
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Allocation:</span>
                    <span
                      className={`font-bold text-lg ${
                        (Object.keys(manualOverrides).length > 0
                          ? stockAllocations.reduce(
                              (sum, stock) =>
                                sum +
                                (manualOverrides[stock.ticker] ?? stock.value),
                              0,
                            )
                          : stockAllocations.reduce(
                              (sum, stock) => sum + stock.value,
                              0,
                            )) === 100
                          ? "text-emerald-400"
                          : "text-orange-400"
                      }`}
                    >
                      {Object.keys(manualOverrides).length > 0
                        ? stockAllocations.reduce(
                            (sum, stock) =>
                              sum +
                              (manualOverrides[stock.ticker] ?? stock.value),
                            0,
                          )
                        : stockAllocations.reduce(
                            (sum, stock) => sum + stock.value,
                            0,
                          )}
                      %
                    </span>
                  </div>
                  {(Object.keys(manualOverrides).length > 0
                    ? stockAllocations.reduce(
                        (sum, stock) =>
                          sum + (manualOverrides[stock.ticker] ?? stock.value),
                        0,
                      )
                    : stockAllocations.reduce(
                        (sum, stock) => sum + stock.value,
                        0,
                      )) !== 100 && (
                    <div className="text-orange-400 text-sm mt-1">
                      ⚠️ Portfolio must total 100% for optimal performance
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Investment Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Investment:</span>
                    <span className="text-white font-bold text-lg">
                      $10,000
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">
                      Expected Annual Return:
                    </span>
                    <span className="text-emerald-400 font-bold">+12.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Risk Score:</span>
                    <span className="text-orange-400 font-bold">Medium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Estimated 1Y Value:</span>
                    <span className="text-cyan-400 font-bold">$11,280</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Override Section */}
            <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Manual Overrides
                </h3>
                <Button
                  onClick={() => setManualOverrides({})}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:text-white text-sm"
                >
                  Reset to AI Recommendations
                </Button>
              </div>
              <p className="text-slate-400 text-sm">
                Adjust individual stock allocations above. Portfolio must total
                100% for optimal performance. Cash allocation earns 4.8%
                overnight yield on unallocated funds.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-14 rounded-xl font-semibold"
                onClick={() => {
                  setShowExecutionScreen(false);
                  alert(
                    "Portfolio executed successfully! You would now be redirected to your brokerage account.",
                  );
                }}
              >
                <Target className="mr-2 h-5 w-5" />
                Execute Portfolio ($10,000)
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 h-14 rounded-xl font-semibold"
                onClick={() => {
                  alert("Portfolio saved to watchlist!");
                }}
              >
                <Eye className="mr-2 h-5 w-5" />
                Save to Watchlist
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Simulator Section */}
      <section id="simulator" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Portfolio
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {" "}
                  Simulator
                </span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                See how different risk levels affect your portfolio performance
              </p>
            </div>

            <div className={`${comparedStocks.length > 1 ? 'w-full' : 'grid lg:grid-cols-2 gap-12 items-center'}`}>
              {/* Enhanced Interactive Chart */}
              <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 ${comparedStocks.length > 1 ? 'w-full' : ''}`}>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      Portfolio vs S&P 500
                    </h3>
                    <div className="flex items-center space-x-2">
                      {["1D", "1W", "1M", "3M", "1Y"].map((timeframe) => (
                        <button
                          key={timeframe}
                          className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                            selectedTimeframe === timeframe
                              ? "bg-cyan-500 text-white"
                              : "bg-white/10 text-white/70 hover:bg-white/20"
                          }`}
                          onClick={() => setSelectedTimeframe(timeframe)}
                        >
                          {timeframe}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Performance Comparison Legend */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-2"></div>
                      <span className="text-white/80">Your Portfolio</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                      <span className="text-white/80">S&P 500</span>
                    </div>
                  </div>

                  {/* Risk Level Slider */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-white font-semibold">
                        Risk Level
                      </label>
                      <span className="text-cyan-400 font-bold">
                        {Math.round(riskLevel * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Portfolio vs S&P 500 Chart */}
                  <div className="h-96 bg-slate-900/50 rounded-xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={portfolioData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#ffffff15"
                          horizontal={true}
                          vertical={false}
                        />
                        <XAxis
                          dataKey="month"
                          stroke="#ffffff60"
                          fontSize={11}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#ffffff60" }}
                        />
                        <YAxis
                          stroke="#ffffff60"
                          fontSize={11}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#ffffff60" }}
                          domain={['dataMin - 200', 'dataMax + 200']}
                          tickFormatter={(value) =>
                            `$${(value / 1000).toFixed(0)}k`
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            border: "1px solid rgba(6, 182, 212, 0.3)",
                            borderRadius: "8px",
                            color: "white",
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                          }}
                          labelStyle={{ color: "#06b6d4" }}
                          cursor={{ stroke: "#06b6d4", strokeWidth: 1 }}
                        />

                        {/* Portfolio Line */}
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#06b6d4"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{
                            r: 6,
                            fill: "#06b6d4",
                            stroke: "#ffffff",
                            strokeWidth: 2,
                          }}
                          name="Portfolio"
                        />

                        {/* S&P 500 Comparison Line */}
                        <Line
                          type="monotone"
                          dataKey="sp500"
                          stroke="#FB923C"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          activeDot={{ r: 5, fill: "#FB923C", stroke: "#ffffff", strokeWidth: 2 }}
                          name="S&P 500"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Chart Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded text-white/70 hover:text-white transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <span className="text-white/60 text-sm">
                        Portfolio vs Market Benchmark
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold text-lg">
                        +13.5%
                      </div>
                      <div className="text-white/60 text-sm">
                        Portfolio Return ({selectedTimeframe})
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics and Pie Chart */}
              <div className={`space-y-8 ${comparedStocks.length > 1 ? 'mt-8 grid md:grid-cols-2 gap-8' : ''}`}>
                {/* Performance Metrics */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Portfolio Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">
                        {metrics.expectedReturn}%
                      </div>
                      <div className="text-white/80">Expected Return</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-2">
                        {metrics.riskScore}%
                      </div>
                      <div className="text-white/80">Risk Score</div>
                    </div>
                    <div className="text-center col-span-2">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {metrics.diversification}%
                      </div>
                      <div className="text-white/80">Diversification</div>
                    </div>
                  </div>
                </div>

                {/* Asset Allocation */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Asset Allocation
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart
                        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
                      >
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                          label={(entry) => `${entry.name} ${entry.value}%`}
                          labelLine={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "12px",
                            color: "white",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section id="open-roles" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Team
              </span>
            </h2>
            <p className="text-xl text-slate-200 leading-relaxed">
              We're building the future of accessible investing and looking for
              exceptional talent to help shape our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-600 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 group cursor-pointer rounded-3xl">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-blue-500/25">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  Backend Engineer
                </CardTitle>
                <CardDescription className="text-slate-200">
                  Part-time • Remote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 mb-4 leading-relaxed">
                  Help build scalable, high-performance systems that power our
                  investment platform. Use cutting-edge technology to help users
                  make better investment decisions.
                </p>

                <Link
                  to="/apply?position=backend-engineer"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 hover:scale-105 transition-transform duration-200 rounded-xl h-12">
                    Join Us
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-600 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group cursor-pointer rounded-3xl">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-purple-500/25">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  AI Developer
                </CardTitle>
                <CardDescription className="text-slate-200">
                  Part-time • Remote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 mb-4 leading-relaxed">
                  Develop intelligent systems that help users build better
                  portfolios. Apply machine learning to make complex financial
                  data simple and actionable.
                </p>

                <Link
                  to="/apply?position=ai-developer"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105 transition-transform duration-200 rounded-xl h-12">
                    Join Us
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-600 hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 group cursor-pointer rounded-3xl">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-emerald-500/25">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  Quantitative Analyst
                </CardTitle>
                <CardDescription className="text-slate-200">
                  Part-time • Remote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 mb-4 leading-relaxed">
                  Create smart algorithms that optimize portfolios and manage
                  risk. Help users achieve better returns while keeping their
                  investments safe.
                </p>

                <Link
                  to="/apply?position=quantitative-analyst"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-105 transition-transform duration-200 rounded-xl h-12">
                    Join Us
                    <div className="ml-2">
                      <Logo variant="transparent" size="sm" showText={false} />
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-600 hover:border-orange-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 group cursor-pointer rounded-3xl">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-orange-500/25">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  Mobile App Developer
                </CardTitle>
                <CardDescription className="text-slate-200">
                  Part-time • Remote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 mb-4 leading-relaxed">
                  Work on world-class mobile experiences that make portfolio
                  management intuitive and accessible. Build complex financial
                  apps with smooth performance.
                </p>

                <Link
                  to="/apply?position=mobile-app-developer"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:scale-105 transition-transform duration-200 rounded-xl h-12">
                    Join Us
                    <Smartphone className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Get In
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  Touch
                </span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                Ready to revolutionize your investing? Let's talk.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-600 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Email</p>
                        <a
                          href="mailto:team@swipr.ai"
                          className="text-slate-200 hover:text-white transition-colors"
                        >
                          team@swipr.ai
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-2xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Location</p>
                        <p className="text-slate-200">New York City, NY</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <Linkedin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">LinkedIn</p>
                        <a
                          href="https://www.linkedin.com/company/swiprai/people/"
                          className="text-slate-200 hover:text-white transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Connect with us
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-600 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">
                      Send us a message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div>
                        <Input
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-slate-800/60 border-slate-600 text-slate-100 placeholder-slate-400 h-14 rounded-xl"
                        />
                      </div>
                      <div>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-slate-800/60 border-slate-600 text-slate-100 placeholder-slate-400 h-14 rounded-xl"
                        />
                      </div>
                      <div>
                        <Textarea
                          name="message"
                          placeholder="Your Message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="bg-slate-800/60 border-slate-600 text-slate-100 placeholder-slate-400 min-h-[120px] rounded-xl"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 h-14 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      >
                        {isSubmittingContact ? (
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : null}
                        Send Message
                      </Button>
                    </form>
                    {contactMessage && (
                      <p
                        className={`text-center mt-4 ${contactMessage.includes("Thank you") || contactMessage.includes("successfully") ? "text-green-400" : "text-red-400"}`}
                      >
                        {contactMessage}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Removed Resources and Newsletter */}
      <footer className="bg-slate-950/50 backdrop-blur-lg border-t border-white/10 py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* About - Left */}
              <div className="order-1">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
                  About
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Mission
                    </a>
                  </li>
                  <li>
                    <a
                      href="#open-roles"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              {/* Product - Middle */}
              <div className="order-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  Product
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#features"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#simulator"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Portfolio Simulator
                    </a>
                  </li>
                  <li>
                    <a
                      href="#mvp-demo"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Try Demo
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal - Right */}
              <div className="order-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  Legal
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/privacy"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/security"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center space-x-3">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      className="text-white"
                    >
                      {/* Stylized arrow/diamond shape inspired by the logo */}
                      <path
                        d="M20 4 L36 20 L20 36 L4 20 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M20 4 L28 20 L20 36 L12 20 Z"
                        fill="currentColor"
                        opacity="0.3"
                      />
                      <path
                        d="M20 12 L28 20 L20 28 L12 20 Z"
                        fill="currentColor"
                      />
                      {/* Arrow pointing up and right */}
                      <path
                        d="M16 24 L20 20 L24 24 M20 20 L20 16"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-2xl font-bold text-white">
                      swipr.ai
                    </span>
                  </div>
                  <p className="text-white/60 mt-2">
                    The future of intelligent investing
                  </p>
                </div>

                {/* Social Icons */}
                <div className="flex items-center space-x-4">
                  <a
                    href="mailto:team@swipr.ai"
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Mail className="h-5 w-5 text-white" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/swiprai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="h-5 w-5 text-white" />
                  </a>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-white/60">
                  © 2025 swipr.ai. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Company Information Drawer */}
      {companyDrawerOpen &&
        selectedCompany &&
        companyData[selectedCompany as keyof typeof companyData] && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setCompanyDrawerOpen(false)}
            ></div>

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl transform transition-transform duration-300 ease-out">
              <div className="h-full overflow-y-auto">
                {(() => {
                  const company =
                    companyData[selectedCompany as keyof typeof companyData];
                  return (
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                            <img
                              src={company.logo}
                              alt={company.ticker}
                              className="w-8 h-8"
                            />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white">
                              {company.ticker}
                            </h2>
                            <p className="text-slate-300">{company.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setCompanyDrawerOpen(false)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <X className="h-6 w-6 text-white" />
                        </button>
                      </div>

                      {/* Price Information */}
                      <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                        <div className="flex items-baseline space-x-4 mb-4">
                          <span className="text-3xl font-bold text-white">
                            ${company.price}
                          </span>
                          <span
                            className={`text-lg font-semibold ${
                              company.change >= 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {company.change >= 0 ? "+" : ""}${company.change} (
                            {company.changePercent}%)
                          </span>
                        </div>
                        <div className="text-slate-400 text-sm">
                          Market Cap: {company.marketCap} • P/E:{" "}
                          {company.peRatio} • Div Yield: {company.dividendYield}
                          %
                        </div>
                      </div>

                      {/* Company Details */}
                      <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Company Overview
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Sector:</span>
                            <span className="text-white">{company.sector}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Industry:</span>
                            <span className="text-white">
                              {company.industry}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">
                              1Y Performance:
                            </span>
                            <span
                              className={`font-semibold ${
                                company.yearPerformance >= 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {company.yearPerformance >= 0 ? "+" : ""}
                              {company.yearPerformance}%
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                          {company.description}
                        </p>
                      </div>

                      {/* Recent News */}
                      <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          Recent News
                        </h3>
                        <div className="space-y-4">
                          {company.news.map((article, index) => (
                            <div
                              key={index}
                              className="border-l-2 border-cyan-500 pl-4"
                            >
                              <h4 className="text-white font-medium mb-1">
                                {article.title}
                              </h4>
                              <p className="text-slate-300 text-sm mb-2">
                                {article.summary}
                              </p>
                              <span className="text-slate-500 text-xs">
                                {article.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => {
                            // Add to portfolio logic
                            setCompanyDrawerOpen(false);
                            // You can add portfolio management logic here
                          }}
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Add to Portfolio
                        </Button>

                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 py-2 rounded-xl"
                            onClick={() => {
                              // Add to watchlist logic
                            }}
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            Watch
                          </Button>
                          <Button
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-600/20 py-2 rounded-xl"
                            onClick={() => {
                              // Share company logic
                            }}
                          >
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
