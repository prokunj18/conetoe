import { GameBoard } from "@/components/game/GameBoard";
import { ConeCustomizationButton } from "@/components/game/ConeCustomizationButton";

const Game = () => {
  return (
    <div className="relative">
      <GameBoard />
      <ConeCustomizationButton />
    </div>
  );
};

export default Game;