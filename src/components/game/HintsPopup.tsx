import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";

export const HintsPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-glass border border-accent/30 backdrop-blur-sm hover:border-accent/50 hover:shadow-glow transition-all duration-300 rounded-full w-12 h-12 p-0"
      >
        <Info className="w-5 h-5" />
      </Button>

      {/* Hints Popup */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-gradient-glass border border-card-border backdrop-blur-xl rounded-xl p-4 shadow-2xl animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Game Hints
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 p-0 hover:bg-surface-elevated"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="p-3 bg-surface rounded-lg">
              <div className="font-semibold text-primary mb-1">🎯 Basic Rules</div>
              <p className="text-muted-foreground">Place your cones on the board to get three in a row (horizontal, vertical, or diagonal).</p>
            </div>

            <div className="p-3 bg-surface rounded-lg">
              <div className="font-semibold text-primary mb-1">📏 Size Matters</div>
              <p className="text-muted-foreground">Larger cones can replace smaller ones. Use this strategically!</p>
            </div>

            <div className="p-3 bg-surface rounded-lg">
              <div className="font-semibold text-primary mb-1">🔄 Return Rule</div>
              <p className="text-muted-foreground">Replaced cones return to your inventory after 4 moves.</p>
            </div>

            <div className="p-3 bg-surface rounded-lg">
              <div className="font-semibold text-primary mb-1">💡 Strategy Tip</div>
              <p className="text-muted-foreground">Save your largest cones for critical moments to override opponent's positions!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
