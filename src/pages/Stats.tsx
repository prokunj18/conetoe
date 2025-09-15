import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Target, Zap, Crown } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";

const Stats = () => {
  const navigate = useNavigate();
  
  // Mock stats data - in a real app, this would come from localStorage or a backend
  const [stats] = useState({
    gamesPlayed: 47,
    gamesWon: 32,
    gamesLost: 15,
    winRate: 68,
    bestStreak: 7,
    currentStreak: 3,
    aiWins: { easy: 12, normal: 8, hard: 3, master: 0 },
    totalPlayTime: "12h 34m",
    favoriteMove: "Center First",
    perfectGames: 5
  });

  const achievements = [
    { name: "First Victory", description: "Win your first game", unlocked: true, icon: Trophy },
    { name: "Streak Master", description: "Win 5 games in a row", unlocked: stats.bestStreak >= 5, icon: Zap },
    { name: "AI Destroyer", description: "Beat Hard AI", unlocked: stats.aiWins.hard > 0, icon: Crown },
    { name: "Perfect Player", description: "Win without losing a cone", unlocked: stats.perfectGames > 0, icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="absolute left-4 top-4 text-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-5xl font-bold bg-gradient-neon bg-clip-text text-transparent">
            Player Statistics
          </h1>
          <p className="text-lg text-foreground/80">Your tactical journey through Cone Tactics</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Games Overview */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">Games Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Games:</span>
                <Badge>{stats.gamesPlayed}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Wins:</span>
                <Badge className="bg-green-500/20 text-green-300">{stats.gamesWon}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Losses:</span>
                <Badge className="bg-red-500/20 text-red-300">{stats.gamesLost}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <Badge className="bg-gradient-primary">{stats.winRate}%</Badge>
              </div>
            </div>
          </Card>

          {/* Streaks & Performance */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Best Streak:</span>
                <Badge className="bg-gradient-secondary">{stats.bestStreak}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <Badge>{stats.currentStreak}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Perfect Games:</span>
                <Badge className="bg-gradient-neon">{stats.perfectGames}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Play Time:</span>
                <Badge>{stats.totalPlayTime}</Badge>
              </div>
            </div>
          </Card>

          {/* AI Performance */}
          <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">AI Victories</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Easy AI:</span>
                <Badge>{stats.aiWins.easy}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Normal AI:</span>
                <Badge>{stats.aiWins.normal}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Hard AI:</span>
                <Badge className="bg-gradient-player-2">{stats.aiWins.hard}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Master AI:</span>
                <Badge className="bg-gradient-primary">{stats.aiWins.master}</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="p-6 bg-gradient-glass border border-card-border backdrop-blur-xl">
          <h3 className="text-2xl font-semibold mb-6 text-center">Achievements</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border/50 bg-muted/20 opacity-50"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked ? "bg-gradient-primary" : "bg-muted/50"
                  }`}>
                    <achievement.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium">{achievement.name}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge className="bg-green-500/20 text-green-300 text-xs">Unlocked</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Stats;