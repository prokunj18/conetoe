import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, BookOpen, Settings, Trophy, Zap, Brain } from "lucide-react";

const MainMenu = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "normal" | "hard" | "master">("normal");

  const difficulties = [
    { 
      id: "easy" as const, 
      name: "Easy", 
      icon: Zap, 
      description: "Random moves, perfect for learning",
      color: "bg-gradient-player-1" 
    },
    { 
      id: "normal" as const, 
      name: "Normal", 
      icon: Brain, 
      description: "Basic strategy and blocks",
      color: "bg-gradient-secondary" 
    },
    { 
      id: "hard" as const, 
      name: "Hard", 
      icon: Trophy, 
      description: "Strategic planning and foresight",
      color: "bg-gradient-player-2" 
    },
    { 
      id: "master" as const, 
      name: "Master", 
      icon: Trophy, 
      description: "Near-perfect AI with advanced tactics",
      color: "bg-gradient-primary" 
    },
  ];

  const startGame = () => {
    navigate("/game", { state: { difficulty: selectedDifficulty, mode: "ai" } });
  };

  const startTwoPlayer = () => {
    navigate("/game", { state: { mode: "local" } });
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Cone Tactics
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Strategic Tic Tac Toe with stackable cone pieces. Outsmart your opponent with size, timing, and tactical returns.
          </p>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            🎯 Win with 3 in a row • 🔄 Replace smaller cones • ⏰ Strategic returns
          </Badge>
        </div>

        {/* Main Menu Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* AI Game */}
          <Card className="p-6 bg-card border-card-border hover:shadow-glow transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <Play className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Play vs AI</h3>
                  <p className="text-sm text-muted-foreground">Challenge the computer</p>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Select Difficulty:</h4>
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
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${diff.color}`}>
                          <diff.icon className="w-3 h-3 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium">{diff.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {diff.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={startGame} 
                className="w-full bg-gradient-primary hover:scale-105 transition-transform"
              >
                Start AI Game
              </Button>
            </div>
          </Card>

          {/* Local Multiplayer */}
          <Card className="p-6 bg-card border-card-border hover:shadow-glow transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-secondary rounded-lg">
                  <Trophy className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Two Players</h3>
                  <p className="text-sm text-muted-foreground">Play with a friend locally</p>
                </div>
              </div>

              <div className="space-y-3 py-4">
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <span className="text-sm">Player 1</span>
                  <div className="w-4 h-4 bg-gradient-player-1 rounded-full shadow-cone"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <span className="text-sm">Player 2</span>
                  <div className="w-4 h-4 bg-gradient-player-2 rounded-full shadow-cone"></div>
                </div>
              </div>

              <Button 
                onClick={startTwoPlayer} 
                variant="secondary"
                className="w-full bg-gradient-secondary hover:scale-105 transition-transform"
              >
                Start Local Game
              </Button>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/rules")}
            className="flex items-center gap-2 border-border hover:border-primary/50"
          >
            <BookOpen className="w-4 h-4" />
            How to Play
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 border-border hover:border-primary/50"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;