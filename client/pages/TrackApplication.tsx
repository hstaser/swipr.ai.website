import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  Eye,
  Users,
  X,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Loader2,
} from "lucide-react";

const STATUS_INFO = {
  pending: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    title: "Application Received",
    description:
      "We've received your application and it's in our review queue. We'll start reviewing it soon!",
  },
  reviewing: {
    icon: Eye,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    title: "Under Review",
    description:
      "Our team is currently reviewing your application and qualifications. This usually takes 3-5 business days.",
  },
  interviewing: {
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    title: "Interview Process",
    description:
      "Congratulations! You've moved to the interview stage. Someone from our team will contact you soon.",
  },
  rejected: {
    icon: X,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    title: "Not Selected",
    description:
      "Thank you for your interest. While we won't be moving forward with your application at this time, we encourage you to apply for future openings.",
  },
  hired: {
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    title: "Congratulations!",
    description:
      "We're excited to offer you a position at swipr.ai! Someone from our team will contact you with next steps.",
  },
};

export default function TrackApplication() {
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchApplication = async () => {
    if (!applicationId.trim()) {
      setError("Please enter an application ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setApplication(null);

    try {
      const response = await fetch(
        `/api/jobs/lookup/${encodeURIComponent(applicationId)}`,
      );

      if (response.ok) {
        const appData = await response.json();
        setApplication(appData);
      } else if (response.status === 404) {
        setError(
          "Application ID not found. Please check your ID and try again.",
        );
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error("Application lookup error:", err);
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchApplication();
    }
  };

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
              Track Your Application
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8 max-w-3xl mx-auto">
              Monitor your application status and stay updated on your journey
              to join swipr.ai
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Search */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-blue-600" />
                Application Lookup
              </CardTitle>
              <CardDescription>
                Your application ID was provided when you submitted your
                application (e.g., APP-1234567890-abc123)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Input
                  placeholder="Enter your application ID"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12"
                />
                <Button
                  onClick={searchApplication}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 px-8"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Application Results */}
          {application && (
            <div className="space-y-6">
              {/* Status Card */}
              <Card
                className={`border-2 ${STATUS_INFO[application.status as keyof typeof STATUS_INFO].borderColor} ${STATUS_INFO[application.status as keyof typeof STATUS_INFO].bgColor}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${STATUS_INFO[application.status as keyof typeof STATUS_INFO].bgColor} border-2 ${STATUS_INFO[application.status as keyof typeof STATUS_INFO].borderColor}`}
                    >
                      {React.createElement(
                        STATUS_INFO[
                          application.status as keyof typeof STATUS_INFO
                        ].icon,
                        {
                          className: `h-8 w-8 ${STATUS_INFO[application.status as keyof typeof STATUS_INFO].color}`,
                        },
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-bold ${STATUS_INFO[application.status as keyof typeof STATUS_INFO].color} mb-2`}
                      >
                        {
                          STATUS_INFO[
                            application.status as keyof typeof STATUS_INFO
                          ].title
                        }
                      </h3>
                      <p className="text-slate-700">
                        {
                          STATUS_INFO[
                            application.status as keyof typeof STATUS_INFO
                          ].description
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {application.firstName[0]}
                          {application.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {application.firstName} {application.lastName}
                        </p>
                        <p className="text-sm text-slate-500">Applicant</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="font-medium">{application.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Applied Date</p>
                          <p className="font-medium">
                            {new Date(
                              application.appliedAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Position Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {application.position
                            .replace("-", " ")
                            .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-slate-500">Position</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-600 mb-2">
                        Application ID
                      </p>
                      <p className="font-mono text-sm bg-white p-2 rounded border break-all">
                        {application.id}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Next Steps and Contact */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>What's Next?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {application.status === "pending" && (
                      <div className="space-y-3">
                        <p className="text-slate-600">
                          We'll start reviewing your application soon. You'll
                          receive an email update when the status changes.
                        </p>
                        <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded">
                          • Initial review: 1-2 business days
                          <br />
                          • Technical assessment: 3-5 business days
                          <br />• Interview process: 1-2 weeks
                        </div>
                      </div>
                    )}
                    {application.status === "reviewing" && (
                      <div className="space-y-3">
                        <p className="text-slate-600">
                          Our hiring team is carefully reviewing your
                          qualifications. This process typically takes 3-5
                          business days. You'll hear from us soon!
                        </p>
                        <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded">
                          Our team reviews: technical skills, experience fit,
                          and cultural alignment
                        </div>
                      </div>
                    )}
                    {application.status === "interviewing" && (
                      <div className="space-y-3">
                        <p className="text-slate-600">
                          Congratulations on advancing to the interview stage! A
                          member of our team will contact you via email or phone
                          to schedule your interview.
                        </p>
                        <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded">
                          Interview format: Technical discussion + culture fit
                        </div>
                      </div>
                    )}
                    {application.status === "rejected" && (
                      <div className="space-y-3">
                        <p className="text-slate-600">
                          While we won't be moving forward with your application
                          for this position, we encourage you to apply for other
                          roles that match your skills.
                        </p>
                        <Link to="/#open-roles">
                          <Button variant="outline" size="sm">
                            View Other Open Positions
                          </Button>
                        </Link>
                      </div>
                    )}
                    {application.status === "hired" && (
                      <div className="space-y-3">
                        <p className="text-slate-600">
                          Welcome to the swipr.ai team! Our HR team will contact
                          you within 24 hours with your offer details and next
                          steps.
                        </p>
                        <div className="text-sm text-slate-500 bg-green-50 p-3 rounded">
                          • Offer details and equity package
                          <br />
                          • Onboarding timeline
                          <br />• Equipment and setup information
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Need Assistance?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-600">
                      If you have any questions about your application or the
                      hiring process, our team is here to help.
                    </p>
                    <div className="space-y-3">
                      <Link to="/#contact">
                        <Button variant="outline" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Our Team
                        </Button>
                      </Link>
                      <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded">
                        <strong>Response time:</strong> We typically respond
                        within 24 hours during business days
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Help Section */}
          {!application && !isLoading && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">
                    Can't find your application ID?
                  </h4>
                  <p className="text-slate-600 text-sm">
                    Your application ID was sent to your email when you
                    submitted your application. It starts with "APP-" followed
                    by numbers and letters.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">
                    Haven't applied yet?
                  </h4>
                  <p className="text-slate-600 text-sm mb-3">
                    Check out our open positions and submit your application.
                  </p>
                  <Link to="/#open-roles">
                    <Button variant="outline" size="sm">
                      View Open Positions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
