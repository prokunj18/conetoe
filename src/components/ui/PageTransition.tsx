import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
  variant?: 'conetoe' | 'classic';
}

export const PageTransition = ({ children, variant = 'conetoe' }: PageTransitionProps) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    setIsVisible(false);
    setShowContent(false);
    
    // Quick fade out, then fade in with content
    const timer = setTimeout(() => {
      setShowContent(true);
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const gradientColors = variant === 'conetoe' 
    ? 'from-pink-500/10 via-transparent to-violet-500/10'
    : 'from-cyan-500/10 via-transparent to-violet-500/10';

  return (
    <div className="relative w-full h-full">
      {/* Transition overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none z-50 bg-gradient-to-br ${gradientColors} transition-opacity duration-300 ${
          isVisible ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Content with fade animation */}
      <div 
        className={`w-full h-full transition-all duration-500 ease-out ${
          isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-[0.98] translate-y-2'
        }`}
      >
        {showContent && children}
      </div>
    </div>
  );
};