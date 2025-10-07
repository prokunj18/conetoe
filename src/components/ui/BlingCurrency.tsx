import { useState } from "react";
import { Coins } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const BlingCurrency = () => {
  const { profile, loading, updateProfile } = useProfile();
  const [cheatCode, setCheatCode] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleCheatCode = async () => {
    if (cheatCode.toLowerCase() === "kunj" || cheatCode.toLowerCase() === "devansh") {
      await updateProfile({ coins: 999999 });
      toast.success("Cheat code activated! 999,999 Bling added!");
      setCheatCode("");
      setIsPopoverOpen(false);
    } else {
      toast.error("Invalid cheat code");
    }
  };

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-1.5">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="w-12 h-4" />
      </div>
    );
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-primary/30 rounded-full px-3 py-1.5 hover:border-primary/50 transition-all duration-200 cursor-pointer">
          <Coins className="w-4 h-4 text-primary" />
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-medium text-muted-foreground">BLING</span>
            <span className="text-sm font-bold text-foreground">
              {profile?.coins ?? 100}
            </span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Cheat Code</h4>
          <Input
            placeholder="Enter code..."
            value={cheatCode}
            onChange={(e) => setCheatCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCheatCode()}
          />
          <Button onClick={handleCheatCode} className="w-full" size="sm">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};