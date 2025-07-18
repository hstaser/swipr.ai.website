import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/lib/analytics";
import {
  TrendingUp,
  Menu,
  X,
  Brain,
  Users,
  Mail,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";

interface NavigationProps {
  variant?: "default" | "transparent";
  className?: string;
}

export function Navigation({
  variant = "default",
  className = "",
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { trackLearnMoreClick } = useAnalytics();

  const isTransparent = variant === "transparent";
  const navClasses = isTransparent
    ? "bg-white/10 backdrop-blur-md border-white/20"
    : "bg-white/95 backdrop-blur-sm border-slate-200";

  const textColor = isTransparent ? "text-white" : "text-slate-700";
  const hoverColor = isTransparent
    ? "hover:text-blue-200"
    : "hover:text-blue-600";

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`shadow-sm border-b sticky top-0 z-50 ${navClasses} ${className}`}
      style={{ contain: "layout style" }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span
              className={`text-xl font-bold ${isTransparent ? "text-white" : "bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"}`}
            >
              swipr.ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`${textColor} ${hoverColor} transition-colors font-medium ${isActive("/") ? "text-blue-600" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/learn-more"
              onClick={trackLearnMoreClick}
              className={`${textColor} ${hoverColor} transition-colors font-medium ${isActive("/learn-more") ? "text-blue-600" : ""}`}
            >
              Learn More
            </Link>
            {location.pathname === "/" ? (
              <a
                href="#open-roles"
                className={`${textColor} ${hoverColor} transition-colors font-medium`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("open-roles")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Join Our Team
              </a>
            ) : (
              <Link
                to="/#open-roles"
                className={`${textColor} ${hoverColor} transition-colors font-medium`}
              >
                Join Our Team
              </Link>
            )}
            <Link
              to="/track"
              className={`${textColor} ${hoverColor} transition-colors font-medium ${isActive("/track") ? "text-blue-600" : ""}`}
            >
              Track Application
            </Link>
            {location.pathname === "/" ? (
              <a
                href="#contact"
                className={`${textColor} ${hoverColor} transition-colors font-medium`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contact
              </a>
            ) : (
              <Link
                to="/#contact"
                className={`${textColor} ${hoverColor} transition-colors font-medium`}
              >
                Contact
              </Link>
            )}
            <div className="flex items-center space-x-3">
              <Link to="/apply">
                <Button
                  size="sm"
                  className={`${isTransparent ? "bg-white/20 hover:bg-white/30 text-white border-white/30" : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"}`}
                  variant={isTransparent ? "outline" : "default"}
                >
                  Apply Now
                </Button>
              </Link>
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${isTransparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-slate-600 hover:text-slate-800"}`}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg ${isTransparent ? "hover:bg-white/10" : "hover:bg-slate-100"} transition-colors`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`h-6 w-6 ${textColor}`} />
            ) : (
              <Menu className={`h-6 w-6 ${textColor}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden border-t ${isTransparent ? "bg-white/10 backdrop-blur-md border-white/20" : "bg-white/95 backdrop-blur-sm border-slate-200"}`}
          >
            <div className="py-4 space-y-3">
              <Link
                to="/"
                className={`block px-4 py-2 ${textColor} ${hoverColor} ${isTransparent ? "hover:bg-white/10" : "hover:bg-slate-50"} rounded-lg transition-colors font-medium ${isActive("/") ? "text-blue-600" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-4 w-4" />
                  <span>Home</span>
                </div>
              </Link>
              <Link
                to="/learn-more"
                className={`block px-4 py-2 ${textColor} ${hoverColor} ${isTransparent ? "hover:bg-white/10" : "hover:bg-slate-50"} rounded-lg transition-colors font-medium ${isActive("/learn-more") ? "text-blue-600" : ""}`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackLearnMoreClick();
                }}
              >
                <div className="flex items-center space-x-3">
                  <Brain className="h-4 w-4" />
                  <span>Learn More</span>
                </div>
              </Link>
              {location.pathname === "/" ? (
                <a
                  href="#open-roles"
                  className={`block px-4 py-2 ${textColor} ${hoverColor} ${isTransparent ? "hover:bg-white/10" : "hover:bg-slate-50"} rounded-lg transition-colors font-medium`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    document
                      .getElementById("open-roles")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4" />
                    <span>Careers</span>
                  </div>
                </a>
              ) : (
                <Link
                  to="/#open-roles"
                  className={`block px-4 py-2 ${textColor} ${hoverColor} ${isTransparent ? "hover:bg-white/10" : "hover:bg-slate-50"} rounded-lg transition-colors font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4" />
                    <span>Careers</span>
                  </div>
                </Link>
              )}
              <Link
                to="/track"
                className={`block px-4 py-2 ${textColor} ${hoverColor} ${isTransparent ? "hover:bg-white/10" : "hover:bg-slate-50"} rounded-lg transition-colors font-medium ${isActive("/track") ? "text-blue-600" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-4 w-4" />
                  <span>Track Application</span>
                </div>
              </Link>
              {location.pathname === "/" ? (
                <a
                  href="#contact"
                  className={`block px-4 py-2 ${textColor} ${hoverColor} ${isTransparent ? "hover:bg-white/10" : "hover:bg-slate-50"} rounded-lg transition-colors font-medium`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4" />
                    <span>Contact</span>
                  </div>
                </a>
              ) : (
                <Link
                  to="/#contact"
                  className={`block px-4 py-2 ${textColor} ${hoverColor} ${isTransparent ? "hover:bg-white/10" : "hover:bg-slate-50"} rounded-lg transition-colors font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4" />
                    <span>Contact</span>
                  </div>
                </Link>
              )}
              <Link
                to="/privacy"
                className={`block px-4 py-2 ${textColor} ${hoverColor} ${isTransparent ? "hover:bg-white/10" : "hover:bg-slate-50"} rounded-lg transition-colors font-medium ${isActive("/privacy") ? "text-blue-600" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </div>
              </Link>
              <div
                className={`border-t pt-3 mt-3 ${isTransparent ? "border-white/20" : "border-slate-200"}`}
              >
                <div className="px-4 space-y-2">
                  <Link to="/apply" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className={`w-full ${isTransparent ? "bg-white/20 hover:bg-white/30 text-white border-white/30" : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"}`}
                      variant={isTransparent ? "outline" : "default"}
                    >
                      Apply Now
                    </Button>
                  </Link>
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className={`w-full ${isTransparent ? "border-white/30 text-white hover:bg-white/10" : ""}`}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
