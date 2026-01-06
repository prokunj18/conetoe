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
  const isClassicMode = location.pathname === '/classic';

  if (!shouldShow) {
    return null;
  }

  // Mode-specific colors
  const colors = isClassicMode ? {
    glow: "from-cyan-500/20 to-violet-500/20",
    bg: "from-slate-800/80 to-slate-900/80",
    border: "border-cyan-500/50",
    hoverBorder: "group-hover:border-cyan-400/70",
    icon: "from-cyan-400 to-violet-500",
    iconText: "text-slate-950",
    text: "from-cyan-200 to-violet-300",
    sparkle: "text-cyan-300"
  } : {
    glow: "from-amber-500/20 to-yellow-500/20",
    bg: "from-amber-900/80 to-yellow-900/80",
    border: "border-amber-500/50",
    hoverBorder: "group-hover:border-amber-400/70",
    icon: "from-amber-400 to-yellow-500",
    iconText: "text-amber-950",
    text: "from-amber-200 to-yellow-300",
    sparkle: "text-yellow-300"
  };

  if (loading) {
    return (
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border ${colors.border} rounded-full px-2.5 py-1`}>
        <Skeleton className="w-3 h-3 rounded-full" />
        <Skeleton className="w-8 h-3" />
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
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.glow} rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity`} />
        
        <div className={`relative flex items-center gap-1.5 bg-gradient-to-r ${colors.bg} backdrop-blur-sm border ${colors.border} rounded-full px-2.5 py-1 transition-all duration-200 ${colors.hoverBorder} group-hover:scale-105`}>
          {/* Coin icon with subtle pulse */}
          <div className="relative">
            <div className={`bg-gradient-to-br ${colors.icon} rounded-full p-0.5 shadow-sm`}>
              <Coins className={`w-3 h-3 ${colors.iconText}`} />
            </div>
            <Sparkles className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 ${colors.sparkle} opacity-0 group-hover:opacity-100 animate-pulse`} />
          </div>
          
          {/* Amount with gradient */}
          <span className={`text-sm font-bold bg-gradient-to-r ${colors.text} bg-clip-text text-transparent`}>
            {profile?.coins ?? 100}
          </span>
        </div>
      </div>
    </button>
  );
};