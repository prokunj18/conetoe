import { CellData } from "@/types/game";

interface ConeCellProps {
  cell: CellData;
  isHovered: boolean;
  isValidMove: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ConeCell = ({ 
  cell, 
  isHovered, 
  isValidMove, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: ConeCellProps) => {
  const getConeSize = (size: number) => {
    switch (size) {
      case 1: return "w-6 h-6";
      case 2: return "w-8 h-8";
      case 3: return "w-10 h-10";
      case 4: return "w-12 h-12";
      default: return "w-6 h-6";
    }
  };

  const getConeGradient = (player: number) => {
    return player === 1 ? "bg-gradient-player-1" : "bg-gradient-player-2";
  };

  return (
    <div 
      className={`
        aspect-square border-2 rounded-lg flex items-center justify-center cursor-pointer
        transition-all duration-300 relative overflow-hidden
        ${isValidMove 
          ? "border-primary bg-primary/10 shadow-glow animate-pulse" 
          : "border-border bg-surface hover:bg-surface-elevated"
        }
        ${isHovered ? "shadow-board scale-105" : ""}
      `}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Cell content */}
      {cell ? (
        <div 
          className={`
            ${getConeSize(cell.size)} 
            ${getConeGradient(cell.player)} 
            rounded-full shadow-cone
            flex items-center justify-center text-white font-bold text-xs
            transition-transform duration-200
            ${isHovered ? "scale-110" : ""}
          `}
        >
          {cell.size}
        </div>
      ) : (
        /* Empty cell indicator */
        <div className="w-4 h-4 bg-muted/30 rounded-full opacity-50"></div>
      )}

      {/* Valid move indicator */}
      {isValidMove && (
        <div className="absolute inset-0 border-2 border-primary rounded-lg animate-pulse">
          <div className="absolute inset-2 bg-primary/20 rounded"></div>
        </div>
      )}

      {/* Hover effect */}
      {isHovered && !isValidMove && (
        <div className="absolute inset-0 bg-primary/5 rounded-lg"></div>
      )}
    </div>
  );
};