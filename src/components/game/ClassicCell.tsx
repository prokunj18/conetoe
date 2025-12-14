import { ClassicCellData } from "@/types/classicGame";

interface ClassicCellProps {
  cell: ClassicCellData | null;
  isHovered: boolean;
  isValidMove: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ClassicCell = ({ 
  cell, 
  isHovered, 
  isValidMove, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: ClassicCellProps) => {
  const renderSymbol = () => {
    if (!cell) return null;
    
    if (cell.player === 1) {
      // X symbol with retro neon style
      return (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <line 
              x1="20" y1="20" x2="80" y2="80" 
              stroke="url(#xGradient1)" 
              strokeWidth="12" 
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_hsl(200,100%,60%)]"
            />
            <line 
              x1="80" y1="20" x2="20" y2="80" 
              stroke="url(#xGradient1)" 
              strokeWidth="12" 
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_hsl(200,100%,60%)]"
            />
            <defs>
              <linearGradient id="xGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(200, 100%, 70%)" />
                <stop offset="50%" stopColor="hsl(220, 100%, 60%)" />
                <stop offset="100%" stopColor="hsl(240, 100%, 65%)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    } else {
      // O symbol with retro neon style
      return (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle 
              cx="50" cy="50" r="32" 
              fill="none" 
              stroke="url(#oGradient1)" 
              strokeWidth="12"
              className="drop-shadow-[0_0_10px_hsl(15,100%,55%)]"
            />
            <defs>
              <linearGradient id="oGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(25, 100%, 65%)" />
                <stop offset="50%" stopColor="hsl(15, 100%, 55%)" />
                <stop offset="100%" stopColor="hsl(0, 90%, 55%)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    }
  };

  return (
    <div 
      className={`
        aspect-square rounded-lg flex items-center justify-center cursor-pointer
        transition-all duration-200 ease-in-out relative overflow-hidden
        bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-black/80
        border-2 border-slate-600/50 backdrop-blur-sm
        ${isValidMove ? "border-emerald-400/70 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.3)]" : ""}
        ${isHovered && !cell ? "border-slate-400/70 scale-105 shadow-lg" : ""}
        hover:border-slate-500/80
      `}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Retro grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
            linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)
          `,
          backgroundSize: '10px 10px'
        }}
      />
      
      {/* Cell content */}
      {cell ? (
        <div className={`transform transition-all duration-300 ${isHovered ? "scale-110" : ""}`}>
          {renderSymbol()}
        </div>
      ) : (
        /* Empty cell hover indicator */
        isHovered && (
          <div className="w-8 h-8 rounded-full bg-slate-500/20 border border-slate-400/30 animate-pulse" />
        )
      )}

      {/* Valid move glow */}
      {isValidMove && (
        <div className="absolute inset-0 border-2 border-emerald-400/50 rounded-lg animate-pulse" />
      )}
    </div>
  );
};
