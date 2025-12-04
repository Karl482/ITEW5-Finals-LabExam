import './Logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

function Logo({ size = 'medium', showText = true, className = '' }: LogoProps) {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64
  };

  const iconSize = sizeMap[size];

  return (
    <div className={`logo ${size} ${className}`}>
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 32 32" 
        xmlns="http://www.w3.org/2000/svg"
        className="logo-icon"
      >
        {/* Background */}
        <rect width="32" height="32" fill="#0066CC" rx="4"/>
        
        {/* Volleyball */}
        <g transform="translate(16, 16)">
          {/* Main circle */}
          <circle cx="0" cy="0" r="9" fill="none" stroke="#FFFFFF" strokeWidth="1.5"/>
          
          {/* Volleyball pattern */}
          {/* Left curved panel */}
          <path d="M -6.36 -6.36 Q -3 -3 -6.36 6.36" fill="none" stroke="#FFFFFF" strokeWidth="1.5"/>
          
          {/* Right curved panel */}
          <path d="M 6.36 -6.36 Q 3 -3 6.36 6.36" fill="none" stroke="#FFFFFF" strokeWidth="1.5"/>
          
          {/* Top curved panel */}
          <path d="M -6.36 -6.36 Q 0 -4 6.36 -6.36" fill="none" stroke="#FFFFFF" strokeWidth="1.5"/>
        </g>
      </svg>
      {showText && <span className="logo-text">Sports Task Manager</span>}
    </div>
  );
}

export default Logo;
