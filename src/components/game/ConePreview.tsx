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
        ? "linear-gradient(135deg, #22d3ee, #2563eb)" 
        : "linear-gradient(135deg, #ec4899, #a855f7)",
      fire: player === 1 
        ? "linear-gradient(135deg, #ef4444, #ea580c)" 
        : "linear-gradient(135deg, #fbbf24, #f59e0b)",
      emerald: player === 1 
        ? "linear-gradient(135deg, #10b981, #047857)" 
        : "linear-gradient(135deg, #06b6d4, #0891b2)",
      galaxy: player === 1 
        ? "linear-gradient(135deg, #a855f7, #7c3aed)" 
        : "linear-gradient(135deg, #ec4899, #db2777)",
      golden: player === 1 
        ? "linear-gradient(135deg, #fbbf24, #d97706)" 
        : "linear-gradient(135deg, #f59e0b, #b45309)",
      arctic: player === 1 
        ? "linear-gradient(135deg, #93c5fd, #3b82f6)" 
        : "linear-gradient(135deg, #e0f2fe, #7dd3fc)",
      shadow: player === 1 
        ? "linear-gradient(135deg, #374151, #111827)" 
        : "linear-gradient(135deg, #6b7280, #4b5563)",
      rainbow: player === 1 
        ? "linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6)" 
        : "linear-gradient(135deg, #ec4899, #a855f7, #3b82f6, #06b6d4)",
      chrome: player === 1 
        ? "linear-gradient(135deg, #e5e7eb, #9ca3af)" 
        : "linear-gradient(135deg, #d1d5db, #6b7280)",
      plasma: player === 1 
        ? "linear-gradient(135deg, #ec4899, #a855f7)" 
        : "linear-gradient(135deg, #8b5cf6, #6366f1)"
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