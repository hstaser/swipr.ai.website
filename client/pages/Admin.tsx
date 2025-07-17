import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Users,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  FileText,
  ExternalLink,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  X,
  UserCheck,
} from "lucide-react";
import { JobApplication } from "@shared/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  interviewing: "bg-purple-100 text-purple-800",
  rejected: "bg-red-100 text-red-800",
  hired: "bg-green-100 text-green-800",
};

const STATUS_ICONS = {
  pending: Clock,
  reviewing: Eye,
  interviewing: Users,
  rejected: X,
  hired: UserCheck,
};

export default function Admin() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);

  const authenticate = async () => {
    try {
      const response = await fetch("/api/jobs/applications", {
        headers: {
          "x-admin-key": adminKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
        setIsAuthenticated(true);
        localStorage.setItem("admin-key", adminKey);
      } else {
        alert("Invalid admin key");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const storedKey = localStorage.getItem("admin-key");
      if (!storedKey) return;

      const response = await fetch("/api/jobs/applications", {
        headers: {
          "x-admin-key": storedKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
        setIsAuthenticated(true);
        setAdminKey(storedKey);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: string,
  ) => {
    try {
      const response = await fetch(
        `/api/jobs/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: status as any } : app,
          ),
        );
        alert("Status updated successfully");
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || app.status === filterStatus;
    const matchesPosition = !filterPosition || app.position === filterPosition;

    return matchesSearch && matchesStatus && matchesPosition;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter the admin key to view job applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && authenticate()}
            />
            <Button
              onClick={authenticate}
              disabled={isLoading || !adminKey}
              className="w-full"
            >
              {isLoading ? "Authenticating..." : "Access Dashboard"}
            </Button>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Homepage
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-slate-800">
                Application Details
              </h1>
              <Button
                variant="ghost"
                onClick={() => setSelectedApplication(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedApplication.firstName}{" "}
                      {selectedApplication.lastName}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {selectedApplication.position
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        STATUS_COLORS[selectedApplication.status]
                      }`}
                    >
                      {React.createElement(
                        STATUS_ICONS[selectedApplication.status],
                        { className: "h-4 w-4 mr-1" },
                      )}
                      {selectedApplication.status}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Applied on{" "}
                      {new Date(
                        selectedApplication.appliedAt,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium">{selectedApplication.email}</p>
                    <p className="text-sm text-slate-500">Email</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="font-medium">{selectedApplication.phone}</p>
                    <p className="text-sm text-slate-500">Phone</p>
                  </div>
                </div>
                {selectedApplication.linkedinUrl && (
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="h-5 w-5 text-slate-500" />
                    <div>
                      <a
                        href={selectedApplication.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                      <p className="text-sm text-slate-500">Social</p>
                    </div>
                  </div>
                )}
                {selectedApplication.portfolioUrl && (
                  <div className="flex items-center space-x-3">
                    <ExternalLink className="h-5 w-5 text-slate-500" />
                    <div>
                      <a
                        href={selectedApplication.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Portfolio
                      </a>
                      <p className="text-sm text-slate-500">Website</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">
                    {selectedApplication.experience}
                  </p>
                  <p className="text-sm text-slate-500">Experience</p>
                </div>
                <div>
                  <p className="font-medium">
                    {new Date(
                      selectedApplication.startDate,
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-500">Available Start Date</p>
                </div>
                {selectedApplication.salary && (
                  <div>
                    <p className="font-medium">{selectedApplication.salary}</p>
                    <p className="text-sm text-slate-500">Expected Salary</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resume */}
            {selectedApplication.resumeFilename && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Resume/CV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Resume uploaded: {selectedApplication.resumeFilename}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Cover Letter */}
            {selectedApplication.coverLetter && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "pending",
                    "reviewing",
                    "interviewing",
                    "rejected",
                    "hired",
                  ].map((status) => (
                    <Button
                      key={status}
                      variant={
                        selectedApplication.status === status
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateApplicationStatus(selectedApplication.id, status)
                      }
                    >
                      {React.createElement(
                        STATUS_ICONS[status as keyof typeof STATUS_ICONS],
                        {
                          className: "h-4 w-4 mr-1",
                        },
                      )}
                      {status}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Job Applications Dashboard
              </h1>
              <p className="text-slate-600">
                {applications.length} total applications
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("admin-key");
                  setIsAuthenticated(false);
                }}
              >
                Logout
              </Button>
              <Link to="/">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Homepage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="interviewing">Interviewing</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Positions</option>
              <option value="backend-engineer">Backend Engineer</option>
              <option value="ai-developer">AI Developer</option>
              <option value="quantitative-analyst">Quantitative Analyst</option>
            </select>
          </CardContent>
        </Card>

        {/* Applications Grid */}
        <div className="grid gap-6">
          {filteredApplications.map((application) => (
            <Card
              key={application.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedApplication(application)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {application.firstName[0]}
                        {application.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {application.firstName} {application.lastName}
                      </h3>
                      <p className="text-slate-600">
                        {application.position
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-slate-500">
                        {application.email} • {application.experience}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        STATUS_COLORS[application.status]
                      }`}
                    >
                      {React.createElement(STATUS_ICONS[application.status], {
                        className: "h-4 w-4 mr-1",
                      })}
                      {application.status}
                    </div>
                    <p className="text-sm text-slate-500">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                    {application.resumeFilename && (
                      <div className="flex items-center text-sm text-slate-500">
                        <FileText className="h-4 w-4 mr-1" />
                        Resume uploaded
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                No applications found
              </h3>
              <p className="text-slate-600">
                {applications.length === 0
                  ? "No applications have been submitted yet."
                  : "Try adjusting your filters to see more results."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
