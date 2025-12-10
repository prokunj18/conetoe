import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Target, Zap, Crown, Star, Lock, Unlock, Flame, Gamepad2, Clock, Award, TrendingUp, Sparkles } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const Stats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  
  const stats = {
    gamesPlayed: profile?.total_games || 0,
    gamesWon: profile?.total_wins || 0,
    gamesLost: (profile?.total_games || 0) - (profile?.total_wins || 0),
    winRate: profile?.total_games ? Math.round((profile.total_wins / profile.total_games) * 100) : 0,
    level: profile?.level || 1,
    exp: profile?.exp || 0,
    coins: profile?.coins || 0,
  };

  const achievements: Achievement[] = [
    // Common achievements
    { id: 'first_win', name: 'First Victory', description: 'Win your first game', icon: Trophy, requirement: 1, currentProgress: stats.gamesWon, unlocked: stats.gamesWon >= 1, rarity: 'common' },
    { id: 'getting_started', name: 'Getting Started', description: 'Play 5 games', icon: Gamepad2, requirement: 5, currentProgress: stats.gamesPlayed, unlocked: stats.gamesPlayed >= 5, rarity: 'common' },
    { id: 'coin_collector', name: 'Coin Collector', description: 'Earn 100 bling', icon: Sparkles, requirement: 100, currentProgress: stats.coins, unlocked: stats.coins >= 100, rarity: 'common' },
    
    // Rare achievements
    { id: 'veteran', name: 'Veteran Player', description: 'Play 25 games', icon: Star, requirement: 25, currentProgress: stats.gamesPlayed, unlocked: stats.gamesPlayed >= 25, rarity: 'rare' },
    { id: 'winner', name: 'Consistent Winner', description: 'Win 10 games', icon: Award, requirement: 10, currentProgress: stats.gamesWon, unlocked: stats.gamesWon >= 10, rarity: 'rare' },
    { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: TrendingUp, requirement: 5, currentProgress: stats.level, unlocked: stats.level >= 5, rarity: 'rare' },
    
    // Epic achievements
    { id: 'champion', name: 'Champion', description: 'Win 50 games', icon: Crown, requirement: 50, currentProgress: stats.gamesWon, unlocked: stats.gamesWon >= 50, rarity: 'epic' },
    { id: 'dedicated', name: 'Dedicated Player', description: 'Play 100 games', icon: Flame, requirement: 100, currentProgress: stats.gamesPlayed, unlocked: stats.gamesPlayed >= 100, rarity: 'epic' },
    { id: 'level_10', name: 'Elite Player', description: 'Reach level 10', icon: Zap, requirement: 10, currentProgress: stats.level, unlocked: stats.level >= 10, rarity: 'epic' },
    
    // Legendary achievements
    { id: 'legend', name: 'Living Legend', description: 'Win 100 games', icon: Crown, requirement: 100, currentProgress: stats.gamesWon, unlocked: stats.gamesWon >= 100, rarity: 'legendary' },
    { id: 'rich', name: 'Bling Mogul', description: 'Accumulate 1000 bling', icon: Sparkles, requirement: 1000, currentProgress: stats.coins, unlocked: stats.coins >= 1000, rarity: 'legendary' },
    { id: 'master', name: 'Grand Master', description: 'Reach level 20', icon: Target, requirement: 20, currentProgress: stats.level, unlocked: stats.level >= 20, rarity: 'legendary' },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const achievementProgress = (unlockedCount / achievements.length) * 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-zinc-400 to-zinc-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-amber-400 to-amber-600';
      default: return 'from-zinc-400 to-zinc-600';
    }
  };

  const getRarityBorder = (rarity: string, unlocked: boolean) => {
    if (!unlocked) return 'border-border/30';
    switch (rarity) {
      case 'common': return 'border-zinc-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]';
      default: return 'border-border';
    }
  };

  // Stars background
  const renderStars = () => {
    return Array.from({ length: 80 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse-soft"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          opacity: Math.random() * 0.8 + 0.2
        }}
      />
    ));
  };

  // Nebula effect
  const renderNebula = () => (
    <>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
    </>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <AnimatedBackground />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {renderStars()}
          {renderNebula()}
        </div>
        <Card className="p-8 bg-gradient-glass border border-card-border backdrop-blur-xl text-center space-y-4 animate-scale-in relative z-10">
          <Lock className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Stats Locked</h2>
          <p className="text-muted-foreground">Sign in to view your stats and achievements</p>
          <Button onClick={() => navigate("/auth")} className="bg-gradient-primary">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Cosmos Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderStars()}
        {renderNebula()}
      </div>
      
      <div className="max-w-5xl w-full space-y-6 relative z-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-down">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-foreground hover:text-primary hover:bg-card/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          
          <Badge className="px-4 py-2 bg-gradient-primary animate-glow-pulse">
            Level {stats.level}
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-neon bg-clip-text text-transparent">
            Player Statistics
          </h1>
          <p className="text-lg text-foreground/60">Your tactical journey through Conetoe</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 animate-scale-in">
          {/* Games Overview */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl hover:border-primary/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Games Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Games</span>
                <Badge className="bg-card/50">{stats.gamesPlayed}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Wins</span>
                <Badge className="bg-green-500/20 text-green-400">{stats.gamesWon}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Losses</span>
                <Badge className="bg-red-500/20 text-red-400">{stats.gamesLost}</Badge>
              </div>
            </div>
          </Card>

          {/* Win Rate */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl hover:border-primary/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-secondary rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Performance</h3>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-neon bg-clip-text text-transparent">
                  {stats.winRate}%
                </div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
              <Progress value={stats.winRate} className="h-2" />
            </div>
          </Card>

          {/* Currency */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl hover:border-primary/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-player-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Bling Balance</h3>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-amber-400 animate-glow-pulse">
                {stats.coins}
              </div>
              <p className="text-sm text-muted-foreground">Total Bling</p>
            </div>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg animate-float">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Achievements</h3>
                <p className="text-sm text-muted-foreground">{unlockedCount} of {achievements.length} unlocked</p>
              </div>
            </div>
            <Badge className="bg-card/50 px-4 py-2">
              {Math.round(achievementProgress)}% Complete
            </Badge>
          </div>

          <Progress value={achievementProgress} className="h-2 mb-6" />

          {/* Achievement Categories */}
          {['legendary', 'epic', 'rare', 'common'].map((rarity) => {
            const rarityAchievements = achievements.filter(a => a.rarity === rarity);
            const rarityLabel = rarity.charAt(0).toUpperCase() + rarity.slice(1);
            
            return (
              <div key={rarity} className="mb-6 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getRarityColor(rarity)}`} />
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{rarityLabel}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {rarityAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-300
                        ${getRarityBorder(achievement.rarity, achievement.unlocked)}
                        ${achievement.unlocked 
                          ? 'bg-card/50 hover:scale-105' 
                          : 'bg-card/20 opacity-60'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          p-2 rounded-lg shrink-0
                          ${achievement.unlocked 
                            ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}` 
                            : 'bg-muted/30'
                          }
                        `}>
                          {achievement.unlocked ? (
                            <achievement.icon className="w-5 h-5 text-white" />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold truncate">{achievement.name}</h4>
                            {achievement.unlocked && (
                              <Unlock className="w-3 h-3 text-green-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                          {!achievement.unlocked && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{achievement.currentProgress}/{achievement.requirement}</span>
                              </div>
                              <Progress 
                                value={(achievement.currentProgress / achievement.requirement) * 100} 
                                className="h-1" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};

export default Stats;