import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConePreview } from "./ConePreview";

interface PlayerInventoryProps {
  player: number;
  inventory: number[];
  isCurrentPlayer: boolean;
  selectedCone: number | null;
  onConeSelect: (coneSize: number) => void;
  label: string;
}

export const PlayerInventory = ({ 
  player, 
  inventory, 
  isCurrentPlayer, 
  selectedCone, 
  onConeSelect, 
  label 
}: PlayerInventoryProps) => {
  const getAvailableCount = (size: number) => {
    return inventory.filter(cone => cone === size).length;
  };

  return (
    <div className="space-y-2">
      {/* Header in one line */}
      <div className="flex items-center gap-2">
        <h3 className={`font-semibold text-sm ${player === 1 ? 'bg-gradient-player-1' : 'bg-gradient-player-2'} bg-clip-text text-transparent`}>
          {label}
        </h3>
        {isCurrentPlayer && (
          <Badge variant="secondary" className="animate-pulse text-xs">
            Active
          </Badge>
        )}
      </div>

      {/* Horizontal Cone Inventory */}
      <div className="flex items-center justify-around gap-2">
        {[4, 3, 2, 1].map(size => {
          const count = getAvailableCount(size);
          const isAvailable = count > 0 && isCurrentPlayer;
          const isSelected = selectedCone === size;
          
          return (
            <Button
              key={size}
              variant="ghost"
              disabled={!isAvailable}
              onClick={() => isAvailable ? onConeSelect(size) : undefined}
              className={`
                relative p-2 h-auto
                ${isSelected ? "bg-primary/20 border-2 border-primary scale-110" : "border border-transparent"}
                ${isAvailable ? "hover:bg-surface-elevated hover:scale-105" : "opacity-40"}
                transition-all duration-200
              `}
            >
              <ConePreview 
                player={player} 
                size={size}
                className={isSelected ? "scale-110" : ""}
              />
            </Button>
          );
        })}
      </div>
    </div>
  );
};
