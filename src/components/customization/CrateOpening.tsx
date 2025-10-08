import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Package } from "lucide-react";
import { CrateType, Rarity } from "@/types/customization";
import { CONES } from "@/data/cones";
import { BOARDS } from "@/data/boards";
import confetti from "canvas-confetti";

interface CrateOpeningProps {
  isOpen: boolean;
  onClose: () => void;
  crate: CrateType;
  crateType: 'cone' | 'board';
  onReward: (itemId: string, rarity: Rarity, type: 'cone' | 'board') => void;
}

export const CrateOpening = ({ isOpen, onClose, crate, crateType, onReward }: CrateOpeningProps) => {
  const [opening, setOpening] = useState(false);
  const [reward, setReward] = useState<{ item: { id: string; name: string; rarity: Rarity; preview: string; gradient?: string }; type: 'cone' | 'board' } | null>(null);

  const getRarityWeights = (crateRarity: Rarity) => {
    const weights = {
      rare: { rare: 100, epic: 0, mythic: 0, legendary: 0 },
      epic: { rare: 60, epic: 100, mythic: 0, legendary: 0 },
      mythic: { rare: 40, epic: 60, mythic: 100, legendary: 0 },
      legendary: { rare: 30, epic: 50, mythic: 70, legendary: 100 }
    };
    return weights[crateRarity];
  };

  const selectReward = () => {
    const weights = getRarityWeights(crate.rarity);
    const roll = Math.random() * 100;
    
    let selectedRarity: Rarity;
    if (roll >= weights.legendary) selectedRarity = 'legendary';
    else if (roll >= weights.mythic) selectedRarity = 'mythic';
    else if (roll >= weights.epic) selectedRarity = 'epic';
    else selectedRarity = 'rare';

    const availableItems = crateType === 'cone'
      ? CONES.filter(c => c.rarity === selectedRarity)
      : BOARDS.filter(b => b.rarity === selectedRarity);
    
    // Fallback to rare if no items found
    if (availableItems.length === 0) {
      const fallbackItems = crateType === 'cone'
        ? CONES.filter(c => c.rarity === 'rare')
        : BOARDS.filter(b => b.rarity === 'rare');
      const selectedItem = fallbackItems[Math.floor(Math.random() * fallbackItems.length)];
      return { item: selectedItem, type: crateType };
    }
    
    const selectedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    return { item: selectedItem, type: crateType };
  };

  const handleOpen = () => {
    setOpening(true);
    
    setTimeout(() => {
      const selected = selectReward();
      setReward(selected);
      setOpening(false);
      
      // Confetti effect
      if (selected.item.rarity === 'legendary' || selected.item.rarity === 'mythic') {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
      
      onReward(selected.item.id, selected.item.rarity, selected.type);
    }, 3000);
  };

  const handleClose = () => {
    setReward(null);
    onClose();
  };

  const getRarityColor = (rarity: Rarity) => {
    const colors = {
      rare: 'from-blue-500 to-cyan-600',
      epic: 'from-purple-500 to-pink-600',
      mythic: 'from-red-500 to-orange-600',
      legendary: 'from-yellow-400 to-orange-500'
    };
    return colors[rarity];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-gradient-glass border border-card-border backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6 p-6">
          {!reward && !opening && (
            <>
              <div className={`p-8 rounded-2xl bg-gradient-to-br ${crate.color} shadow-glow animate-float`}>
                <Package className="w-24 h-24 text-white" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{crate.name}</h2>
                <p className="text-muted-foreground">Ready to open your crate?</p>
              </div>
              <Button 
                onClick={handleOpen}
                className="w-full bg-gradient-primary hover:shadow-neon hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Open Crate
              </Button>
            </>
          )}

          {opening && (
            <div className="flex flex-col items-center gap-4">
              <div className={`p-8 rounded-2xl bg-gradient-to-br ${crate.color} shadow-glow animate-spin-slow`}>
                <Package className="w-24 h-24 text-white" />
              </div>
              <h2 className="text-2xl font-bold animate-pulse">Opening...</h2>
            </div>
          )}

          {reward && (
            <>
              <div className="relative">
                {reward.type === 'cone' ? (
                  <div 
                    className="w-32 h-32 relative shadow-glow animate-scale-in"
                    style={{
                      background: reward.item.preview,
                      clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                      filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))'
                    }}
                  >
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20"
                      style={{ clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)' }}
                    />
                  </div>
                ) : (
                  <div 
                    className={`w-32 h-32 ${reward.item.gradient} rounded-lg border-4 ${reward.item.preview} shadow-glow animate-scale-in`}
                  />
                )}
                <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${getRarityColor(reward.item.rarity)} bg-clip-text text-transparent`}>
                  {reward.item.name}
                </h2>
                <p className="text-lg text-muted-foreground capitalize">{reward.item.rarity} {reward.type === 'cone' ? 'Cone' : 'Board'}</p>
              </div>
              <Button 
                onClick={handleClose}
                className="w-full bg-gradient-primary hover:shadow-neon hover:scale-105 transition-all duration-300"
                size="lg"
              >
                Claim Reward
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};