import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Target,
  Users,
  Globe,
  TrendingUp,
  Brain,
  Shield,
  Heart,
  Zap,
  Rocket,
  Star,
  CheckCircle,
  X,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Mission() {
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

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">swipr.ai</span>
            </Link>
            
            <Link to="/">
              <Button variant="outline" size="sm" className="border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent leading-tight">
              Our Mission
            </h1>
            <p className="text-2xl md:text-3xl text-cyan-300 font-semibold mb-6">
              Democratizing Intelligent Investing for Everyone
            </p>
            <p className="text-xl text-slate-200 max-w-4xl mx-auto leading-relaxed">
              We believe that sophisticated investment strategies shouldn't be exclusive to Wall Street elites. 
              Our mission is to make intelligent, AI-powered investing accessible, intuitive, and profitable for every individual.
            </p>
          </div>

          {/* Core Mission Statement */}
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-600 rounded-3xl mb-16">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-4xl text-white font-bold">Why We Exist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-lg text-slate-200 leading-relaxed space-y-6">
                <p>
                  <strong className="text-white">The financial industry has failed everyday people.</strong> For decades, 
                  sophisticated investment strategies, portfolio optimization algorithms, and market insights have been 
                  hoarded by institutional investors and the ultra-wealthy. Meanwhile, regular people are left with 
                  confusing jargon, hidden fees, and outdated investment approaches that barely keep pace with inflation.
                </p>
                
                <p>
                  <strong className="text-cyan-300">We're here to change that.</strong> swipr.ai represents a fundamental 
                  shift in how people interact with financial markets. By combining cutting-edge artificial intelligence 
                  with an interface as intuitive as social media, we're breaking down the barriers that have kept 
                  intelligent investing out of reach for millions.
                </p>
                
                <p>
                  Our platform doesn't just make investing easier—it makes it <em className="text-blue-300">smarter</em>. 
                  Every swipe is backed by real-time market analysis, portfolio theory, and machine learning algorithms 
                  that continuously optimize for your financial goals. We're not just building an app; we're creating 
                  a movement toward financial empowerment.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vision Pillars */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Our Vision</h2>
            <p className="text-xl text-slate-200 text-center mb-12 max-w-3xl mx-auto">
              Building the future of finance through five core principles that guide everything we do
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg border border-blue-400/30 rounded-2xl hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Intelligence First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200">
                    Every decision should be backed by data, algorithms, and artificial intelligence. 
                    We replace gut feelings with scientific analysis and emotional trading with logical optimization.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-400/30 rounded-2xl hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Radical Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200">
                    Sophisticated investing shouldn't require a finance degree. We make complex strategies 
                    as simple as swiping right, democratizing tools once reserved for Wall Street professionals.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-lg border border-emerald-400/30 rounded-2xl hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Transparent Trust</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200">
                    No hidden fees, no misleading marketing, no black-box algorithms. We believe trust is built 
                    through transparency, and our users deserve to understand exactly how their money is managed.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg border border-orange-400/30 rounded-2xl hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Speed & Precision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200">
                    Markets move in milliseconds, opportunities vanish in minutes. Our technology operates at 
                    the speed of modern finance while maintaining the precision required for optimal outcomes.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/30 rounded-2xl hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Long-term Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200">
                    We optimize for sustainable wealth building, not quick gains. Our algorithms focus on 
                    long-term compound growth that builds generational wealth for our users.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur-lg border border-violet-400/30 rounded-2xl hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Global Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200">
                    Financial empowerment shouldn't be limited by geography. We're building a platform that 
                    can serve investors worldwide, creating global financial inclusion through technology.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* The Problem We're Solving */}
          <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-lg border border-red-400/30 rounded-3xl mb-16">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white font-bold mb-4">The Problem We're Solving</CardTitle>
              <CardDescription className="text-lg text-slate-200">
                Why the traditional financial industry is failing everyday investors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Complexity Barriers</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-200">Confusing financial jargon and interfaces</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-200">Overwhelming choice without guidance</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-200">Steep learning curves for basic investing</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-4">Access Inequality</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-200">High minimum investments and fees</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-200">AI tools reserved for institutions</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-200">Professional advice only for the wealthy</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6 mt-8">
                <h4 className="text-xl font-semibold text-white mb-4">The Result: A Broken System</h4>
                <p className="text-slate-200 leading-relaxed">
                  <strong className="text-red-300">78% of Americans</strong> live paycheck to paycheck. 
                  <strong className="text-red-300">Only 32%</strong> have investments beyond their employer's 401k. 
                  <strong className="text-red-300">Average investor returns</strong> lag the market by 3-4% annually due to poor timing and emotional decisions. 
                  Meanwhile, institutional investors with AI-powered strategies consistently outperform by leveraging the same technologies we're now bringing to everyone.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Our Solution */}
          <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-lg border border-green-400/30 rounded-3xl mb-16">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white font-bold mb-4">Our Solution</CardTitle>
              <CardDescription className="text-lg text-slate-200">
                How swipr.ai transforms investing from complicated to intuitive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Familiar Interface</h4>
                  <p className="text-slate-200 text-sm">
                    Swipe-based investing that feels like social media, making complex decisions simple and intuitive.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Intelligence</h4>
                  <p className="text-slate-200 text-sm">
                    Machine learning algorithms analyze thousands of data points to provide personalized recommendations.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Automatic Optimization</h4>
                  <p className="text-slate-200 text-sm">
                    Continuous portfolio rebalancing and tax-loss harvesting without any manual intervention required.
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-white mb-4 text-center">The Impact We're Creating</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-white font-medium">15% average improvement</span>
                    </div>
                    <p className="text-slate-200 text-sm ml-8">in portfolio performance vs traditional retail investing</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-white font-medium">90% reduction</span>
                    </div>
                    <p className="text-slate-200 text-sm ml-8">in time spent on investment research and management</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-white font-medium">Zero fees</span>
                    </div>
                    <p className="text-slate-200 text-sm ml-8">on portfolio optimization and rebalancing services</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                      <span className="text-white font-medium">Accessible to everyone</span>
                    </div>
                    <p className="text-slate-200 text-sm ml-8">with any investment amount, from $1 to millions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg rounded-3xl p-12 border border-slate-600">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Join the Financial Revolution</h2>
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              We're not just building a product—we're building a movement. Every person who joins swipr.ai 
              is taking a stand against an outdated financial system and choosing a future where intelligent 
              investing is a right, not a privilege.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/#open-roles">
                <Button variant="outline" className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 px-8 py-4 rounded-xl text-lg font-semibold">
                  <Users className="mr-2 h-5 w-5" />
                  Join Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
