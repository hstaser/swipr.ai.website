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
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  AlertCircle,
  Info,
} from "lucide-react";
import { JobApplicationRequest, JobApplicationResponse } from "@shared/api";

const POSITIONS = {
  "backend-engineer": {
    title: "Backend Engineer",
    description:
      "Help build scalable, high-performance systems that power our investment platform. Use cutting-edge technology to help users make better investment decisions.",
    skills: [
      "1+ years of college or bootcamp experience",
      "Interest in backend development and APIs",
      "Basic programming skills (any language)",
    ],
  },
  "ai-developer": {
    title: "AI/ML Engineer",
    description:
      "Develop intelligent systems that help users build better portfolios. Apply machine learning to make complex financial data simple and actionable.",
    skills: [
      "1+ years of college or relevant coursework",
      "Interest in AI/ML and data science",
      "Basic Python or programming experience",
    ],
  },
  "quantitative-analyst": {
    title: "Quantitative Researcher",
    description:
      "Create smart algorithms that optimize portfolios and manage risk. Help users achieve better returns while keeping their investments safe.",
    skills: [
      "1+ years of college in math, statistics, or related field",
      "Interest in finance and quantitative analysis",
      "Basic understanding of statistics or willingness to learn",
    ],
  },
  "mobile-app-developer": {
    title: "Mobile App Developer",
    description:
      "Work on world-class mobile experiences that make portfolio management intuitive and accessible. Build complex financial apps with smooth performance.",
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

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  experience?: string;
  startDate?: string;
  general?: string;
}

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
    linkedinUrl: "",
    portfolioUrl: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "">("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

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

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return "This field is required";
        if (value.trim().length < 2)
          return "Must be at least 2 characters long";
        if (!/^[a-zA-Z\s\-']+$/.test(value))
          return "Only letters, spaces, hyphens, and apostrophes allowed";
        break;

      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        break;

      case "phone":
        if (!value.trim()) return "Phone number is required";
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)\.]/g, "");
        if (!phoneRegex.test(cleanPhone))
          return "Please enter a valid phone number";
        break;

      case "experience":
        if (!value) return "Please select your experience level";
        break;

      case "startDate":
        if (!value) return "Please select your available start date";
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate < today) return "Start date cannot be in the past";
        break;

      case "linkedinUrl":
      case "portfolioUrl":
        if (value && !/^https?:\/\/.+/.test(value))
          return "Please enter a valid URL (starting with http:// or https://)";
        break;

      default:
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Validate required fields
    errors.firstName = validateField("firstName", formData.firstName);
    errors.lastName = validateField("lastName", formData.lastName);
    errors.email = validateField("email", formData.email);
    errors.phone = validateField("phone", formData.phone);
    errors.experience = validateField("experience", formData.experience);
    errors.startDate = validateField("startDate", formData.startDate);

    // Validate optional URL fields
    if (formData.linkedinUrl) {
      const linkedinError = validateField("linkedinUrl", formData.linkedinUrl);
      if (linkedinError) errors.general = linkedinError;
    }

    if (formData.portfolioUrl) {
      const portfolioError = validateField(
        "portfolioUrl",
        formData.portfolioUrl,
      );
      if (portfolioError) errors.general = portfolioError;
    }

    // Remove undefined errors
    Object.keys(errors).forEach((key) => {
      if (!errors[key as keyof ValidationErrors]) {
        delete errors[key as keyof ValidationErrors];
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
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
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          general: "File size must be less than 5MB",
        }));
        return;
      }
      setResumeFile(file);
      setValidationErrors((prev) => ({ ...prev, general: undefined }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        general: "Please upload a PDF, DOC, DOCX, or TXT file.",
      }));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors((prev) => ({
          ...prev,
          general: "File size must be less than 5MB",
        }));
        return;
      }
      setResumeFile(file);
      setValidationErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
      setValidationErrors((prev) => ({
        ...prev,
        general: "Please fix the errors above before submitting.",
      }));
      return;
    }

    try {
      const applicationData: JobApplicationRequest = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        position,
        experience: formData.experience,
        startDate: formData.startDate,
        linkedinUrl: formData.linkedinUrl?.trim() || "",
        portfolioUrl: formData.portfolioUrl?.trim() || "",
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
          result.message || "Something went wrong. Please try again later.",
        );
      }
    } catch (error) {
      console.error("Application submission error:", error);
      setSubmitMessage(
        "Network error. Please check your internet connection and try again.",
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

            <Alert className="bg-teal-50 border-teal-200">
              <Info className="h-4 w-4 text-teal-600" />
              <AlertDescription className="text-teal-700">
                We'll review your application carefully and get back to you with
                next steps. Keep an eye on your email for updates!
              </AlertDescription>
            </Alert>

            <div className="grid sm:grid-cols-2 gap-3 pt-4">
              <Link to="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight pb-2">
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
                    <p>• Part-time position</p>
                    <p>• Remote</p>
                    <p>• Equity-based compensation</p>
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
            </div>
          </div>

          {/* Global Validation Errors */}
          {validationErrors.general && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {validationErrors.general}
              </AlertDescription>
            </Alert>
          )}

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
                    className={`h-12 ${validationErrors.firstName ? "border-red-500" : ""}`}
                    placeholder="Enter your first name"
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.firstName}
                    </p>
                  )}
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
                    className={`h-12 ${validationErrors.lastName ? "border-red-500" : ""}`}
                    placeholder="Enter your last name"
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.lastName}
                    </p>
                  )}
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
                    className={`h-12 ${validationErrors.email ? "border-red-500" : ""}`}
                    placeholder="your.email@example.com"
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.email}
                    </p>
                  )}
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
                    className={`h-12 ${validationErrors.phone ? "border-red-500" : ""}`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.phone}
                    </p>
                  )}
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
                      className={`w-full h-12 px-3 py-2 border rounded-md bg-background ${validationErrors.experience ? "border-red-500" : "border-input"}`}
                    >
                      <option value="">Select experience level</option>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    {validationErrors.experience && (
                      <p className="text-red-600 text-sm mt-1">
                        {validationErrors.experience}
                      </p>
                    )}
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
                      className={`h-12 ${validationErrors.startDate ? "border-red-500" : ""}`}
                    />
                    {validationErrors.startDate && (
                      <p className="text-red-600 text-sm mt-1">
                        {validationErrors.startDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      LinkedIn Profile (Optional)
                    </label>
                    <Input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="h-12"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Portfolio/Website (Optional)
                    </label>
                    <Input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      className="h-12"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume Upload */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Resume/CV (Optional)
                </CardTitle>
                <CardDescription>
                  Upload your resume in PDF, DOC, DOCX, or TXT format (max 5MB)
                  <br />
                  <span className="text-blue-600 font-medium">Note:</span>{" "}
                  Resume can also be sent via email if preferred
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
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {submitMessage}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
