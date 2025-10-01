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
  const { boardTheme, coneStyle } = useSettings();

  const getConeSize = (size: number) => {
    switch (size) {
      case 1: return "w-6 h-6";
      case 2: return "w-8 h-8";
      case 3: return "w-10 h-10";
      case 4: return "w-12 h-12";
      default: return "w-6 h-6";
    }
  };

  const getConeStyleGradient = (player: number) => {
    const styleMap = {
      classic: player === 1 
        ? "bg-gradient-to-br from-cyan-400 to-blue-600" 
        : "bg-gradient-to-br from-pink-500 to-purple-600",
      fire: player === 1 
        ? "bg-gradient-to-br from-red-500 to-orange-600" 
        : "bg-gradient-to-br from-yellow-400 to-amber-600",
      emerald: player === 1 
        ? "bg-gradient-to-br from-green-500 to-emerald-700" 
        : "bg-gradient-to-br from-teal-400 to-cyan-600",
      galaxy: player === 1 
        ? "bg-gradient-to-br from-purple-500 to-violet-700" 
        : "bg-gradient-to-br from-pink-500 to-rose-600",
      golden: player === 1 
        ? "bg-gradient-to-br from-yellow-400 to-amber-600" 
        : "bg-gradient-to-br from-amber-500 to-orange-700",
      arctic: player === 1 
        ? "bg-gradient-to-br from-blue-400 to-blue-600" 
        : "bg-gradient-to-br from-sky-200 to-cyan-400",
      shadow: player === 1 
        ? "bg-gradient-to-br from-gray-700 to-gray-900" 
        : "bg-gradient-to-br from-slate-600 to-gray-700",
      rainbow: player === 1 
        ? "bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500" 
        : "bg-gradient-to-br from-pink-500 via-purple-500 via-blue-500 to-cyan-500",
      chrome: player === 1 
        ? "bg-gradient-to-br from-gray-300 to-gray-500" 
        : "bg-gradient-to-br from-slate-400 to-gray-600",
      plasma: player === 1 
        ? "bg-gradient-to-br from-pink-500 to-purple-600" 
        : "bg-gradient-to-br from-violet-500 to-indigo-600"
    };
    return styleMap[coneStyle] || styleMap.classic;
  };

  const getConeGradient = (player: number, isWooden = false) => {
    if (isWooden) {
      return player === 1 ? "bg-wooden-cone-1 shadow-wooden-glow" : "bg-wooden-cone-2 shadow-wooden-glow";
    }
    return `${getConeStyleGradient(player)} shadow-glow animate-glow-pulse`;
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
      {/* Cell content - Modern Triangle Cone */}
      {cell ? (
        <div 
          className={`
            ${getConeSize(cell.size)} 
            ${getConeGradient(cell.player, boardTheme === 'wooden')}
            relative flex items-center justify-center text-white font-bold text-xs
            transition-all duration-300 transform-gpu
            ${isHovered ? "scale-110" : ""}
          `}
          style={{
            clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
            filter: `drop-shadow(0 ${isHovered ? '8px' : '4px'} ${isHovered ? '20px' : '12px'} rgba(0,0,0,0.4))`,
            willChange: 'transform'
          }}
        >
          {/* Modern gradient overlay */}
          <div 
            className={`absolute inset-0 ${boardTheme === 'wooden' 
              ? 'bg-gradient-to-b from-wooden-light/60 via-wooden-primary/40 to-wooden-dark/60' 
              : 'bg-gradient-to-br from-white/40 via-transparent to-black/20'
            }`}
            style={{ clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)' }}
          />
          
          {/* Enhanced textures based on cone style */}
          {!boardTheme.includes('wooden') && (
            <>
              {/* Metallic shine for chrome */}
              {coneStyle === 'chrome' && (
                <div 
                  className="absolute inset-0 opacity-60"
                  style={{ 
                    clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                    backgroundImage: `
                      linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%),
                      repeating-linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)
                    `
                  }}
                />
              )}
              
              {/* Fire animation texture */}
              {coneStyle === 'fire' && (
                <div 
                  className="absolute inset-0 opacity-40 animate-pulse"
                  style={{ 
                    clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                    backgroundImage: `
                      radial-gradient(circle at 50% 80%, rgba(255,100,0,0.4) 0%, transparent 60%),
                      radial-gradient(circle at 30% 70%, rgba(255,200,0,0.3) 0%, transparent 50%)
                    `
                  }}
                />
              )}

              {/* Crystalline texture for arctic/emerald */}
              {(coneStyle === 'arctic' || coneStyle === 'emerald') && (
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{ 
                    clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                    backgroundImage: `
                      repeating-linear-gradient(30deg, transparent 0%, rgba(255,255,255,0.2) 2px, transparent 4px),
                      repeating-linear-gradient(-30deg, transparent 0%, rgba(255,255,255,0.1) 2px, transparent 6px)
                    `
                  }}
                />
              )}

              {/* Plasma energy effect */}
              {coneStyle === 'plasma' && (
                <div 
                  className="absolute inset-0 opacity-50 animate-pulse"
                  style={{ 
                    clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                    backgroundImage: `
                      radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%),
                      conic-gradient(from 0deg, rgba(255,0,255,0.2), rgba(0,255,255,0.2), rgba(255,0,255,0.2))
                    `
                  }}
                />
              )}

              {/* Galaxy swirl effect */}
              {coneStyle === 'galaxy' && (
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{ 
                    clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                    backgroundImage: `
                      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 40%),
                      conic-gradient(from 45deg, transparent, rgba(255,255,255,0.1), transparent)
                    `
                  }}
                />
              )}
            </>
          )}
          
          {/* Enhanced wood texture */}
          {boardTheme === 'wooden' && (
            <>
              <div 
                className="absolute inset-0 opacity-25"
                style={{ 
                  clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                  backgroundImage: `
                    repeating-linear-gradient(
                      45deg,
                      transparent 0px,
                      rgba(0,0,0,0.15) 1px,
                      transparent 2px,
                      transparent 6px
                    ),
                    repeating-linear-gradient(
                      -45deg,
                      transparent 0px,
                      rgba(255,255,255,0.05) 1px,
                      transparent 2px,
                      transparent 8px
                    )
                  `
                }}
              />
              <div 
                className="absolute inset-0 opacity-20"
                style={{ 
                  clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                  backgroundImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, transparent 70%)'
                }}
              />
            </>
          )}
          
          
          {/* Subtle inner glow */}
          {isHovered && (
            <div 
              className={`absolute inset-1 opacity-30 ${getConeGradient(cell.player, boardTheme === 'wooden')} blur-sm`}
              style={{ clipPath: 'polygon(50% 10%, 10% 90%, 90% 90%)' }}
            />
          )}
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