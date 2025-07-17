import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Brain,
  TrendingUp,
  Users,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";
import {
  ContactRequest,
  ContactResponse,
  WaitlistRequest,
  WaitlistResponse,
} from "@shared/api";

export default function Index() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [waitlistMessage, setWaitlistMessage] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactMessage("");

    try {
      const contactData: ContactRequest = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result: ContactResponse = await response.json();

      if (result.success) {
        setContactMessage(result.message);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setContactMessage(
          result.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setContactMessage("Network error. Please try again later.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingWaitlist(true);
    setWaitlistMessage("");

    try {
      const waitlistData: WaitlistRequest = {
        email: waitlistEmail,
      };

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(waitlistData),
      });

      const result: WaitlistResponse = await response.json();

      if (result.success) {
        setWaitlistMessage(result.message);
        setWaitlistEmail("");
      } else {
        setWaitlistMessage(
          result.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error("Waitlist signup error:", error);
      setWaitlistMessage("Network error. Please try again later.");
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-6 py-24 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              swipr.ai
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing stock investing through intelligent swipe-based
              decisions powered by AI and portfolio optimization
            </p>
            <div className="space-y-4">
              <form
                onSubmit={handleWaitlistSubmit}
                className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  required
                  className="bg-white/90 border-0 text-slate-800 placeholder-slate-500 h-12"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmittingWaitlist}
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 h-12 whitespace-nowrap"
                >
                  {isSubmittingWaitlist ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
              {waitlistMessage && (
                <p className="text-blue-100 text-center mt-4">
                  {waitlistMessage}
                </p>
              )}
              <div className="flex justify-center mt-6">
                <Link to="/learn-more">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm text-lg px-8 py-3"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              The Future of Investing
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Swipr.ai transforms complex investment decisions into simple,
              intuitive swipes. Our AI-powered platform analyzes thousands of
              data points to present you with personalized stock recommendations
              that match your risk profile and investment goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-800">
                  Smart Swipe Interface
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Swipe right on stocks you love, left on ones you don't. Our
                  intuitive interface makes investing as easy as social media.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-800">
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Advanced machine learning algorithms analyze market trends,
                  company fundamentals, and sentiment to guide your decisions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-800">
                  Portfolio Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Automatically balance your portfolio for optimal risk-adjusted
                  returns using modern portfolio theory and quantitative
                  methods.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Open Roles Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Join Our Team
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              We're building the future of fintech and looking for exceptional
              talent to join our mission.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">
                  Backend Engineer
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Full-time • Remote/NYC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Build scalable APIs and infrastructure for our trading
                  platform. Experience with Python, PostgreSQL, and cloud
                  services required.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                  onClick={() =>
                    (window.location.href =
                      "mailto:team@swipr.ai?subject=Backend Engineer Application")
                  }
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">
                  AI Developer
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Full-time • Remote/NYC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Develop machine learning models for stock analysis and
                  recommendation systems. Deep knowledge of ML/AI and financial
                  markets.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() =>
                    (window.location.href =
                      "mailto:team@swipr.ai?subject=AI Developer Application")
                  }
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">
                  Quantitative Analyst
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Full-time • Remote/NYC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Design portfolio optimization algorithms and risk models.
                  Strong background in mathematics, statistics, and financial
                  engineering.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700"
                  onClick={() =>
                    (window.location.href =
                      "mailto:team@swipr.ai?subject=Quantitative Analyst Application")
                  }
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                Get In Touch
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Have questions or want to learn more? We'd love to hear from
                you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-800">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Email</p>
                        <p className="text-slate-600">team@swipr.ai</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Location</p>
                        <p className="text-slate-600">New York City, NY</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-800">
                      Send us a message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div>
                        <Input
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Textarea
                          name="message"
                          placeholder="Your Message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className="min-h-[120px]"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 h-12"
                      >
                        {isSubmittingContact ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Send Message
                      </Button>
                    </form>
                    {contactMessage && (
                      <p
                        className={`text-center mt-4 ${contactMessage.includes("Thank you") ? "text-green-600" : "text-red-600"}`}
                      >
                        {contactMessage}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  swipr.ai
                </h3>
                <p className="text-slate-400 mt-2">
                  The future of intelligent investing
                </p>
              </div>
              <div className="flex items-center space-x-8">
                <a
                  href="mailto:team@swipr.ai"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms
                </a>
              </div>
            </div>
            <div className="border-t border-slate-700 mt-8 pt-8 text-center">
              <p className="text-slate-400">
                © 2024 swipr.ai. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
