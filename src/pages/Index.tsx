import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Settings, Trophy, Brain, Users, Zap, Crown, BookOpen, LogIn, Sparkles, BarChart3, Grid3X3, ArrowLeftRight } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { useSettings } from "@/contexts/SettingsContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ConePreview } from "@/components/game/ConePreview";
import { BlingCurrency } from "@/components/ui/BlingCurrency";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TutorialPrompt } from "@/components/tutorial/TutorialPrompt";
import { DailyChallengeButton } from "@/components/game/DailyChallengeButton";
import { PageTransition } from "@/components/ui/PageTransition";

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

const Index = () => {
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
      color: "bg-gradient-player-1" 
    },
    { 
      id: "normal" as const, 
      name: "Normal", 
      icon: Brain, 
      description: "Balanced challenge",
      color: "bg-gradient-secondary" 
    },
    { 
      id: "hard" as const, 
      name: "Hard", 
      icon: Crown, 
      description: "Unbeatable AI",
      color: "bg-gradient-player-2" 
    },
    { 
      id: "master" as const, 
      name: "Master", 
      icon: Crown, 
      description: "Perfect strategy",
      color: "bg-gradient-primary" 
    },
  ];

  const startAIGame = () => {
    if (!user) {
      toast("Playing without login - progress won't be saved", {
        description: "Sign in to save your stats and earn bling!"
      });
    }
    setShowPlayDialog(false);
    navigate("/game", { state: { difficulty: selectedDifficulty, mode: "ai" } });
  };

  const startDuelGame = () => {
    if (!user) {
      toast("Playing without login - progress won't be saved", {
        description: "Sign in to save your stats and earn bling!"
      });
    }
    setShowPlayDialog(false);
    navigate("/game", { state: { mode: "local" } });
  };


  // Stars and particles background
  const renderStars = () => {
    return Array.from({ length: 100 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          opacity: Math.random() * 0.8 + 0.2
        }}
      />
    ));
  };

  return (
    <PageTransition variant="conetoe">
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <AnimatedBackground />
        
        {/* Stars Background */}
        <div className="absolute inset-0 overflow-hidden">
          {renderStars()}
        </div>

        {/* Top Left Controls - Gamemode Switch & Account */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {/* Gamemode Switch Button */}
          <Button
            onClick={() => navigate("/classic")}
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-600/20 to-orange-600/20 border border-cyan-500/40 hover:border-cyan-400/70 backdrop-blur-md px-4 py-2 gap-2 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            <Grid3X3 className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
            <ArrowLeftRight className="w-4 h-4 text-foreground/80 group-hover:scale-110 transition-transform duration-300" />
            <span className="hidden sm:inline text-sm font-medium bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">Classic</span>
          </Button>

          {/* Account Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => user ? navigate("/account") : navigate("/auth")}
            className="bg-card/80 backdrop-blur-sm hover:bg-card/90 hover:scale-105 transition-all duration-300 border border-border/50 w-10 h-10"
          >
            {user && profile ? (
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {avatarOptions.find(a => a.id === profile.avatar)?.emoji || '🤖'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <LogIn className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div className="max-w-md w-full flex flex-col items-center space-y-6 relative z-10">
          {/* Title Section */}
          <div className={`text-center space-y-4 ${animationsEnabled ? 'animate-fade-in' : ''}`}>
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-neon bg-clip-text text-transparent tracking-wider">
                CONETOE
              </h1>
              <div className="absolute -inset-4 bg-gradient-circular opacity-20 blur-2xl rounded-full animate-spin-slow" />
            </div>
            {user && profile && (
              <div className="flex items-center justify-center gap-3 text-sm text-foreground/80">
                <span className="font-semibold">{profile.username}</span> • Level {profile.level}
              </div>
            )}
            <div className="text-lg text-foreground/60 tracking-[0.3em] uppercase font-light">
              TACTICAL WARFARE
            </div>
          </div>


          {/* Menu Buttons */}
          <div className={`w-full space-y-4 ${animationsEnabled ? 'animate-scale-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.3s' } : {}}>
            <Button
              onClick={() => setShowPlayDialog(true)}
              className="w-full h-16 text-xl font-semibold bg-gradient-primary hover:shadow-neon hover:scale-105 transition-all duration-300 rounded-full border-0"
            >
              <Play className="w-6 h-6 mr-3" />
              Play
            </Button>

            <Button
              onClick={() => {
                if (!user) {
                  navigate("/auth");
                } else {
                  navigate("/multiplayer");
                }
              }}
              className="w-full h-16 text-xl font-semibold bg-gradient-glass hover:shadow-glow hover:scale-105 transition-all duration-300 rounded-full border border-accent/30 hover:border-accent/50"
            >
              <Trophy className="w-6 h-6 mr-3" />
              Multiplayer
            </Button>

            <Button
              onClick={() => navigate("/customization")}
              className="w-full h-16 text-xl font-semibold bg-gradient-secondary hover:shadow-neon hover:scale-105 transition-all duration-300 rounded-full border-0"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Boards & Cones
            </Button>

            <Button
              onClick={() => navigate("/rules")}
              className="w-full h-16 text-xl font-semibold bg-gradient-glass hover:shadow-glow hover:scale-105 transition-all duration-300 rounded-full border border-border/30"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              How to Play
            </Button>

            <Button
              onClick={() => navigate("/stats")}
              className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:shadow-neon hover:scale-105 transition-all duration-300 rounded-full border-0"
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              Stats & Achievements
            </Button>

            <Button
              onClick={() => navigate("/settings")}
              className="w-full h-16 text-xl font-semibold bg-gradient-glass hover:shadow-glow hover:scale-105 transition-all duration-300 rounded-full border border-border/30"
            >
              <Settings className="w-6 h-6 mr-3" />
              Settings
            </Button>
          </div>

          {/* Version */}
          <div className={`text-xs text-foreground/40 ${animationsEnabled ? 'animate-fade-in' : ''}`} style={animationsEnabled ? { animationDelay: '0.6s' } : {}}>
            v1.2.4
          </div>
        </div>

        {/* Bling Currency */}
        <BlingCurrency />

        {/* Daily Challenge Button - Right Side */}
        <DailyChallengeButton variant="conetoe" />

        {/* Tutorial Prompt for New Players */}
        <TutorialPrompt />
      </div>

      {/* Play Mode Selection Dialog */}
      <Dialog open={showPlayDialog} onOpenChange={setShowPlayDialog}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-2xl max-h-[85vh] overflow-y-auto bg-gradient-glass border border-card-border backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-center bg-gradient-neon bg-clip-text text-transparent">
              Select Game Mode
            </DialogTitle>
          </DialogHeader>
          
          
          <div className="p-2">
            {/* Responsive Game Mode Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* VS AI Section */}
              <div className="space-y-3 p-4 bg-card-glass rounded-xl border border-card-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">VS AI</h3>
                </div>

                {/* Difficulty Selection */}
                <div className="grid grid-cols-2 gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedDifficulty === diff.id
                          ? "border-primary bg-primary/10 shadow-glow"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`p-1.5 rounded ${diff.color}`}>
                          <diff.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium">{diff.name}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={startAIGame}
                  className="w-full bg-gradient-primary hover:shadow-neon transition-all duration-300 mt-2"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Battle AI
                </Button>
              </div>

              {/* Local Duel Section */}
              <div className="space-y-3 p-4 bg-card-glass rounded-xl border border-card-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-secondary rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Local Duel</h3>
                </div>
                
                <p className="text-sm text-muted-foreground py-2">
                  Face-off against a friend on the same device
                </p>

                <div className="flex gap-2 justify-center items-center py-4">
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gradient-player-1 flex items-center gap-1.5 px-3 py-1.5">
                      <ConePreview player={1} size={1} />
                      <span>Player 1</span>
                    </Badge>
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">vs</span>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-gradient-player-2 flex items-center gap-1.5 px-3 py-1.5">
                      <ConePreview player={2} size={1} />
                      <span>Player 2</span>
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={startDuelGame}
                  className="w-full bg-gradient-secondary hover:shadow-neon transition-all duration-300 mt-2"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Start Duel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default Index;