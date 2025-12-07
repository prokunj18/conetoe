import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, BookOpen, Settings, Trophy, Zap, Brain, Crown, Coins, Sparkles } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useSettings } from "@/contexts/SettingsContext";
import { useProfile, canAffordBet } from "@/hooks/useProfile";
import { toast } from "sonner";

const MainMenu = () => {
  const navigate = useNavigate();
  const { animationsEnabled } = useSettings();
  const { profile } = useProfile();
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "normal" | "hard" | "master">("normal");
  const [betAmount, setBetAmount] = useState(0);
  
  const maxBet = Math.min(profile?.coins || 0, 1000);

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
    // Check if user can afford bet
    if (betAmount > 0 && profile && !canAffordBet(profile, betAmount)) {
      toast.error("Insufficient Bling balance for this bet!");
      return;
    }
    navigate("/game", { state: { difficulty: selectedDifficulty, mode: "ai", betAmount } });
  };

  const startTwoPlayer = () => {
    navigate("/game", { state: { mode: "local", betAmount: 0 } });
  };
  
  const handleBetChange = (values: number[]) => {
    setBetAmount(values[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-4xl w-full space-y-8 relative z-10">
        
        {/* Back to Home Button */}
        <div className="fixed left-4 top-4 z-20">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:scale-105 transition-all duration-300 animate-fade-in"
          >
            ← Back to Home
          </Button>
        </div>
        
        {/* Bling Display */}
        {profile && (
          <div className="fixed right-4 top-4 z-20 animate-slide-down">
            <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-400 px-4 py-2 text-lg flex items-center gap-2 hover:scale-105 transition-transform">
              <Coins className="w-5 h-5 animate-bounce-slow" />
              {profile.coins} Bling
            </Badge>
          </div>
        )}
        
        {/* Header */}
        <div className={`text-center space-y-6 ${animationsEnabled ? 'animate-fade-in' : ''}`}>
          <div className="relative">
            <h1 className={`text-7xl font-bold bg-gradient-neon bg-clip-text text-transparent ${animationsEnabled ? 'animate-glow-pulse' : ''}`}>
              Conetoe
            </h1>
            <div className={`absolute -inset-4 bg-gradient-primary opacity-20 blur-xl rounded-full ${animationsEnabled ? 'animate-float' : ''}`} />
          </div>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Strategic Tic Tac Toe evolved. Master stackable triangle mechanics, tactical timing, and intelligent returns.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="px-4 py-2 bg-gradient-glass border border-primary/30 backdrop-blur-sm hover:scale-110 transition-transform cursor-default animate-fade-in" style={{ animationDelay: '0.2s' }}>
              🎯 3-in-a-row victory
            </Badge>
            <Badge className="px-4 py-2 bg-gradient-glass border border-secondary/30 backdrop-blur-sm hover:scale-110 transition-transform cursor-default animate-fade-in" style={{ animationDelay: '0.3s' }}>
              🔄 Size-based replacement
            </Badge>
            <Badge className="px-4 py-2 bg-gradient-glass border border-accent/30 backdrop-blur-sm hover:scale-110 transition-transform cursor-default animate-fade-in" style={{ animationDelay: '0.4s' }}>
              ⏰ 4-move returns
            </Badge>
          </div>
        </div>

        {/* Main Menu Cards */}
        <div className={`grid md:grid-cols-2 gap-6 ${animationsEnabled ? 'animate-scale-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.2s' } : {}}>
          {/* AI Game */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl hover:shadow-neon hover:scale-[1.02] transition-all duration-500 group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-primary rounded-xl shadow-neon group-hover:animate-neon-pulse group-hover:scale-110 transition-transform">
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
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((diff, index) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`flex-1 min-w-0 p-3 rounded-xl border transition-all hover:scale-[1.02] animate-fade-in ${
                        selectedDifficulty === diff.id
                          ? "border-primary bg-primary/15 shadow-glow"
                          : "border-border/50 hover:border-primary/60 hover:shadow-neon"
                      }`}
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className={`p-2 rounded-lg ${diff.color} shadow-neon transition-transform hover:scale-110`}>
                          <diff.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{diff.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate leading-tight">
                            {diff.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bet Slider for AI Mode */}
              {profile && (
                <div className="space-y-3 p-4 bg-surface-glass rounded-xl border border-border/30 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-foreground">Bet Amount (Optional)</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30">
                      {betAmount} Bling
                    </Badge>
                  </div>
                  <Slider
                    value={[betAmount]}
                    onValueChange={handleBetChange}
                    min={0}
                    max={maxBet}
                    step={10}
                    className="w-full"
                    disabled={maxBet < 10}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Free</span>
                    {betAmount > 0 && (
                      <span className="text-amber-400 font-medium animate-pulse-soft">
                        Win: +{betAmount * 2} Bling
                      </span>
                    )}
                    <span>Max: {maxBet}</span>
                  </div>
                </div>
              )}

              <Button 
                onClick={startGame} 
                className="w-full bg-gradient-primary hover:shadow-neon hover:scale-105 transition-all duration-300 border-0 group"
              >
                <Play className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                Launch AI Battle {betAmount > 0 && `(${betAmount} Bling)`}
              </Button>
            </div>
          </Card>

          {/* Local Multiplayer */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl hover:shadow-neon hover:scale-[1.02] transition-all duration-500 group">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-secondary rounded-xl shadow-neon group-hover:animate-neon-pulse group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Two Players</h3>
                  <p className="text-sm text-muted-foreground">Local tactical warfare</p>
                </div>
              </div>

              <div className="space-y-3 py-4">
                <div className="flex items-center justify-between p-3 bg-surface-glass rounded-xl border border-border/30 hover:scale-[1.02] transition-transform">
                  <span className="text-sm font-medium">Player 1</span>
                  <div className="w-5 h-5 bg-gradient-player-1 rounded-full shadow-neon animate-glow-pulse"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-glass rounded-xl border border-border/30 hover:scale-[1.02] transition-transform">
                  <span className="text-sm font-medium">Player 2</span>
                  <div className="w-5 h-5 bg-gradient-player-2 rounded-full shadow-neon animate-glow-pulse"></div>
                </div>
              </div>

              <Button 
                onClick={startTwoPlayer} 
                className="w-full bg-gradient-secondary hover:shadow-neon hover:scale-105 transition-all duration-300 border-0 group"
              >
                <Trophy className="w-4 h-4 mr-2 group-hover:animate-pulse" />
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
            className="flex items-center gap-2 border-border/50 bg-gradient-glass backdrop-blur-sm hover:border-primary/50 hover:shadow-glow hover:scale-105 transition-all duration-300"
          >
            <BookOpen className="w-4 h-4" />
            How to Play
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 border-border/50 bg-gradient-glass backdrop-blur-sm hover:border-secondary/50 hover:shadow-glow hover:scale-105 transition-all duration-300"
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