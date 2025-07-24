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
  Lock,
  Eye,
  Server,
  CheckCircle,
  AlertTriangle,
  Mail,
  FileCheck,
  Key,
  Database,
  Clock,
} from "lucide-react";

export default function Security() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Security & Trust
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8 max-w-3xl mx-auto">
              Bank-grade security protecting your investments, data, and financial information with enterprise-level safeguards
            </p>
            <div className="flex items-center justify-center space-x-6 text-blue-200">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-emerald-400" />
                <span>256-bit Encryption</span>
              </div>
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

          {/* Security Content */}
          <div className="space-y-8">
            {/* Security Overview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Shield className="h-8 w-8 mr-3 text-emerald-600" />
                  Our Security Commitment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed mb-4 text-lg">
                  At swipr.ai, we understand that trust is earned through actions, not words. That's why we've implemented the same level of security used by major financial institutions to protect your sensitive information and investments.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Lock className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">Encrypted</div>
                    <div className="text-sm text-slate-600">End-to-end encryption</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Eye className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">Monitored</div>
                    <div className="text-sm text-slate-600">24/7 threat detection</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <FileCheck className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <div className="font-semibold text-slate-800">Audited</div>
                    <div className="text-sm text-slate-600">Regular security audits</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Encryption */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-6 w-6 mr-3 text-blue-600" />
                  Data Encryption & Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">AES-256 Encryption</p>
                      <p className="text-slate-600 text-sm">All data is encrypted using industry-standard 256-bit encryption both in transit and at rest</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">TLS 1.3 Connections</p>
                      <p className="text-slate-600 text-sm">All communications between your device and our servers use the latest TLS encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">Zero-Knowledge Architecture</p>
                      <p className="text-slate-600 text-sm">Sensitive financial data is encrypted with keys that only you control</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">Secure Key Management</p>
                      <p className="text-slate-600 text-sm">Encryption keys are managed using hardware security modules (HSMs)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Security */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-6 w-6 mr-3 text-blue-600" />
                  Infrastructure Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Cloud Security</h4>
                    <ul className="space-y-2 text-slate-600 text-sm">
                      <li>• AWS/Azure enterprise-grade infrastructure</li>
                      <li>• Multi-region data replication and backup</li>
                      <li>• DDoS protection and traffic filtering</li>
                      <li>• Isolated network segments and firewalls</li>
                      <li>• Regular vulnerability scanning</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">Access Controls</h4>
                    <ul className="space-y-2 text-slate-600 text-sm">
                      <li>• Multi-factor authentication (MFA)</li>
                      <li>• Role-based access permissions</li>
                      <li>• Principle of least privilege</li>
                      <li>• Regular access reviews and rotation</li>
                      <li>• Session management and timeout</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Certifications */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="h-6 w-6 mr-3 text-blue-600" />
                  Compliance & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                      <div>
                        <div className="font-semibold">SOC 2 Type II</div>
                        <div className="text-sm text-slate-600">Independently audited security controls</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                      <div>
                        <div className="font-semibold">PCI DSS Compliant</div>
                        <div className="text-sm text-slate-600">Payment card data security standards</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                      <div>
                        <div className="font-semibold">GDPR Compliant</div>
                        <div className="text-sm text-slate-600">European data protection standards</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                      <div>
                        <div className="font-semibold">ISO 27001</div>
                        <div className="text-sm text-slate-600">Information security management</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monitoring & Incident Response */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-6 w-6 mr-3 text-blue-600" />
                  24/7 Monitoring & Incident Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Real-time Threat Detection</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Our security operations center monitors all systems 24/7 using AI-powered threat detection and automated response systems.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-slate-600 text-sm">
                      <li>• Continuous security monitoring</li>
                      <li>• Automated anomaly detection</li>
                      <li>• Real-time alerting systems</li>
                      <li>• Incident response team on standby</li>
                    </ul>
                    <ul className="space-y-2 text-slate-600 text-sm">
                      <li>• Regular penetration testing</li>
                      <li>• Vulnerability assessments</li>
                      <li>• Security patch management</li>
                      <li>• Disaster recovery procedures</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Security Best Practices */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-6 w-6 mr-3 text-blue-600" />
                  How You Can Stay Secure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  Security is a shared responsibility. Here's how you can help protect your account:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-emerald-600 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Do These
                    </h4>
                    <ul className="space-y-2 text-slate-600 text-sm">
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Keep your devices updated</li>
                      <li>• Log out of shared devices</li>
                      <li>• Monitor your account regularly</li>
                      <li>• Report suspicious activity immediately</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Avoid These
                    </h4>
                    <ul className="space-y-2 text-slate-600 text-sm">
                      <li>• Don't share your login credentials</li>
                      <li>• Don't use public Wi-Fi for trading</li>
                      <li>• Don't click suspicious email links</li>
                      <li>• Don't save passwords in browsers</li>
                      <li>• Don't access accounts on shared computers</li>
                      <li>• Don't ignore security notifications</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Contact */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-6 w-6 mr-3 text-blue-600" />
                  Report Security Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 mb-4">
                  If you discover a security vulnerability or have security concerns, please contact our security team immediately:
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800">Security Emergency</span>
                  </div>
                  <p className="text-red-700 text-sm">
                    For urgent security issues, please email us immediately. Do not post security vulnerabilities publicly.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2 mb-4">
                  <p><strong>Email:</strong> security@swipr.ai</p>
                  <p><strong>Subject Line:</strong> [SECURITY] Brief description</p>
                  <p><strong>Response Time:</strong> Within 2 hours for critical issues</p>
                  <p><strong>Bug Bounty:</strong> We reward responsible disclosure</p>
                </div>

                <div className="flex justify-center">
                  <a href="mailto:security@swipr.ai?subject=[SECURITY] Security Report">
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                      <Shield className="h-4 w-4 mr-2" />
                      Report Security Issue
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
