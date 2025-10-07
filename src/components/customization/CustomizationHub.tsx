import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Palette, LayoutGrid, Package, Lock } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useProfile } from "@/hooks/useProfile";
import { CONES } from "@/data/cones";
import { BOARDS } from "@/data/boards";
import { CRATES } from "@/data/crates";
import { CrateOpening } from "./CrateOpening";
import { Rarity, CrateType } from "@/types/customization";
import { toast } from "sonner";

interface CustomizationHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizationHub = ({ isOpen, onClose }: CustomizationHubProps) => {
  const { coneStyle, setConeStyle, boardTheme, setBoardTheme } = useSettings();
  const { profile, updateProfile } = useProfile();
  const [ownedCones, setOwnedCones] = useState<string[]>(() => {
    const saved = localStorage.getItem('ownedCones');
    return saved ? JSON.parse(saved) : ['classic'];
  });
  const [ownedBoards, setOwnedBoards] = useState<string[]>(() => {
    const saved = localStorage.getItem('ownedBoards');
    return saved ? JSON.parse(saved) : ['neon'];
  });
  const [selectedCrate, setSelectedCrate] = useState<CrateType | null>(null);
  const [crateOpening, setCrateOpening] = useState(false);

  const handleCratePurchase = (crate: CrateType) => {
    if (!profile || profile.coins < crate.cost) {
      toast.error("Not enough Bling!");
      return;
    }
    setSelectedCrate(crate);
    setCrateOpening(true);
  };

  const handleReward = async (itemId: string, rarity: Rarity, type: 'cone' | 'board') => {
    if (!selectedCrate || !profile) return;
    
    // Deduct coins and update profile
    const newCoins = profile.coins - selectedCrate.cost;
    await updateProfile({ coins: newCoins });
    
    // Add to inventory
    if (type === 'cone') {
      const newOwned = [...ownedCones, itemId];
      setOwnedCones(newOwned);
      localStorage.setItem('ownedCones', JSON.stringify(newOwned));
      const item = CONES.find(c => c.id === itemId);
      toast.success(`Unlocked ${item?.name}!`);
    } else {
      const newOwned = [...ownedBoards, itemId];
      setOwnedBoards(newOwned);
      localStorage.setItem('ownedBoards', JSON.stringify(newOwned));
      const item = BOARDS.find(b => b.id === itemId);
      toast.success(`Unlocked ${item?.name}!`);
    }
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

  const getRarityBorder = (rarity: Rarity) => {
    const borders = {
      rare: 'border-blue-500',
      epic: 'border-purple-500',
      mythic: 'border-red-500',
      legendary: 'border-yellow-400'
    };
    return borders[rarity];
  };

  const groupByRarity = <T extends { rarity: Rarity }>(items: T[]) => {
    return {
      legendary: items.filter(i => i.rarity === 'legendary'),
      mythic: items.filter(i => i.rarity === 'mythic'),
      epic: items.filter(i => i.rarity === 'epic'),
      rare: items.filter(i => i.rarity === 'rare')
    };
  };

  const conesGrouped = groupByRarity(CONES);
  const boardsGrouped = groupByRarity(BOARDS);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-gradient-glass border border-card-border backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-secondary bg-clip-text text-transparent">
              Customization Hub
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="cones" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cones">
                <Palette className="w-4 h-4 mr-2" />
                Cones
              </TabsTrigger>
              <TabsTrigger value="boards">
                <LayoutGrid className="w-4 h-4 mr-2" />
                Boards
              </TabsTrigger>
              <TabsTrigger value="crates">
                <Package className="w-4 h-4 mr-2" />
                Crates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cones" className="max-h-[65vh] overflow-y-auto space-y-6">
              {(['legendary', 'mythic', 'epic', 'rare'] as const).map(rarity => (
                <div key={rarity}>
                  <h3 className={`text-lg font-bold mb-4 capitalize bg-gradient-to-r ${getRarityColor(rarity)} bg-clip-text text-transparent`}>
                    {rarity} ({conesGrouped[rarity].length})
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {conesGrouped[rarity].map(cone => {
                      const owned = ownedCones.includes(cone.id);
                      const selected = coneStyle === cone.id;
                      return (
                        <button
                          key={cone.id}
                          onClick={() => owned && setConeStyle(cone.id as any)}
                          disabled={!owned}
                          className={`
                            p-3 rounded-xl border-2 transition-all
                            ${owned ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                            ${selected ? `${getRarityBorder(cone.rarity)} bg-primary/15 shadow-glow scale-105` : 'border-border'}
                            ${cone.effect && owned ? cone.effect : ''}
                          `}
                        >
                          <div className="space-y-2">
                            <div className="relative">
                              <div 
                                className="w-12 h-12 mx-auto relative shadow-glow"
                                style={{
                                  background: cone.preview,
                                  clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)',
                                  filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
                                }}
                              >
                                <div 
                                  className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20"
                                  style={{ clipPath: 'polygon(50% 5%, 5% 95%, 95% 95%)' }}
                                />
                              </div>
                              {!owned && <Lock className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground" />}
                            </div>
                            <p className="text-xs font-medium text-center truncate">{cone.name}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="boards" className="max-h-[65vh] overflow-y-auto space-y-6">
              {(['legendary', 'mythic', 'epic', 'rare'] as const).map(rarity => (
                <div key={rarity}>
                  <h3 className={`text-lg font-bold mb-4 capitalize bg-gradient-to-r ${getRarityColor(rarity)} bg-clip-text text-transparent`}>
                    {rarity} ({boardsGrouped[rarity].length})
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {boardsGrouped[rarity].map(board => {
                      const owned = ownedBoards.includes(board.id);
                      const selected = boardTheme === board.id;
                      return (
                        <button
                          key={board.id}
                          onClick={() => owned && setBoardTheme(board.id as any)}
                          disabled={!owned}
                          className={`
                            p-3 rounded-xl border-2 transition-all
                            ${owned ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                            ${selected ? `${getRarityBorder(board.rarity)} bg-primary/15 shadow-glow scale-105` : 'border-border'}
                          `}
                        >
                          <div className="space-y-2">
                            <div className={`w-12 h-12 mx-auto ${board.gradient} rounded-lg border ${board.preview} relative`}>
                              {!owned && <Lock className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground" />}
                            </div>
                            <p className="text-xs font-medium text-center truncate">{board.name}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="crates" className="max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CRATES.map(crate => (
                  <Card key={crate.rarity} className={`p-6 bg-gradient-to-br ${crate.color} border-2 ${getRarityBorder(crate.rarity)}`}>
                    <div className="flex flex-col items-center gap-4 text-white">
                      <Package className="w-16 h-16" />
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold">{crate.name}</h3>
                        <Badge variant="secondary" className="text-lg">
                          {crate.cost} Bling
                        </Badge>
                      </div>
                      <Button 
                        onClick={() => handleCratePurchase(crate)}
                        disabled={!profile || profile.coins < crate.cost}
                        className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/50"
                      >
                        Purchase
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {selectedCrate && (
        <CrateOpening 
          isOpen={crateOpening} 
          onClose={() => {
            setCrateOpening(false);
            setSelectedCrate(null);
          }}
          crate={selectedCrate}
          onReward={handleReward}
        />
      )}
    </>
  );
};