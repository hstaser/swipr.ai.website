import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  Mail,
  BarChart3,
  TrendingUp,
  Eye,
  Clock,
  Download,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Activity,
  RefreshCw,
  User,
  Phone,
  Calendar,
  Briefcase,
  FileText,
  Settings,
  ExternalLink,
} from "lucide-react";

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  startDate: string;
  appliedAt: string;
  status: "pending" | "reviewing" | "interviewing" | "rejected" | "hired";
  lastUpdated: string;
  notes?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  status: "new" | "read";
  readAt?: string;
}

interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  joinedAt: string;
}

interface DashboardStats {
  applications: {
    total: number;
    pending: number;
    reviewing: number;
    interviewing: number;
    rejected: number;
    hired: number;
    byPosition: Record<string, number>;
  };
  contacts: {
    total: number;
    unread: number;
  };
  waitlist: {
    count: number;
  };
}

// CSP-safe logging function
const safeLog = (...args: any[]) => {
  try {
    if (typeof console !== "undefined" && console.log) {
      console.log(...args);
    }
  } catch (e) {
    // Ignore console errors in production
  }
};

const safeError = (...args: any[]) => {
  try {
    if (typeof console !== "undefined" && console.error) {
      console.error(...args);
    }
  } catch (e) {
    // Ignore console errors in production
  }
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken");
    if (token === "admin-swipr-2025") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      console.log("🔄 Fetching admin dashboard data...");

      // Fetch stats
      safeLog("🔄 Fetching stats with token:", token);
      const statsResponse = await fetch("/api/admin/dashboard?type=stats", {
        headers,
      });
      safeLog("📊 Stats response status:", statsResponse.status);
      if (statsResponse.ok) {
        const statsResult = await statsResponse.json();
        safeLog("📊 Stats data received:", statsResult);
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data);
        } else {
          safeError("❌ Stats data invalid:", statsResult);
          setError("Invalid stats data received");
        }
      } else {
        const errorText = await statsResponse.text();
        safeError("❌ Stats fetch failed:", statsResponse.status, errorText);
        setError(`Failed to fetch stats: ${statsResponse.status}`);
      }

      // Fetch applications
      const appsResponse = await fetch(
        "/api/admin/dashboard?type=applications",
        { headers },
      );
      safeLog("📱 Applications response status:", appsResponse.status);
      if (appsResponse.ok) {
        const appsResult = await appsResponse.json();
        safeLog("📱 Applications data received:", appsResult);
        if (appsResult.success && Array.isArray(appsResult.data)) {
          setApplications(appsResult.data);
          safeLog(`✅ Loaded ${appsResult.data.length} applications`);
        } else {
          safeError("❌ Applications data invalid:", appsResult);
          setApplications([]);
        }
      } else {
        const errorText = await appsResponse.text();
        safeError(
          "❌ Applications fetch failed:",
          appsResponse.status,
          errorText,
        );
      }

      // Fetch contacts
      const contactsResponse = await fetch(
        "/api/admin/dashboard?type=contacts",
        { headers },
      );
      safeLog("📧 Contacts response status:", contactsResponse.status);
      if (contactsResponse.ok) {
        const contactsResult = await contactsResponse.json();
        safeLog("📧 Contacts data received:", contactsResult);
        if (contactsResult.success && Array.isArray(contactsResult.data)) {
          setContacts(contactsResult.data);
          safeLog(`✅ Loaded ${contactsResult.data.length} contacts`);
        } else {
          safeError("❌ Contacts data invalid:", contactsResult);
          setContacts([]);
        }
      } else {
        const errorText = await contactsResponse.text();
        safeError(
          "❌ Contacts fetch failed:",
          contactsResponse.status,
          errorText,
        );
      }

      // Fetch waitlist
      const waitlistResponse = await fetch(
        "/api/admin/dashboard?type=waitlist",
        { headers },
      );
      console.log("📝 Waitlist response status:", waitlistResponse.status);
      if (waitlistResponse.ok) {
        const waitlistResult = await waitlistResponse.json();
        console.log("📝 Waitlist data received:", waitlistResult);
        if (waitlistResult.success && Array.isArray(waitlistResult.data)) {
          setWaitlist(waitlistResult.data);
          safeLog(`✅ Loaded ${waitlistResult.data.length} waitlist entries`);
        } else {
          console.error("❌ Waitlist data invalid:", waitlistResult);
          setWaitlist([]);
        }
      } else {
        const errorText = await waitlistResponse.text();
        console.error(
          "❌ Waitlist fetch failed:",
          waitlistResponse.status,
          errorText,
        );
      }
    } catch (err) {
      const errorMessage = `Failed to load dashboard data: ${err instanceof Error ? err.message : "Unknown error"}`;
      setError(errorMessage);
      safeError("🚨 Dashboard fetch error:", err);
      safeError("🚨 Error details:", {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
        token: localStorage.getItem("adminToken"),
        url: window.location.href,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (
    id: string,
    status: string,
    notes: string = "",
  ) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `/api/admin/dashboard?type=application&id=${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, notes }),
        },
      );

      if (response.ok) {
        await fetchData(); // Refresh data
        setSelectedApplication(null);
      } else {
        setError("Failed to update application status");
      }
    } catch (err) {
      setError("Error updating application");
      console.error("Update error:", err);
    }
  };

  const markContactAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `/api/admin/dashboard?type=contact&id=${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        await fetchData(); // Refresh data
      }
    } catch (err) {
      console.error("Error marking contact as read:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "interviewing":
        return "bg-purple-100 text-purple-800";
      case "hired":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      `${app.firstName} ${app.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              <div className="text-sm text-slate-600 mr-3">
                {stats ? (
                  <span className="inline-flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    {stats.applications.total +
                      stats.contacts.total +
                      stats.waitlist.count}{" "}
                    total records
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                    Loading data...
                  </span>
                )}
              </div>
              <Button
                onClick={fetchData}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={() => {
                  // Safe debug function for production
                  const debugInfo = {
                    token: localStorage.getItem("adminToken"),
                    stats,
                    applications,
                    contacts,
                    waitlist,
                    url: window.location.href,
                  };
                  // CSP-safe logging
                  safeLog("🔍 DEBUG INFO:", debugInfo);
                  alert("Debug info logged to console (F12)");
                }}
                variant="outline"
                size="sm"
              >
                Debug
              </Button>
              <Button
                onClick={async () => {
                  const token = localStorage.getItem("adminToken");
                  try {
                    const response = await fetch(
                      "/api/admin/dashboard?type=stats",
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      },
                    );
                    const data = await response.json();
                    // CSP-safe logging
                    safeLog("API Test:", {
                      status: response.status,
                      data,
                    });
                    alert(
                      `API Test: ${response.status} - ${data.success ? "Success" : "Failed"}`,
                    );
                  } catch (error) {
                    const errorMsg =
                      error instanceof Error ? error.message : "Unknown error";
                    alert(`API Test Failed: ${errorMsg}`);
                  }
                }}
                variant="outline"
                size="sm"
              >
                Test API
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="container mx-auto px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="text-red-700 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">
                  Check the browser console (F12) for detailed error
                  information.
                </p>
                <p className="text-red-600 text-sm">
                  If you continue to see this error, try refreshing the page or
                  logging out and back in.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">
              Applications
              {stats && stats.applications.pending > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {stats.applications.pending}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contacts">
              Contacts
              {stats && stats.contacts.unread > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {stats.contacts.unread}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {stats && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Applications
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.applications.total}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stats.applications.pending} pending review
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Contacts
                      </CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.contacts.total}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {stats.contacts.unread} unread
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Waitlist
                      </CardTitle>
                      <Logo size="sm" showText={false} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.waitlist.count}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        interested users
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Hired
                      </CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.applications.hired}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        successful hires
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Position Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Applications by Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(stats.applications.byPosition).map(
                        ([position, count]) => (
                          <div
                            key={position}
                            className="flex items-center justify-between"
                          >
                            <span className="capitalize">
                              {position.replace("-", " ")}
                            </span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-700 mb-2">
                      No Applications Yet
                    </h3>
                    <p className="text-slate-500">
                      Applications will appear here when candidates apply
                      through your website.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredApplications.map((app) => (
                  <Card
                    key={app.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedApplication(app)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {app.firstName} {app.lastName}
                              </h3>
                              <p className="text-gray-600">{app.email}</p>
                              <p className="text-sm text-gray-500 capitalize">
                                {app.position.replace("-", " ")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{contact.name}</h3>
                          {contact.status === "new" && (
                            <Badge className="bg-red-100 text-red-800">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{contact.email}</p>
                        <p className="text-gray-700">{contact.message}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(contact.submittedAt).toLocaleDateString()}
                        </p>
                        {contact.status === "new" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => markContactAsRead(contact.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="waitlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Waitlist Entries</CardTitle>
                <CardDescription>
                  Users who signed up for notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {waitlist.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{entry.email}</p>
                        {entry.name && (
                          <p className="text-sm text-gray-600">{entry.name}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedApplication.firstName} {selectedApplication.lastName}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApplication(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p>{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Phone
                  </label>
                  <p>{selectedApplication.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Position
                  </label>
                  <p className="capitalize">
                    {selectedApplication.position.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Experience
                  </label>
                  <p>{selectedApplication.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Start Date
                  </label>
                  <p>{selectedApplication.startDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Applied
                  </label>
                  <p>
                    {new Date(
                      selectedApplication.appliedAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {(selectedApplication.linkedinUrl ||
                selectedApplication.portfolioUrl) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">
                    Links
                  </label>
                  {selectedApplication.linkedinUrl && (
                    <a
                      href={selectedApplication.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      LinkedIn <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                  {selectedApplication.portfolioUrl && (
                    <a
                      href={selectedApplication.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      Portfolio <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Select
                      defaultValue={selectedApplication.status}
                      onValueChange={(value) => {
                        updateApplicationStatus(selectedApplication.id, value);
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="interviewing">
                          Interviewing
                        </SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {selectedApplication.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Notes
                  </label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedApplication.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
