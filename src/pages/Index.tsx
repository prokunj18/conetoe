import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Settings, X, Brain, Users, Zap, Crown, BookOpen } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useSettings } from "@/contexts/SettingsContext";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const { animationsEnabled } = useSettings();
  const [showPlayDialog, setShowPlayDialog] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "normal" | "hard" | "master">("normal");

  const difficulties = [
    { 
      id: "easy" as const, 
      name: "Easy", 
      icon: Zap, 
      description: "Perfect for beginners",
      color: "bg-gradient-player-1" 
    },
    { 
      id: "normal" as const, 
      name: "Normal", 
      icon: Brain, 
      description: "Balanced challenge",
      color: "bg-gradient-secondary" 
    },
    { 
      id: "hard" as const, 
      name: "Hard", 
      icon: Crown, 
      description: "Unbeatable AI",
      color: "bg-gradient-player-2" 
    },
    { 
      id: "master" as const, 
      name: "Master", 
      icon: Crown, 
      description: "Perfect strategy",
      color: "bg-gradient-primary" 
    },
  ];

  const startAIGame = () => {
    setShowPlayDialog(false);
    navigate("/game", { state: { difficulty: selectedDifficulty, mode: "ai" } });
  };

  const startDuelGame = () => {
    setShowPlayDialog(false);
    navigate("/game", { state: { mode: "local" } });
  };

  // Stars and particles background
  const renderStars = () => {
    return Array.from({ length: 100 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          opacity: Math.random() * 0.8 + 0.2
        }}
      />
    ));
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <AnimatedBackground />
        
        {/* Stars Background */}
        <div className="absolute inset-0 overflow-hidden">
          {renderStars()}
        </div>

        <div className="max-w-md w-full flex flex-col items-center space-y-8 relative z-10">
          {/* Title Section */}
          <div className={`text-center space-y-4 ${animationsEnabled ? 'animate-fade-in' : ''}`}>
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-neon bg-clip-text text-transparent tracking-wider">
                CONETOE
              </h1>
              <div className="absolute -inset-4 bg-gradient-circular opacity-20 blur-2xl rounded-full animate-spin-slow" />
            </div>
            <div className="text-lg text-foreground/60 tracking-[0.3em] uppercase font-light">
              TACTICAL WARFARE
            </div>
          </div>

          {/* Menu Buttons */}
          <div className={`w-full space-y-4 ${animationsEnabled ? 'animate-scale-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.3s' } : {}}>
            <Button
              onClick={() => setShowPlayDialog(true)}
              className="w-full h-16 text-xl font-semibold bg-gradient-primary hover:shadow-neon hover:scale-105 transition-all duration-300 rounded-full border-0"
            >
              <Play className="w-6 h-6 mr-3" />
              Play
            </Button>

            <Button
              onClick={() => navigate("/settings")}
              className="w-full h-16 text-xl font-semibold bg-gradient-secondary hover:shadow-neon hover:scale-105 transition-all duration-300 rounded-full border-0"
            >
              <Settings className="w-6 h-6 mr-3" />
              Settings
            </Button>

            <Button
              onClick={() => navigate("/rules")}
              className="w-full h-16 text-xl font-semibold bg-gradient-glass hover:shadow-glow hover:scale-105 transition-all duration-300 rounded-full border border-border/30"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              How to Play
            </Button>

            <Button
              onClick={() => window.close()}
              className="w-full h-16 text-xl font-semibold bg-gradient-glass hover:shadow-glow hover:scale-105 transition-all duration-300 rounded-full border border-destructive/30 hover:border-destructive/50"
            >
              <X className="w-6 h-6 mr-3" />
              Quit
            </Button>
          </div>

          {/* Version */}
          <div className={`text-xs text-foreground/40 ${animationsEnabled ? 'animate-fade-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.6s' } : {}}>
            v1.2.4
          </div>
        </div>
      </div>

      {/* Play Mode Selection Dialog */}
      <Dialog open={showPlayDialog} onOpenChange={setShowPlayDialog}>
        <DialogContent className="sm:max-w-md bg-gradient-glass border border-card-border backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-neon bg-clip-text text-transparent">
              Select Game Mode
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 p-4">
            {/* VS AI Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">VS AI</h3>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Choose difficulty:</p>
                <div className="grid grid-cols-2 gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedDifficulty === diff.id
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${diff.color}`}>
                          <diff.icon className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{diff.name}</div>
                          <div className="text-xs text-muted-foreground">{diff.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={startAIGame}
                className="w-full bg-gradient-primary hover:shadow-neon transition-all duration-300"
              >
                <Brain className="w-4 h-4 mr-2" />
                Battle AI
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            {/* Local Duel Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-secondary rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Local Duel</h3>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Face-off against a friend on the same device
              </p>

              <div className="flex gap-2 justify-center">
                <Badge className="bg-gradient-player-1">Player 1</Badge>
                <span className="text-muted-foreground">vs</span>
                <Badge className="bg-gradient-player-2">Player 2</Badge>
              </div>

              <Button 
                onClick={startDuelGame}
                className="w-full bg-gradient-secondary hover:shadow-neon transition-all duration-300"
              >
                <Users className="w-4 h-4 mr-2" />
                Start Duel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Index;