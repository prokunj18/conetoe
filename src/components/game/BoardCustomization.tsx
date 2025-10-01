import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSettings, BoardTheme } from "@/contexts/SettingsContext";
import { Sparkles, Grid3X3, Layers, Box, Zap, Crown, Diamond, Flame, Snowflake, Mountain } from "lucide-react";

interface BoardCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BoardCustomization = ({ isOpen, onClose }: BoardCustomizationProps) => {
  const { boardTheme, setBoardTheme, animationsEnabled } = useSettings();

  const boardStyles = [
    { 
      id: 'neon' as BoardTheme, 
      name: 'Neon Cyber', 
      icon: Zap,
      description: 'Vibrant neon glow',
      gradient: 'bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700',
      preview: 'border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
    },
    { 
      id: 'wooden' as BoardTheme, 
      name: 'Classic Wood', 
      icon: Mountain,
      description: 'Traditional warmth',
      gradient: 'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900',
      preview: 'border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.3)]'
    },
    { 
      id: 'crystal' as BoardTheme, 
      name: 'Crystal Ice', 
      icon: Diamond,
      description: 'Frozen elegance',
      gradient: 'bg-gradient-to-br from-blue-100 via-cyan-200 to-blue-300',
      preview: 'border-cyan-300/60 shadow-[0_0_25px_rgba(103,232,249,0.5)]'
    },
    { 
      id: 'lava' as BoardTheme, 
      name: 'Lava Flow', 
      icon: Flame,
      description: 'Molten intensity',
      gradient: 'bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500',
      preview: 'border-orange-500/60 shadow-[0_0_30px_rgba(249,115,22,0.6)]'
    },
    { 
      id: 'space' as BoardTheme, 
      name: 'Deep Space', 
      icon: Sparkles,
      description: 'Cosmic darkness',
      gradient: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-black',
      preview: 'border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
    },
    { 
      id: 'matrix' as BoardTheme, 
      name: 'Matrix Grid', 
      icon: Grid3X3,
      description: 'Digital reality',
      gradient: 'bg-gradient-to-br from-green-950 via-emerald-900 to-black',
      preview: 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
    },
    { 
      id: 'royal' as BoardTheme, 
      name: 'Royal Gold', 
      icon: Crown,
      description: 'Regal luxury',
      gradient: 'bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-700',
      preview: 'border-yellow-500/60 shadow-[0_0_25px_rgba(234,179,8,0.5)]'
    },
    { 
      id: 'ocean' as BoardTheme, 
      name: 'Ocean Depths', 
      icon: Layers,
      description: 'Aquatic serenity',
      gradient: 'bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-600',
      preview: 'border-teal-400/60 shadow-[0_0_20px_rgba(20,184,166,0.5)]'
    },
    { 
      id: 'midnight' as BoardTheme, 
      name: 'Midnight Blue', 
      icon: Box,
      description: 'Dark elegance',
      gradient: 'bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900',
      preview: 'border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
    },
    { 
      id: 'sunset' as BoardTheme, 
      name: 'Sunset Sky', 
      icon: Snowflake,
      description: 'Warm horizons',
      gradient: 'bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-500',
      preview: 'border-orange-400/60 shadow-[0_0_25px_rgba(251,146,60,0.5)]'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-glass border border-card-border backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-secondary bg-clip-text text-transparent">
            Board Themes
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Choose your battlefield style
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
          {boardStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setBoardTheme(style.id)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${boardTheme === style.id 
                  ? 'border-primary bg-primary/10 scale-105 shadow-glow' 
                  : 'border-border hover:border-primary/50 hover:scale-105'
                }
                ${animationsEnabled ? 'hover:shadow-glow' : ''}
              `}
            >
              <div className="space-y-3">
                <div className={`w-full h-20 ${style.gradient} rounded-lg border-2 ${style.preview} transition-all`}>
                  <div className="flex items-center justify-center h-full">
                    <style.icon className="w-8 h-8 text-white/80" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-center">{style.name}</h3>
                  <p className="text-[10px] text-muted-foreground text-center leading-tight">
                    {style.description}
                  </p>
                </div>
              </div>
              {boardTheme === style.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="p-6 bg-card-glass rounded-xl border border-card-border space-y-4">
          <h3 className="font-semibold text-center">Preview</h3>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto p-4 bg-surface rounded-xl">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div 
                key={i}
                className={`
                  aspect-square rounded-lg border-2 
                  ${boardStyles.find(s => s.id === boardTheme)?.gradient || boardStyles[0].gradient}
                  ${boardStyles.find(s => s.id === boardTheme)?.preview || boardStyles[0].preview}
                `}
              />
            ))}
          </div>
        </div>

        <Button 
          onClick={onClose}
          className="w-full bg-gradient-secondary hover:shadow-neon transition-all duration-300"
        >
          Apply Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};
