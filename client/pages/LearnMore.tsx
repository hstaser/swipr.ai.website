import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  TrendingUp,
  Users,
  Shield,
  Smartphone,
  BarChart3,
  Target,
  Zap,
  CheckCircle,
  Rocket,
  Eye,
  ChevronDown,
  DollarSign,
  Activity,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LearnMore() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <Link
                to="/"
                className="text-white/80 hover:text-white transition-all duration-300 font-medium relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 group-hover:w-full transition-all duration-300" />
              </Link>
              <a
                href="#how-it-works"
                className="text-white/80 hover:text-white transition-all duration-300 font-medium relative group"
              >
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 group-hover:w-full transition-all duration-300" />
              </a>
              <a
                href="#features"
                className="text-white/80 hover:text-white transition-all duration-300 font-medium relative group"
              >
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 group-hover:w-full transition-all duration-300" />
              </a>
              <Link
                to="/"
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent leading-tight animate-fade-in">
              The Future of
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Intelligent Investing
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed animate-fade-in-delayed">
              Discover how swipr.ai revolutionizes investing with intuitive
              design, AI-powered insights, and automated portfolio optimization.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-slow">
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 border-2 border-blue-400/50 hover:border-blue-300 group h-16">
                  <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                  Get Started
                </Button>
              </Link>
              <Button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                variant="outline"
                className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 px-10 py-6 rounded-2xl text-xl font-bold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-sm h-16"
              >
                <Eye className="mr-3 h-6 w-6" />
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              How It
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Works
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Three simple steps to smarter investing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-cyan-500/25">
                <Smartphone className="h-12 w-12 text-white" />
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 group-hover:border-cyan-400/50 transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-4">
                  1. Swipe Stocks
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Browse curated stocks with simple swipe gestures. Like what
                  you see? Swipe right to add it to your portfolio.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-purple-500/25">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 group-hover:border-purple-400/50 transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-4">
                  2. AI Analysis
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Our AI analyzes market data, company fundamentals, and your
                  preferences to provide personalized recommendations.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-emerald-500/25">
                <Target className="h-12 w-12 text-white" />
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 group-hover:border-emerald-400/50 transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-4">
                  3. Auto-Optimize
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Watch as our algorithms automatically rebalance your portfolio
                  for optimal risk-adjusted returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section id="features" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Powerful
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Features
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Everything you need for intelligent investing
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 group rounded-3xl">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-cyan-500/25">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-white font-bold">
                  Intuitive Swiping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-white/80 leading-relaxed mb-6">
                  Navigate investments with familiar social media gestures. Our
                  interface makes complex financial decisions feel as simple as
                  choosing what to watch next.
                </CardDescription>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">Swipe right to invest</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">Swipe left to pass</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">
                      Tap for detailed analysis
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group rounded-3xl">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-purple-500/25">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-white font-bold">
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-white/80 leading-relaxed mb-6">
                  Advanced machine learning algorithms analyze thousands of data
                  points to provide personalized investment recommendations
                  tailored to your goals.
                </CardDescription>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">
                      Real-time market analysis
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">Sentiment analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">Risk assessment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 group rounded-3xl">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-emerald-500/25">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-white font-bold">
                  Smart Rebalancing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-white/80 leading-relaxed mb-6">
                  Automatically optimize your portfolio allocation using modern
                  portfolio theory and quantitative risk management techniques.
                </CardDescription>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">Automatic rebalancing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">Risk optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">Tax-loss harvesting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-orange-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 group rounded-3xl">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-orange-500/25">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-white font-bold">
                  Bank-Grade Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-white/80 leading-relaxed mb-6">
                  Your investments and personal data are protected with
                  enterprise-grade security measures and compliance protocols.
                </CardDescription>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">256-bit encryption</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">SIPC insured</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3" />
                    <span className="text-white/80">
                      Two-factor authentication
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose swipr.ai */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Why Choose
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                swipr.ai?
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              The advantages that set us apart
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Advantage 1 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Low Fees</h3>
              <p className="text-white/80">
                No commission trading and low management fees to maximize your
                returns.
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Real-Time Updates
              </h3>
              <p className="text-white/80">
                Get instant notifications and portfolio updates as market
                conditions change.
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Expert Support
              </h3>
              <p className="text-white/80">
                24/7 customer support from licensed financial advisors and
                investment experts.
              </p>
            </div>

            {/* Advantage 4 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-orange-400/50 transition-all duration-500 hover:scale-105 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Advanced Analytics
              </h3>
              <p className="text-white/80">
                Comprehensive performance tracking and detailed investment
                analytics.
              </p>
            </div>

            {/* Advantage 5 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Lightning Fast
              </h3>
              <p className="text-white/80">
                Execute trades in milliseconds with our high-performance trading
                infrastructure.
              </p>
            </div>

            {/* Advantage 6 */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-pink-400/50 transition-all duration-500 hover:scale-105 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Customizable
              </h3>
              <p className="text-white/80">
                Tailor your investment strategy with personalized risk and
                return preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Ready to Start
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Investing?
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed mb-12">
              Join thousands of smart investors already using swipr.ai to build
              their wealth.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 border-2 border-blue-400/50 hover:border-blue-300 group h-16">
                  <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/">
                <Button
                  variant="outline"
                  className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 px-12 py-6 rounded-2xl text-xl font-bold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-sm h-16"
                >
                  Join the Waitlist
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/50 backdrop-blur-lg border-t border-white/10 py-16 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                swipr.ai
              </span>
            </div>
            <p className="text-white/60 mb-8">
              The future of intelligent investing
            </p>

            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <Link
                to="/"
                className="text-white/70 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/privacy"
                className="text-white/70 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="border-t border-white/10 pt-8">
              <p className="text-white/60">
                © 2025 swipr.ai. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
