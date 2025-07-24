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
                Democratizing Professional Investment Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg text-slate-200 leading-relaxed space-y-6">
                <p>
                  At swipr.ai, we believe that sophisticated investment strategies and AI-powered 
                  portfolio optimization should not be exclusive privileges of Wall Street institutions 
                  and high-net-worth individuals.
                </p>
                <p>
                  Our mission is to democratize access to professional-grade investment intelligence, 
                  making advanced portfolio management tools available to every investor regardless 
                  of their account size or financial background.
                </p>
                <p>
                  We are committed to eliminating the complexity, high fees, and barriers that have 
                  traditionally separated ordinary investors from institutional-quality investment 
                  strategies, creating a more equitable financial future for all.
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
                <CardTitle className="text-xl text-white">Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 text-center">
                  Leveraging cutting-edge AI and machine learning to provide 
                  data-driven investment recommendations and portfolio optimization.
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
                  Maintaining complete transparency in our algorithms, fees, 
                  and recommendations while prioritizing security and regulatory compliance.
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
                  Making professional investment tools accessible to everyone, 
                  with intuitive interfaces and no minimum investment requirements.
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
                We envision a world where every individual has access to the same level of 
                investment intelligence and portfolio optimization that was once reserved for 
                institutional investors. Through technology, transparency, and innovation, 
                we are building the foundation for a more democratized and equitable 
                financial ecosystem.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
