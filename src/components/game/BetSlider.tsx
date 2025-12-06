import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";

interface BetSliderProps {
  maxBet: number;
  currentBet: number;
  onBetChange: (value: number) => void;
  disabled?: boolean;
}

export const BetSlider = ({ maxBet, currentBet, onBetChange, disabled }: BetSliderProps) => {
  const effectiveMax = Math.min(maxBet, 1000);
  const minBet = 10;

  // Ensure current bet is within valid range
  useEffect(() => {
    if (currentBet > effectiveMax) {
      onBetChange(effectiveMax);
    }
    if (currentBet < minBet && effectiveMax >= minBet) {
      onBetChange(minBet);
    }
  }, [effectiveMax, currentBet, onBetChange]);

  const handleChange = (values: number[]) => {
    const newValue = Math.max(minBet, Math.min(values[0], effectiveMax));
    onBetChange(newValue);
  };

  const potentialWin = currentBet * 2;

  return (
    <div className="space-y-4 p-4 bg-surface-glass rounded-xl border border-border/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <span className="font-medium text-foreground">Bet Amount</span>
        </div>
        <Badge className="bg-gradient-primary text-white border-0 px-3 py-1">
          {currentBet} Bling
        </Badge>
      </div>

      <Slider
        value={[currentBet]}
        onValueChange={handleChange}
        min={minBet}
        max={effectiveMax}
        step={10}
        disabled={disabled || effectiveMax < minBet}
        className="w-full"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Min: {minBet}</span>
        <span className="text-center text-amber-400 font-medium">
          Win: +{potentialWin} Bling
        </span>
        <span>Max: {effectiveMax}</span>
      </div>

      {effectiveMax < minBet && (
        <p className="text-xs text-destructive text-center">
          Insufficient balance for betting
        </p>
      )}
    </div>
  );
};
