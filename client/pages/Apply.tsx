import { useState, useCallback, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  Loader2,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { JobApplicationRequest, JobApplicationResponse } from "@shared/api";

const POSITIONS = {
  "backend-engineer": {
    title: "Backend Engineer",
    description:
      "Work on high-performance, scalable infrastructure for our algorithmic trading platform",
    skills: [
      "1+ years of college or bootcamp experience",
      "Interest in backend development and APIs",
      "Basic programming skills (any language)",
    ],
    compensation:
      "Competitive equity package with significant upside potential",
  },
  "ai-developer": {
    title: "AI/ML Engineer",
    description:
      "Work on cutting-edge machine learning systems for financial market analysis and algorithmic trading",
    skills: [
      "1+ years of college or relevant coursework",
      "Interest in AI/ML and data science",
      "Basic Python or programming experience",
    ],
    compensation: "Significant equity stake with performance-based vesting",
  },
  "quantitative-analyst": {
    title: "Quantitative Researcher",
    description:
      "Work on sophisticated mathematical models for portfolio optimization, risk management, and alpha generation",
    skills: [
      "1+ years of college in math, statistics, or related field",
      "Interest in finance and quantitative analysis",
      "Basic understanding of statistics or willingness to learn",
    ],
    compensation: "Equity-heavy compensation with performance incentives",
  },
  "mobile-app-developer": {
    title: "Mobile App Developer",
    description:
      "Work on our mobile application that brings sophisticated portfolio management to users' fingertips",
    skills: [
      "1+ years of college or bootcamp experience",
      "Interest in mobile app development",
      "Basic React, Flutter, or mobile development experience",
    ],
  },
} as const;

const EXPERIENCE_LEVELS = [
  "0-1 years",
  "2-3 years",
  "4-5 years",
  "6-8 years",
  "9+ years",
];

export default function Apply() {
  const [searchParams] = useSearchParams();
  const position =
    (searchParams.get("position") as keyof typeof POSITIONS) ||
    "backend-engineer";

  const [formData, setFormData] = useState<JobApplicationRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position,
    experience: "",
    startDate: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "">("");

  // Auto-save draft functionality
  useEffect(() => {
    const savedData = localStorage.getItem(`application-${position}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load saved application data");
      }
    }
  }, [position]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.firstName || formData.lastName || formData.email) {
        setSaveStatus("saving");
        localStorage.setItem(
          `application-${position}`,
          JSON.stringify(formData),
        );
        setTimeout(() => setSaveStatus("saved"), 500);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, position]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "text/plain")
    ) {
      setResumeFile(file);
    } else {
      alert("Please upload a PDF, DOC, DOCX, or TXT file.");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Prepare application data (without file for now - files need special handling in serverless)
      const applicationData: JobApplicationRequest = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        position,
        experience: formData.experience,
        startDate: formData.startDate,
      };

      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      const result: JobApplicationResponse = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
        setSubmitMessage(
          result.message || "Application submitted successfully!",
        );
        setApplicationId(result.applicationId || "");

        // Clear saved draft
        localStorage.removeItem(`application-${position}`);

        // Scroll to success message
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitMessage(
          result.message ||
            result.error ||
            "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error("Application submission error:", error);
      setSubmitMessage(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <Card className="max-w-lg w-full text-center border-0 shadow-xl">
          <CardHeader>
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-800">
              Application Submitted!
            </CardTitle>
            <CardDescription className="text-lg">
              {submitMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">Application ID</p>
                <p className="font-mono text-sm bg-white p-2 rounded border break-all">
                  {applicationId}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 mb-2">Timeline</p>
                <p className="text-sm text-blue-800">
                  Review: 3-5 business days
                </p>
              </div>
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-medium text-teal-900 mb-2">
                About Compensation
              </h4>
              <p className="text-sm text-teal-700">
                swipr.ai offers equity-based compensation packages with
                significant upside potential. Compensation details will be
                discussed during the interview process.
              </p>
            </div>

            <p className="text-slate-600 text-center">
              We'll review your application carefully and get back to you with
              next steps. Keep an eye on your email for updates!
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-4">
              <Link to="/track">
                <Button variant="outline" className="w-full">
                  Track Application
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Back Home
                </Button>
              </Link>
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                Apply Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <Navigation />

      {/* Save Status Bar */}
      {saveStatus && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-2">
            <span className="text-sm text-slate-500 flex items-center justify-center">
              {saveStatus === "saving" ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Saving draft...
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                  Draft saved automatically
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 py-16 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Apply for {POSITIONS[position].title}
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {POSITIONS[position].description}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Position Details */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Position Overview
            </h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Position Details
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>• Full-time position</p>
                    <p>• Remote/NYC hybrid</p>
                    <p>• {POSITIONS[position].compensation}</p>
                  </div>
                </div>
                <div className="bg-teal-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-teal-900 mb-3">
                    Key Requirements
                  </h3>
                  <div className="space-y-1 text-sm text-teal-700">
                    {POSITIONS[position].skills
                      .slice(0, 3)
                      .map((skill, index) => (
                        <p key={index}>• {skill}</p>
                      ))}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Technical Skills & Experience
                </h3>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-700">
                  {POSITIONS[position].skills.map((skill, index) => (
                    <p key={index}>• {skill}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Years of Experience *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">Select experience level</option>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Available Start Date *
                    </label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="h-12"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Please select a future date
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume Upload */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Resume/CV
                </CardTitle>
                <CardDescription>
                  Upload your resume in PDF, DOC, DOCX, or TXT format (max 5MB)
                  <br />
                  <span className="text-blue-600 font-medium">Note:</span>{" "}
                  Resume will be handled via email follow-up
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver
                      ? "border-blue-500 bg-blue-50"
                      : resumeFile
                        ? "border-green-500 bg-green-50"
                        : "border-slate-300 hover:border-slate-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {resumeFile ? (
                    <div className="flex items-center justify-center space-x-4">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-slate-800">
                          {resumeFile.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setResumeFile(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-slate-800 mb-2">
                        Drag and drop your resume here
                      </p>
                      <p className="text-slate-600 mb-4">or</p>
                      <Button type="button" variant="outline" asChild>
                        <label className="cursor-pointer">
                          Choose File
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Cover Letter (Optional)</CardTitle>
                <CardDescription>
                  Tell us why you're excited about this role and what you'd
                  bring to swipr.ai
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Write your cover letter here..."
                  className="min-h-[150px] resize-none"
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-lg px-12 py-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Submitting Application...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>

            {submitMessage && !isSuccess && (
              <div className="text-center">
                <p className="text-red-600 bg-red-50 p-4 rounded-lg">
                  {submitMessage}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
