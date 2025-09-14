import { CellData } from "@/types/game";
import { useSettings } from "@/contexts/SettingsContext";

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
  const { boardTheme } = useSettings();

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

  const getThemeClasses = () => {
    if (boardTheme === 'wooden') {
      return {
        cell: "bg-gradient-wooden border-wooden-border hover:shadow-wooden",
        validMove: "border-wooden-accent bg-wooden-accent/20 shadow-wooden",
        hover: "shadow-wooden scale-105"
      };
    }
    return {
      cell: "bg-gradient-board border-border hover:bg-surface-elevated hover:shadow-vibrant",
      validMove: "border-primary bg-primary/10 shadow-vibrant animate-pulse",
      hover: "shadow-vibrant scale-105"
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <div 
      className={`
        aspect-square border-2 rounded-xl flex items-center justify-center cursor-pointer
        transition-all duration-300 relative overflow-hidden backdrop-blur-sm
        ${isValidMove 
          ? themeClasses.validMove
          : themeClasses.cell
        }
        ${isHovered ? themeClasses.hover : ""}
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
            rounded-full shadow-cone border-2 border-white/20
            flex items-center justify-center text-white font-bold text-xs
            transition-all duration-300 relative overflow-hidden
            ${isHovered ? "scale-110 shadow-vibrant" : ""}
            ${boardTheme === 'wooden' ? 'shadow-wooden' : 'shadow-glow'}
          `}
        >
          <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent rounded-full"></div>
          <span className="relative z-10 drop-shadow-lg">{cell.size}</span>
          {/* Cone rim effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent rounded-full"></div>
        </div>
      ) : (
        /* Empty cell indicator */
        <div className={`w-4 h-4 rounded-full opacity-40 transition-all ${
          boardTheme === 'wooden' ? 'bg-wooden-accent/30' : 'bg-primary/30'
        }`}></div>
      )}

      {/* Valid move indicator */}
      {isValidMove && (
        <div className={`absolute inset-0 border-2 rounded-xl animate-pulse ${
          boardTheme === 'wooden' ? 'border-wooden-accent' : 'border-primary'
        }`}>
          <div className={`absolute inset-2 rounded-lg ${
            boardTheme === 'wooden' ? 'bg-wooden-accent/20' : 'bg-primary/20'
          }`}></div>
        </div>
      )}

      {/* Hover effect */}
      {isHovered && !isValidMove && (
        <div className={`absolute inset-0 rounded-xl ${
          boardTheme === 'wooden' ? 'bg-wooden-accent/10' : 'bg-primary/5'
        }`}></div>
      )}
    </div>
  );
};