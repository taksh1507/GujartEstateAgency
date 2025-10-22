import { Building2 } from 'lucide-react';

const Logo = ({ 
  className = "", 
  textClassName = "", 
  iconClassName = "", 
  showText = true,
  variant = "default" // "default", "white", "dark"
}) => {
  
  // Define color variants
  const variants = {
    default: {
      icon: "text-primary",
      accent: "bg-secondary",
      gujarat: "text-primary",
      estate: "text-secondary", 
      agency: "text-gray-600"
    },
    white: {
      icon: "text-white",
      accent: "bg-secondary",
      gujarat: "text-white",
      estate: "text-secondary",
      agency: "text-gray-200"
    },
    dark: {
      icon: "text-gray-800",
      accent: "bg-secondary",
      gujarat: "text-gray-800",
      estate: "text-secondary",
      agency: "text-gray-600"
    }
  };

  const colors = variants[variant] || variants.default;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <Building2 className={`h-8 w-8 ${iconClassName || colors.icon}`} />
        <div className={`absolute -top-1 -right-1 w-3 h-3 ${colors.accent} rounded-full`}></div>
      </div>
      
      {/* Company Name */}
      {showText && (
        <div className={`font-bold text-xl ${textClassName}`}>
          <span className={colors.gujarat}>Gujarat</span>
          <span className={`ml-1 ${colors.estate}`}>Estate</span>
          <div className={`text-xs -mt-1 ${colors.agency}`}>Agency</div>
        </div>
      )}
    </div>
  );
};

export default Logo;