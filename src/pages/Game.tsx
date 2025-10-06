import { GameBoard } from "@/components/game/GameBoard";
import { CustomizationButton } from "@/components/customization/CustomizationButton";
import { BlingCurrency } from "@/components/ui/BlingCurrency";

const Game = () => {
  return (
    <div className="relative">
      <BlingCurrency />
      <GameBoard />
      <CustomizationButton />
    </div>
  );
};

export default Game;