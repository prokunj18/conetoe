import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Palette, 
  MessageSquare,
  Send,
  Star,
  AlertCircle,
  Sparkles,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState<"bug" | "feature" | "general">("general");
  const [rating, setRating] = useState(0);
  
  const { 
    soundEnabled, 
    animationsEnabled, 
    showMoveHints,
    setSoundEnabled,
    setAnimationsEnabled,
    setShowMoveHints,
  } = useSettings();

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    if (feedbackText.length < 10) {
      toast.error("Feedback must be at least 10 characters");
      return;
    }
    if (feedbackText.length > 1000) {
      toast.error("Feedback must be less than 1000 characters");
      return;
    }
    
    // In production, this would send to backend
    toast.success("Thank you for your feedback! 🚀");
    setFeedbackText("");
    setRating(0);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmos Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(240,60%,8%)] via-[hsl(260,50%,12%)] to-[hsl(280,40%,8%)]">
        {/* Stars Layer */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 3 + "s",
                animationDuration: Math.random() * 2 + 2 + "s",
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>
        
        {/* Nebula Glows */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]" />
        
        {/* Shooting Stars */}
        <div className="absolute top-20 left-10 w-1 h-1 bg-white rounded-full animate-bounce-slow opacity-60" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-cyan-300 rounded-full animate-float opacity-70" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Badge className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border-white/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Settings
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center space-y-3 animate-slide-down">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-glow-pulse">
            Settings
          </h1>
          <p className="text-lg text-white/60">
            Customize your cosmic Conetoe experience
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="settings" className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-md border border-white/10 p-1">
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/50 data-[state=active]:to-pink-500/50 data-[state=active]:text-white transition-all duration-300"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="feedback"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/50 data-[state=active]:to-blue-500/50 data-[state=active]:text-white transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-6">
            {/* Audio Settings */}
            <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:border-purple-500/30 transition-all duration-500 group animate-slide-in-left">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                    {soundEnabled ? (
                      <Volume2 className="w-6 h-6 text-white" />
                    ) : (
                      <VolumeX className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-white">Audio & Sound</h2>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div>
                    <h3 className="font-medium text-white">Sound Effects</h3>
                    <p className="text-sm text-white/50">
                      Play sounds for moves, wins, and interactions
                    </p>
                  </div>
                  <Switch 
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
                  />
                </div>
              </div>
            </Card>

            {/* Visual Settings */}
            <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:border-cyan-500/30 transition-all duration-500 group animate-slide-in-right">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform duration-300">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Visual & Interface</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <h3 className="font-medium text-white">Animations</h3>
                      <p className="text-sm text-white/50">
                        Enable smooth animations and transitions
                      </p>
                    </div>
                    <Switch 
                      checked={animationsEnabled}
                      onCheckedChange={setAnimationsEnabled}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <h3 className="font-medium text-white">Move Hints</h3>
                      <p className="text-sm text-white/50">
                        Highlight valid moves when cone is selected
                      </p>
                    </div>
                    <Switch 
                      checked={showMoveHints}
                      onCheckedChange={setShowMoveHints}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Game Info */}
            <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:border-indigo-500/30 transition-all duration-500 group animate-slide-in-left">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Game Information</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl border border-purple-500/20">
                    <div className="font-medium text-purple-300">Version</div>
                    <div className="text-white/70 text-lg">1.0.0</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl border border-cyan-500/20">
                    <div className="font-medium text-cyan-300">Mode</div>
                    <div className="text-white/70 text-lg">2D Classic</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-pink-500/10 to-transparent rounded-xl border border-pink-500/20">
                    <div className="font-medium text-pink-300">Players</div>
                    <div className="text-white/70 text-lg">1-2 + AI</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 hover:border-pink-500/30 transition-all duration-500 animate-slide-in-right">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  About Conetoe
                </h2>
                <p className="text-white/60 leading-relaxed">
                  Conetoe is an evolved version of classic Tic-Tac-Toe, featuring strategic 
                  triangular pieces of different sizes, replacement mechanics, and dynamic return rules.
                  The game combines simplicity with deep strategic gameplay.
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Strategy</Badge>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">Logic</Badge>
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Quick Games</Badge>
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">AI Opponents</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4 mt-6">
            {/* Feedback Form */}
            <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 animate-fade-in">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl shadow-lg shadow-cyan-500/25">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Send Feedback</h2>
                    <p className="text-sm text-white/50">Help us improve Conetoe</p>
                  </div>
                </div>

                {/* Feedback Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Feedback Type</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "bug", label: "🐛 Bug Report", color: "from-red-500/20 to-orange-500/20 border-red-500/30" },
                      { id: "feature", label: "✨ Feature Request", color: "from-purple-500/20 to-pink-500/20 border-purple-500/30" },
                      { id: "general", label: "💬 General", color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFeedbackType(type.id as typeof feedbackType)}
                        className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                          feedbackType === type.id
                            ? `bg-gradient-to-r ${type.color} scale-105`
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-white/90">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Rate Your Experience</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-all duration-200 hover:scale-125"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/30 hover:text-amber-400/50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Your Feedback</label>
                  <Textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you think... (10-1000 characters)"
                    className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 transition-all"
                    maxLength={1000}
                  />
                  <div className="text-xs text-white/40 text-right">
                    {feedbackText.length}/1000
                  </div>
                </div>

                {/* Submit */}
                <Button
                  onClick={handleSubmitFeedback}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </Card>

            {/* Guidelines */}
            <Card className="p-6 bg-white/5 backdrop-blur-md border-white/10 animate-slide-in-left">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-amber-500/25">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Feedback Guidelines</h2>
                </div>

                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Be specific and clear about the issue or suggestion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Include steps to reproduce bugs if applicable</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Keep feedback constructive and respectful</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>No spam, offensive language, or personal attacks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✗</span>
                    <span>Do not include personal or sensitive information</span>
                  </li>
                </ul>

                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 mt-4">
                  <p className="text-amber-300/90 text-sm">
                    📝 Your feedback helps us make Conetoe better for everyone. All submissions are reviewed by our team.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in pt-4">
          <Button 
            onClick={() => navigate("/rules")}
            variant="outline"
            className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white transition-all duration-300 hover:scale-105"
          >
            📖 View Rules
          </Button>
          
          <Button 
            onClick={() => navigate("/stats")}
            variant="outline"
            className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white transition-all duration-300 hover:scale-105"
          >
            📊 View Stats
          </Button>
          
          <Button 
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            🎯 Start Playing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
