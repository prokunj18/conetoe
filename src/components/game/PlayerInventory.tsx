import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";

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
  const { boardTheme } = useSettings();

  const getConeGradient = (player: number) => {
    return player === 1 ? "bg-gradient-player-1" : "bg-gradient-player-2";
  };

  const getConeSize = (size: number) => {
    switch (size) {
      case 1: return "w-8 h-8";
      case 2: return "w-10 h-10";
      case 3: return "w-12 h-12";
      case 4: return "w-14 h-14";
      default: return "w-8 h-8";
    }
  };

  const getAvailableCount = (size: number) => {
    return inventory.filter(cone => cone === size).length;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className={`font-semibold ${getConeGradient(player)} bg-clip-text text-transparent`}>
          {label}
        </h3>
        {isCurrentPlayer && (
          <Badge variant="secondary" className="animate-pulse">
            Active
          </Badge>
        )}
      </div>

      {/* Cone Inventory */}
      <div className="space-y-3">
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
                w-full p-4 h-auto flex items-center justify-between
                ${isSelected ? "bg-primary/20 border border-primary" : ""}
                ${isAvailable ? "hover:bg-surface-elevated" : "opacity-50"}
                transition-all duration-200
              `}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`
                    ${getConeSize(size)} 
                    ${getConeGradient(player)} 
                    relative flex items-center justify-center text-white font-bold text-sm
                    ${isSelected ? "scale-110 shadow-vibrant" : ""}
                    ${boardTheme === 'wooden' ? 'shadow-wooden' : 'shadow-neon'}
                    transition-all duration-300
                  `}
                  style={{
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    filter: `drop-shadow(0 0 ${isSelected ? '12px' : '8px'} currentColor)`
                  }}
                >
                  {/* Triangle gradient overlay */}
                  <div 
                    className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent"
                    style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                  />
                  
                  {/* Number display */}
                  <span className="relative z-10 drop-shadow-lg translate-y-1">{size}</span>
                  
                  {/* Neon glow effect */}
                  <div 
                    className={`absolute inset-0 opacity-50 ${getConeGradient(player)} blur-sm`}
                    style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                  />
                </div>
                <div className="text-left">
                  <div className="font-medium">Size {size}</div>
                  <div className="text-xs text-muted-foreground">
                    {size === 4 ? "Largest" : size === 1 ? "Smallest" : "Medium"}
                  </div>
                </div>
              </div>
              
              <Badge 
                variant={count > 0 ? "secondary" : "outline"}
                className="ml-2"
              >
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Instructions */}
      {isCurrentPlayer && (
        <div className="text-xs text-muted-foreground p-3 bg-surface rounded-lg">
          💡 Select a cone size, then click a board position. Larger cones can replace smaller ones!
        </div>
      )}
    </div>
  );
};