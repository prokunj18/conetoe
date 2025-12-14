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
      color: "bg-gradient-to-r from-cyan-500 to-cyan-600" 
    },
    { 
      id: "normal" as const, 
      name: "Normal", 
      icon: Brain, 
      description: "Balanced challenge",
      color: "bg-gradient-to-r from-slate-500 to-slate-600" 
    },
    { 
      id: "hard" as const, 
      name: "Hard", 
      icon: Crown, 
      description: "Strategic AI",
      color: "bg-gradient-to-r from-orange-500 to-orange-600" 
    },
    { 
      id: "master" as const, 
      name: "Master", 
      icon: Crown, 
      description: "Perfect strategy",
      color: "bg-gradient-to-r from-red-500 to-red-600" 
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

  // Floating particles
  const renderParticles = () => {
    return Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`
        }}
      />
    ));
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Retro Grid Background */}
        {renderRetroGrid()}
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {renderParticles()}
        </div>

        {/* Neon border glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        </div>

        {/* Switch to Conetoe Button */}
        <div className="absolute top-4 right-4 z-20">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="bg-slate-800/80 border-cyan-500/30 hover:border-cyan-400/50 hover:bg-slate-700/80 text-cyan-400 gap-2"
          >
            <Triangle className="w-4 h-4" />
            <ArrowLeftRight className="w-4 h-4" />
            <span className="hidden sm:inline">Switch to Conetoe</span>
          </Button>
        </div>

        {/* Account Button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => user ? navigate("/account") : navigate("/auth")}
            className="bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/90 border border-slate-600/30"
          >
            {user && profile ? (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-slate-700">
                  {avatarOptions.find(a => a.id === profile.avatar)?.emoji || '🤖'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <LogIn className="w-5 h-5 text-cyan-400" />
            )}
          </Button>
        </div>

        <div className="max-w-md w-full flex flex-col items-center space-y-8 relative z-10">
          {/* Title Section - Retro Style */}
          <div className={`text-center space-y-4 ${animationsEnabled ? 'animate-fade-in' : ''}`}>
            <div className="relative">
              {/* X and O decorations */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-4xl text-cyan-400/30 font-bold">X</div>
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-4xl text-orange-400/30 font-bold">O</div>
              
              <h1 className="text-5xl md:text-6xl font-bold tracking-wider">
                <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">CLASSIC</span>
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold tracking-wider mt-1">
                <span className="text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.5)]">CONETOE</span>
              </h2>
              <div className="absolute -inset-8 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent blur-xl" />
            </div>
            {user && profile && (
              <div className="flex items-center justify-center gap-3 text-sm text-slate-400">
                <span className="font-semibold text-cyan-400">{profile.username}</span> • Level {profile.level}
              </div>
            )}
            <div className="text-lg text-slate-500 tracking-[0.3em] uppercase font-light flex items-center justify-center gap-2">
              <Grid3X3 className="w-5 h-5 text-cyan-400/60" />
              TIC TAC TOE
              <Grid3X3 className="w-5 h-5 text-orange-400/60" />
            </div>
          </div>

          {/* Menu Buttons - Retro Neon Style */}
          <div className={`w-full space-y-4 ${animationsEnabled ? 'animate-scale-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.3s' } : {}}>
            <Button
              onClick={() => setShowPlayDialog(true)}
              className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105 transition-all duration-300 rounded-full border-0"
            >
              <Play className="w-6 h-6 mr-3" />
              Play
            </Button>

            <Button
              onClick={() => navigate("/rules")}
              className="w-full h-16 text-xl font-semibold bg-slate-800/80 hover:bg-slate-700/80 hover:shadow-[0_0_20px_rgba(148,163,184,0.2)] hover:scale-105 transition-all duration-300 rounded-full border border-slate-600/30"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              How to Play
            </Button>

            <Button
              onClick={() => navigate("/stats")}
              className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 hover:shadow-[0_0_30px_rgba(251,146,60,0.4)] hover:scale-105 transition-all duration-300 rounded-full border-0"
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              Stats & Achievements
            </Button>

            <Button
              onClick={() => navigate("/settings")}
              className="w-full h-16 text-xl font-semibold bg-slate-800/80 hover:bg-slate-700/80 hover:shadow-[0_0_20px_rgba(148,163,184,0.2)] hover:scale-105 transition-all duration-300 rounded-full border border-slate-600/30"
            >
              <Settings className="w-6 h-6 mr-3" />
              Settings
            </Button>
          </div>

          {/* Version */}
          <div className={`text-xs text-slate-500 ${animationsEnabled ? 'animate-fade-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.6s' } : {}}>
            v1.2.4 • Classic Mode
          </div>
        </div>

        {/* Bling Currency */}
        <BlingCurrency />
      </div>

      {/* Play Mode Selection Dialog - Retro Style */}
      <Dialog open={showPlayDialog} onOpenChange={setShowPlayDialog}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900/95 border border-cyan-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-center">
              <span className="text-cyan-400">Select</span>{" "}
              <span className="text-orange-400">Game Mode</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-2">
            {/* Game Mode Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* VS AI Section */}
              <div className="space-y-3 p-4 bg-slate-800/60 rounded-xl border border-slate-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-cyan-400">VS AI</h3>
                </div>

                {/* Difficulty Selection */}
                <div className="grid grid-cols-2 gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedDifficulty === diff.id
                          ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                          : "border-slate-600 hover:border-cyan-500/50"
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
                  className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 mt-2"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Battle AI
                </Button>
              </div>

              {/* Local Duel Section */}
              <div className="space-y-3 p-4 bg-slate-800/60 rounded-xl border border-slate-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-orange-400">Local Duel</h3>
                </div>
                
                <p className="text-sm text-slate-400 py-2">
                  Face-off against a friend on the same device
                </p>

                <div className="flex gap-2 justify-center items-center py-4">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gradient-to-r from-cyan-600 to-cyan-500 flex items-center gap-1.5 px-3 py-1.5">
                      <span className="text-lg font-bold">X</span>
                      <span>Player 1</span>
                    </Badge>
                  </div>
                  <span className="text-sm font-semibold text-slate-500">vs</span>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gradient-to-r from-orange-600 to-orange-500 flex items-center gap-1.5 px-3 py-1.5">
                      <span className="text-lg font-bold">O</span>
                      <span>Player 2</span>
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={startDuelGame}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 hover:shadow-[0_0_20px_rgba(251,146,60,0.4)] transition-all duration-300 mt-2"
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
