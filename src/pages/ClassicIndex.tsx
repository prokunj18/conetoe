import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Settings, Brain, Users, Zap, Crown, BookOpen, LogIn, BarChart3, Grid3X3, Triangle, ArrowLeftRight } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BlingCurrency } from "@/components/ui/BlingCurrency";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DailyChallengeButton } from "@/components/game/DailyChallengeButton";

const avatarOptions = [
  { id: 'avatar1', emoji: '🤖' },
  { id: 'avatar2', emoji: '👨‍🚀' },
  { id: 'avatar3', emoji: '⚔️' },
  { id: 'avatar4', emoji: '🧙' },
  { id: 'avatar5', emoji: '🥷' },
  { id: 'avatar6', emoji: '🏴‍☠️' },
  { id: 'avatar7', emoji: '🔬' },
  { id: 'avatar8', emoji: '🧭' },
];

const ClassicIndex = () => {
  const navigate = useNavigate();
  const { animationsEnabled } = useSettings();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [showPlayDialog, setShowPlayDialog] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "normal" | "hard" | "master">("normal");

  const difficulties = [
    { 
      id: "easy" as const, 
      name: "Easy", 
      icon: Zap, 
      description: "Perfect for beginners",
      color: "bg-gradient-to-r from-cyan-500 to-teal-500" 
    },
    { 
      id: "normal" as const, 
      name: "Normal", 
      icon: Brain, 
      description: "Balanced challenge",
      color: "bg-gradient-to-r from-violet-500 to-purple-500" 
    },
    { 
      id: "hard" as const, 
      name: "Hard", 
      icon: Crown, 
      description: "Strategic AI",
      color: "bg-gradient-to-r from-pink-500 to-rose-500" 
    },
    { 
      id: "master" as const, 
      name: "Master", 
      icon: Crown, 
      description: "Perfect strategy",
      color: "bg-gradient-to-r from-amber-500 to-orange-500" 
    },
  ];

  const startAIGame = () => {
    if (!user) {
      toast("Playing without login - progress won't be saved", {
        description: "Sign in to save your stats and earn bling!"
      });
    }
    setShowPlayDialog(false);
    navigate("/classic-game", { state: { difficulty: selectedDifficulty, mode: "ai" } });
  };

  const startDuelGame = () => {
    if (!user) {
      toast("Playing without login - progress won't be saved", {
        description: "Sign in to save your stats and earn bling!"
      });
    }
    setShowPlayDialog(false);
    navigate("/classic-game", { state: { mode: "local" } });
  };

  // Retro grid pattern
  const renderRetroGrid = () => {
    return (
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    );
  };

  // Floating particles with cyan and violet colors
  const renderParticles = () => {
    return Array.from({ length: 60 }).map((_, i) => {
      const isViolet = i % 2 === 0;
      return (
        <div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${isViolet ? 'bg-violet-400/40' : 'bg-cyan-400/40'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`
          }}
        />
      );
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Cool aurora effect background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Retro Grid Background */}
        {renderRetroGrid()}
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {renderParticles()}
        </div>

        {/* Neon border glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-violet-500/30 to-transparent" />
        </div>

        {/* Top Left Controls - Gamemode Switch & Account */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {/* Gamemode Switch Button */}
          <Button
            onClick={() => navigate("/")}
            className="group relative overflow-hidden bg-gradient-to-r from-violet-600/20 to-pink-600/20 border border-violet-500/40 hover:border-violet-400/70 backdrop-blur-md px-4 py-2 gap-2 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            <Triangle className="w-4 h-4 text-violet-400 group-hover:rotate-180 transition-transform duration-500" />
            <ArrowLeftRight className="w-4 h-4 text-slate-300 group-hover:scale-110 transition-transform duration-300" />
            <span className="hidden sm:inline text-sm font-medium bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Conetoe</span>
          </Button>

          {/* Account Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => user ? navigate("/account") : navigate("/auth")}
            className="bg-slate-900/60 backdrop-blur-sm hover:bg-slate-800/80 border border-slate-600/30 hover:border-cyan-500/50 hover:scale-105 transition-all duration-300 w-10 h-10"
          >
            {user && profile ? (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-violet-600">
                  {avatarOptions.find(a => a.id === profile.avatar)?.emoji || '🤖'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <LogIn className="w-5 h-5 text-cyan-400" />
            )}
          </Button>
        </div>

        <div className="max-w-md w-full flex flex-col items-center space-y-6 relative z-10">
          {/* Title Section - Cool Aesthetic */}
          <div className={`text-center space-y-4 ${animationsEnabled ? 'animate-fade-in' : ''}`}>
            <div className="relative">
              {/* X and O decorations with glow */}
              <div className="absolute -left-14 top-1/2 -translate-y-1/2 text-5xl font-bold text-cyan-400/40 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse">X</div>
              <div className="absolute -right-14 top-1/2 -translate-y-1/2 text-5xl font-bold text-violet-400/40 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-pulse" style={{ animationDelay: '0.5s' }}>O</div>
              
              <h1 className="text-5xl md:text-6xl font-bold tracking-wider">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]">CLASSIC</span>
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold tracking-wider mt-1">
                <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]">CONETOE</span>
              </h2>
              <div className="absolute -inset-8 bg-gradient-radial from-cyan-500/15 via-violet-500/10 to-transparent blur-2xl animate-pulse" />
            </div>
            {user && profile && (
              <div className="flex items-center justify-center gap-3 text-sm text-slate-300">
                <span className="font-semibold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">{profile.username}</span> 
                <span className="text-slate-500">•</span> 
                <span className="text-violet-300">Level {profile.level}</span>
              </div>
            )}
            <div className="text-lg text-slate-400 tracking-[0.3em] uppercase font-light flex items-center justify-center gap-3">
              <Grid3X3 className="w-5 h-5 text-cyan-400/70 animate-pulse" />
              <span className="bg-gradient-to-r from-cyan-400/80 to-violet-400/80 bg-clip-text text-transparent">TIC TAC TOE</span>
              <Grid3X3 className="w-5 h-5 text-violet-400/70 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>


          {/* Menu Buttons - Cool Neon Style */}
          <div className={`w-full space-y-4 ${animationsEnabled ? 'animate-scale-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.3s' } : {}}>
            <Button
              onClick={() => setShowPlayDialog(true)}
              className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-500 hover:from-cyan-500 hover:via-teal-400 hover:to-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:scale-105 transition-all duration-300 rounded-full border-0"
            >
              <Play className="w-6 h-6 mr-3" />
              Play
            </Button>

            <Button
              onClick={() => navigate("/rules")}
              className="w-full h-16 text-xl font-semibold bg-slate-900/60 hover:bg-slate-800/80 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] hover:scale-105 transition-all duration-300 rounded-full border border-violet-500/30 hover:border-violet-400/50 backdrop-blur-sm"
            >
              <BookOpen className="w-6 h-6 mr-3 text-violet-400" />
              How to Play
            </Button>

            <Button
              onClick={() => navigate("/stats")}
              className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 hover:from-violet-500 hover:via-purple-400 hover:to-pink-400 hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] hover:scale-105 transition-all duration-300 rounded-full border-0"
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              Stats & Achievements
            </Button>

            <Button
              onClick={() => navigate("/settings")}
              className="w-full h-16 text-xl font-semibold bg-slate-900/60 hover:bg-slate-800/80 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] hover:scale-105 transition-all duration-300 rounded-full border border-cyan-500/30 hover:border-cyan-400/50 backdrop-blur-sm"
            >
              <Settings className="w-6 h-6 mr-3 text-cyan-400" />
              Settings
            </Button>
          </div>

          {/* Version */}
          <div className={`text-xs text-slate-500 ${animationsEnabled ? 'animate-fade-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.6s' } : {}}>
            <span className="bg-gradient-to-r from-cyan-500/60 to-violet-500/60 bg-clip-text text-transparent">v1.2.4</span>
            <span className="mx-2">•</span>
            <span className="text-violet-400/60">Classic Mode</span>
          </div>
        </div>

        {/* Bling Currency */}
        <BlingCurrency />

        {/* Daily Challenge Button - Right Side */}
        <DailyChallengeButton variant="classic" />
      </div>

      {/* Play Mode Selection Dialog - Cool Style */}
      <Dialog open={showPlayDialog} onOpenChange={setShowPlayDialog}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-950/95 border border-violet-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-center">
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Select Game Mode</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-2">
            {/* Game Mode Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* VS AI Section */}
              <div className="space-y-3 p-4 bg-slate-900/60 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-to-r from-cyan-600 to-teal-500 rounded-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">VS AI</h3>
                </div>

                {/* Difficulty Selection */}
                <div className="grid grid-cols-2 gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        selectedDifficulty === diff.id
                          ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                          : "border-slate-700 hover:border-violet-500/50 hover:bg-violet-500/5"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-1.5 rounded ${diff.color}`}>
                          <diff.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium text-slate-300">{diff.name}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={startAIGame}
                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 mt-2"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Battle AI
                </Button>
              </div>

              {/* Local Duel Section */}
              <div className="space-y-3 p-4 bg-slate-900/60 rounded-xl border border-violet-500/20 hover:border-violet-500/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-to-r from-violet-600 to-pink-500 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Local Duel</h3>
                </div>
                
                <p className="text-sm text-slate-400 py-2">
                  Face-off against a friend on the same device
                </p>

                <div className="flex gap-2 justify-center items-center py-4">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gradient-to-r from-cyan-600 to-teal-500 flex items-center gap-1.5 px-3 py-1.5">
                      <span className="text-lg font-bold">X</span>
                      <span>Player 1</span>
                    </Badge>
                  </div>
                  <span className="text-sm font-semibold text-slate-500">vs</span>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gradient-to-r from-violet-600 to-pink-500 flex items-center gap-1.5 px-3 py-1.5">
                      <span className="text-lg font-bold">O</span>
                      <span>Player 2</span>
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={startDuelGame}
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300 mt-2"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Start Duel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClassicIndex;
