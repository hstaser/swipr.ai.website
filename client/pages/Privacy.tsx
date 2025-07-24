import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
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
  Eye,
  Lock,
  Users,
  Mail,
  AlertTriangle,
} from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 py-16 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8 max-w-3xl mx-auto">
              Your privacy and data security are fundamental to everything we do
              at swipr.ai
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Last Updated */}
          <div className="text-center mb-12">
            <p className="text-slate-600">Last Updated: January 1, 2025</p>
          </div>

          {/* Introduction */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-3 text-blue-600" />
                Our Commitment to Your Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                At swipr.ai, we believe that privacy is a fundamental right.
                This Privacy Policy explains how we collect, use, protect, and
                share your personal information when you use our investment
                platform, apply for jobs, or interact with our services. We are
                committed to being transparent about our data practices and
                giving you control over your personal information.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 mr-3 text-purple-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Information You Provide
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>
                    • <strong>Account Information:</strong> Name, email address,
                    phone number, and authentication credentials
                  </li>
                  <li>
                    • <strong>Job Applications:</strong> Resume, cover letter,
                    professional experience, education, and portfolio links
                  </li>
                  <li>
                    • <strong>Investment Preferences:</strong> Risk tolerance,
                    investment goals, and portfolio preferences
                  </li>
                  <li>
                    • <strong>Communications:</strong> Messages you send us,
                    feedback, and support requests
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Information We Collect Automatically
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>
                    • <strong>Usage Data:</strong> How you interact with our
                    platform, features used, and time spent
                  </li>
                  <li>
                    • <strong>Device Information:</strong> IP address, browser
                    type, operating system, and device identifiers
                  </li>
                  <li>
                    • <strong>Location Data:</strong> General location based on
                    IP address (not precise location)
                  </li>
                  <li>
                    • <strong>Analytics:</strong> Performance metrics and user
                    behavior patterns (anonymized)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Financial Data
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-slate-700">
                    <strong>Important:</strong> We do not store your banking
                    information, passwords, or account credentials. All
                    financial data connections are handled through encrypted,
                    bank-level security protocols with our trusted financial
                    data partners.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-3 text-teal-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Platform Services
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Provide personalized investment recommendations</li>
                    <li>• Optimize your portfolio based on your preferences</li>
                    <li>• Send important account and security notifications</li>
                    <li>• Improve our AI and recommendation algorithms</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Business Operations
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Process job applications and hiring decisions</li>
                    <li>• Respond to customer support requests</li>
                    <li>• Comply with legal and regulatory requirements</li>
                    <li>• Prevent fraud and ensure platform security</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-6 w-6 mr-3 text-green-600" />
                How We Protect Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Technical Safeguards
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• End-to-end encryption for all data transmission</li>
                    <li>
                      • Secure, encrypted data storage with regular backups
                    </li>
                    <li>• Multi-factor authentication for account access</li>
                    <li>• Regular security audits and penetration testing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Operational Safeguards
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>
                      • Limited access to personal data on a need-to-know basis
                    </li>
                    <li>• Employee training on data privacy and security</li>
                    <li>• Incident response procedures for data breaches</li>
                    <li>
                      • Compliance with SOC 2 and other security standards
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-slate-700">
                  <strong>Industry Standards:</strong> We follow the same
                  security practices used by major financial institutions,
                  including bank-level encryption and regulatory compliance with
                  SEC and FINRA requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-orange-600" />
                When We Share Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-800 font-semibold mb-2">
                  We Never Sell Your Data
                </p>
                <p className="text-red-700">
                  swipr.ai will never sell, rent, or trade your personal
                  information to third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Limited Sharing Scenarios
                </h3>
                <ul className="space-y-3 text-slate-700">
                  <li>
                    <strong>Service Providers:</strong> Trusted partners who
                    help us operate our platform (cloud hosting, analytics,
                    customer support) under strict data protection agreements
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law,
                    regulation, or valid legal process
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a
                    merger or acquisition, with your consent
                  </li>
                  <li>
                    <strong>Safety and Security:</strong> To protect the rights,
                    property, or safety of swipr.ai, our users, or the public
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Data Control
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>
                      • <strong>Access:</strong> Request a copy of your personal
                      data
                    </li>
                    <li>
                      • <strong>Correction:</strong> Update or correct
                      inaccurate information
                    </li>
                    <li>
                      • <strong>Deletion:</strong> Request deletion of your
                      account and data
                    </li>
                    <li>
                      • <strong>Portability:</strong> Export your data in a
                      standard format
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">
                    Communication Preferences
                  </h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Opt out of marketing communications anytime</li>
                    <li>• Control notification preferences in your account</li>
                    <li>• Manage cookie and tracking preferences</li>
                    <li>• Request human review of automated decisions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                We use cookies and similar technologies to improve your
                experience, analyze usage patterns, and provide personalized
                content. You can control cookie preferences through your browser
                settings.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Essential Cookies
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Required for basic platform functionality
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Analytics Cookies
                  </h4>
                  <p className="text-purple-700 text-sm">
                    Help us understand how you use our platform
                  </p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-teal-900 mb-2">
                    Preference Cookies
                  </h4>
                  <p className="text-teal-700 text-sm">
                    Remember your settings and preferences
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-6 w-6 mr-3 text-blue-600" />
                Contact Us About Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700">
                If you have questions about this Privacy Policy or want to
                exercise your privacy rights, please contact our Data Protection
                Officer:
              </p>

              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <p>
                  <strong>Email:</strong> privacy@swipr.ai
                </p>
                <p>
                  <strong>Subject Line:</strong> Privacy Request - [Your Request
                  Type]
                </p>
                <p>
                  <strong>Response Time:</strong> We will respond within 30 days
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <a href="mailto:privacy@swipr.ai?subject=Privacy Request">
                  <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Our Team
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Updates to Policy */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">
                We may update this Privacy Policy periodically to reflect
                changes in our practices, technology, or legal requirements.
                When we make significant changes, we will:
              </p>

              <ul className="space-y-2 text-slate-700 mb-4">
                <li>
                  • Notify you via email at least 30 days before the changes
                  take effect
                </li>
                <li>• Display a prominent notice on our platform</li>
                <li>
                  • Update the "Last Updated" date at the top of this policy
                </li>
                <li>• Provide a summary of key changes</li>
              </ul>

              <p className="text-slate-700">
                Continued use of our services after the effective date
                constitutes acceptance of the updated policy. If you disagree
                with the changes, you may delete your account before they take
                effect.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
