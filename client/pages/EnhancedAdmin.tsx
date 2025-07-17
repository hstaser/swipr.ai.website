import React, { useState, useEffect } from "react";
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
  Mail,
  BarChart3,
  TrendingUp,
  Eye,
  MousePointer,
  Clock,
  Download,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Activity,
  Globe,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { JobApplication } from "@shared/api";

interface AnalyticsData {
  overview: {
    totalEvents: number;
    todayEvents: number;
    weekEvents: number;
    uniqueSessions: number;
    pageViews: number;
    buttonClicks: number;
    applyClicks: number;
  };
  pageViews: Record<string, number>;
  trafficSources: Record<string, number>;
  hourlyActivity: Array<{ hour: number; events: number }>;
  recentEvents: Array<{
    id: string;
    eventType: string;
    page: string;
    element?: string;
    timestamp: string;
  }>;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: "new" | "read" | "replied" | "archived";
  source: string;
}

interface MessagesData {
  messages: ContactMessage[];
  stats: {
    total: number;
    new: number;
    read: number;
    replied: number;
    archived: number;
  };
}

export default function EnhancedAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [messages, setMessages] = useState<MessagesData | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [messageFilter, setMessageFilter] = useState<string>("");

  const loadData = async (key: string) => {
    try {
      // Load applications with full details for admin
      const appsResponse = await fetch("/api/jobs/applications/details", {
        headers: { "x-admin-key": key },
      });
      if (appsResponse.ok) {
        const appsData = await appsResponse.json();
        setApplications(appsData.applications);
      }

      // Load analytics
      const analyticsResponse = await fetch("/api/admin/analytics", {
        headers: { "x-admin-key": key },
      });
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      // Load messages
      const messagesResponse = await fetch("/api/admin/messages", {
        headers: { "x-admin-key": key },
      });
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error("Failed to load admin data:", error);
    }
  };

  const authenticate = async () => {
    try {
      const response = await fetch("/api/jobs/applications", {
        headers: { "x-admin-key": adminKey },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("admin-key", adminKey);
        await loadData(adminKey);
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

  const refreshData = async () => {
    const storedKey = localStorage.getItem("admin-key");
    if (storedKey) {
      await loadData(storedKey);
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": localStorage.getItem("admin-key") || "",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await refreshData();
      }
    } catch (error) {
      console.error("Failed to update message status:", error);
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
            "x-admin-key": localStorage.getItem("admin-key") || "",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (response.ok) {
        await refreshData();
      }
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  const downloadResume = async (applicationId: string) => {
    try {
      const response = await fetch(
        `/api/jobs/applications/${applicationId}/download`,
        {
          headers: {
            "x-admin-key": localStorage.getItem("admin-key") || "",
          },
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        // Get filename from response headers or use default
        const contentDisposition = response.headers.get("content-disposition");
        let filename = "resume.pdf";
        if (contentDisposition) {
          const matches = /filename="(.+)"/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1];
          }
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download resume");
      }
    } catch (error) {
      console.error("Failed to download resume:", error);
      alert("Error downloading resume");
    }
  };

  const exportData = (type: string) => {
    let data: any = [];
    let filename = "";

    switch (type) {
      case "applications":
        data = applications;
        filename = "job_applications.json";
        break;
      case "messages":
        data = messages?.messages;
        filename = "contact_messages.json";
        break;
      case "analytics":
        data = analytics;
        filename = "analytics_data.json";
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const storedKey = localStorage.getItem("admin-key");
    if (storedKey) {
      setAdminKey(storedKey);
      setIsAuthenticated(true);
      loadData(storedKey);
    }
    setIsLoading(false);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <CardDescription>
              Enter the admin key to access the comprehensive dashboard
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

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredMessages = messages?.messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !messageFilter || msg.status === messageFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-slate-800">
                swipr.ai Admin Dashboard
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshData}
                className="text-slate-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("admin-key");
                  setIsAuthenticated(false);
                }}
              >
                Logout
              </Button>
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "analytics", label: "Analytics", icon: Activity },
              { id: "messages", label: "Messages", icon: MessageSquare },
              { id: "applications", label: "Applications", icon: Users },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center"
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Key Metrics */}
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
                    {applications.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {applications.filter((a) => a.status === "pending").length}{" "}
                    pending review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    New Messages
                  </CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {messages?.stats.new || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {messages?.stats.total || 0} total messages
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Page Views Today
                  </CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.overview.todayEvents || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.overview.uniqueSessions || 0} unique sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Apply Clicks
                  </CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.overview.applyClicks || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics?.overview.buttonClicks || 0} total clicks
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {app.firstName} {app.lastName}
                          </p>
                          <p className="text-sm text-slate-600">
                            {app.position.replace("-", " ")}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.status === "reviewing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages?.messages && messages.messages.length > 0 ? (
                      messages.messages.slice(0, 5).map((msg) => (
                        <div
                          key={msg.id}
                          className="flex items-start justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{msg.name}</p>
                            <p className="text-sm text-slate-600 break-words">
                              {msg.message.length > 80
                                ? `${msg.message.substring(0, 80)}...`
                                : msg.message}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                                msg.status === "new"
                                  ? "bg-red-100 text-red-800"
                                  : msg.status === "read"
                                    ? "bg-blue-100 text-blue-800"
                                    : msg.status === "replied"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {msg.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p>No messages yet</p>
                        <p className="text-sm">
                          Contact messages will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && analytics && (
          <div className="space-y-8">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics.trafficSources).map(
                      ([source, count]) => (
                        <div
                          key={source}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{source}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics.pageViews).map(
                      ([page, views]) => (
                        <div
                          key={page}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm">{page}</span>
                          <span className="font-medium">{views}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hourly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {analytics.hourlyActivity.slice(-6).map((hour) => (
                      <div
                        key={hour.hour}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>{hour.hour}:00</span>
                        <div className="flex items-center">
                          <div
                            className="bg-blue-200 h-2 rounded mr-2"
                            style={{
                              width: `${Math.max(
                                (hour.events /
                                  Math.max(
                                    ...analytics.hourlyActivity.map(
                                      (h) => h.events,
                                    ),
                                  )) *
                                  50,
                                2,
                              )}px`,
                            }}
                          />
                          <span>{hour.events}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportData("analytics")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-2 hover:bg-slate-50 rounded"
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            event.eventType === "page_view"
                              ? "bg-blue-100 text-blue-800"
                              : event.eventType === "button_click"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {event.eventType}
                        </span>
                        <span className="text-sm">{event.page}</span>
                        {event.element && (
                          <span className="text-xs text-slate-500">
                            → {event.element}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && messages && (
          <div className="space-y-6">
            {/* Messages Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Contact Messages</h2>
                <p className="text-slate-600">
                  {messages.stats.total} total messages, {messages.stats.new}{" "}
                  unread
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportData("messages")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Message Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select
                    value={messageFilter}
                    onChange={(e) => setMessageFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Messages List */}
            <div className="space-y-4">
              {filteredMessages?.map((message) => (
                <Card
                  key={message.id}
                  className={`${
                    message.status === "new"
                      ? "border-l-4 border-l-red-500"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-800">
                            {message.name}
                          </h3>
                          <span className="text-sm text-slate-500">
                            {message.email}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              message.status === "new"
                                ? "bg-red-100 text-red-800"
                                : message.status === "read"
                                  ? "bg-blue-100 text-blue-800"
                                  : message.status === "replied"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {message.status}
                          </span>
                        </div>
                        <p className="text-slate-700 mb-3">{message.message}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateMessageStatus(
                              message.id,
                              message.status === "new" ? "read" : "new",
                            )
                          }
                        >
                          {message.status === "new" ? "Mark Read" : "Mark New"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `mailto:${message.email}?subject=Re: Your message to swipr.ai`)
                          }
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Applications Tab - Enhanced version of existing */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Job Applications</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportData("applications")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Enhanced filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search applications..."
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
                </div>
              </CardContent>
            </Card>

            {/* Applications grid with enhanced info */}
            <div className="grid gap-6">
              {filteredApplications.map((application) => (
                <Card
                  key={application.id}
                  className="hover:shadow-lg transition-shadow"
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
                          <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                            <span>{application.email}</span>
                            <span>•</span>
                            <span>{application.experience}</span>
                            <span>•</span>
                            <span>
                              {new Date(
                                application.appliedAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            application.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : application.status === "reviewing"
                                ? "bg-blue-100 text-blue-800"
                                : application.status === "interviewing"
                                  ? "bg-purple-100 text-purple-800"
                                  : application.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                          }`}
                        >
                          {application.status}
                        </div>
                        <div className="flex flex-col space-y-2">
                          {application.resumeFilename && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadResume(application.id)}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download Resume
                            </Button>
                          )}
                          <select
                            value={application.status}
                            onChange={(e) =>
                              updateApplicationStatus(
                                application.id,
                                e.target.value,
                              )
                            }
                            className="text-xs px-2 py-1 border rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="rejected">Rejected</option>
                            <option value="hired">Hired</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
