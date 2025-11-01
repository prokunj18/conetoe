import { Coins } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

export const BlingCurrency = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="w-12 h-4" />
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/30 rounded-full px-3 py-1.5">
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