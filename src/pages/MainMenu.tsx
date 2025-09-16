import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Settings, Trophy, Zap, Brain, Crown } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useSettings } from "@/contexts/SettingsContext";

const MainMenu = () => {
  const navigate = useNavigate();
  const { animationsEnabled } = useSettings();
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "normal" | "hard" | "master">("normal");

  const difficulties = [
    { 
      id: "easy" as const, 
      name: "Easy", 
      icon: Zap, 
      description: "Learns as it plays",
      color: "bg-gradient-player-1" 
    },
    { 
      id: "normal" as const, 
      name: "Normal", 
      icon: Brain, 
      description: "Strategic thinking",
      color: "bg-gradient-secondary" 
    },
    { 
      id: "hard" as const, 
      name: "Hard", 
      icon: Crown, 
      description: "Unbeatable tactics",
      color: "bg-gradient-player-2" 
    },
    { 
      id: "master" as const, 
      name: "Master", 
      icon: Crown, 
      description: "Perfect calculation",
      color: "bg-gradient-primary" 
    },
  ];

  const startGame = () => {
    navigate("/game", { state: { difficulty: selectedDifficulty, mode: "ai" } });
  };

  const startTwoPlayer = () => {
    navigate("/game", { state: { mode: "local" } });
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-4xl w-full space-y-8 relative z-10">
        
        {/* Back to Home Button */}
        <div className="absolute left-4 top-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-foreground hover:text-primary"
          >
            ← Back to Home
          </Button>
        </div>
        {/* Header */}
        <div className={`text-center space-y-6 ${animationsEnabled ? 'animate-fade-in' : ''}`}>
          <div className="relative">
            <h1 className={`text-7xl font-bold bg-gradient-neon bg-clip-text text-transparent ${animationsEnabled ? 'animate-glow-pulse' : ''}`}>
              Conetoe
            </h1>
            <div className={`absolute -inset-4 bg-gradient-primary opacity-20 blur-xl rounded-full ${animationsEnabled ? 'animate-float' : ''}`} />
          </div>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Strategic Tic Tac Toe evolved. Master stackable triangle mechanics, tactical timing, and intelligent returns.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="px-4 py-2 bg-gradient-glass border border-primary/30 backdrop-blur-sm">
              🎯 3-in-a-row victory
            </Badge>
            <Badge className="px-4 py-2 bg-gradient-glass border border-secondary/30 backdrop-blur-sm">
              🔄 Size-based replacement
            </Badge>
            <Badge className="px-4 py-2 bg-gradient-glass border border-accent/30 backdrop-blur-sm">
              ⏰ 4-move returns
            </Badge>
          </div>
        </div>

        {/* Main Menu Cards */}
        <div className={`grid md:grid-cols-2 gap-6 ${animationsEnabled ? 'animate-scale-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.2s' } : {}}>
          {/* AI Game */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl hover:shadow-neon hover:scale-105 transition-all duration-500 group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-primary rounded-xl shadow-neon group-hover:animate-neon-pulse">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Play vs AI</h3>
                  <p className="text-sm text-muted-foreground">Challenge intelligent opponents</p>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Select Difficulty:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedDifficulty === diff.id
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${diff.color}`}>
                          <diff.icon className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium">{diff.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {diff.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={startGame} 
                className="w-full bg-gradient-primary hover:shadow-neon hover:scale-105 transition-all duration-300 border-0"
              >
                <Play className="w-4 h-4 mr-2" />
                Launch AI Battle
              </Button>
            </div>
          </Card>

          {/* Local Multiplayer */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl hover:shadow-neon hover:scale-105 transition-all duration-500 group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-secondary rounded-xl shadow-neon group-hover:animate-neon-pulse">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Two Players</h3>
                  <p className="text-sm text-muted-foreground">Local tactical warfare</p>
                </div>
              </div>

              <div className="space-y-3 py-4">
                <div className="flex items-center justify-between p-3 bg-surface-glass rounded-xl border border-border/30">
                  <span className="text-sm font-medium">Player 1</span>
                  <div className="w-5 h-5 bg-gradient-player-1 rounded-full shadow-neon animate-glow-pulse"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-glass rounded-xl border border-border/30">
                  <span className="text-sm font-medium">Player 2</span>
                  <div className="w-5 h-5 bg-gradient-player-2 rounded-full shadow-neon animate-glow-pulse"></div>
                </div>
              </div>

              <Button 
                onClick={startTwoPlayer} 
                className="w-full bg-gradient-secondary hover:shadow-neon hover:scale-105 transition-all duration-300 border-0"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Begin Duel
              </Button>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className={`flex flex-wrap justify-center gap-4 ${animationsEnabled ? 'animate-fade-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.4s' } : {}}>
          <Button 
            variant="outline" 
            onClick={() => navigate("/rules")}
            className="flex items-center gap-2 border-border/50 bg-gradient-glass backdrop-blur-sm hover:border-primary/50 hover:shadow-glow transition-all duration-300"
          >
            <BookOpen className="w-4 h-4" />
            How to Play
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 border-border/50 bg-gradient-glass backdrop-blur-sm hover:border-secondary/50 hover:shadow-glow transition-all duration-300"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;