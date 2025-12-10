import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

const TUTORIAL_SEEN_KEY = 'conetoe_tutorial_seen';

export const TutorialPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading } = useProfile();

  useEffect(() => {
    // Check if tutorial has been seen
    const tutorialSeen = localStorage.getItem(TUTORIAL_SEEN_KEY);
    
    // Show tutorial prompt for new players (no games played) or first-time visitors
    if (!loading) {
      const isNewPlayer = !profile || profile.total_games === 0;
      const hasNotSeenTutorial = !tutorialSeen;
      
      if (isNewPlayer && hasNotSeenTutorial) {
        // Delay the prompt slightly for better UX
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [profile, loading]);

  const handleViewTutorial = () => {
    localStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
    setShowPrompt(false);
    navigate("/rules");
  };

  const handleSkip = () => {
    localStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
    setShowPrompt(false);
  };

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md bg-gradient-glass border border-card-border backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-neon bg-clip-text text-transparent">
            Welcome to Conetoe!
          </DialogTitle>
          <DialogDescription className="text-center text-foreground/80 pt-2">
            Looks like you're new here. Would you like to learn how to play with our interactive tutorial?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Tutorial Preview */}
          <div className="p-4 bg-card/50 rounded-xl border border-card-border/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold">Interactive Tutorial</h4>
                <p className="text-xs text-muted-foreground">Learn the basics in 2 minutes</p>
              </div>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• How to place cones</li>
              <li>• Stacking strategy</li>
              <li>• The 4th move rule</li>
              <li>• Winning conditions</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 border-border/50 hover:border-border"
            >
              <X className="w-4 h-4 mr-2" />
              Skip for Now
            </Button>
            <Button
              onClick={handleViewTutorial}
              className="flex-1 bg-gradient-primary hover:scale-105 transition-transform"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Tutorial
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can access the tutorial anytime from "How to Play" in the menu
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialPrompt;