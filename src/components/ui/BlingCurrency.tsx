import { Coins } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "react-router-dom";

export const BlingCurrency = () => {
  const { profile, loading } = useProfile();
  const location = useLocation();

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
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/30 rounded-full px-3 py-1.5 transition-all duration-200">
      <Coins className="w-4 h-4 text-primary" />
      <div className="flex items-baseline gap-1">
        <span className="text-xs font-medium text-muted-foreground">BLING</span>
        <span className="text-sm font-bold text-foreground">
          {profile?.coins ?? 100}
        </span>
      </div>
    </div>
  );
};
