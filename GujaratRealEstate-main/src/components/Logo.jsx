import { Building2 } from 'lucide-react';

const Logo = ({ className = "", textClassName = "", iconClassName = "", showText = true }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <Building2 className={`h-8 w-8 text-primary ${iconClassName}`} />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"></div>
      </div>
      
      {/* Company Name */}
      {showText && (
        <div className={`font-bold text-xl ${textClassName}`}>
          <span className="text-primary">Gujarat</span>
          <span className="text-secondary ml-1">Estate</span>
          <div className="text-xs text-gray-600 -mt-1">Agency</div>
        </div>
      )}
    </div>
  );
};

export default Logo;