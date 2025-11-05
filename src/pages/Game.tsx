import { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RotateCcw, Zap, Crown, Trophy } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { WinningModal } from "@/components/game/WinningModal";
import { PlayerBench3D } from "@/components/game/PlayerBench3D";
import { Board3DGrid } from "@/components/game/Board3DGrid";
import { Cone3D } from "@/components/game/Cone3D";
import { Game3DErrorBoundary } from "@/components/game/Game3DErrorBoundary";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useSettings } from "@/contexts/SettingsContext";
import { CellData } from "@/types/game";
import { useSound } from "@/hooks/useSound";
import { PointLight } from 'three';

const botNames = [
  "CyberKnight", "NeonPhantom", "QuantumRogue", "ShadowCone", "PrismWarrior",
  "VoidStriker", "NovaBlade", "EchoHunter", "ZenithBot", "OmegaTactician",
];

const DynamicLights = () => {
  const light1Ref = useRef<PointLight>(null);
  const light2Ref = useRef<PointLight>(null);
  const light3Ref = useRef<PointLight>(null);

  return (
    <>
      <pointLight ref={light1Ref} position={[5, 8, 5]} color="#00ffff" intensity={2} distance={15} castShadow />
      <pointLight ref={light2Ref} position={[-5, 8, -5]} color="#ff00ff" intensity={2} distance={15} castShadow />
      <pointLight ref={light3Ref} position={[0, 10, 0]} color="#ffffff" intensity={1.5} distance={20} />
    </>
  );
};

const Scene = ({ board, onCellClick, hoveredCell, onCellHover, boardTheme, playerInventories, selectedCone, setSelectedCone, currentPlayer, onConeSelect }: any) => {
  return (
    <>
      <color attach="background" args={['#000011']} />
      <PerspectiveCamera makeDefault position={[0, 16, 16]} fov={50} />
      <OrbitControls 
        enablePan={false}
        minDistance={12}
        maxDistance={26}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
        enableDamping
        dampingFactor={0.08}
      />

      <ambientLight intensity={0.3} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#00ffff" />
      <directionalLight position={[0, 5, -15]} intensity={0.6} color="#ff00ff" />
      <hemisphereLight args={['#4400ff', '#00ffff', 0.3]} />
      <DynamicLights />
      <fog attach="fog" args={['#000011', 20, 50]} />
      <Environment preset="night" />

      {/* Wooden Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
          color="#3d2817"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Floor Wood Planks Pattern */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh key={`plank-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-15 + i * 2, -0.99, 0]}>
          <planeGeometry args={[0.08, 60]} />
          <meshBasicMaterial color="#2a1810" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Player Benches - Horizontal with Selection */}
      <PlayerBench3D 
        player={1} 
        position={[0, -0.5, -10]} 
        inventory={playerInventories[0]}
        onConeSelect={onConeSelect}
        selectedCone={selectedCone}
        isCurrentPlayer={currentPlayer === 1}
      />
      <PlayerBench3D 
        player={2} 
        position={[0, -0.5, 10]} 
        inventory={playerInventories[1]}
        onConeSelect={onConeSelect}
        selectedCone={selectedCone}
        isCurrentPlayer={currentPlayer === 2}
      />

      {/* Game Board */}
      <Board3DGrid 
        board={board}
        theme={boardTheme}
        onCellClick={onCellClick}
        hoveredCell={hoveredCell}
        onCellHover={onCellHover}
      />

      {/* Placed Cones */}
      {board.map((cell: CellData | null, index: number) => {
        if (!cell) return null;
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = (col - 1) * 3;
        const z = (row - 1) * 3;
        return <Cone3D key={index} position={[x, 0, z]} player={cell.player} size={cell.size} />;
      })}
    </>
  );
};

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { boardTheme } = useSettings();
  const { playBGM, stopBGM, playPlace, playOverlap, playSelect } = useSound({ bgm: true, sfx: true, volume: 0.5 });
  
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
  } = useGameLogic(gameState);

  const [selectedCone, setSelectedCone] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    playBGM();
    return () => stopBGM();
  }, []);

  const botName = useMemo(() => {
    return botNames[Math.floor(Math.random() * botNames.length)];
  }, []);

  useEffect(() => {
    if (gameStatus === "finished" && winner) {
      setShowWinModal(true);
    }
  }, [gameStatus, winner]);

  const handleCellClick = (position: number) => {
    if (gameStatus !== "playing" || !selectedCone || currentPlayer !== 1) return;
    if (isValidMove(position, selectedCone)) {
      const existingCell = board[position];
      if (existingCell && existingCell.size < selectedCone) {
        playOverlap();
      } else {
        playPlace();
      }
      makeMove(position, selectedCone);
      setSelectedCone(null);
    }
  };

  const handleConeSelect = (size: number) => {
    if (currentPlayer === 1 && gameStatus === "playing") {
      setSelectedCone(size);
      playSelect();
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
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden">
      {/* Fixed UI Overlay */}
      <div className="fixed top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            {gameStatus === "playing" && (
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  <span className={`${getPlayerGradient(currentPlayer)} bg-clip-text text-transparent`}>
                    {gameState.mode === "ai" 
                      ? (currentPlayer === 1 ? "Your Turn" : `${botName}'s Turn`)
                      : `Player ${currentPlayer}`
                    }
                  </span>
                </h2>
                <div className="flex gap-2 text-xs mt-1">
                  <Badge variant="secondary">Move #{Math.floor((playerMoves[0] + playerMoves[1]) / 2) + 1}</Badge>
                  <Badge variant="secondary">Return in: {4 - (playerMoves[currentPlayer - 1] % 4)}</Badge>
                </div>
              </div>
            )}
            
            {gameState.mode === "ai" && (
              <Badge variant="secondary" className="flex items-center gap-2">
                {getDifficultyIcon()}
                {gameState.difficulty?.charAt(0).toUpperCase() + gameState.difficulty?.slice(1)}
              </Badge>
            )}
            
            <Button variant="outline" onClick={resetGame}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Game
            </Button>
          </div>
        </div>
      </div>

      {/* Full Screen 3D Game */}
      <div className="fixed inset-0 pt-20">
        <Game3DErrorBoundary>
          <Canvas 
            shadows 
            gl={{ 
              antialias: true, 
              alpha: false,
              powerPreference: "high-performance",
              failIfMajorPerformanceCaveat: false
            }}
            dpr={[1, 1.5]}
            onCreated={(state) => {
              state.gl.setClearColor('#000011');
            }}
          >
            <Suspense fallback={null}>
              <Scene 
                board={board}
                onCellClick={handleCellClick}
                hoveredCell={hoveredCell}
                onCellHover={setHoveredCell}
                boardTheme={boardTheme}
                playerInventories={playerInventories}
                selectedCone={selectedCone}
                setSelectedCone={setSelectedCone}
                currentPlayer={currentPlayer}
                onConeSelect={handleConeSelect}
              />
            </Suspense>
          </Canvas>
        </Game3DErrorBoundary>
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
  );
};

export default Game;