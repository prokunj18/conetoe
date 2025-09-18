import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Palette, Sparkles, Gem, Flame, Zap } from "lucide-react";
import { useSettings, ConeStyle } from "@/contexts/SettingsContext";

interface ConeCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConeCustomization = ({ isOpen, onClose }: ConeCustomizationProps) => {
  const { coneStyle, setConeStyle, animationsEnabled } = useSettings();

  const coneStyles = [
    {
      id: "classic",
      name: "Classic",
      icon: Zap,
      description: "Traditional neon triangles",
      gradient: "bg-gradient-to-br from-cyan-400 to-blue-600",
      preview: "linear-gradient(135deg, #22d3ee, #2563eb)"
    },
    {
      id: "fire",
      name: "Fire",
      icon: Flame,
      description: "Blazing hot flames",
      gradient: "bg-gradient-to-br from-red-500 to-orange-600",
      preview: "linear-gradient(135deg, #ef4444, #ea580c)"
    },
    {
      id: "emerald",
      name: "Emerald",
      icon: Gem,
      description: "Precious gemstone",
      gradient: "bg-gradient-to-br from-emerald-400 to-green-600",
      preview: "linear-gradient(135deg, #34d399, #16a34a)"
    },
    {
      id: "galaxy",
      name: "Galaxy",
      icon: Sparkles,
      description: "Cosmic nebula",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-600",
      preview: "linear-gradient(135deg, #a855f7, #db2777)"
    },
    {
      id: "golden",
      name: "Golden",
      icon: Gem,
      description: "Luxury gold finish",
      gradient: "bg-gradient-to-br from-yellow-400 to-orange-500",
      preview: "linear-gradient(135deg, #facc15, #f97316)"
    },
    {
      id: "arctic",
      name: "Arctic",
      icon: Sparkles,
      description: "Frozen ice crystal",
      gradient: "bg-gradient-to-br from-blue-200 to-cyan-400",
      preview: "linear-gradient(135deg, #bfdbfe, #22d3ee)"
    },
    {
      id: "shadow",
      name: "Shadow",
      icon: Zap,
      description: "Dark matter energy",
      gradient: "bg-gradient-to-br from-gray-600 to-black",
      preview: "linear-gradient(135deg, #4b5563, #000000)"
    },
    {
      id: "rainbow",
      name: "Rainbow",
      icon: Palette,
      description: "Prismatic spectrum",
      gradient: "bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500",
      preview: "linear-gradient(135deg, #ef4444, #eab308, #22c55e, #3b82f6)"
    },
    {
      id: "chrome",
      name: "Chrome",
      icon: Gem,
      description: "Metallic reflective",
      gradient: "bg-gradient-to-br from-gray-300 to-gray-500",
      preview: "linear-gradient(135deg, #d1d5db, #6b7280)"
    },
    {
      id: "plasma",
      name: "Plasma",
      icon: Flame,
      description: "Electric energy",
      gradient: "bg-gradient-to-br from-pink-400 to-purple-600",
      preview: "linear-gradient(135deg, #f472b6, #9333ea)"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-glass border border-card-border backdrop-blur-xl ${animationsEnabled ? 'animate-scale-in' : ''}`}>
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-neon">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Cone Customization</h2>
                <p className="text-sm text-muted-foreground">Choose your cone style and colors</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Select Cone Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {coneStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setConeStyle(style.id as ConeStyle)}
                      className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                        coneStyle === style.id
                          ? "border-primary bg-primary/15 shadow-glow"
                          : "border-border/50 hover:border-primary/60 hover:shadow-neon"
                      }`}
                    >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="relative">
                        {/* Cone Preview */}
                        <div 
                          className="w-12 h-12 relative shadow-glow"
                          style={{
                            background: style.preview,
                            clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
                          }}
                        >
                          <div 
                            className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20"
                            style={{ clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)' }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs translate-y-1">
                            1
                          </span>
                        </div>
                        <style.icon className="w-3 h-3 text-primary absolute -top-1 -right-1 bg-background rounded-full p-0.5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{style.name}</div>
                        <div className="text-xs text-muted-foreground">{style.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Preview</h3>
              <div className="flex items-center justify-center p-8 bg-gradient-board rounded-xl border border-border/30">
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((size) => (
                    <div key={size} className="flex flex-col items-center gap-2">
                      <Badge variant="outline" className="text-xs">Size {size}</Badge>
                      <div 
                        className={`relative shadow-glow transition-all hover:scale-110 ${
                          size === 1 ? 'w-6 h-6' : 
                          size === 2 ? 'w-8 h-8' : 
                          size === 3 ? 'w-10 h-10' : 'w-12 h-12'
                        }`}
                        style={{
                          background: coneStyles.find(s => s.id === coneStyle)?.preview || coneStyles[0].preview,
                          clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
                        }}
                      >
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20"
                          style={{ clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)' }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs translate-y-1">
                          {size}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border/50">
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-primary hover:shadow-neon hover:scale-105 transition-all duration-300"
          >
            Apply Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};