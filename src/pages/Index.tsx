import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Settings, BarChart3, X } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useSettings } from "@/contexts/SettingsContext";

const Index = () => {
  const navigate = useNavigate();
  const { animationsEnabled } = useSettings();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Menu items arranged in circular pattern
  const menuItems = [
    { id: "play", label: "PLAY", icon: Play, action: () => navigate("/game", { state: { mode: "ai", difficulty: "normal" } }), highlight: true },
    { id: "settings", label: "SETTINGS", icon: Settings, action: () => navigate("/settings") },
    { id: "stats", label: "STATS", icon: BarChart3, action: () => navigate("/stats") },
    { id: "quit", label: "QUIT", icon: X, action: () => window.close() }
  ];

  // Auto-rotate selection for visual effect
  useEffect(() => {
    if (!animationsEnabled) return;
    
    const interval = setInterval(() => {
      setSelectedOption(prev => {
        const currentIndex = menuItems.findIndex(item => item.id === prev);
        const nextIndex = (currentIndex + 1) % menuItems.length;
        return menuItems[nextIndex].id;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [animationsEnabled]);

  const handleMenuClick = (item: typeof menuItems[0]) => {
    setSelectedOption(item.id);
    setTimeout(() => item.action(), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Stars and particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl w-full flex flex-col items-center justify-center space-y-16 relative z-10">
        {/* Title */}
        <div className={`text-center space-y-6 ${animationsEnabled ? 'animate-fade-in' : ''}`}>
          <div className="relative">
            <h1 className="text-7xl md:text-8xl font-bold bg-gradient-neon bg-clip-text text-transparent tracking-wider">
              CONE TACTICS
            </h1>
            <div className="absolute -inset-4 bg-gradient-circular opacity-20 blur-3xl rounded-full animate-spin-slow" />
          </div>
          <div className="text-sm text-foreground/60 tracking-[0.2em] uppercase">
            v1.2.4
          </div>
        </div>

        {/* Circular Menu */}
        <div className="relative w-96 h-96 flex items-center justify-center">
          {/* Central Circle */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 bg-gradient-glass backdrop-blur-xl">
            <div className="absolute inset-4 rounded-full border border-secondary/20" />
            <div className="absolute inset-8 rounded-full border border-accent/10" />
          </div>

          {/* Rotating glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-circular opacity-30 animate-spin-slow blur-sm" />

          {/* Menu Items */}
          {menuItems.map((item, index) => {
            const angle = (index * 90) - 90; // Start from top, 90° apart
            const radius = 120;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            const isSelected = selectedOption === item.id;
            const isHighlighted = item.highlight;

            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleMenuClick(item)}
                className={`
                  absolute w-24 h-24 rounded-full border-2 transition-all duration-500
                  ${isHighlighted 
                    ? 'border-primary bg-primary/20 shadow-neon text-primary' 
                    : isSelected
                      ? 'border-secondary bg-secondary/20 shadow-glow text-secondary'
                      : 'border-muted-foreground/30 bg-surface/20 hover:border-primary/50 hover:bg-primary/10'
                  }
                  ${animationsEnabled && isSelected ? 'scale-110 animate-neon-pulse' : ''}
                  backdrop-blur-sm
                `}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-bold tracking-wider">{item.label}</span>
                </div>
              </Button>
            );
          })}

          {/* Center Icon */}
          <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-neon">
            <div className="w-8 h-8 bg-gradient-to-t from-primary/50 to-transparent rounded-full animate-glow-pulse" />
          </div>
        </div>

        {/* Instructions */}
        <div className={`text-center space-y-2 ${animationsEnabled ? 'animate-fade-in' : ''}`} style={animationsEnabled ? { animationDelay: '1s' } : {}}>
          <p className="text-foreground/60 text-sm">Select an option to continue</p>
          <p className="text-xs text-muted-foreground">Strategic Tic Tac Toe • Stackable Mechanics • Tactical Warfare</p>
        </div>
      </div>
    </div>
  );
};

export default Index;