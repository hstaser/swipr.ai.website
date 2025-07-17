import { useState, useCallback, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
  DollarSign,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { JobApplicationRequest, JobApplicationResponse } from "@shared/api";

const POSITIONS = {
  "backend-engineer": {
    title: "Backend Engineer",
    description:
      "Build scalable APIs and infrastructure for our trading platform",
  },
  "ai-developer": {
    title: "AI Developer",
    description:
      "Develop machine learning models for stock analysis and recommendation systems",
  },
  "quantitative-analyst": {
    title: "Quantitative Analyst",
    description: "Design portfolio optimization algorithms and risk models",
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
    coverLetter: "",
    linkedinUrl: "",
    portfolioUrl: "",
    startDate: "",
    salary: "",
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
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value);
        }
      });

      // Append resume file if provided
      if (resumeFile) {
        formDataToSend.append("resume", resumeFile);
      }

      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        body: formDataToSend,
      });

      const result: JobApplicationResponse = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setSubmitMessage(result.message);
        setApplicationId(result.applicationId || "");

        // Clear saved draft
        localStorage.removeItem(`application-${position}`);

        // Scroll to success message
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitMessage(
          result.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error("Application submission error:", error);
      setSubmitMessage("Network error. Please try again later.");
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
          <CardContent className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">Application ID</p>
              <p className="font-mono text-sm bg-white p-2 rounded border">
                {applicationId}
              </p>
            </div>
            <p className="text-slate-600">
              We'll review your application and get back to you within 3-5
              business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Homepage
                </Button>
              </Link>
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                Apply for Another Position
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              swipr.ai
            </Link>
            <div className="flex items-center space-x-4">
              {saveStatus && (
                <span className="text-sm text-slate-500 flex items-center">
                  {saveStatus === "saving" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      Draft saved
                    </>
                  )}
                </span>
              )}
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Apply for {POSITIONS[position].title}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {POSITIONS[position].description}
            </p>
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full mt-4">
              <Briefcase className="h-4 w-4 mr-2" />
              Full-time • Remote/NYC
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
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <ExternalLink className="h-4 w-4 inline mr-1" />
                      LinkedIn Profile
                    </label>
                    <Input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Portfolio/Website
                    </label>
                    <Input
                      type="url"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Expected Salary (Optional)
                  </label>
                  <Input
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., $120,000 - $150,000"
                    className="h-12"
                  />
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
