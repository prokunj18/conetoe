import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, RotateCcw, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Rules = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 border-border hover:border-primary/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
          
          <Badge variant="secondary" className="px-4 py-2">
            📖 Game Rules & Strategy
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            How to Play Conetoe
          </h1>
          <p className="text-xl text-muted-foreground">
            Master the art of strategic triangle placement and tactical returns
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Rules */}
          <Card className="p-6 bg-card border-card-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Basic Rules</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">🎯 Objective</h3>
                  <p className="text-sm text-muted-foreground">
                    Be the first to get 3 of your cones in a row (horizontal, vertical, or diagonal).
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">🔢 Your Arsenal</h3>
                  <p className="text-sm text-muted-foreground">
                    Each player starts with exactly 4 cones: sizes 1, 2, 3, and 4.
                  </p>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4].map(size => (
                      <div 
                        key={size}
                        className={`
                          ${size === 1 ? "w-6 h-6" : size === 2 ? "w-8 h-8" : size === 3 ? "w-10 h-10" : "w-12 h-12"}
                          bg-gradient-primary rounded-full shadow-cone
                          flex items-center justify-center text-white text-xs font-bold
                        `}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">📐 Placement Rules</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Place cones on any empty space</li>
                    <li>• Larger cones can replace smaller ones</li>
                    <li>• Replaced cones return to their owner</li>
                    <li>• You can't place on equal or larger cones</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Advanced Mechanics */}
          <Card className="p-6 bg-card border-card-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-secondary rounded-lg">
                  <RotateCcw className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Advanced Mechanics</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-secondary">🔄 4th Move Return Rule</h3>
                  <p className="text-sm text-muted-foreground">
                    After every 4th move by a player, their oldest cone automatically returns to their inventory.
                  </p>
                  <div className="p-3 bg-surface rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      💡 This prevents board locks and keeps games dynamic!
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-secondary">⚡ Strategic Depth</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Resource management is key</li>
                    <li>• Plan your cone sizes wisely</li>
                    <li>• Time your large cone placements</li>
                    <li>• Force returns with strategic moves</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-secondary">🧠 Pro Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Save size 4 cones for crucial moments</li>
                    <li>• Control the center early</li>
                    <li>• Force opponent replacements</li>
                    <li>• Plan around the 4-move cycle</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Difficulties */}
          <Card className="p-6 bg-card border-card-border md:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-player-2 rounded-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold">AI Difficulty Levels</h2>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { 
                    name: "Easy", 
                    icon: Zap, 
                    color: "bg-gradient-player-1",
                    description: "Random moves with minimal strategy. Perfect for learning the basic mechanics."
                  },
                  { 
                    name: "Normal", 
                    icon: Target, 
                    color: "bg-gradient-secondary",
                    description: "Basic awareness of winning/losing positions. Will block obvious wins."
                  },
                  { 
                    name: "Hard", 
                    icon: Crown, 
                    color: "bg-gradient-player-2",
                    description: "Strategic planning with foresight. Manages the 4th-move rule smartly."
                  },
                  { 
                    name: "Master", 
                    icon: Crown, 
                    color: "bg-gradient-primary",
                    description: "Near-perfect play using advanced tactics. A serious challenge for experts."
                  }
                ].map((difficulty) => (
                  <div 
                    key={difficulty.name}
                    className="p-4 bg-surface rounded-lg border border-card-border"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 ${difficulty.color} rounded`}>
                        <difficulty.icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold">{difficulty.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {difficulty.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Start Playing */}
        <div className="text-center">
          <Button 
            onClick={() => navigate("/")}
            size="lg"
            className="bg-gradient-primary hover:scale-105 transition-transform"
          >
            Ready to Play! 🎯
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rules;