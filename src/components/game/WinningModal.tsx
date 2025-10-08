import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Zap, RotateCcw, Home, Star, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

interface WinningModalProps {
  winner: number | null;
  isVisible: boolean;
  onNewGame: () => void;
  gameMode: string;
  difficulty?: string;
}

export const WinningModal = ({ 
  winner, 
  isVisible, 
  onNewGame, 
  gameMode, 
  difficulty 
}: WinningModalProps) => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [showConfetti, setShowConfetti] = useState(false);
  const [coinsAwarded, setCoinsAwarded] = useState(false);

  useEffect(() => {
    if (isVisible && winner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
    // Reset coinsAwarded when modal closes
    if (!isVisible) {
      setCoinsAwarded(false);
    }
  }, [isVisible, winner]);

  useEffect(() => {
    // Award coins when player wins (only for AI mode, and only once)
    if (isVisible && winner === 1 && gameMode === "ai" && !coinsAwarded && profile) {
      const coinReward = difficulty === "master" ? 50 : difficulty === "hard" ? 30 : difficulty === "normal" ? 20 : 10;
      updateProfile({ coins: profile.coins + coinReward });
      setCoinsAwarded(true);
      toast.success(`You earned ${coinReward} Bling!`, {
        icon: <Coins className="w-4 h-4" />
      });
    }
  }, [isVisible, winner, gameMode, difficulty, coinsAwarded, profile, updateProfile]);

  if (!isVisible || !winner) return null;

  const getWinnerInfo = () => {
    if (winner === 1) {
      return {
        title: gameMode === "ai" ? "Victory!" : "Player 1 Wins!",
        subtitle: gameMode === "ai" ? "You conquered the AI!" : "Excellent strategy!",
        icon: Trophy,
        gradient: "bg-gradient-player-1",
        color: "text-player-1-glow"
      };
    } else {
      return {
        title: gameMode === "ai" ? "AI Victory" : "Player 2 Wins!",
        subtitle: gameMode === "ai" ? "The AI outsmarted you!" : "Brilliant tactics!",
        icon: Crown,
        gradient: "bg-gradient-player-2", 
        color: "text-player-2-glow"
      };
    }
  };

  const getDifficultyBadge = () => {
    if (gameMode !== "ai" || !difficulty) return null;
    
    const badges = {
      easy: { icon: Zap, text: "Easy AI", color: "bg-gradient-player-1" },
      normal: { icon: Star, text: "Normal AI", color: "bg-gradient-secondary" },
      hard: { icon: Crown, text: "Hard AI", color: "bg-gradient-player-2" },
      master: { icon: Crown, text: "Master AI", color: "bg-gradient-primary" },
    };
    
    const badge = badges[difficulty as keyof typeof badges];
    if (!badge) return null;
    
    return (
      <Badge className={`${badge.color} px-4 py-2 text-white border-0`}>
        <badge.icon className="w-4 h-4 mr-2" />
        {badge.text}
      </Badge>
    );
  };

  const winnerInfo = getWinnerInfo();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-end md:items-center justify-center z-50 animate-fade-in pb-safe">{/* Mobile: bottom, Desktop: center */}
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-neon opacity-80 animate-victory-burst"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Modal Content */}
      <div className="bg-gradient-glass backdrop-blur-xl border border-card-border rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 mb-4 md:mb-0 shadow-board animate-scale-in">{/* Added bottom margin for mobile */}
        {/* Winner Icon */}
        <div className="text-center mb-6">
          <div className={`inline-flex p-6 ${winnerInfo.gradient} rounded-full shadow-neon animate-glow-pulse mb-4`}>
            <winnerInfo.icon className="w-12 h-12 text-white" />
          </div>
          
          {/* Title */}
          <h1 className={`text-3xl font-bold ${winnerInfo.color} mb-2`}>
            {winnerInfo.title}
          </h1>
          
          <p className="text-muted-foreground text-lg">
            {winnerInfo.subtitle}
          </p>
        </div>

        {/* Difficulty Badge */}
        {getDifficultyBadge() && (
          <div className="flex justify-center mb-6">
            {getDifficultyBadge()}
          </div>
        )}

        {/* Game Stats */}
        <div className="bg-surface-glass rounded-xl p-4 mb-6 border border-border/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {gameMode === "ai" ? "1v1" : "2P"}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Game Mode
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {winner === 1 ? "P1" : gameMode === "ai" ? "AI" : "P2"}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Winner
              </div>
            </div>
            {gameMode === "ai" && winner === 1 && (
              <div>
                <div className="text-2xl font-bold text-accent">
                  +{difficulty === "master" ? 50 : difficulty === "hard" ? 30 : difficulty === "normal" ? 20 : 10}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Bling
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onNewGame}
            size="lg"
            className="w-full bg-gradient-primary hover:shadow-neon transition-all duration-300 border-0"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
              className="border-border hover:border-primary/50 hover:bg-primary/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Main Menu
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/game", { 
                state: { 
                  mode: gameMode, 
                  difficulty: gameMode === "ai" ? "master" : undefined 
                } 
              })}
              className="border-border hover:border-secondary/50 hover:bg-secondary/10"
            >
              <Crown className="w-4 h-4 mr-2" />
              Challenge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};