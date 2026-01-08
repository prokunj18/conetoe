import { ReactNode, useRef, useLayoutEffect } from "react";

interface PageTransitionProps {
  children: ReactNode;
  variant?: 'conetoe' | 'classic';
}

export const PageTransition = ({ children, variant = 'conetoe' }: PageTransitionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    // Use GPU-accelerated animation with will-change
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    
    // Force reflow then animate
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 200ms ease-out, transform 200ms ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full will-change-transform"
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
};