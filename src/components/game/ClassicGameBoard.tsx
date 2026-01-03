import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Zap, Crown, Trophy, Sparkles, Grid3X3, Palette, Settings2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClassicCell } from "./ClassicCell";
import { ClassicWinningModal } from "./ClassicWinningModal";
import { useClassicGameLogic } from "@/hooks/useClassicGameLogic";
import { useSettings } from "@/contexts/SettingsContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GameErrorBoundary } from "@/components/ui/GameErrorBoundary";
import { getSafeAssets, DEFAULT_CONE_ID, DEFAULT_BOARD_ID } from "@/utils/gameValidation";
import { BOARDS } from "@/data/boards";

const botNames = [
  "RetroBot", "ClassicMind", "TicTacPro", "GridMaster", "OldSchool",
  "PixelBrain", "ArcadeAI", "VintageBot", "NeonLogic", "8BitThinker"
];

export const ClassicGameBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showMoveHints, animationsEnabled } = useSettings();
  const { profile, reload } = useProfile();
  
  const gameState = location.state || { mode: "ai", difficulty: "normal" };
  const { 
    board, 
    currentPlayer, 
    gameStatus, 
    winner,
    moveCount,
    makeMove, 
    resetGame,
    isValidMove,
  } = useClassicGameLogic(gameState);

  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [betDeducted, setBetDeducted] = useState(false);
  const [assetError, setAssetError] = useState(false);
  
  const betAmount = gameState.betAmount || 0;
  
  // Get selected customizations with fallback
  const selectedCone = gameState.selectedCone || DEFAULT_CONE_ID;
  const selectedBoard = gameState.selectedBoard || DEFAULT_BOARD_ID;
  
  // Validate and get safe assets
  const safeAssets = useMemo(() => {
    const result = getSafeAssets(selectedCone, selectedBoard);
    if (result.usedFallback) {
      console.warn('Using fallback assets due to invalid selection');
      setAssetError(true);
    }
    return result;
  }, [selectedCone, selectedBoard]);
  
  const currentBoard = BOARDS.find(b => b.id === safeAssets.boardId);

  const botName = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * botNames.length);
    return botNames[randomIndex];
  }, []);

  // Deduct bet at game start
  useEffect(() => {
    const deductBet = async () => {
      if (betAmount > 0 && profile && !betDeducted && gameStatus === "playing") {
        const { error } = await supabase.rpc('start_ai_game', {
          p_bet_amount: betAmount,
          p_difficulty: gameState.difficulty || 'normal'
        });
        
        if (!error) {
          setBetDeducted(true);
          reload();
          toast.info(`${betAmount} Bling wagered!`);
        } else {
          console.error('Failed to deduct bet:', error);
          toast.error('Failed to start game: ' + error.message);
        }
      }
    };
    deductBet();
  }, [betAmount, profile, betDeducted, gameStatus, reload, gameState.difficulty]);

  useEffect(() => {
    if ((gameStatus === "finished" || gameStatus === "draw") && (winner || gameStatus === "draw")) {
      setShowWinModal(true);
    }
  }, [gameStatus, winner]);

  useEffect(() => {
    if (assetError) {
      toast.warning("Using default board - selected asset unavailable", {
        duration: 3000
      });
    }
  }, [assetError]);

  const handleCellClick = (position: number) => {
    if (gameStatus !== "playing") return;
    if (gameState.mode === "ai" && currentPlayer === 2) return;
    
    if (isValidMove(position)) {
      makeMove(position);
    }
  };

  const getDifficultyIcon = () => {
    switch (gameState.difficulty) {
      case "easy": return <Zap className="w-4 h-4" />;
      case "normal": return <Trophy className="w-4 h-4" />;
      case "hard": return <Crown className="w-4 h-4" />;
      case "master": return <Crown className="w-4 h-4 text-amber-400" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  return (
    <GameErrorBoundary fallbackType="game" onRetry={() => navigate("/classic")}>
      <div 
        className="min-h-screen p-4 animate-fade-in relative overflow-hidden"
        style={{
          background: currentBoard 
            ? `linear-gradient(to br, ${currentBoard.gradient.includes('slate') ? '#0f172a' : '#0a0a0f'}, #020617, #0a0a0f)`
            : 'linear-gradient(to br, #0f172a, #020617, #0a0a0f)'
        }}
      >
        {/* Retro scanlines effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
          }}
        />
        
        {/* Neon grid background with board theming */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 0%, rgba(100,200,255,0.1) 50%, transparent 100%),
              linear-gradient(0deg, transparent 0%, rgba(100,200,255,0.05) 50%, transparent 100%)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between animate-slide-down">
            <Button 
              variant="outline" 
              onClick={() => navigate("/classic")}
              className="flex items-center gap-2 border-slate-600/50 bg-slate-800/50 hover:bg-slate-700/50 hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Menu
            </Button>
            
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge className="bg-gradient-to-r from-slate-700 to-slate-800 border-slate-500/50 flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Classic Mode
              </Badge>
              
              {currentBoard && (
                <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 flex items-center gap-1">
                  <Palette className="w-3 h-3" />
                  {currentBoard.name}
                </Badge>
              )}
              
              {gameState.mode === "ai" && (
                <Badge variant="secondary" className="flex items-center gap-2 bg-slate-700/50 border-slate-500/50">
                  {getDifficultyIcon()}
                  {gameState.difficulty?.charAt(0).toUpperCase() + gameState.difficulty?.slice(1)} AI
                </Badge>
              )}
              
              {betAmount > 0 && (
                <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  {betAmount} Bling
                </Badge>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => resetGame()}
                className="flex items-center gap-2 border-slate-600/50 bg-slate-800/50 hover:bg-slate-700/50 hover:scale-105 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4" />
                New Game
              </Button>
            </div>
          </div>

          {/* Game Status */}
          <GameErrorBoundary fallbackType="ui">
            {gameStatus === "playing" && (
              <div className="text-center space-y-3 animate-scale-in">
                <h2 className="text-3xl font-bold">
                  <span className={`${currentPlayer === 1 ? "text-cyan-400" : "text-violet-400"} drop-shadow-[0_0_10px_currentColor]`}>
                    {gameState.mode === "ai" 
                      ? (currentPlayer === 1 ? "Your Turn (X)" : `${botName}'s Turn (O)`)
                      : `Player ${currentPlayer} Turn (${currentPlayer === 1 ? "X" : "O"})`
                    }
                  </span>
                </h2>
                <Badge className="bg-slate-700/50 border-slate-500/50">
                  Move #{moveCount + 1}
                </Badge>
              </div>
            )}
          </GameErrorBoundary>

          {/* Game Board */}
          <Card 
            className={`p-8 bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-black/80 border-2 border-slate-600/50 backdrop-blur-xl shadow-[0_0_50px_rgba(100,200,255,0.1)] animate-scale-in ${currentBoard?.preview || ''}`}
          >
            <div className="aspect-square max-w-sm mx-auto">
              <div className="grid grid-cols-3 gap-3 h-full p-2">
                {board.map((cell, index) => (
                  <ClassicCell
                    key={index}
                    cell={cell}
                    isHovered={hoveredCell === index}
                    isValidMove={showMoveHints && isValidMove(index)}
                    onClick={() => handleCellClick(index)}
                    onMouseEnter={() => setHoveredCell(index)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-8 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center text-cyan-400 font-bold text-lg drop-shadow-[0_0_5px_currentColor]">X</div>
                <span className="text-slate-400">{gameState.mode === "ai" ? "You" : "Player 1"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center text-violet-400 font-bold text-lg drop-shadow-[0_0_5px_currentColor]">O</div>
                <span className="text-slate-400">{gameState.mode === "ai" ? botName : "Player 2"}</span>
              </div>
            </div>
          </Card>

          {/* Winning Modal */}
          <ClassicWinningModal
            winner={winner}
            isDraw={gameStatus === "draw"}
            isVisible={showWinModal}
            onNewGame={() => {
              resetGame();
              setShowWinModal(false);
            }}
            gameMode={gameState.mode}
            difficulty={gameState.difficulty}
            betAmount={betAmount}
          />
        </div>
      </div>
    </GameErrorBoundary>
  );
};
