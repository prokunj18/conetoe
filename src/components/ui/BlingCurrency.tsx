import { Coins } from "lucide-react";
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
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-amber-500/30 rounded-full px-2.5 py-1">
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
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-900/70 to-yellow-900/70 backdrop-blur-sm border border-amber-500/40 rounded-full px-2.5 py-1 transition-all duration-200 group-hover:border-amber-400/60 group-hover:scale-105">
        {/* Coin icon */}
        <div className="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full p-0.5">
          <Coins className="w-3 h-3 text-amber-950" />
        </div>
        
        {/* Amount */}
        <span className="text-sm font-bold bg-gradient-to-r from-amber-200 to-yellow-300 bg-clip-text text-transparent">
          {profile?.coins ?? 100}
        </span>
      </div>
    </button>
  );
};