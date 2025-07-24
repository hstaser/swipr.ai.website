import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Shield,
  Scale,
  FileText,
  AlertTriangle,
  Mail,
  Calendar,
} from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8 max-w-3xl mx-auto">
              Clear, fair terms that protect both you and swipr.ai while ensuring the best possible investment experience
            </p>
            <div className="flex items-center justify-center space-x-4 text-blue-200">
              <Calendar className="h-5 w-5" />
              <span>Last Updated: January 15, 2025</span>
            </div>
          </div>

          <div className="mb-8">
            <Link to="/">
              <Button
                variant="outline"
                className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="h-6 w-6 mr-3 text-blue-600" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed mb-4">
                  By accessing or using swipr.ai, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  These terms constitute a legally binding agreement between you and swipr.ai. Please read them carefully before using our services.
                </p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Service Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed mb-4">
                  swipr.ai is a financial technology platform that provides:
                </p>
                <ul className="space-y-2 text-slate-700 mb-4">
                  <li>• AI-powered portfolio optimization and investment recommendations</li>
                  <li>• Real-time market data and analytics</li>
                  <li>• Educational content and investment tools</li>
                  <li>• Social investment features and community insights</li>
                  <li>• Portfolio tracking and performance monitoring</li>
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  Our services are designed to help you make informed investment decisions. However, all investment decisions are ultimately yours, and you bear full responsibility for your investment outcomes.
                </p>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed mb-4">
                  As a user of swipr.ai, you agree to:
                </p>
                <ul className="space-y-2 text-slate-700 mb-4">
                  <li>• Provide accurate and truthful information</li>
                  <li>• Maintain the security of your account credentials</li>
                  <li>• Use the platform only for lawful purposes</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• Not attempt to manipulate or interfere with our systems</li>
                  <li>• Comply with all applicable laws and regulations</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-amber-800 font-semibold">Important Notice</p>
                      <p className="text-amber-700 text-sm">
                        You are responsible for all activities that occur under your account. Please keep your login credentials secure and notify us immediately of any unauthorized access.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Disclaimers */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Investment Disclaimers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 font-semibold">Investment Risk Warning</p>
                      <p className="text-red-700 text-sm">
                        All investments carry risk, including the potential loss of principal. Past performance does not guarantee future results.
                      </p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-slate-700">
                  <li>• swipr.ai provides educational content and tools, not investment advice</li>
                  <li>• We are not a registered investment advisor or broker-dealer</li>
                  <li>• All investment decisions are your responsibility</li>
                  <li>• We do not guarantee investment performance or outcomes</li>
                  <li>• Consult with qualified financial professionals before making investment decisions</li>
                </ul>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed mb-4">
                  To the maximum extent permitted by law, swipr.ai shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to investment losses, lost profits, or data loss.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Our total liability to you for any claim arising from these terms or your use of our services shall not exceed the amount you paid to us in the 12 months preceding the claim.
                </p>
              </CardContent>
            </Card>

            {/* Data and Privacy */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Data and Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Your use of swipr.ai is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
                </p>
                <Link to="/privacy">
                  <Button variant="outline" className="mb-4">
                    <Shield className="h-4 w-4 mr-2" />
                    View Privacy Policy
                  </Button>
                </Link>
                <p className="text-slate-700 leading-relaxed text-sm">
                  By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-6 w-6 mr-3 text-blue-600" />
                  Contact Us About These Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  If you have questions about these Terms of Service, please contact our legal team:
                </p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <p><strong>Email:</strong> legal@swipr.ai</p>
                  <p><strong>Subject Line:</strong> Terms of Service Question</p>
                  <p><strong>Response Time:</strong> We will respond within 7 business days</p>
                </div>

                <div className="flex justify-center pt-4">
                  <a href="mailto:legal@swipr.ai?subject=Terms of Service Question">
                    <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Legal Team
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Changes to These Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  We may update these Terms of Service periodically. When we make changes, we will:
                </p>
                <ul className="space-y-2 text-slate-700 mb-4">
                  <li>• Post the updated terms on this page</li>
                  <li>• Update the "Last Updated" date</li>
                  <li>• Notify you via email for significant changes</li>
                  <li>• Provide 30 days notice for material changes</li>
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  Your continued use of swipr.ai after changes become effective constitutes acceptance of the updated terms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
