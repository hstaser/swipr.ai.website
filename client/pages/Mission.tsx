import { Link } from "react-router-dom";
import { ArrowLeft, Target, TrendingUp, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Mission() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,119,198,0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(120,219,255,0.1),_transparent_50%)]" />

      {/* Header */}
      <div className="pt-8 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="text-2xl font-bold text-white">
              swipr.ai
            </Link>
          </div>

          {/* Back Button */}
          <div className="mt-2">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-20 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent leading-tight">
              Our Mission
            </h1>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Target className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Mission Statement */}
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-600 rounded-3xl mb-12">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl text-white font-bold">
                Making Smart Investing Accessible to Everyone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg text-slate-200 leading-relaxed space-y-6">
                <p>
                  We believe smart investing shouldn't be reserved for Wall Street insiders.
                  Advanced investment strategies and AI-powered portfolio optimization should be
                  available to everyone, not just institutions and the ultra-wealthy.
                </p>
                <p>
                  Our mission is simple: give every investor access to intelligent investment tools,
                  regardless of how much money they're starting with or their financial background.
                </p>
                <p>
                  We're breaking down the complexity, high fees, and barriers that have kept
                  sophisticated investing out of reach, building a platform where everyone can
                  invest with confidence.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Core Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg border border-slate-600 rounded-2xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Smart Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 text-center">
                  We use advanced AI and machine learning to give you
                  data-driven investment recommendations and automatic portfolio optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg border border-slate-600 rounded-2xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Trust</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 text-center">
                  We're completely transparent about our algorithms, fees,
                  and recommendations while keeping your investments secure and compliant.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg border border-slate-600 rounded-2xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 text-center">
                  We make sophisticated investment tools easy to use for everyone,
                  with simple interfaces and no minimum investment requirements.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Vision Statement */}
          <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg border border-slate-600 rounded-3xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white font-bold">
                Our Vision for the Future
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-slate-200 leading-relaxed text-center">
                We're building a world where everyone has access to the same smart
                investment tools that were once only available to big institutions.
                Through technology, transparency, and innovation, we're creating a more
                fair and accessible financial future for all.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
