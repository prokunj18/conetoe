import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Target, RotateCcw, Zap, Crown, Play, CheckCircle, Circle, Hand, MousePointer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Progress } from "@/components/ui/progress";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  interactive?: boolean;
  action?: string;
  board?: (number | null)[][];
  highlight?: { row: number; col: number }[];
  cones?: { row: number; col: number; size: number; player: number }[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to Conetoe!",
    description: "A strategic game where you place cones to form a line of 3. Let's learn the basics together!",
    icon: Target,
    action: "Click 'Next' to continue",
  },
  {
    id: 2,
    title: "The Game Board",
    description: "The game is played on a 3x3 grid. Your goal is to place 3 of your cones in a row - horizontally, vertically, or diagonally.",
    icon: Target,
    board: Array(3).fill(null).map(() => Array(3).fill(null)),
    action: "Tap any cell to see where you can place cones",
    interactive: true,
  },
  {
    id: 3,
    title: "Your Cone Arsenal",
    description: "You have 4 cones of different sizes: 1, 2, 3, and 4. Larger cones can cover smaller ones!",
    icon: Zap,
    action: "Try clicking on the cones below",
    interactive: true,
  },
  {
    id: 4,
    title: "Stacking Cones",
    description: "The key strategy! A size 3 cone can replace a size 1 or 2 cone. The replaced cone returns to its owner.",
    icon: RotateCcw,
    board: [[null, null, null], [null, 1, null], [null, null, null]],
    cones: [{ row: 1, col: 1, size: 1, player: 2 }],
    highlight: [{ row: 1, col: 1 }],
    action: "Place a larger cone on the highlighted cell",
    interactive: true,
  },
  {
    id: 5,
    title: "The 4th Move Rule",
    description: "After your 4th move, your oldest cone automatically returns to your inventory. This keeps the game dynamic!",
    icon: RotateCcw,
    action: "Watch the animation to see how it works",
  },
  {
    id: 6,
    title: "Winning the Game",
    description: "Get 3 of your cones in a row to win! Plan your moves carefully and block your opponent.",
    icon: Crown,
    board: [[1, null, null], [null, 1, null], [null, null, 1]],
    cones: [
      { row: 0, col: 0, size: 2, player: 1 },
      { row: 1, col: 1, size: 3, player: 1 },
      { row: 2, col: 2, size: 1, player: 1 },
    ],
    action: "This diagonal wins the game!",
  },
  {
    id: 7,
    title: "You're Ready!",
    description: "Now you know the basics. Start with Easy AI to practice, then challenge harder opponents!",
    icon: CheckCircle,
    action: "Click 'Start Playing' to begin your journey",
  },
];

const Rules = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [interactionComplete, setInteractionComplete] = useState<boolean[]>(new Array(tutorialSteps.length).fill(false));
  const [selectedCone, setSelectedCone] = useState<number | null>(null);
  const [clickedCells, setClickedCells] = useState<Set<string>>(new Set());

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    setClickedCells(prev => new Set([...prev, key]));
    setInteractionComplete(prev => {
      const newState = [...prev];
      newState[currentStep] = true;
      return newState;
    });
  };

  const handleConeClick = (size: number) => {
    setSelectedCone(size);
    setInteractionComplete(prev => {
      const newState = [...prev];
      newState[currentStep] = true;
      return newState;
    });
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setClickedCells(new Set());
      setSelectedCone(null);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setClickedCells(new Set());
      setSelectedCone(null);
    }
  };

  // Stars background
  const renderStars = () => {
    return Array.from({ length: 80 }).map((_, i) => (
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

  // Nebula effect
  const renderNebula = () => (
    <>
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
    </>
  );

  const renderInteractiveBoard = () => {
    const board = step.board || Array(3).fill(null).map(() => Array(3).fill(null));
    
    return (
      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto my-4">
        {board.map((row, rowIdx) => (
          row.map((_, colIdx) => {
            const cone = step.cones?.find(c => c.row === rowIdx && c.col === colIdx);
            const isHighlighted = step.highlight?.some(h => h.row === rowIdx && h.col === colIdx);
            const isClicked = clickedCells.has(`${rowIdx}-${colIdx}`);
            
            return (
              <button
                key={`${rowIdx}-${colIdx}`}
                onClick={() => handleCellClick(rowIdx, colIdx)}
                className={`
                  w-14 h-14 rounded-lg border-2 transition-all duration-300 flex items-center justify-center
                  ${isHighlighted ? 'border-primary animate-pulse bg-primary/20' : 'border-border/50'}
                  ${isClicked ? 'bg-primary/30 scale-95' : 'hover:bg-card/50 hover:scale-105'}
                  ${step.interactive ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {cone && (
                  <div 
                    className={`
                      rounded-full flex items-center justify-center font-bold text-white shadow-lg animate-scale-in
                      ${cone.player === 1 ? 'bg-gradient-player-1' : 'bg-gradient-player-2'}
                      ${cone.size === 1 ? 'w-6 h-6 text-xs' : cone.size === 2 ? 'w-8 h-8 text-sm' : cone.size === 3 ? 'w-10 h-10 text-base' : 'w-12 h-12 text-lg'}
                    `}
                  >
                    {cone.size}
                  </div>
                )}
                {!cone && isClicked && (
                  <div className="w-8 h-8 rounded-full bg-primary/50 animate-scale-in" />
                )}
              </button>
            );
          })
        ))}
      </div>
    );
  };

  const renderConeArsenal = () => (
    <div className="flex gap-3 justify-center my-4">
      {[1, 2, 3, 4].map(size => (
        <button
          key={size}
          onClick={() => handleConeClick(size)}
          className={`
            rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300
            bg-gradient-player-1 hover:scale-110 cursor-pointer
            ${size === 1 ? 'w-8 h-8 text-xs' : size === 2 ? 'w-10 h-10 text-sm' : size === 3 ? 'w-12 h-12 text-base' : 'w-14 h-14 text-lg'}
            ${selectedCone === size ? 'ring-4 ring-primary ring-offset-2 ring-offset-background scale-110' : ''}
          `}
        >
          {size}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Cosmos Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderStars()}
        {renderNebula()}
      </div>

      <div className="max-w-2xl w-full space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-down">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground hover:text-primary hover:bg-card/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
          
          <Badge variant="secondary" className="px-4 py-2 bg-card/50 backdrop-blur-sm animate-glow-pulse">
            📖 Interactive Tutorial
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 animate-fade-in">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-card/50" />
        </div>

        {/* Tutorial Card */}
        <Card className="p-8 bg-gradient-glass border border-card-border backdrop-blur-xl animate-scale-in">
          <div className="space-y-6">
            {/* Step Header */}
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-primary rounded-xl animate-float">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-neon bg-clip-text text-transparent">
                  {step.title}
                </h2>
                <p className="text-muted-foreground text-sm">Step {step.id}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-foreground/90 leading-relaxed">
              {step.description}
            </p>

            {/* Interactive Content */}
            {step.board && renderInteractiveBoard()}
            {currentStep === 2 && renderConeArsenal()}

            {/* Action Hint */}
            <div className="flex items-center gap-2 text-sm text-primary/80 bg-primary/10 rounded-lg p-3 animate-pulse-soft">
              {step.interactive ? (
                <Hand className="w-4 h-4" />
              ) : (
                <MousePointer className="w-4 h-4" />
              )}
              <span>{step.action}</span>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2">
              {tutorialSteps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`transition-all duration-300 ${
                    idx === currentStep 
                      ? 'w-8 h-2 bg-primary rounded-full' 
                      : idx < currentStep 
                        ? 'w-2 h-2 bg-primary/50 rounded-full hover:bg-primary/70' 
                        : 'w-2 h-2 bg-card-border rounded-full hover:bg-card-border/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between animate-fade-in">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 border-border/50 hover:border-primary/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep === tutorialSteps.length - 1 ? (
            <Button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-gradient-primary hover:scale-105 transition-transform animate-glow-pulse"
            >
              <Play className="w-4 h-4" />
              Start Playing!
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-gradient-primary hover:scale-105 transition-transform"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Quick Reference */}
        <Card className="p-4 bg-card/30 border border-card-border/50 backdrop-blur-sm animate-slide-down" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Quick Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 bg-card/50 rounded-lg">
              <Circle className="w-3 h-3 text-primary" />
              <span>3 in a row wins</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-card/50 rounded-lg">
              <Zap className="w-3 h-3 text-secondary" />
              <span>4 cone sizes</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-card/50 rounded-lg">
              <RotateCcw className="w-3 h-3 text-accent" />
              <span>4th move returns</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-card/50 rounded-lg">
              <Target className="w-3 h-3 text-primary" />
              <span>Big covers small</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Rules;