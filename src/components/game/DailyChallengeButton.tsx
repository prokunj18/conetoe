import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { Calendar, Clock, Trophy, Coins, CheckCircle2, Zap, Brain, Crown, Grid3X3, Triangle, X, ChevronRight, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DailyChallengeButtonProps {
  variant: 'conetoe' | 'classic';
}

export const DailyChallengeButton = ({ variant }: DailyChallengeButtonProps) => {
  const navigate = useNavigate();
  const { challenge, loading, getTimeUntilReset } = useDailyChallenge();
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  // Initialize position on mount and handle resize
  useEffect(() => {
    const updatePosition = () => {
      if (dragRef.current) {
        const rect = dragRef.current.getBoundingClientRect();
        const padding = 8;
        
        if (position === null) {
          // Initial position - right side, vertically centered
          setPosition({ 
            x: window.innerWidth - rect.width - padding, 
            y: Math.max(padding, Math.min(window.innerHeight - rect.height - padding, window.innerHeight / 2 - rect.height / 2))
          });
        } else {
          // Clamp existing position within bounds on resize
          setPosition(prev => prev ? {
            x: Math.max(padding, Math.min(window.innerWidth - rect.width - padding, prev.x)),
            y: Math.max(padding, Math.min(window.innerHeight - rect.height - padding, prev.y))
          } : prev);
        }
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [position === null]);

  const handleDragStart = (clientX: number, clientY: number) => {
    if (!position) return;
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY, posX: position.x, posY: position.y };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !dragStartRef.current || !dragRef.current) return;
    
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    const padding = 8;
    
    const newX = Math.max(padding, Math.min(window.innerWidth - dragRef.current.offsetWidth - padding, dragStartRef.current.posX + deltaX));
    const newY = Math.max(padding, Math.min(window.innerHeight - dragRef.current.offsetHeight - padding, dragStartRef.current.posY + deltaY));
    
    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => handleDragEnd();

  if (loading || !challenge) return null;

  const isCorrectMode = challenge.gameMode === variant;
  const difficultyIcons = {
    easy: Zap,
    normal: Brain,
    hard: Crown,
    master: Crown
  };
  const DiffIcon = difficultyIcons[challenge.difficulty];

  const difficultyColors = {
    easy: 'from-emerald-500 to-green-500',
    normal: 'from-blue-500 to-cyan-500',
    hard: 'from-orange-500 to-red-500',
    master: 'from-purple-500 to-pink-500'
  };

  const handleStartChallenge = () => {
    if (challenge.gameMode === 'conetoe') {
      navigate("/game", { 
        state: { 
          difficulty: challenge.difficulty, 
          mode: "ai",
          isDailyChallenge: true 
        } 
      });
    } else {
      navigate("/classic-game", { 
        state: { 
          difficulty: challenge.difficulty, 
          mode: "ai",
          isDailyChallenge: true 
        } 
      });
    }
    setIsExpanded(false);
  };

  const isConetoe = variant === 'conetoe';
  // Conetoe uses play button colors (pink/violet), Classic uses cyan/violet
  const gradientColors = isConetoe 
    ? 'from-pink-500/20 via-violet-500/10 to-purple-500/20' 
    : 'from-cyan-500/20 via-violet-500/10 to-pink-500/20';
  const borderColor = isConetoe ? 'border-pink-500/40' : 'border-cyan-500/40';
  const hoverBorder = isConetoe ? 'hover:border-pink-400/70' : 'hover:border-cyan-400/70';
  const accentColor = isConetoe ? 'text-pink-400' : 'text-cyan-400';
  const pulseGradient = isConetoe 
    ? 'from-pink-500 to-violet-500' 
    : 'from-cyan-500 to-violet-500';
  const buttonGradient = isConetoe
    ? 'from-pink-500 to-violet-500 hover:from-pink-400 hover:to-violet-400'
    : 'from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400';
  const glowColor = isConetoe
    ? 'hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]'
    : 'hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]';

  const positionStyle = position ? { left: position.x, top: position.y } : { right: 16, top: '50%', transform: 'translateY(-50%)' };

  return (
    <div 
      ref={dragRef}
      className={`fixed z-30 ${isDragging ? 'cursor-grabbing' : ''}`}
      style={positionStyle}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Collapsed Button */}
      <div
        className={`transition-all duration-500 ease-out ${isExpanded ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
      >
        {/* Drag Handle */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`absolute -left-6 top-1/2 -translate-y-1/2 p-1 rounded-l-lg bg-gradient-to-br ${gradientColors} border ${borderColor} border-r-0 cursor-grab active:cursor-grabbing opacity-60 hover:opacity-100 transition-opacity`}
        >
          <GripVertical className="w-4 h-4 text-foreground/60" />
        </div>
        <button
          onClick={() => !isDragging && setIsExpanded(true)}
          className={`relative group flex items-center gap-2 px-3 py-3 bg-gradient-to-br ${gradientColors} border ${borderColor} ${hoverBorder} rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 ${glowColor}`}
        >
          {/* Pulse ring effect */}
          {!challenge.completed && (
            <div className={`absolute -inset-1 bg-gradient-to-r ${pulseGradient} rounded-xl opacity-30 blur-sm animate-pulse`} />
          )}
          
          <div className={`relative p-2 bg-gradient-to-r ${pulseGradient} rounded-lg ${!challenge.completed ? 'animate-pulse' : ''}`}>
            <Calendar className="w-5 h-5 text-white" />
          </div>
          
          <div className="relative flex flex-col items-start">
            <span className={`font-bold text-sm ${accentColor}`}>Daily</span>
            <div className="flex items-center gap-1">
              {challenge.completed ? (
                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-[10px] px-1.5 py-0 h-4">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                  Done
                </Badge>
              ) : (
                <span className="text-[10px] text-foreground/60 flex items-center gap-0.5">
                  <Coins className="w-3 h-3 text-amber-400" />
                  +{challenge.bonusReward}
                </span>
              )}
            </div>
          </div>
          
          <ChevronRight className={`w-4 h-4 ${accentColor} group-hover:translate-x-0.5 transition-transform`} />
        </button>
      </div>

      {/* Expanded Panel */}
      <div
        className={`absolute left-0 top-full mt-2 transition-all duration-500 ease-out ${
          isExpanded 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className={`w-72 p-4 bg-gradient-to-br ${gradientColors} rounded-2xl border ${borderColor} backdrop-blur-xl relative overflow-hidden`}>
          {/* Close button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/20 hover:bg-background/40 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${isConetoe ? 'from-pink-500/10 to-violet-500/10' : 'from-cyan-500/10 to-violet-500/10'} blur-xl`} />
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className={`p-2 bg-gradient-to-r ${pulseGradient} rounded-lg ${!challenge.completed ? 'animate-pulse' : ''}`}>
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-bold ${accentColor}`}>Daily Challenge</h3>
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <Clock className="w-3 h-3" />
                <span>Resets in {getTimeUntilReset()}</span>
              </div>
            </div>
          </div>

          {/* Challenge Info */}
          <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
            <Badge variant="outline" className={`${isConetoe ? 'border-pink-500/50 text-pink-400' : 'border-cyan-500/50 text-cyan-400'} gap-1`}>
              {challenge.gameMode === 'conetoe' ? (
                <Triangle className="w-3 h-3" />
              ) : (
                <Grid3X3 className="w-3 h-3" />
              )}
              {challenge.gameMode === 'conetoe' ? 'Conetoe' : 'Classic'}
            </Badge>
            <Badge className={`bg-gradient-to-r ${difficultyColors[challenge.difficulty]} gap-1`}>
              <DiffIcon className="w-3 h-3" />
              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
            </Badge>
            <div className={`flex items-center gap-1 ${accentColor} font-bold text-sm ml-auto`}>
              <Coins className="w-4 h-4" />
              <span>+{challenge.bonusReward}</span>
              <Trophy className="w-4 h-4" />
            </div>
          </div>

          {/* Status or Action */}
          {challenge.completed ? (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 relative z-10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-emerald-400">Completed Today!</span>
            </div>
          ) : (
            <Button
              onClick={handleStartChallenge}
              className={`w-full bg-gradient-to-r ${buttonGradient} ${glowColor} transition-all duration-300 relative z-10`}
            >
              {isCorrectMode ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Start Challenge
                </>
              ) : (
                <>
                  {challenge.gameMode === 'classic' ? <Grid3X3 className="w-4 h-4 mr-2" /> : <Triangle className="w-4 h-4 mr-2" />}
                  Go to {challenge.gameMode === 'classic' ? 'Classic' : 'Conetoe'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
