interface LogoProps {
  className?: string;
  variant?: "default" | "transparent";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ 
  className = "", 
  variant = "default", 
  size = "md",
  showText = true 
}: LogoProps) {
  const isTransparent = variant === "transparent";
  
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };
  
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="transition-all duration-300 hover:scale-105">
        <svg 
          width={size === "sm" ? "24" : size === "md" ? "32" : "48"} 
          height={size === "sm" ? "24" : size === "md" ? "32" : "48"} 
          viewBox="0 0 40 40" 
          className={isTransparent ? "text-white" : "text-blue-600"}
        >
          {/* Stylized arrow/diamond shape inspired by the logo */}
          <path d="M20 4 L36 20 L20 36 L4 20 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M20 4 L28 20 L20 36 L12 20 Z" fill="currentColor" opacity="0.3"/>
          <path d="M20 12 L28 20 L20 28 L12 20 Z" fill="currentColor"/>
          {/* Arrow pointing up and right */}
          <path d="M16 24 L20 20 L24 24 M20 20 L20 16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      {showText && (
        <span
          className={`${textSizeClasses[size]} font-bold ${
            isTransparent 
              ? "text-white" 
              : "bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
          }`}
        >
          swipr.ai
        </span>
      )}
    </div>
  );
}
