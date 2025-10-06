import { Coins } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

export const BlingCurrency = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border-2 border-yellow-500/50 rounded-full px-4 py-2 shadow-[0_0_30px_rgba(234,179,8,0.5)]">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-16 h-6" />
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border-2 border-yellow-500/50 rounded-full px-4 py-2 shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-105 transition-all duration-300 animate-glow-pulse">
      <div className="relative">
        <Coins className="w-6 h-6 text-yellow-400 animate-spin-slow" />
        <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-lg animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-yellow-200/70 font-medium leading-tight">BLING</span>
        <span className="text-lg font-bold text-yellow-300 leading-tight">
          {profile?.coins ?? 100}
        </span>
      </div>
    </div>
  );
};