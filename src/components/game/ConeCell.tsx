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

  const getConeGradient = (player: number, isWooden = false) => {
    if (isWooden) {
      return player === 1 ? "bg-wooden-cone-1 shadow-wooden-glow" : "bg-wooden-cone-2 shadow-wooden-glow";
    }
    return player === 1 ? "bg-gradient-player-1 shadow-glow animate-glow-pulse" : "bg-gradient-player-2 shadow-glow animate-glow-pulse";
  };

  const getConeGlow = (player: number) => {
    if (boardTheme === 'wooden') {
      return player === 1 ? "shadow-[0_0_20px_hsl(var(--wooden-cone-1-glow))]" : "shadow-[0_0_20px_hsl(var(--wooden-cone-2-glow))]";
    }
    return "shadow-neon";
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
      {/* Cell content - Triangle Cone */}
      {cell ? (
        <div 
          className={`
            ${getConeSize(cell.size)} 
            ${getConeGradient(cell.player, boardTheme === 'wooden')}
            relative flex items-center justify-center text-white font-bold text-xs
            transition-all duration-500 animate-float
            ${isHovered ? "scale-110 animate-neon-pulse" : ""}
            ${getConeGlow(cell.player)}
          `}
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            filter: `drop-shadow(0 0 ${isHovered ? '16px' : '10px'} currentColor)`,
            animationDelay: `${cell.size * 0.1}s`
          }}
        >
          {/* Triangle gradient overlay */}
          <div 
            className={`absolute inset-0 ${boardTheme === 'wooden' 
              ? 'bg-gradient-to-b from-white/40 via-transparent to-black/20' 
              : 'bg-gradient-radial from-white/30 to-transparent'
            } animate-pulse`}
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          
          {/* Wood texture for wooden theme */}
          {boardTheme === 'wooden' && (
            <div 
              className="absolute inset-0 opacity-30"
              style={{ 
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.1) 2px,
                  rgba(0,0,0,0.1) 4px
                )`
              }}
            />
          )}
          
          {/* Number display - positioned in center of triangle */}
          <span className={`relative z-10 drop-shadow-lg translate-y-2 ${
            boardTheme === 'wooden' ? 'text-wooden-background font-bold' : 'text-white'
          }`}>{cell.size}</span>
          
          {/* Enhanced glow effect */}
          <div 
            className={`absolute inset-0 opacity-60 ${getConeGradient(cell.player, boardTheme === 'wooden')} blur-md animate-glow-pulse`}
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          
          {/* Outer glow ring */}
          <div 
            className={`absolute -inset-1 opacity-40 ${getConeGradient(cell.player, boardTheme === 'wooden')} blur-lg`}
            style={{ clipPath: 'polygon(50% 10%, 10% 90%, 90% 90%)' }}
          />
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