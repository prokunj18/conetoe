import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Zap, Crown, Trophy, Box } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ConeCell } from "./ConeCell";
import { PlayerInventory } from "./PlayerInventory";
import { WinningModal } from "./WinningModal";
import { HintsPopup } from "./HintsPopup";
import { Game3DBoard } from "./Game3DBoard";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";

const botNames = [
  "CyberKnight", "NeonPhantom", "QuantumRogue", "ShadowCone", "PrismWarrior",
  "VoidStriker", "NovaBlade", "EchoHunter", "ZenithBot", "OmegaTactician",
  "TitanCore", "PhoenixMind", "VortexGuard", "CrystalSage", "ThunderCone"
];

export const GameBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { showMoveHints, animationsEnabled, boardTheme, gameMode } = useSettings();
  
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

  // Random bot name for AI opponent
  const botName = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * botNames.length);
    return botNames[randomIndex];
  }, []);

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

  const getBoardThemeClasses = () => {
    const themeMap = {
      neon: {
        container: "bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-700/20 shadow-[0_0_40px_rgba(34,211,238,0.3)] border-cyan-400/40",
        card: "bg-gradient-glass border-cyan-400/30 backdrop-blur-xl shadow-[0_0_20px_rgba(34,211,238,0.2)]",
        glow: "hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:border-cyan-400/60"
      },
      wooden: {
        container: "bg-gradient-wooden-surface shadow-wooden border-wooden-border",
        card: "bg-wooden-card border-wooden-border backdrop-blur-xl",
        glow: "hover:shadow-wooden hover:border-wooden-accent/50"
      },
      crystal: {
        container: "bg-gradient-to-br from-blue-100/20 via-cyan-200/20 to-blue-300/20 shadow-[0_0_40px_rgba(103,232,249,0.4)] border-cyan-300/50",
        card: "bg-gradient-glass border-cyan-300/40 backdrop-blur-xl",
        glow: "hover:shadow-[0_0_30px_rgba(103,232,249,0.5)] hover:border-cyan-300/70"
      },
      lava: {
        container: "bg-gradient-to-br from-red-600/20 via-orange-600/20 to-yellow-500/20 shadow-[0_0_50px_rgba(249,115,22,0.5)] border-orange-500/50",
        card: "bg-gradient-glass border-orange-500/40 backdrop-blur-xl",
        glow: "hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:border-orange-500/70"
      },
      space: {
        container: "bg-gradient-to-br from-indigo-950/40 via-purple-900/40 to-black/40 shadow-[0_0_40px_rgba(168,85,247,0.3)] border-purple-500/30",
        card: "bg-gradient-glass border-purple-500/30 backdrop-blur-xl",
        glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:border-purple-500/50"
      },
      matrix: {
        container: "bg-gradient-to-br from-green-950/30 via-emerald-900/30 to-black/30 shadow-[0_0_40px_rgba(34,197,94,0.3)] border-green-500/40",
        card: "bg-gradient-glass border-green-500/30 backdrop-blur-xl",
        glow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:border-green-500/60"
      },
      royal: {
        container: "bg-gradient-to-br from-yellow-600/20 via-amber-500/20 to-yellow-700/20 shadow-[0_0_40px_rgba(234,179,8,0.4)] border-yellow-500/50",
        card: "bg-gradient-glass border-yellow-500/40 backdrop-blur-xl",
        glow: "hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:border-yellow-500/70"
      },
      ocean: {
        container: "bg-gradient-to-br from-blue-600/20 via-teal-500/20 to-cyan-600/20 shadow-[0_0_40px_rgba(20,184,166,0.4)] border-teal-400/50",
        card: "bg-gradient-glass border-teal-400/40 backdrop-blur-xl",
        glow: "hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] hover:border-teal-400/70"
      },
      midnight: {
        container: "bg-gradient-to-br from-slate-800/30 via-blue-900/30 to-slate-900/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] border-blue-500/30",
        card: "bg-gradient-glass border-blue-500/30 backdrop-blur-xl",
        glow: "hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:border-blue-500/50"
      },
      sunset: {
        container: "bg-gradient-to-br from-pink-500/20 via-orange-400/20 to-yellow-500/20 shadow-[0_0_40px_rgba(251,146,60,0.4)] border-orange-400/50",
        card: "bg-gradient-glass border-orange-400/40 backdrop-blur-xl",
        glow: "hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] hover:border-orange-400/70"
      }
    };
    return themeMap[boardTheme] || themeMap.neon;
  };

  const themeClasses = getBoardThemeClasses();

  const getBackgroundClass = () => {
    const bgMap = {
      neon: 'bg-gradient-hero',
      wooden: 'bg-wooden-background',
      crystal: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100',
      lava: 'bg-gradient-to-br from-red-950 via-orange-950 to-yellow-900',
      space: 'bg-gradient-to-br from-black via-indigo-950 to-purple-950',
      matrix: 'bg-gradient-to-br from-black via-green-950 to-emerald-950',
      royal: 'bg-gradient-to-br from-yellow-900 via-amber-950 to-yellow-950',
      ocean: 'bg-gradient-to-br from-blue-950 via-teal-900 to-cyan-950',
      midnight: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
      sunset: 'bg-gradient-to-br from-pink-950 via-orange-900 to-yellow-950'
    };
    return bgMap[boardTheme] || bgMap.neon;
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} p-4`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 border-border ${themeClasses.glow}`}
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
              className={`flex items-center gap-2 border-border ${themeClasses.glow}`}
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
                  {gameState.mode === "ai" 
                    ? (currentPlayer === 1 ? "Your Turn" : `${botName}'s Turn`)
                    : `Player ${currentPlayer} Turn`
                  }
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
          <Card className={`p-4 ${themeClasses.card}`}>
            <PlayerInventory
              player={1}
              inventory={playerInventories[0]}
              isCurrentPlayer={currentPlayer === 1 && gameStatus === "playing"}
              selectedCone={selectedCone}
              onConeSelect={handleConeSelect}
              label={gameState.mode === "ai" ? "Your Triangles" : "Player 1"}
            />
          </Card>

          {/* Game Board */}
          <Card className={`p-6 ${themeClasses.container} transition-all duration-500`}>
            {gameMode === '3D' ? (
              <Game3DBoard
                board={board}
                onCellClick={handleCellClick}
                hoveredCell={hoveredCell}
                onCellHover={setHoveredCell}
              />
            ) : (
              <div className="aspect-square max-w-sm mx-auto">
                <div className="grid grid-cols-3 gap-3 h-full p-2">
                  {board.map((cell, index) => (
                    <ConeCell
                      key={index}
                      cell={cell}
                      isHovered={hoveredCell === index}
                      isValidMove={showMoveHints && selectedCone ? isValidMove(index, selectedCone) : false}
                      onClick={() => handleCellClick(index)}
                      onMouseEnter={() => setHoveredCell(index)}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Player 2/AI Inventory */}
          <Card className={`p-4 ${themeClasses.card}`}>
            <PlayerInventory
              player={2}
              inventory={playerInventories[1]}
              isCurrentPlayer={currentPlayer === 2 && gameStatus === "playing"}
              selectedCone={selectedCone}
              onConeSelect={handleConeSelect}
              label={gameState.mode === "ai" ? `${botName}'s Triangles` : "Player 2"}
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

        {/* Hints Popup */}
        <HintsPopup />
      </div>
    </div>
  );
};