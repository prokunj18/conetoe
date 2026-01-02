import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { Calendar, Clock, Trophy, Coins, CheckCircle2, Zap, Brain, Crown, Grid3X3, Triangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DailyChallengeCardProps {
  variant: 'conetoe' | 'classic';
}

export const DailyChallengeCard = ({ variant }: DailyChallengeCardProps) => {
  const navigate = useNavigate();
  const { challenge, loading, getTimeUntilReset } = useDailyChallenge();

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
  };

  // Conetoe styling
  if (variant === 'conetoe') {
    return (
      <div className="w-full p-4 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 rounded-2xl border border-amber-500/30 backdrop-blur-sm relative overflow-hidden group hover:border-amber-400/50 transition-all duration-300">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg animate-pulse">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-amber-400">Daily Challenge</h3>
              <div className="flex items-center gap-1 text-xs text-foreground/60">
                <Clock className="w-3 h-3" />
                <span>Resets in {getTimeUntilReset()}</span>
              </div>
            </div>
          </div>
          {challenge.completed && (
            <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Done
            </Badge>
          )}
        </div>

        {/* Challenge Info */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 gap-1">
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
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Coins className="w-4 h-4" />
            <span>+{challenge.bonusReward}</span>
            <Trophy className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleStartChallenge}
          disabled={challenge.completed}
          className={`w-full ${
            challenge.completed 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]'
          } transition-all duration-300`}
        >
          {challenge.completed ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completed Today
            </>
          ) : isCorrectMode ? (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Start Challenge
            </>
          ) : (
            <>
              <Grid3X3 className="w-4 h-4 mr-2" />
              Go to {challenge.gameMode === 'classic' ? 'Classic' : 'Conetoe'}
            </>
          )}
        </Button>
      </div>
    );
  }

  // Classic styling
  return (
    <div className="w-full p-4 bg-gradient-to-br from-cyan-500/10 via-violet-500/5 to-pink-500/10 rounded-2xl border border-cyan-500/30 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-400/50 transition-all duration-300">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg animate-pulse">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Daily Challenge</h3>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Resets in {getTimeUntilReset()}</span>
            </div>
          </div>
        </div>
        {challenge.completed && (
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Done
          </Badge>
        )}
      </div>

      {/* Challenge Info */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 gap-1">
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
        </div>
        <div className="flex items-center gap-1 text-cyan-400 font-bold">
          <Coins className="w-4 h-4" />
          <span>+{challenge.bonusReward}</span>
          <Trophy className="w-4 h-4 ml-1" />
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleStartChallenge}
        disabled={challenge.completed}
        className={`w-full ${
          challenge.completed 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]'
        } transition-all duration-300`}
      >
        {challenge.completed ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completed Today
          </>
        ) : isCorrectMode ? (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Start Challenge
          </>
        ) : (
          <>
            <Triangle className="w-4 h-4 mr-2" />
            Go to {challenge.gameMode === 'classic' ? 'Classic' : 'Conetoe'}
          </>
        )}
      </Button>
    </div>
  );
};
