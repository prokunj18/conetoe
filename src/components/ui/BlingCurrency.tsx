import { Coins, Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const BlingCurrency = () => {
  const { profile, loading } = useProfile();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const shouldShow = location.pathname === '/' || location.pathname === '/classic' || location.pathname === '/customize';

  if (!shouldShow) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-card/90 backdrop-blur-sm border border-amber-500/30 rounded-full px-2 py-0.5">
        <Skeleton className="w-2.5 h-2.5 rounded-full" />
        <Skeleton className="w-6 h-2.5" />
      </div>
    );
  }

  return (
    <button
      onClick={() => user ? navigate("/customization") : navigate("/auth")}
      className="fixed top-4 right-4 z-50 group"
    >
      <div className="relative">
        {/* Subtle glow on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-center gap-1 bg-gradient-to-r from-amber-900/80 to-yellow-900/80 backdrop-blur-sm border border-amber-500/50 rounded-full px-2 py-0.5 transition-all duration-200 group-hover:border-amber-400/70 group-hover:scale-105">
          {/* Coin icon with subtle pulse */}
          <div className="relative">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full p-0.5 shadow-sm">
              <Coins className="w-2.5 h-2.5 text-amber-950" />
            </div>
            <Sparkles className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 text-yellow-300 opacity-0 group-hover:opacity-100 animate-pulse" />
          </div>
          
          {/* Amount with gradient */}
          <span className="text-xs font-bold bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
            {profile?.coins ?? 100}
          </span>
        </div>
      </div>
    </button>
  );
};