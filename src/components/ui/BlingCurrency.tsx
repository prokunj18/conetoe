import { Coins, Zap, Sparkles, ChevronRight } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const BlingCurrency = () => {
  const { profile, loading } = useProfile();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Only show on home pages and customization page
  const shouldShow = location.pathname === '/' || location.pathname === '/classic' || location.pathname === '/customize';

  if (!shouldShow) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="w-12 h-4" />
      </div>
    );
  }

  return (
    <button
      onClick={() => user ? navigate("/customization") : navigate("/auth")}
      className="fixed top-4 right-4 z-50 group"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-yellow-400/30 to-orange-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Main container */}
        <div className="relative flex items-center gap-2 bg-gradient-to-r from-amber-950/80 via-yellow-950/80 to-orange-950/80 backdrop-blur-md border border-amber-500/40 rounded-full px-4 py-2 transition-all duration-300 group-hover:border-amber-400/70 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]">
          {/* Animated coin icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400/40 rounded-full blur-sm animate-pulse" />
            <div className="relative bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full p-1.5 shadow-lg">
              <Coins className="w-4 h-4 text-amber-950" />
            </div>
            {/* Sparkle effects */}
            <Sparkles className="absolute -top-1 -right-1 w-2.5 h-2.5 text-yellow-300 animate-pulse" />
          </div>
          
          {/* Content */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-bold tracking-wider text-amber-300/80 uppercase">
              Bling
            </span>
            <span className="text-lg font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
              {profile?.coins ?? 100}
            </span>
          </div>
          
          {/* Hover arrow */}
          <ChevronRight className="w-4 h-4 text-amber-400/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
          
          {/* Energy bolt indicator */}
          <Zap className="w-3 h-3 text-yellow-400/80 animate-pulse" />
        </div>
        
        {/* Floating particles on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full animate-ping"
              style={{
                left: `${20 + i * 20}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      </div>
    </button>
  );
};
