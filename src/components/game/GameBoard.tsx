import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Zap, Crown, Trophy } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ConeCell } from "./ConeCell";
import { PlayerInventory } from "./PlayerInventory";
import { WinningModal } from "./WinningModal";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useToast } from "@/hooks/use-toast";

export const GameBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const gameState = location.state || { mode: "ai", difficulty: "normal" };
  const { 
    board, 
    currentPlayer, 
    playerInventories, 
    gameStatus, 
    winner,
    playerMoves,
    makeMove, 
    resetGame,
    isValidMove,
    getAvailableCones
  } = useGameLogic(gameState);

  const [selectedCone, setSelectedCone] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    if (gameStatus === "finished" && winner) {
      setShowWinModal(true);
    }
  }, [gameStatus, winner]);

  const handleCellClick = (position: number) => {
    if (gameStatus !== "playing" || !selectedCone) return;
    
    if (isValidMove(position, selectedCone)) {
      makeMove(position, selectedCone);
      setSelectedCone(null);
    }
  };

  const handleConeSelect = (coneSize: number) => {
    const availableCones = getAvailableCones(currentPlayer);
    if (availableCones.includes(coneSize)) {
      setSelectedCone(selectedCone === coneSize ? null : coneSize);
    }
  };

  const getDifficultyIcon = () => {
    switch (gameState.difficulty) {
      case "easy": return <Zap className="w-4 h-4" />;
      case "normal": return <Trophy className="w-4 h-4" />;
      case "hard": return <Crown className="w-4 h-4" />;
      case "master": return <Crown className="w-4 h-4 text-primary" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getPlayerGradient = (player: number) => {
    return player === 1 ? "bg-gradient-player-1" : "bg-gradient-player-2";
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 border-border hover:border-primary/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
          
          <div className="flex items-center gap-4">
            {gameState.mode === "ai" && (
              <Badge variant="secondary" className="flex items-center gap-2">
                {getDifficultyIcon()}
                {gameState.difficulty?.charAt(0).toUpperCase() + gameState.difficulty?.slice(1)} AI
              </Badge>
            )}
            
            <Button 
              variant="outline" 
              onClick={resetGame}
              className="flex items-center gap-2 border-border hover:border-primary/50"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </Button>
          </div>
        </div>

        {/* Game Status */}
        {gameStatus === "playing" && (
          <div className="text-center space-y-3 animate-fade-in">
            <div className="relative">
              <h2 className="text-3xl font-bold">
                <span className={`${getPlayerGradient(currentPlayer)} bg-clip-text text-transparent animate-glow-pulse`}>
                  {currentPlayer === 1 ? "Player 1" : gameState.mode === "ai" ? "Your" : "Player 2"} Turn
                </span>
              </h2>
            </div>
            <div className="flex justify-center gap-4 text-sm">
              <Badge className="bg-gradient-glass border border-primary/30 backdrop-blur-sm">
                Move #{Math.floor((playerMoves[0] + playerMoves[1]) / 2) + 1}
              </Badge>
              <Badge className="bg-gradient-glass border border-secondary/30 backdrop-blur-sm">
                Next return: {4 - (playerMoves[currentPlayer - 1] % 4)} moves
              </Badge>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Player 1 Inventory */}
          <Card className="p-4 bg-gradient-glass border border-card-border backdrop-blur-xl">
            <PlayerInventory
              player={1}
              inventory={playerInventories[0]}
              isCurrentPlayer={currentPlayer === 1 && gameStatus === "playing"}
              selectedCone={selectedCone}
              onConeSelect={handleConeSelect}
              label={gameState.mode === "ai" ? "Your Cones" : "Player 1"}
            />
          </Card>

          {/* Game Board */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl shadow-board hover:shadow-neon transition-all duration-500">
            <div className="aspect-square max-w-sm mx-auto">
              <div className="grid grid-cols-3 gap-3 h-full p-2">
                {board.map((cell, index) => (
                  <ConeCell
                    key={index}
                    cell={cell}
                    isHovered={hoveredCell === index}
                    isValidMove={selectedCone ? isValidMove(index, selectedCone) : false}
                    onClick={() => handleCellClick(index)}
                    onMouseEnter={() => setHoveredCell(index)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Player 2/AI Inventory */}
          <Card className="p-4 bg-gradient-glass border border-card-border backdrop-blur-xl">
            <PlayerInventory
              player={2}
              inventory={playerInventories[1]}
              isCurrentPlayer={currentPlayer === 2 && gameStatus === "playing"}
              selectedCone={selectedCone}
              onConeSelect={handleConeSelect}
              label={gameState.mode === "ai" ? "AI Cones" : "Player 2"}
            />
          </Card>
        </div>

        {/* Winning Modal */}
        <WinningModal
          winner={winner}
          isVisible={showWinModal}
          onNewGame={() => {
            resetGame();
            setShowWinModal(false);
          }}
          gameMode={gameState.mode}
          difficulty={gameState.difficulty}
        />
      </div>
    </div>
  );
};