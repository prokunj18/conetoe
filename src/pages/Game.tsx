// Game.tsx - Uses 2D GameBoard by default, 3D mode disabled for now
import { GameBoard } from "@/components/game/GameBoard";

const Game = () => {
  // 2D mode is the default - 3D files are kept intact but disabled
  return <GameBoard />;
};

export default Game;