import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings as SettingsIcon, Volume2, VolumeX, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/contexts/SettingsContext";

const Settings = () => {
  const navigate = useNavigate();
  const { 
    soundEnabled, 
    animationsEnabled, 
    showMoveHints,
    setSoundEnabled,
    setAnimationsEnabled,
    setShowMoveHints
  } = useSettings();

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-3xl mx-auto space-y-6">
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
            ⚙️ Game Settings
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-xl text-muted-foreground">
            Customize your Cone Tactics experience
          </p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Audio Settings */}
          <Card className="p-6 bg-card border-card-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  {soundEnabled ? (
                    <Volume2 className="w-6 h-6 text-primary-foreground" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-primary-foreground" />
                  )}
                </div>
                <h2 className="text-xl font-semibold">Audio & Sound</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sound Effects</h3>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for moves, wins, and interactions
                    </p>
                  </div>
                  <Switch 
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Visual Settings */}
          <Card className="p-6 bg-card border-card-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-secondary rounded-lg">
                  <Palette className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Visual & Interface</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Animations</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable smooth animations and transitions
                    </p>
                  </div>
                  <Switch 
                    checked={animationsEnabled}
                    onCheckedChange={setAnimationsEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Move Hints</h3>
                    <p className="text-sm text-muted-foreground">
                      Highlight valid moves when cone is selected
                    </p>
                  </div>
                  <Switch 
                    checked={showMoveHints}
                    onCheckedChange={setShowMoveHints}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Game Info */}
          <Card className="p-6 bg-card border-card-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-player-1 rounded-lg">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Game Information</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-surface rounded-lg">
                  <div className="font-medium text-primary">Version</div>
                  <div className="text-muted-foreground">1.0.0</div>
                </div>
                
                <div className="p-3 bg-surface rounded-lg">
                  <div className="font-medium text-primary">Game Mode</div>
                  <div className="text-muted-foreground">Strategic Tic-Tac-Toe</div>
                </div>
                
                <div className="p-3 bg-surface rounded-lg">
                  <div className="font-medium text-primary">Players</div>
                  <div className="text-muted-foreground">1-2 Players + AI</div>
                </div>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card className="p-6 bg-card border-card-border">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">About Cone Tactics</h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Cone Tactics is an evolved version of classic Tic-Tac-Toe, featuring strategic 
                  cone pieces of different sizes, replacement mechanics, and dynamic return rules.
                </p>
                <p>
                  The game combines the simplicity of the 3×3 grid with deep strategic gameplay, 
                  making every match unique and engaging.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">Strategy</Badge>
                <Badge variant="outline">Logic</Badge>
                <Badge variant="outline">Quick Games</Badge>
                <Badge variant="outline">AI Opponents</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            onClick={() => navigate("/rules")}
            variant="outline"
            className="border-border hover:border-primary/50"
          >
            📖 View Rules
          </Button>
          
          <Button 
            onClick={() => navigate("/")}
            className="bg-gradient-primary hover:scale-105 transition-transform"
          >
            🎯 Start Playing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;