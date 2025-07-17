import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              swipr.ai
            </Link>
            <Link to="/">
              <Button variant="ghost">← Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              The Future of Stock Investing
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Discover how swipr.ai is revolutionizing investment decisions
              through AI-powered analysis and intuitive design.
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-slate-800 mb-6">
                  The Problem
                </h2>
                <div className="space-y-4 text-lg text-slate-600">
                  <p>
                    Traditional investment platforms present overwhelming
                    amounts of unstructured data, making it difficult for
                    investors to identify actionable opportunities.
                  </p>
                  <p>
                    Retail investors lack access to institutional-grade research
                    and quantitative analysis tools, creating an uneven playing
                    field.
                  </p>
                  <p>
                    Professional portfolio management is expensive and
                    inaccessible, while DIY approaches often lead to suboptimal
                    allocation decisions.
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-slate-800 mb-6">
                  Our Solution
                </h2>
                <div className="space-y-4 text-lg text-slate-600">
                  <p>
                    swipr.ai democratizes institutional-grade investment
                    research through streamlined decision-making interfaces.
                  </p>
                  <p>
                    Our quantitative engine processes multi-dimensional data to
                    generate evidence-based investment recommendations aligned
                    with your objectives.
                  </p>
                  <p>
                    Systematic portfolio optimization using modern portfolio
                    theory and risk management frameworks to maximize
                    risk-adjusted returns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our three-step process makes investing as simple as using your
                favorite social app
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg text-center">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <CardTitle className="text-xl">Set Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Tell us your investment goals, risk tolerance, and time
                    horizon. Our AI creates a personalized investment strategy
                    just for you.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg text-center">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <CardTitle className="text-xl">
                    Portfolio Construction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Review algorithmically-curated investment opportunities.
                    Binary preference feedback trains our models to better
                    understand your investment thesis and risk preferences.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg text-center">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <CardTitle className="text-xl">Auto-Optimize</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    Our algorithms automatically balance your portfolio,
                    rebalance as needed, and optimize for the best risk-adjusted
                    returns.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                Powered by Advanced Technology
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Behind the simple interface lies sophisticated AI and
                quantitative finance technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Machine Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">
                    Advanced neural networks analyze market patterns,
                    fundamentals, and sentiment data.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Quantitative Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">
                    Modern portfolio theory and factor models for optimal asset
                    allocation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Real-time Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">
                    Live market data, earnings reports, and news sentiment
                    analysis.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">Risk Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">
                    Sophisticated risk models protect your portfolio from market
                    volatility.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                Why Choose swipr.ai?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Democratized Investing
                      </h3>
                      <p className="text-slate-600">
                        Professional-grade investment strategies accessible to
                        everyone, regardless of experience level.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Personalized Experience
                      </h3>
                      <p className="text-slate-600">
                        AI learns your preferences and adapts recommendations to
                        match your unique investment style.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Automated Optimization
                      </h3>
                      <p className="text-slate-600">
                        Continuous portfolio rebalancing and optimization
                        without the hassle of manual management.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Transparent & Educational
                      </h3>
                      <p className="text-slate-600">
                        Learn why each recommendation is made and understand
                        your investment decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 rounded-2xl">
                <div className="text-center">
                  <Smartphone className="h-20 w-20 text-blue-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    Coming Soon to Mobile
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Experience the future of investing right from your
                    smartphone. Intuitive design meets powerful technology.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      <span className="text-sm font-medium text-slate-600">
                        iOS & Android
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Investing?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of investors who are already using AI to make
              smarter investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
                >
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
