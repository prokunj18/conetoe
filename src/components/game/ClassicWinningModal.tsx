import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Home, Sparkles, Frown, Handshake } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import confetti from "canvas-confetti";

interface ClassicWinningModalProps {
  winner: number | null;
  isDraw: boolean;
  isVisible: boolean;
  onNewGame: () => void;
  gameMode: "ai" | "local";
  difficulty?: string;
  betAmount?: number;
}

export const ClassicWinningModal = ({
  winner,
  isDraw,
  isVisible,
  onNewGame,
  gameMode,
  difficulty,
  betAmount = 0
}: ClassicWinningModalProps) => {
  const navigate = useNavigate();
  const { profile, reload } = useProfile();
  const [rewardProcessed, setRewardProcessed] = useState(false);

  const isPlayerWin = gameMode === "ai" ? winner === 1 : true;
  const winAmount = betAmount * 2;

  useEffect(() => {
    const processReward = async () => {
      if (!isVisible || rewardProcessed || !profile) return;

      if (isPlayerWin && !isDraw && winner === 1 && betAmount > 0) {
        // Award winnings
        const { error } = await supabase.rpc('complete_game', {
          p_room_id: null,
          p_winner_id: profile.id,
          p_bet_amount: betAmount
        });

        if (!error) {
          reload();
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#22d3ee', '#8b5cf6', '#ec4899', '#a855f7']
          });
        }
      }
      setRewardProcessed(true);
    };

    processReward();
  }, [isVisible, winner, isDraw, betAmount, profile, reload, isPlayerWin, rewardProcessed]);

  useEffect(() => {
    if (!isVisible) {
      setRewardProcessed(false);
    }
  }, [isVisible]);

  const getTitle = () => {
    if (isDraw) return "It's a Draw!";
    if (gameMode === "ai") {
      return winner === 1 ? "Victory!" : "Defeat!";
    }
    return `Player ${winner} Wins!`;
  };

  const getIcon = () => {
    if (isDraw) return <Handshake className="w-12 h-12 text-slate-400" />;
    if (gameMode === "ai") {
      return winner === 1 
        ? <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
        : <Frown className="w-12 h-12 text-slate-400" />;
    }
    return <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />;
  };

  return (
    <Dialog open={isVisible} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-800 via-slate-900 to-black border-2 border-slate-600/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center gap-4">
              {getIcon()}
              <span className={`text-3xl font-bold ${
                isDraw ? "text-slate-300" : 
                (winner === 1 ? "text-cyan-400" : "text-violet-400")
              } drop-shadow-[0_0_10px_currentColor]`}>
                {getTitle()}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reward Display */}
          {betAmount > 0 && !isDraw && (
            <div className="text-center">
              {winner === 1 && gameMode === "ai" ? (
                <Badge className="bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-300 border-amber-500/50 px-4 py-2 text-lg flex items-center gap-2 mx-auto w-fit">
                  <Sparkles className="w-5 h-5" />
                  +{winAmount} Bling Won!
                </Badge>
              ) : (
                <Badge className="bg-slate-700/50 text-slate-400 border-slate-500/50 px-4 py-2">
                  -{betAmount} Bling Lost
                </Badge>
              )}
            </div>
          )}

          {/* Game Info */}
          <div className="flex justify-center gap-4">
            {gameMode === "ai" && difficulty && (
              <Badge variant="outline" className="border-slate-500/50 text-slate-300">
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} AI
              </Badge>
            )}
            <Badge variant="outline" className="border-slate-500/50 text-slate-300">
              Classic Tic-Tac-Toe
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={onNewGame}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/classic")}
              className="w-full border-slate-600/50 hover:bg-slate-700/50"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
