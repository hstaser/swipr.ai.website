import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/lib/analytics";
import { Navigation } from "@/components/Navigation";
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
  Twitter,
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

  return baseData.map((item, index) => ({
    ...item,
    value: Math.floor(
      10000 + (item.growth / 100) * 10000 * (1 + riskLevel * 0.5),
    ),
    growth: item.growth * (1 + riskLevel * 0.5),
  }));
};

const pieData = [
  { name: "Tech", value: 60, color: "#3B82F6" },
  { name: "Automotive", value: 25, color: "#10B981" },
  { name: "Finance", value: 8, color: "#8B5CF6" },
  { name: "Healthcare", value: 4, color: "#F59E0B" },
  { name: "Other", value: 3, color: "#EF4444" },
];

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [waitlistMessage, setWaitlistMessage] = useState("");
  const [riskLevel, setRiskLevel] = useState(0.5);
  const [portfolioData, setPortfolioData] = useState(
    generatePortfolioData(0.5),
  );
  const [isScrolled, setIsScrolled] = useState(false);

  // MVP Demo States
  const [mvpStep, setMvpStep] = useState(0);
  const [currentStockIndex, setCurrentStockIndex] = useState(0);
  const [swipedStocks, setSwipedStocks] = useState<{
    [key: number]: "left" | "right";
  }>({});
  const [portfolio, setPortfolio] = useState<typeof stockCards>([]);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      message: "Hi! I'm AlphaCue. Ask me anything about the market!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  const {
    trackApplyClick,
    trackWaitlistSignup,
    trackFormSubmit,
    trackContactFormOpen,
    trackLearnMoreClick,
  } = useAnalytics();

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
    setPortfolioData(generatePortfolioData(riskLevel));
  }, [riskLevel]);

  // Speed up optimization effect
  useEffect(() => {
    if (mvpStep === 2 && optimizationProgress < 100) {
      const timer = setTimeout(() => {
        setOptimizationProgress((prev) => Math.min(prev + 20, 100));
      }, 200); // Faster progress - every 200ms instead of 1000ms
      return () => clearTimeout(timer);
    }
  }, [mvpStep, optimizationProgress]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactMessage("");

    try {
      const contactData: ContactRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result: ContactResponse = await response.json();

      if (response.ok && result.success) {
        setContactMessage(result.message || "Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        trackFormSubmit("contact", true);
      } else {
        setContactMessage(
          result.message || "Something went wrong. Please try again.",
        );
        trackFormSubmit("contact", false);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setContactMessage(
        "Network error. Please check your connection and try again.",
      );
      trackFormSubmit("contact", false);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingWaitlist(true);
    setWaitlistMessage("");

    trackWaitlistSignup(waitlistEmail);

    try {
      const waitlistData: WaitlistRequest = {
        email: waitlistEmail.trim(),
      };

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(waitlistData),
      });

      const result: WaitlistResponse = await response.json();

      if (response.ok && result.success) {
        setWaitlistMessage(
          result.message || "Thanks for joining our waitlist!",
        );
        setWaitlistEmail("");
        trackFormSubmit("waitlist", true);
      } else {
        setWaitlistMessage(
          result.message || "Something went wrong. Please try again.",
        );
        trackFormSubmit("waitlist", false);
      }
    } catch (error) {
      console.error("Waitlist signup error:", error);
      setWaitlistMessage(
        "Network error. Please check your connection and try again.",
      );
      trackFormSubmit("waitlist", false);
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };

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
    const expectedReturn = (baseReturn * (1 + riskLevel * 0.8)).toFixed(1);
    const riskScore = (baseRisk * (1 + riskLevel * 0.6)).toFixed(1);
    const diversification = (95 - riskLevel * 15).toFixed(0);

    return { expectedReturn, riskScore, diversification };
  };

  // MVP Demo Functions
  const handleStockSwipe = (direction: "left" | "right") => {
    const currentStock = stockCards[currentStockIndex];
    setSwipedStocks((prev) => ({ ...prev, [currentStock.id]: direction }));

    if (direction === "right") {
      setPortfolio((prev) => [...prev, currentStock]);
    }

    if (currentStockIndex < stockCards.length - 1) {
      setCurrentStockIndex((prev) => prev + 1);
    } else {
      setMvpStep(2); // Move to optimization preview
      setOptimizationProgress(0); // Reset optimization progress
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", message: userMessage },
    ]);
    setChatInput("");

    // Simulate bot response with contextual answers
    setTimeout(() => {
      let response = "";
      const message = userMessage.toLowerCase();

      if (message.includes("tech stock") || message.includes("best tech")) {
        response =
          "Based on current analysis, NVDA shows strong fundamentals with AI tailwinds. Your portfolio already has 28% NVDA allocation, which provides good exposure to the AI trend.";
      } else if (
        message.includes("diversify") ||
        message.includes("diversification")
      ) {
        response =
          "Your current portfolio has 60% tech allocation (AAPL 32%, NVDA 28%) and 25% automotive (TSLA). Consider adding healthcare, finance, or international exposure for better diversification.";
      } else if (
        message.includes("expected return") ||
        message.includes("return")
      ) {
        response =
          "With your current allocation, the expected annual return is 12.8% with a Sharpe ratio of 0.89. This reflects a balanced risk-return profile for a tech-heavy portfolio.";
      } else if (message.includes("aapl") || message.includes("apple")) {
        response =
          "AAPL represents 32% of your portfolio. Given strong fundamentals and upcoming product launches, this allocation seems appropriate. Consider holding for long-term growth.";
      } else if (message.includes("tsla") || message.includes("tesla")) {
        response =
          "TSLA at 25% allocation provides good exposure to EV growth. Monitor production targets and autonomous driving progress for future rebalancing decisions.";
      } else {
        const genericResponses = [
          "Based on current market data, your portfolio shows solid fundamentals.",
          "Consider reviewing your risk tolerance and investment timeline.",
          "Market conditions favor growth stocks in the current environment.",
          "Your tech allocation aligns well with current market trends.",
          "Regular rebalancing helps maintain optimal risk-return ratios.",
        ];
        response =
          genericResponses[Math.floor(Math.random() * genericResponses.length)];
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", message: response },
      ]);
    }, 1000);
  };

  const mvpSteps = [
    "Welcome",
    "Swipe Stocks",
    "Optimization",
    "Portfolio",
    "Chat Bot",
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
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl p-2 group-hover:scale-110 transition-all duration-300 border border-white/20 hover:border-cyan-400/50">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F8274926fadf9406c8e2d75b7a56de814%2Fa6a66b2fcf0441379eacc75b64af9438?format=webp&width=800"
                  alt="swipr.ai logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                swipr.ai
              </span>
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
                  document
                    .getElementById("hero")
                    ?.scrollIntoView({ behavior: "smooth" });
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
              media, let AI optimize your portfolio.
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
                    👆 Swipe to build your portfolio
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
            <div className="max-w-md mx-auto">
              <form onSubmit={handleWaitlistSubmit} className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  required
                  className="bg-white/10 backdrop-blur-lg border-white/30 text-white placeholder-white/60 h-14 rounded-xl flex-1"
                />
                <Button
                  type="submit"
                  disabled={isSubmittingWaitlist}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 h-14 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
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
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Revolutionary
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Features
              </span>
            </h2>
            <p className="text-xl text-slate-200 leading-relaxed">
              Experience the next generation of intelligent investing
            </p>
          </div>

          <div className="space-y-20 max-w-7xl mx-auto">
            {/* Feature 1: Swipe to Invest */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-500 group">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-cyan-500/25">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      Swipe to Invest
                    </h3>
                  </div>
                  <p className="text-lg text-slate-200 leading-relaxed mb-6">
                    Make investing as intuitive as swiping right. Explore
                    stocks, ETFs, and AI-picked assets with the familiar gesture
                    you know and love.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Swipe right to invest, left to pass
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        AI curates personalized recommendations
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
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
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
                  >
                    See It In Action
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl p-8 backdrop-blur-sm border border-cyan-400/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer">
                        <div className="w-8 h-8 bg-white rounded mb-2 flex items-center justify-center">
                          <img
                            src="https://logo.clearbit.com/apple.com"
                            alt="AAPL"
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="text-white font-semibold">AAPL</div>
                        <div className="text-green-400 text-sm">+2.4%</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer">
                        <div className="w-8 h-8 bg-white rounded mb-2 flex items-center justify-center">
                          <img
                            src="https://logo.clearbit.com/tesla.com"
                            alt="TSLA"
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="text-white font-semibold">TSLA</div>
                        <div className="text-green-400 text-sm">+5.7%</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer col-span-2">
                        <div className="w-8 h-8 bg-white rounded mb-2 flex items-center justify-center">
                          <img
                            src="https://logo.clearbit.com/nvidia.com"
                            alt="NVDA"
                            className="w-6 h-6"
                          />
                        </div>
                        <div className="text-white font-semibold">NVDA</div>
                        <div className="text-green-400 text-sm">+3.2%</div>
                      </div>
                    </div>
                    <div className="text-center mt-6 text-white/60">
                      ← Swipe left to pass • Swipe right to invest →
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Portfolio Optimization */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-400/30">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={(entry) => `${entry.name} ${entry.value}%`}
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
                    <div className="text-center mt-4 text-white/60">
                      Automatically balanced portfolio
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-500 group">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-purple-500/25">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      Portfolio Optimization
                    </h3>
                  </div>
                  <p className="text-lg text-slate-200 leading-relaxed mb-6">
                    Our algorithm allocates for you — balancing risk, growth,
                    and diversification automatically based on modern portfolio
                    theory.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Automatic rebalancing
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Risk-adjusted optimization
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Tax-loss harvesting
                      </span>
                    </li>
                  </ul>
                  <Button
                    onClick={() =>
                      document
                        .getElementById("simulator")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Try Simulator
                    <BarChart3 className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature 3: Real-time Analytics */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all duration-500 group">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-emerald-500/25">
                      <Activity className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">
                      Real-time Analytics
                    </h3>
                  </div>
                  <p className="text-lg text-slate-200 leading-relaxed mb-6">
                    See your performance live. Watch how each swipe shifts your
                    future with instant portfolio impact visualization.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Live performance tracking
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Instant portfolio impact
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-emerald-400 mr-3" />
                      <span className="text-slate-200">
                        Predictive analytics
                      </span>
                    </li>
                  </ul>
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
                    View Analytics
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-3xl p-8 backdrop-blur-sm border border-emerald-400/30">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                        <span className="text-white">Portfolio Value</span>
                        <span className="text-emerald-400 font-bold">
                          $11,350
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                        <span className="text-white">Total Return</span>
                        <span className="text-emerald-400 font-bold">
                          +13.5%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                        <span className="text-white">Today's Gain</span>
                        <span className="text-emerald-400 font-bold">
                          +$142.30
                        </span>
                      </div>
                      <div className="h-32 bg-white/10 rounded-xl p-4 flex items-center justify-center">
                        <div className="text-center">
                          <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                          <div className="text-white/60 text-sm">
                            Live chart updates
                          </div>
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
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-3xl p-8 backdrop-blur-sm border border-orange-400/30">
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      <div className="flex justify-start">
                        <div className="bg-white/20 rounded-xl p-3 max-w-xs">
                          <div className="text-white text-sm">
                            Hi! I'm AlphaCue. Ask me about the market!
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-blue-600 rounded-xl p-3 max-w-xs">
                          <div className="text-white text-sm">
                            What's the best tech stock right now?
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white/20 rounded-xl p-3 max-w-xs">
                          <div className="text-white text-sm">
                            Based on current data, NVDA shows strong momentum
                            with AI tailwinds.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center p-3 bg-white/10 rounded-xl">
                      <input
                        placeholder="Ask AlphaCue... (Coming Feature)"
                        className="flex-1 bg-transparent text-white placeholder-white/60 outline-none"
                        disabled
                      />
                      <MessageSquare className="h-5 w-5 text-white/60" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-2">
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
                  <ul className="space-y-3 mb-6">
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
                  <Button
                    onClick={() => {
                      setMvpStep(4);
                      document
                        .getElementById("mvp-demo")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Chat Now
                    <MessageSquare className="ml-2 h-5 w-5" />
                  </Button>
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
                          <span className="text-white font-bold">A</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold">
                            Alex Chen
                          </div>
                          <div className="text-green-400 text-sm">
                            +24.7% this year
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Follow
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
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Follow
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
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Swipe Through Stocks
                    </h3>
                    <p className="text-white/80">
                      Swipe right to invest, left to pass (3 stocks only)
                    </p>
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
                      <div className="text-center mt-6 text-white/60">
                        {currentStockIndex + 1} of {stockCards.length} stocks
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
                        See Portfolio Optimization
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Optimization Preview - Faster */}
              {mvpStep === 2 && (
                <div className="flex-1 p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      AI Portfolio Optimization
                    </h3>
                    <p className="text-white/80">
                      Watch as our AI optimizes your selections
                    </p>
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
                        View Portfolio Breakdown
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Portfolio Breakdown */}
              {mvpStep === 3 && (
                <div className="flex-1 p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Your Optimized Portfolio
                    </h3>
                    <p className="text-white/80">
                      Perfectly balanced for risk and return
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                              label={(entry) => `${entry.name} ${entry.value}%`}
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
                          <div className="flex justify-between">
                            <span className="text-slate-300">Total Value:</span>
                            <span className="text-white font-bold">
                              $10,000
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">
                              Expected Annual Return:
                            </span>
                            <span className="text-emerald-400 font-bold">
                              +12.8%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Risk Level:</span>
                            <span className="text-orange-400 font-bold">
                              Medium
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">
                              Sharpe Ratio:
                            </span>
                            <span className="text-blue-400 font-bold">
                              0.89
                            </span>
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
                      Chat with AlphaCue
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Chatbot */}
              {mvpStep === 4 && (
                <div className="flex-1 p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Chat with AlphaCue
                    </h3>
                    <p className="text-slate-200">
                      Try these sample questions or ask anything about investing
                    </p>
                  </div>
                  <div className="max-w-2xl mx-auto">
                    {/* Sample Questions */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Sample Questions:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          onClick={() =>
                            setChatInput(
                              "What's the best tech stock to invest in right now?",
                            )
                          }
                          className="p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-left text-slate-200 hover:bg-slate-700/50 hover:border-cyan-400/50 transition-all duration-200"
                        >
                          "What's the best tech stock to invest in right now?"
                        </button>
                        <button
                          onClick={() =>
                            setChatInput("How should I diversify my portfolio?")
                          }
                          className="p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-left text-slate-200 hover:bg-slate-700/50 hover:border-cyan-400/50 transition-all duration-200"
                        >
                          "How should I diversify my portfolio?"
                        </button>
                        <button
                          onClick={() =>
                            setChatInput(
                              "What's my expected return with this allocation?",
                            )
                          }
                          className="p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-left text-slate-200 hover:bg-slate-700/50 hover:border-cyan-400/50 transition-all duration-200"
                        >
                          "What's my expected return with this allocation?"
                        </button>
                        <button
                          onClick={() =>
                            setChatInput("Should I buy or sell AAPL?")
                          }
                          className="p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-left text-slate-200 hover:bg-slate-700/50 hover:border-cyan-400/50 transition-all duration-200"
                        >
                          "Should I buy or sell AAPL?"
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900/70 border border-slate-600 rounded-xl p-6 mb-6 h-80 overflow-y-auto">
                      <div className="space-y-4">
                        {chatMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-xs p-3 rounded-xl ${
                                msg.sender === "user"
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-700 text-slate-100 border border-slate-600"
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <form onSubmit={handleChatSubmit} className="flex gap-3">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask AlphaCue anything..."
                        className="bg-slate-800/50 border-slate-600 text-slate-100 placeholder-slate-400 h-12 rounded-xl flex-1"
                      />
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 h-12 rounded-xl"
                      >
                        Send
                      </Button>
                    </form>
                    <div className="text-center mt-8">
                      <Button
                        onClick={() => setMvpStep(5)}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold"
                      >
                        Explore Social Features
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Social Features */}
              {mvpStep === 5 && (
                <div className="flex-1 p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Social Trading
                    </h3>
                    <p className="text-white/80">
                      See what your network is investing in
                    </p>
                  </div>
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-white/10 rounded-xl p-6">
                      <h4 className="text-xl font-semibold text-white mb-4">
                        Friend's Portfolio
                      </h4>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-lg">
                            A
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-semibold">
                            Alex Chen
                          </div>
                          <div className="text-emerald-400">
                            +24.7% this year • 2.1k followers
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
                        <Button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl">
                          <Plus className="mr-2 h-5 w-5" />
                          Copy Portfolio
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 rounded-xl"
                        >
                          <Heart className="mr-2 h-5 w-5" />
                          Follow
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
                        onClick={() => setMvpStep(6)}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold"
                      >
                        Ready to Get Started?
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Final CTA */}
              {mvpStep === 6 && (
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

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Interactive Chart */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      Portfolio Growth
                    </h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-2"></div>
                        <span className="text-white/80">Portfolio Value</span>
                      </div>
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

                  {/* Chart */}
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={portfolioData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#ffffff20"
                        />
                        <XAxis
                          dataKey="month"
                          stroke="#ffffff80"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="#ffffff80"
                          fontSize={12}
                          tickFormatter={(value) =>
                            `$${(value / 1000).toFixed(0)}k`
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "12px",
                            color: "white",
                          }}
                          formatter={(value: any) => [
                            `$${value.toLocaleString()}`,
                            "Portfolio Value",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="url(#colorGradient)"
                          strokeWidth={3}
                          dot={{ fill: "#06b6d4", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: "#06b6d4" }}
                        />
                        <defs>
                          <linearGradient
                            id="colorGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Metrics and Pie Chart */}
              <div className="space-y-8">
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
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={(entry) => `${entry.name} ${entry.value}%`}
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
            <p className="text-xl text-white/80 leading-relaxed">
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
                <p className="text-white/80 mb-4 leading-relaxed">
                  Help build scalable, high-performance systems that power our
                  investment platform. Use cutting-edge technology to help users
                  make better investment decisions.
                </p>

                <Link to="/apply?position=backend-engineer">
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
                <p className="text-white/80 mb-4 leading-relaxed">
                  Develop intelligent systems that help users build better
                  portfolios. Apply machine learning to make complex financial
                  data simple and actionable.
                </p>

                <Link to="/apply?position=ai-developer">
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
                <p className="text-white/80 mb-4 leading-relaxed">
                  Create smart algorithms that optimize portfolios and manage
                  risk. Help users achieve better returns while keeping their
                  investments safe.
                </p>

                <Link to="/apply?position=quantitative-analyst">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:scale-105 transition-transform duration-200 rounded-xl h-12">
                    Join Us
                    <TrendingUp className="ml-2 h-4 w-4" />
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
                <p className="text-white/80 mb-4 leading-relaxed">
                  Work on world-class mobile experiences that make portfolio
                  management intuitive and accessible. Build complex financial
                  apps with smooth performance.
                </p>

                <Link to="/apply?position=mobile-app-developer">
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
                        <p className="text-slate-200">team@swipr.ai</p>
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
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Office Hours</p>
                        <p className="text-slate-200">Mon-Fri, 9AM-6PM EST</p>
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
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* About */}
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
                  About
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Our Story
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Team
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

              {/* Product */}
              <div>
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

              {/* Legal */}
              <div>
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
                    <a
                      href="#"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F8274926fadf9406c8e2d75b7a56de814%2Fa6a66b2fcf0441379eacc75b64af9438?format=webp&width=800"
                        alt="swipr.ai logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
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
                    href="#"
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Twitter className="h-5 w-5 text-white" />
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
    </div>
  );
}
