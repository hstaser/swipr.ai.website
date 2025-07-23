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
            <div className={`w-10 h-10 rounded-xl p-2 border transition-all duration-300 hover:scale-105 ${
              isTransparent
                ? "bg-white/10 backdrop-blur-sm border-white/20 hover:border-cyan-400/50"
                : "bg-slate-100 border-slate-200 hover:border-blue-400/50"
            }`}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F8274926fadf9406c8e2d75b7a56de814%2Fa6a66b2fcf0441379eacc75b64af9438?format=webp&width=800"
                alt="swipr.ai logo"
                className="w-full h-full object-contain"
              />
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
                    <span>Join Our Team</span>
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
                    <span>Join Our Team</span>
                  </div>
                </Link>
              )}

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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
