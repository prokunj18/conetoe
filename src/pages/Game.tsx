import { GameBoard } from "@/components/game/GameBoard";
import { BlingCurrency } from "@/components/ui/BlingCurrency";

const Game = () => {
  return (
    <div className="relative">
      <BlingCurrency />
      <GameBoard />
    </div>
  );
};

export default Game;