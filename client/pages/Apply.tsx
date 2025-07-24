import { useState, useCallback, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Logo } from "@/components/Logo";
import { apiClient } from "@/lib/api-client";
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
  TrendingUp,
  Rocket,
  Zap,
  Brain,
  Target,
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
    icon: Rocket,
    gradient: "from-blue-500 to-teal-500",
  },
  "ai-developer": {
    title: "AI/ML Engineer",
    description:
      "Develop intelligent systems that help users build better portfolios. Apply machine learning to make complex financial data simple and actionable.",
    skills: [
      "1+ years of college or relevant coursework",
      "Interest in AI/ML and data science",
      "Experience with Python or similar languages",
    ],
    icon: Brain,
    gradient: "from-purple-500 to-pink-500",
  },
  "quantitative-analyst": {
    title: "Quantitative Analyst",
    description:
      "Create smart algorithms that optimize portfolios and manage risk. Help users achieve better returns while keeping their investments safe.",
    skills: [
      "Strong background in mathematics or finance",
      "Programming experience (Python, R, or similar)",
      "Interest in financial markets and quantitative analysis",
    ],
    icon: Target,
    gradient: "from-emerald-500 to-teal-500",
  },
  "mobile-app-developer": {
    title: "Mobile App Developer",
    description:
      "Work on world-class mobile experiences that make portfolio management intuitive and accessible. Build complex financial apps with smooth performance.",
    skills: [
      "Experience with React Native, Flutter, or native development",
      "Understanding of mobile UI/UX principles",
      "Portfolio of mobile app projects",
    ],
    icon: Zap,
    gradient: "from-orange-500 to-red-500",
  },
};

export default function Apply() {
  const [searchParams] = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: searchParams.get("position") || "",
    linkedinUrl: "",
    portfolioUrl: "",
    startDate: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const selectedPosition =
    POSITIONS[formData.position as keyof typeof POSITIONS];

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    [],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setSubmitMessage("File size must be less than 10MB");
          return;
        }
        if (!file.type.includes("pdf") && !file.type.includes("doc")) {
          setSubmitMessage("Please upload a PDF or DOC file");
          return;
        }
        setResume(file);
        setSubmitMessage("");
      }
    },
    [],
  );

  const removeResume = useCallback(() => {
    setResume(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Create comprehensive cover letter
      const coverLetter = `I am applying for the ${position?.title} position at swipr.ai.

Name: ${formData.firstName.trim()} ${formData.lastName.trim()}
Email: ${formData.email.trim()}
Phone: ${formData.phone.trim()}
LinkedIn: ${formData.linkedinUrl.trim() || 'Not provided'}
Portfolio: ${formData.portfolioUrl.trim() || 'Not provided'}
Available Start Date: ${formData.startDate || 'Flexible'}

Relevant Skills and Experience:
${position?.skills.map(skill => `• ${skill}`).join('\n') || ''}

I am excited to contribute to swipr.ai's mission of democratizing intelligent investing through innovative technology and look forward to discussing how my skills can help build the future of investment platforms.`;

      const applicationData = {
        position: formData.position,
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        coverLetter,
        resumeUrl: formData.linkedinUrl.trim() || formData.portfolioUrl.trim() || ''
      };

      const result = await apiClient.submitJobApplication(applicationData);

      setSubmitSuccess(true);
      setSubmitMessage("Application submitted successfully! We'll be in touch soon.");

      // Track application submission
      await apiClient.trackEvent('job_application_submitted', {
        position: formData.position,
        applicationId: result.applicationId,
        hasLinkedIn: !!formData.linkedinUrl.trim(),
        hasPortfolio: !!formData.portfolioUrl.trim()
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        linkedinUrl: "",
        portfolioUrl: "",
        startDate: "",
      });
      setResume(null);

    } catch (error: any) {
      console.error("Application submission error:", error);
      setSubmitMessage(
        error.message || "Network error. Please check your connection and try again.",
      );

      // Track failed submission
      await apiClient.trackEvent('job_application_failed', {
        position: formData.position,
        error: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden dark">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float-slow" />
        </div>
      </div>

      {/* Sticky Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                <Logo variant="transparent" size="sm" showText={false} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                swipr.ai
              </span>
            </Link>

            {/* Back Button */}
            <Link to="/">
              <Button
                variant="outline"
                className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105 bg-white/5 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent leading-tight animate-fade-in">
              Join Our Team
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed animate-fade-in-delayed">
              Help build the future of intelligent investing
            </p>
          </div>

          {/* Position Info */}
          {selectedPosition && (
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg border border-slate-600 rounded-3xl mb-12 animate-fade-in-slow">
              <CardHeader className="text-center pb-6">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${selectedPosition.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                >
                  <selectedPosition.icon className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl text-slate-900 dark:text-white font-bold">
                  {selectedPosition.title}
                </CardTitle>
                <CardDescription className="text-lg text-slate-200 mt-4">
                  {selectedPosition.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    What we're looking for:
                  </h3>
                  <ul className="space-y-3">
                    {selectedPosition.skills.map((skill, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-200">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application Form */}
          <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-lg border border-slate-600 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-3xl text-white dark:text-white font-bold">
                Application Form
              </CardTitle>
              <CardDescription className="text-lg text-slate-200">
                Tell us about yourself and why you'd be a great fit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-900 dark:text-slate-100 font-semibold mb-3">
                      <User className="inline h-4 w-4 mr-2" />
                      First Name *
                    </label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800/60 border-slate-600 text-slate-100 placeholder-slate-400 h-14 rounded-xl"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-900 dark:text-slate-100 font-semibold mb-3">
                      <User className="inline h-4 w-4 mr-2" />
                      Last Name *
                    </label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800/60 border-slate-600 text-slate-100 placeholder-slate-400 h-14 rounded-xl"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-900 dark:text-slate-100 font-semibold mb-3">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email Address *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800/60 border-slate-600 text-slate-100 placeholder-slate-400 h-14 rounded-xl"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-900 dark:text-slate-100 font-semibold mb-3">
                      <Phone className="inline h-4 w-4 mr-2" />
                      Phone Number *
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-800/60 border-slate-600 text-slate-100 placeholder-slate-400 h-14 rounded-xl"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Position Selection */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    <Briefcase className="inline h-4 w-4 mr-2" />
                    Position *
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-slate-800/60 border border-slate-600 text-slate-100 h-14 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="" className="bg-white text-slate-900">
                      Select a position
                    </option>
                    {Object.entries(POSITIONS).map(([key, position]) => (
                      <option
                        key={key}
                        value={key}
                        className="bg-white text-slate-900"
                      >
                        {position.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-900 dark:text-slate-100 font-semibold mb-3">
                      <ExternalLink className="inline h-4 w-4 mr-2" />
                      LinkedIn Profile (Optional)
                    </label>
                    <Input
                      name="linkedinUrl"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="bg-slate-800/60 border-slate-600 text-slate-100 placeholder-slate-400 h-14 rounded-xl"
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-900 dark:text-slate-100 font-semibold mb-3">
                      <ExternalLink className="inline h-4 w-4 mr-2" />
                      Portfolio/GitHub (Optional)
                    </label>
                    <Input
                      name="portfolioUrl"
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      className="bg-slate-800/60 border-slate-600 text-slate-100 placeholder-slate-400 h-14 rounded-xl"
                      placeholder="https://github.com/yourname"
                    />
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Earliest Start Date *
                  </label>
                  <Input
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800/60 border-slate-600 text-slate-100 h-14 rounded-xl"
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    <Upload className="inline h-4 w-4 mr-2" />
                    Resume (PDF or DOC) *
                  </label>
                  <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-colors">
                    {resume ? (
                      <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 text-cyan-400 mr-3" />
                          <div className="text-left">
                            <p className="text-white font-medium">
                              {resume.name}
                            </p>
                            <p className="text-white/60 text-sm">
                              {(resume.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeResume}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-12 w-12 text-white/60 mx-auto mb-4" />
                        <p className="text-slate-200 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-white/60 text-sm">
                          PDF or DOC files only, max 10MB
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          id="resume-upload"
                        />
                        <label
                          htmlFor="resume-upload"
                          className="inline-block mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !resume}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-6 rounded-xl text-xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed h-16"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin mr-3" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-6 w-6 mr-3" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>

                {/* Status Message */}
                {submitMessage && (
                  <Alert
                    className={`${submitSuccess ? "border-emerald-500 bg-emerald-500/10" : "border-red-500 bg-red-500/10"} rounded-xl`}
                  >
                    {submitSuccess ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    )}
                    <AlertDescription
                      className={
                        submitSuccess ? "text-emerald-200" : "text-red-200"
                      }
                    >
                      {submitMessage}
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <Alert className="border-cyan-500/50 bg-cyan-500/10 rounded-xl max-w-2xl mx-auto">
              <Info className="h-5 w-5 text-cyan-400" />
              <AlertDescription className="text-cyan-200">
                We review all applications carefully and will get back to you
                within 5-7 business days. Questions? Email us at{" "}
                <a
                  href="mailto:team@swipr.ai"
                  className="text-cyan-300 hover:text-cyan-200 underline"
                >
                  team@swipr.ai
                </a>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
