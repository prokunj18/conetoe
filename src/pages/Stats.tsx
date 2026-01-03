import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Trophy, Target, Zap, Crown, Star, Lock, Unlock, Flame, 
  Gamepad2, Award, TrendingUp, Sparkles, Gift, CheckCircle2, Coins,
  PartyPopper, CircleDot
} from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { QuestsPanel } from "@/components/game/QuestsPanel";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  claimed: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  rewardType: 'coins' | 'avatar';
  rewardValue: string;
  rewardDisplay: string;
}

const Stats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading, reload } = useProfile();
  const { toast } = useToast();
  const [claimedAchievements, setClaimedAchievements] = useState<string[]>([]);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const stats = {
    gamesPlayed: profile?.total_games || 0,
    gamesWon: profile?.total_wins || 0,
    gamesLost: (profile?.total_games || 0) - (profile?.total_wins || 0),
    winRate: profile?.total_games ? Math.round((profile.total_wins / profile.total_games) * 100) : 0,
    level: profile?.level || 1,
    exp: profile?.exp || 0,
    coins: profile?.coins || 0,
  };

  // Load claimed achievements
  useEffect(() => {
    if (user) {
      loadClaimedAchievements();
    }
  }, [user]);

  const loadClaimedAchievements = async () => {
    const { data } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', user?.id);
    
    if (data) {
      setClaimedAchievements(data.map(a => a.achievement_id));
    }
  };

  const achievements: Achievement[] = [
    // Common achievements - Small coin rewards
    { id: 'first_win', name: 'First Victory', description: 'Win your first game', icon: Trophy, requirement: 1, currentProgress: stats.gamesWon, unlocked: stats.gamesWon >= 1, claimed: claimedAchievements.includes('first_win'), rarity: 'common', rewardType: 'coins', rewardValue: '25', rewardDisplay: '25 Bling' },
    { id: 'getting_started', name: 'Getting Started', description: 'Play 5 games', icon: Gamepad2, requirement: 5, currentProgress: stats.gamesPlayed, unlocked: stats.gamesPlayed >= 5, claimed: claimedAchievements.includes('getting_started'), rarity: 'common', rewardType: 'coins', rewardValue: '30', rewardDisplay: '30 Bling' },
    { id: 'coin_collector', name: 'Coin Collector', description: 'Earn 100 bling', icon: Sparkles, requirement: 100, currentProgress: stats.coins, unlocked: stats.coins >= 100, claimed: claimedAchievements.includes('coin_collector'), rarity: 'common', rewardType: 'coins', rewardValue: '20', rewardDisplay: '20 Bling' },
    
    // Rare achievements - Medium coin rewards
    { id: 'veteran', name: 'Veteran Player', description: 'Play 25 games', icon: Star, requirement: 25, currentProgress: stats.gamesPlayed, unlocked: stats.gamesPlayed >= 25, claimed: claimedAchievements.includes('veteran'), rarity: 'rare', rewardType: 'coins', rewardValue: '75', rewardDisplay: '75 Bling' },
    { id: 'winner', name: 'Consistent Winner', description: 'Win 10 games', icon: Award, requirement: 10, currentProgress: stats.gamesWon, unlocked: stats.gamesWon >= 10, claimed: claimedAchievements.includes('winner'), rarity: 'rare', rewardType: 'coins', rewardValue: '100', rewardDisplay: '100 Bling' },
    { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: TrendingUp, requirement: 5, currentProgress: stats.level, unlocked: stats.level >= 5, claimed: claimedAchievements.includes('level_5'), rarity: 'rare', rewardType: 'coins', rewardValue: '80', rewardDisplay: '80 Bling' },
    
    // Epic achievements - Large coin rewards + avatar unlock
    { id: 'champion', name: 'Champion', description: 'Win 50 games', icon: Crown, requirement: 50, currentProgress: stats.gamesWon, unlocked: stats.gamesWon >= 50, claimed: claimedAchievements.includes('champion'), rarity: 'epic', rewardType: 'coins', rewardValue: '250', rewardDisplay: '250 Bling' },
    { id: 'dedicated', name: 'Dedicated Player', description: 'Play 100 games', icon: Flame, requirement: 100, currentProgress: stats.gamesPlayed, unlocked: stats.gamesPlayed >= 100, claimed: claimedAchievements.includes('dedicated'), rarity: 'epic', rewardType: 'coins', rewardValue: '200', rewardDisplay: '200 Bling' },
    { id: 'level_10', name: 'Elite Player', description: 'Reach level 10', icon: Zap, requirement: 10, currentProgress: stats.level, unlocked: stats.level >= 10, claimed: claimedAchievements.includes('level_10'), rarity: 'epic', rewardType: 'coins', rewardValue: '300', rewardDisplay: '300 Bling' },
    
    // Legendary achievements - Huge rewards
    { id: 'legend', name: 'Living Legend', description: 'Win 100 games', icon: Crown, requirement: 100, currentProgress: stats.gamesWon, unlocked: stats.gamesWon >= 100, claimed: claimedAchievements.includes('legend'), rarity: 'legendary', rewardType: 'coins', rewardValue: '500', rewardDisplay: '500 Bling' },
    { id: 'rich', name: 'Bling Mogul', description: 'Accumulate 1000 bling', icon: Sparkles, requirement: 1000, currentProgress: stats.coins, unlocked: stats.coins >= 1000, claimed: claimedAchievements.includes('rich'), rarity: 'legendary', rewardType: 'coins', rewardValue: '1000', rewardDisplay: '1000 Bling' },
    { id: 'master', name: 'Grand Master', description: 'Reach level 20', icon: Target, requirement: 20, currentProgress: stats.level, unlocked: stats.level >= 20, claimed: claimedAchievements.includes('master'), rarity: 'legendary', rewardType: 'coins', rewardValue: '750', rewardDisplay: '750 Bling' },
  ];

  const claimableCount = achievements.filter(a => a.unlocked && !a.claimed).length;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const achievementProgress = (unlockedCount / achievements.length) * 100;

  const claimAchievement = async (achievement: Achievement) => {
    if (!user || claiming || achievement.claimed || !achievement.unlocked) return;
    
    setClaiming(achievement.id);
    
    const { data, error } = await supabase.rpc('claim_achievement', {
      p_achievement_id: achievement.id,
      p_reward_type: achievement.rewardType,
      p_reward_value: achievement.rewardValue
    });

    const result = data as { success?: boolean; error?: string } | null;

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to claim achievement',
        variant: 'destructive'
      });
    } else if (result?.success) {
      // Fire confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: achievement.rarity === 'legendary' ? ['#fbbf24', '#f59e0b', '#d97706'] : 
                achievement.rarity === 'epic' ? ['#a855f7', '#9333ea', '#7e22ce'] :
                achievement.rarity === 'rare' ? ['#3b82f6', '#2563eb', '#1d4ed8'] :
                ['#71717a', '#52525b', '#3f3f46']
      });
      
      toast({
        title: '🎉 Achievement Claimed!',
        description: `You received ${achievement.rewardDisplay}!`,
      });
      
      setClaimedAchievements(prev => [...prev, achievement.id]);
      reload();
    }
    
    setClaiming(null);
  };

  const claimAllAchievements = async () => {
    const claimable = achievements.filter(a => a.unlocked && !a.claimed);
    
    for (const achievement of claimable) {
      await claimAchievement(achievement);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-zinc-400 to-zinc-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-amber-400 to-amber-600';
      default: return 'from-zinc-400 to-zinc-600';
    }
  };

  const getRarityBorder = (rarity: string, unlocked: boolean, claimed: boolean) => {
    if (!unlocked) return 'border-border/30';
    if (claimed) return 'border-green-500/50';
    switch (rarity) {
      case 'common': return 'border-zinc-400 hover:border-zinc-300';
      case 'rare': return 'border-blue-400 hover:border-blue-300';
      case 'epic': return 'border-purple-400 hover:border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      case 'legendary': return 'border-amber-400 hover:border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.4)]';
      default: return 'border-border';
    }
  };

  const getRarityGlow = (rarity: string, isHovered: boolean) => {
    if (!isHovered) return '';
    switch (rarity) {
      case 'legendary': return 'shadow-[0_0_40px_rgba(251,191,36,0.5)]';
      case 'epic': return 'shadow-[0_0_30px_rgba(168,85,247,0.4)]';
      case 'rare': return 'shadow-[0_0_20px_rgba(59,130,246,0.3)]';
      default: return 'shadow-[0_0_15px_rgba(113,113,122,0.2)]';
    }
  };

  // Stars background
  const renderStars = () => {
    return Array.from({ length: 100 }).map((_, i) => (
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

  // Shooting stars
  const renderShootingStars = () => (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + i * 15}%`,
            animation: `shooting-star ${3 + i}s linear infinite`,
            animationDelay: `${i * 2}s`
          }}
        />
      ))}
    </>
  );

  // Nebula effect
  const renderNebula = () => (
    <>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse-soft" />
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
        {renderShootingStars()}
        {renderNebula()}
      </div>

      {/* Custom CSS for shooting stars */}
      <style>{`
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateX(300px) translateY(300px); opacity: 0; }
        }
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.3); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.6); }
        }
      `}</style>
      
      <div className="max-w-5xl w-full space-y-6 relative z-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-down">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-foreground hover:text-primary hover:bg-card/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3">
            {claimableCount > 0 && (
              <Button 
                onClick={claimAllAchievements}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 animate-pulse"
              >
                <Gift className="w-4 h-4 mr-2" />
                Claim All ({claimableCount})
              </Button>
            )}
            <Badge className="px-4 py-2 bg-gradient-primary">
              Level {stats.level}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Player Statistics
          </h1>
          <p className="text-lg text-foreground/60">Your tactical journey through Conetoe</p>
        </div>

        {/* Interactive Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 animate-scale-in">
          {/* Games Card */}
          <Card 
            className="p-5 bg-gradient-glass border border-card-border backdrop-blur-xl hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
            onMouseEnter={() => setHoveredCard('games')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-primary rounded-lg group-hover:animate-bounce">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">Total Games</span>
            </div>
            <div className="text-3xl font-bold">{stats.gamesPlayed}</div>
          </Card>

          {/* Wins Card */}
          <Card 
            className="p-5 bg-gradient-glass border border-card-border backdrop-blur-xl hover:border-green-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg group-hover:animate-bounce">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">Wins</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.gamesWon}</div>
          </Card>

          {/* Win Rate Card */}
          <Card 
            className="p-5 bg-gradient-glass border border-card-border backdrop-blur-xl hover:border-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover:animate-bounce">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">Win Rate</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats.winRate}%</div>
          </Card>

          {/* Bling Card */}
          <Card 
            className="p-5 bg-gradient-glass border border-amber-500/30 backdrop-blur-xl hover:border-amber-500/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
            style={{ animation: 'card-glow 3s ease-in-out infinite' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg group-hover:animate-bounce">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">Bling</span>
            </div>
            <div className="text-3xl font-bold text-amber-400">{stats.coins}</div>
          </Card>
        </div>

        {/* Experience Progress */}
        <Card className="p-5 bg-gradient-glass border border-card-border backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Experience Progress</span>
            </div>
            <Badge className="bg-card/50">{stats.exp} / {stats.level * 100} XP</Badge>
          </div>
          <Progress value={(stats.exp / (stats.level * 100)) * 100} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {stats.level * 100 - stats.exp} XP until Level {stats.level + 1}
          </p>
        </Card>

        {/* Quests Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <QuestsPanel />
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
                <p className="text-sm text-muted-foreground">
                  {unlockedCount} unlocked • {claimedAchievements.length} claimed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {claimableCount > 0 && (
                <Badge className="bg-amber-500/20 text-amber-400 animate-pulse">
                  <Gift className="w-3 h-3 mr-1" />
                  {claimableCount} to claim!
                </Badge>
              )}
              <Badge className="bg-card/50 px-4 py-2">
                {Math.round(achievementProgress)}%
              </Badge>
            </div>
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
                  <div className="flex-1 h-px bg-border/30" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {rarityAchievements.map((achievement) => {
                    const isClaimable = achievement.unlocked && !achievement.claimed;
                    const isHovered = hoveredCard === achievement.id;
                    
                    return (
                      <div
                        key={achievement.id}
                        onMouseEnter={() => setHoveredCard(achievement.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => isClaimable && claimAchievement(achievement)}
                        className={`
                          p-4 rounded-xl border-2 transition-all duration-300
                          ${getRarityBorder(achievement.rarity, achievement.unlocked, achievement.claimed)}
                          ${getRarityGlow(achievement.rarity, isHovered && achievement.unlocked)}
                          ${achievement.unlocked 
                            ? isClaimable 
                              ? 'bg-card/50 hover:scale-105 cursor-pointer' 
                              : 'bg-card/30'
                            : 'bg-card/10 opacity-50'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            p-2 rounded-lg shrink-0 transition-all duration-300
                            ${achievement.unlocked 
                              ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}` 
                              : 'bg-muted/30'
                            }
                            ${isClaimable && isHovered ? 'scale-110 rotate-12' : ''}
                          `}>
                            {achievement.claimed ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : achievement.unlocked ? (
                              <achievement.icon className="w-5 h-5 text-white" />
                            ) : (
                              <Lock className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold truncate">{achievement.name}</h4>
                              {achievement.claimed && (
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                            
                            {/* Reward Display */}
                            <div className={`
                              mt-2 flex items-center gap-1 text-xs
                              ${achievement.claimed ? 'text-green-400' : isClaimable ? 'text-amber-400' : 'text-muted-foreground'}
                            `}>
                              {achievement.claimed ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Claimed!</span>
                                </>
                              ) : (
                                <>
                                  <Gift className="w-3 h-3" />
                                  <span>{achievement.rewardDisplay}</span>
                                  {isClaimable && (
                                    <Badge className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 animate-pulse">
                                      CLAIM
                                    </Badge>
                                  )}
                                </>
                              )}
                            </div>
                            
                            {!achievement.unlocked && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progress</span>
                                  <span>{Math.min(achievement.currentProgress, achievement.requirement)}/{achievement.requirement}</span>
                                </div>
                                <Progress 
                                  value={Math.min((achievement.currentProgress / achievement.requirement) * 100, 100)} 
                                  className="h-1" 
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Claiming overlay */}
                        {claiming === achievement.id && (
                          <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center">
                            <PartyPopper className="w-8 h-8 text-amber-400 animate-bounce" />
                          </div>
                        )}
                      </div>
                    );
                  })}
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