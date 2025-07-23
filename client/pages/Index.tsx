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
  { name: "Tech", value: 35, color: "#3B82F6" },
  { name: "Healthcare", value: 25, color: "#10B981" },
  { name: "Finance", value: 20, color: "#8B5CF6" },
  { name: "Energy", value: 12, color: "#F59E0B" },
  { name: "Other", value: 8, color: "#EF4444" },
];

export default function Index() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [waitlistMessage, setWaitlistMessage] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [riskLevel, setRiskLevel] = useState(0.5);
  const [portfolioData, setPortfolioData] = useState(generatePortfolioData(0.5));
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNewsletter(true);
    setNewsletterMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNewsletterMessage("Successfully subscribed to our newsletter!");
        setNewsletterEmail("");
      } else {
        setNewsletterMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setNewsletterMessage("Network error. Please try again.");
    } finally {
      setIsSubmittingNewsletter(false);
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                <TrendingUp className="h-6 w-6 text-white" />
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
                href="#simulator"
                className="text-white/80 hover:text-white transition-all duration-300 font-medium relative group"
              >
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 group-hover:w-full transition-all duration-300" />
              </a>
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
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
            <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed animate-fade-in-slow">
              Smarter investing in seconds. Swipe through stocks like social media, 
              let AI optimize your portfolio.
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

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 border-2 border-blue-400/50 hover:border-blue-300 group h-16"
              >
                <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                Launch App
              </Button>
              <Button
                onClick={() => document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 px-10 py-6 rounded-2xl text-xl font-bold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-sm h-16"
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

      {/* Features Section */}
      <section id="features" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              The Future of
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {" "}Investing
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Experience intelligent portfolio management with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature Card 1 */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 group rounded-3xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-cyan-500/25">
                  <Smartphone className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-white font-bold">
                  Swipe to Invest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-white/80 leading-relaxed">
                  Navigate stocks with familiar swipe gestures. Our intelligent system learns your preferences and suggests optimal investments.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group rounded-3xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-purple-500/25">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-white font-bold">
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-white/80 leading-relaxed">
                  Advanced machine learning analyzes market trends, fundamentals, and sentiment to guide your investment decisions.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 group rounded-3xl">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-emerald-500/25">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-white font-bold">
                  Auto-Rebalance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-white/80 leading-relaxed">
                  Automatically optimize your portfolio for maximum returns while managing risk through quantitative analysis.
                </CardDescription>
              </CardContent>
            </Card>
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
                  {" "}Simulator
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
                    <h3 className="text-2xl font-bold text-white">Portfolio Growth</h3>
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
                      <label className="text-white font-semibold">Risk Level</label>
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#ffffff80"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#ffffff80"
                          fontSize={12}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            color: 'white',
                          }}
                          formatter={(value: any) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="url(#colorGradient)"
                          strokeWidth={3}
                          dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: '#06b6d4' }}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
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
                  <h3 className="text-2xl font-bold text-white mb-6">Portfolio Metrics</h3>
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
                  <h3 className="text-2xl font-bold text-white mb-6">Asset Allocation</h3>
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
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            color: 'white',
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

      {/* Contact Section */}
      <section id="contact" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Get In
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}Touch
                </span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                Ready to revolutionize your investing? Let's talk.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl">
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
                        <p className="text-white/80">team@swipr.ai</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-2xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Location</p>
                        <p className="text-white/80">New York City, NY</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl">
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
                          className="bg-white/10 border-white/30 text-white placeholder-white/60 h-14 rounded-xl"
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
                          className="bg-white/10 border-white/30 text-white placeholder-white/60 h-14 rounded-xl"
                        />
                      </div>
                      <div>
                        <Textarea
                          name="message"
                          placeholder="Your Message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="bg-white/10 border-white/30 text-white placeholder-white/60 min-h-[120px] rounded-xl"
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
                        className={`text-center mt-4 ${contactMessage.includes("Thank you") ? "text-green-400" : "text-red-400"}`}
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

      {/* Footer */}
      <footer className="bg-slate-950/50 backdrop-blur-lg border-t border-white/10 py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* About */}
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
                  About
                </h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Our Story</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Team</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>

              {/* Product */}
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                  Product
                </h3>
                <ul className="space-y-3">
                  <li><a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#simulator" className="text-white/70 hover:text-white transition-colors">Portfolio Simulator</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">API</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  Resources
                </h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>

              {/* Legal & Newsletter */}
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
                  Legal
                </h3>
                <ul className="space-y-3 mb-6">
                  <li><Link to="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white transition-colors">Security</a></li>
                </ul>

                {/* Newsletter Signup */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Newsletter</h4>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/30 text-white placeholder-white/60 h-12 rounded-xl"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmittingNewsletter}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 rounded-xl font-semibold"
                    >
                      {isSubmittingNewsletter ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Subscribe"
                      )}
                    </Button>
                  </form>
                  {newsletterMessage && (
                    <p className="text-sm text-green-400 mt-2">{newsletterMessage}</p>
                  )}
                  <p className="text-xs text-white/60 mt-2">
                    By subscribing, you agree to our Privacy Policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
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
                    href="#"
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

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delayed {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-slow {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 1.2s ease-out forwards;
        }
        
        .animate-fade-in-slow {
          animation: fade-in-slow 1.5s ease-out forwards;
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
        }
      `}</style>
    </div>
  );
}
