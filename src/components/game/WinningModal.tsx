import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Zap, RotateCcw, Home, Star, Coins, Calendar } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WinningModalProps {
  winner: number | null;
  isVisible: boolean;
  onNewGame: () => void;
  gameMode: string;
  difficulty?: string;
  betAmount?: number;
  roomId?: string;
  isDailyChallenge?: boolean;
}

export const WinningModal = ({ 
  winner, 
  isVisible, 
  onNewGame, 
  gameMode, 
  difficulty,
  betAmount = 0,
  roomId,
  isDailyChallenge = false
}: WinningModalProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { profile, updateProfile, reload } = useProfile();
  const { challenge, completeChallenge } = useDailyChallenge();
  const [showConfetti, setShowConfetti] = useState(false);
  const [coinsAwarded, setCoinsAwarded] = useState(false);
  const [dailyChallengeReward, setDailyChallengeReward] = useState(0);
  
  // Get room ID from props or URL params for multiplayer
  const multiplayerRoomId = roomId || searchParams.get('room');
  const isMultiplayerGame = gameMode === "multiplayer" && multiplayerRoomId;

  useEffect(() => {
    if (isVisible && winner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
    // Reset states when modal closes
    if (!isVisible) {
      setCoinsAwarded(false);
      setDailyChallengeReward(0);
    }
  }, [isVisible, winner]);

  useEffect(() => {
    const handleGameEnd = async () => {
      if (!isVisible || coinsAwarded) return;
      
      // Only process rewards for logged in users
      if (!profile || !user) {
        if (winner === 1 && gameMode === "ai") {
          toast.info("Sign in to earn Bling and save your progress!");
        }
        setCoinsAwarded(true);
        return;
      }

      // MULTIPLAYER GAMES: Use secure server-side RPC
      if (isMultiplayerGame && multiplayerRoomId) {
        try {
          // Determine winner ID - player 1 is host, player 2 is guest
          // We need to get room info to determine who won
          const { data: room } = await supabase
            .from('game_rooms')
            .select('id, host_id, guest_id, bet_amount, status')
            .eq('room_code', multiplayerRoomId)
            .single();

          if (room && room.status === 'playing') {
            const winnerId = winner === 1 ? room.host_id : room.guest_id;
            
            // Call secure server-side function to complete game with actual room UUID
            const { error } = await supabase.rpc('complete_game', {
              p_room_id: room.id,
              p_winner_id: winnerId,
              p_bet_amount: room.bet_amount
            });

            if (error) {
              console.error('Error completing game:', error);
              toast.error("Error processing game results");
            } else {
              reload();
              const isWinner = (winner === 1 && room.host_id === user.id) || 
                              (winner === 2 && room.guest_id === user.id);
              if (isWinner) {
                toast.success(`+${room.bet_amount * 2} Bling won!`, { 
                  icon: <Coins className="w-4 h-4 text-amber-400" /> 
                });
              } else {
                toast.error(`Lost ${room.bet_amount} Bling bet!`, { 
                  icon: <Coins className="w-4 h-4 text-destructive" /> 
                });
              }
            }
          }
        } catch (error) {
          console.error('Error in multiplayer game completion:', error);
        }
        
        setCoinsAwarded(true);
        return;
      }

      // AI GAMES: Process rewards client-side (single-player, no exploitation risk)
      let coinChange = 0;
      let message = "";

      if (gameMode === "ai") {
        const baseReward = difficulty === "master" ? 50 : difficulty === "hard" ? 30 : difficulty === "normal" ? 20 : 10;
        
        if (winner === 1) {
          // Player won - get base reward + double the bet (bet back + profit)
          coinChange = baseReward + (betAmount * 2);
          message = betAmount > 0 
            ? `+${baseReward} base + ${betAmount * 2} bet winnings!`
            : `+${baseReward} Bling!`;
        } else {
          // Player lost - bet was already deducted at start, just base reward lost
          coinChange = 0; // Bet already taken
          message = betAmount > 0 ? `Lost ${betAmount} Bling bet!` : "";
        }
      }

      // Update coins and increment total_games for AI games
      if (coinChange !== 0 || gameMode === "ai") {
        const newCoins = Math.max(0, profile.coins + coinChange);
        await updateProfile({ 
          coins: newCoins,
          total_games: profile.total_games + 1,
          total_wins: winner === 1 ? profile.total_wins + 1 : profile.total_wins
        });
        
        if (coinChange > 0) {
          toast.success(message, { icon: <Coins className="w-4 h-4 text-amber-400" /> });
        } else if (coinChange < 0) {
          toast.error(message, { icon: <Coins className="w-4 h-4 text-destructive" /> });
        }
      }

      // Process daily challenge completion
      if (isDailyChallenge && winner === 1 && challenge && !challenge.completed) {
        const result = await completeChallenge();
        if (result.success) {
          setDailyChallengeReward(result.reward);
          toast.success(`Daily Challenge Complete! +${result.reward} bonus Bling!`, { 
            icon: <Calendar className="w-4 h-4 text-amber-400" /> 
          });
        }
      }

      setCoinsAwarded(true);
    };

    handleGameEnd();
  }, [isVisible, winner, gameMode, difficulty, coinsAwarded, profile, user, updateProfile, betAmount, isMultiplayerGame, multiplayerRoomId, reload, isDailyChallenge, challenge, completeChallenge]);

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

  // Calculate display values
  const baseReward = difficulty === "master" ? 50 : difficulty === "hard" ? 30 : difficulty === "normal" ? 20 : 10;
  const totalWin = winner === 1 ? baseReward + (betAmount * 2) + dailyChallengeReward : 0;
  const totalLoss = winner === 2 ? betAmount : 0;

  const winnerInfo = getWinnerInfo();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-end md:items-center justify-center z-50 animate-fade-in pb-safe">
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
      <div className="bg-gradient-glass backdrop-blur-xl border border-card-border rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 mb-4 md:mb-0 shadow-board animate-scale-in">
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
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {getDifficultyBadge()}
          {isDailyChallenge && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-white border-0">
              <Calendar className="w-4 h-4 mr-2" />
              Daily Challenge
            </Badge>
          )}
        </div>

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
            {gameMode === "ai" && profile && (
              <div>
                <div className={`text-2xl font-bold ${winner === 1 ? 'text-accent' : 'text-destructive'}`}>
                  {winner === 1 ? `+${totalWin}` : totalLoss > 0 ? `-${totalLoss}` : '0'}
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
