import React from 'react';
import { useSettings } from "@/contexts/SettingsContext";

interface ConePreviewProps {
  player: number;
  size: number;
  className?: string;
}

export const ConePreview = ({ player, size, className = "" }: ConePreviewProps) => {
  const { coneStyle, boardTheme } = useSettings();

  const getConeStyleGradient = (player: number) => {
    const styleMap = {
      classic: player === 1 
        ? "linear-gradient(135deg, #06b6d4, #0284c7, #0369a1)" 
        : "linear-gradient(135deg, #f97316, #ea580c, #c2410c)",
      fire: player === 1 
        ? "linear-gradient(135deg, #dc2626, #b91c1c, #991b1b)" 
        : "linear-gradient(135deg, #facc15, #eab308, #ca8a04)",
      emerald: player === 1 
        ? "linear-gradient(135deg, #059669, #047857, #065f46)" 
        : "linear-gradient(135deg, #14b8a6, #0d9488, #0f766e)",
      galaxy: player === 1 
        ? "linear-gradient(135deg, #9333ea, #7e22ce, #6b21a8)" 
        : "linear-gradient(135deg, #f43f5e, #e11d48, #be123c)",
      golden: player === 1 
        ? "linear-gradient(135deg, #f59e0b, #d97706, #b45309)" 
        : "linear-gradient(135deg, #fb923c, #f97316, #ea580c)",
      arctic: player === 1 
        ? "linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8)" 
        : "linear-gradient(135deg, #38bdf8, #0ea5e9, #0284c7)",
      shadow: player === 1 
        ? "linear-gradient(135deg, #18181b, #09090b, #000000)" 
        : "linear-gradient(135deg, #52525b, #3f3f46, #27272a)",
      rainbow: player === 1 
        ? "linear-gradient(135deg, #dc2626, #f59e0b, #10b981, #3b82f6)" 
        : "linear-gradient(135deg, #f472b6, #c084fc, #60a5fa, #22d3ee)",
      chrome: player === 1 
        ? "linear-gradient(135deg, #d1d5db, #9ca3af, #6b7280)" 
        : "linear-gradient(135deg, #f9fafb, #e5e7eb, #d1d5db)",
      plasma: player === 1 
        ? "linear-gradient(135deg, #db2777, #be185d, #9f1239)" 
        : "linear-gradient(135deg, #7c3aed, #6d28d9, #5b21b6)"
    };
    return styleMap[coneStyle] || styleMap.classic;
  };

  const getConeSize = (size: number) => {
    switch (size) {
      case 1: return "w-4 h-4";
      case 2: return "w-5 h-5";
      case 3: return "w-6 h-6";
      case 4: return "w-7 h-7";
      default: return "w-4 h-4";
    }
  };

  return (
    <div 
      className={`${getConeSize(size)} relative ${className}`}
      style={{
        background: getConeStyleGradient(player),
        clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
      }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20"
        style={{ clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)' }}
      />
    </div>
  );
};