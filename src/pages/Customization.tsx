import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Palette, LayoutGrid, Package, Lock, ArrowLeft, Coins } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CONES } from "@/data/cones";
import { BOARDS } from "@/data/boards";
import { CRATES } from "@/data/crates";
import { CrateOpening } from "@/components/customization/CrateOpening";
import { Rarity, CrateType } from "@/types/customization";
import { toast } from "sonner";
import { BlingCurrency } from "@/components/ui/BlingCurrency";

// Memoized item card to prevent unnecessary re-renders
const ConeCard = ({ 
  cone, 
  owned, 
  selected, 
  onSelect,
  getRarityBorder 
}: { 
  cone: typeof CONES[0]; 
  owned: boolean; 
  selected: boolean; 
  onSelect: () => void;
  getRarityBorder: (rarity: Rarity) => string;
}) => (
  <button
    onClick={onSelect}
    disabled={!owned}
    className={`
      p-3 rounded-xl border-2 transition-all duration-200
      ${owned ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
      ${selected ? `${getRarityBorder(cone.rarity)} bg-primary/15 shadow-glow scale-105` : 'border-border bg-black/30'}
      ${cone.effect && owned ? cone.effect : ''}
    `}
  >
    <div className="space-y-2">
      <div className="relative">
        <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden bg-black/50">
          <div className="w-full h-full relative flex items-center justify-center">
            <div 
              className="w-8 h-8 relative shadow-glow"
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
          </div>
        </div>
        {!owned && <Lock className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground" />}
      </div>
      <p className="text-xs font-medium text-center truncate">{cone.name}</p>
    </div>
  </button>
);

const BoardCard = ({ 
  board, 
  owned, 
  selected, 
  onSelect,
  getRarityBorder 
}: { 
  board: typeof BOARDS[0]; 
  owned: boolean; 
  selected: boolean; 
  onSelect: () => void;
  getRarityBorder: (rarity: Rarity) => string;
}) => (
  <button
    onClick={onSelect}
    disabled={!owned}
    className={`
      p-3 rounded-xl border-2 transition-all duration-200
      ${owned ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
      ${selected ? `${getRarityBorder(board.rarity)} bg-primary/15 shadow-glow scale-105` : 'border-border bg-black/30'}
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

// Simple crate card without 3D (much faster)
const CrateCard = ({
  crate,
  type,
  canAfford,
  onPurchase,
  getRarityColor,
  getRarityBorder
}: {
  crate: CrateType;
  type: 'cone' | 'board';
  canAfford: boolean;
  onPurchase: () => void;
  getRarityColor: (rarity: Rarity) => string;
  getRarityBorder: (rarity: Rarity) => string;
}) => (
  <Card className={`p-4 bg-gradient-to-br from-black/80 to-black/60 border-2 ${getRarityBorder(crate.rarity)} hover:scale-[1.02] transition-transform`}>
    <div className="flex flex-col items-center gap-3">
      {/* Simple animated crate preview instead of 3D */}
      <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${getRarityColor(crate.rarity)} flex items-center justify-center animate-pulse`}>
        <Package className="w-10 h-10 text-white drop-shadow-lg" />
      </div>
      <div className="text-center space-y-1">
        <h3 className={`text-lg font-bold bg-gradient-to-r ${getRarityColor(crate.rarity)} bg-clip-text text-transparent`}>
          {crate.name} {type === 'cone' ? 'Cone' : 'Board'}
        </h3>
        <Badge variant="secondary" className="text-sm">
          <Coins className="w-3 h-3 mr-1" />
          {crate.cost}
        </Badge>
      </div>
      <Button 
        onClick={onPurchase}
        disabled={!canAfford}
        size="sm"
        className={`w-full ${type === 'cone' ? 'bg-gradient-primary' : 'bg-gradient-secondary'} hover:shadow-neon transition-all`}
      >
        Purchase
      </Button>
    </div>
  </Card>
);

const Customization = () => {
  const navigate = useNavigate();
  const { coneStyle, setConeStyle, boardTheme, setBoardTheme } = useSettings();
  const { profile, reload: reloadProfile } = useProfile();
  const { user } = useAuth();
  const [ownedCones, setOwnedCones] = useState<string[]>(['classic']);
  const [ownedBoards, setOwnedBoards] = useState<string[]>(['neon']);
  const [selectedCrate, setSelectedCrate] = useState<CrateType | null>(null);
  const [selectedCrateType, setSelectedCrateType] = useState<'cone' | 'board'>('cone');
  const [crateOpening, setCrateOpening] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load owned cosmetics from database
  useEffect(() => {
    const loadCosmetics = async () => {
      if (!user) {
        const savedCones = localStorage.getItem('ownedCones');
        const savedBoards = localStorage.getItem('ownedBoards');
        setOwnedCones(savedCones ? JSON.parse(savedCones) : ['classic']);
        setOwnedBoards(savedBoards ? JSON.parse(savedBoards) : ['neon']);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_cosmetics')
        .select('item_type, item_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading cosmetics:', error);
        setLoading(false);
        return;
      }

      const cones = data.filter(item => item.item_type === 'cone').map(item => item.item_id);
      const boards = data.filter(item => item.item_type === 'board').map(item => item.item_id);

      setOwnedCones(['classic', ...cones.filter(c => c !== 'classic')]);
      setOwnedBoards(['neon', ...boards.filter(b => b !== 'neon')]);
      setLoading(false);
    };

    loadCosmetics();
  }, [user]);

  const handleCratePurchase = useCallback((crate: CrateType, type: 'cone' | 'board') => {
    if (!profile || profile.coins < crate.cost) {
      toast.error("Not enough Bling!");
      return;
    }
    setSelectedCrate(crate);
    setSelectedCrateType(type);
    setCrateOpening(true);
  }, [profile]);

  const handleReward = useCallback(async (itemId: string, rarity: Rarity, type: 'cone' | 'board') => {
    if (!selectedCrate) return;
    
    if (!user) {
      if (type === 'cone') {
        const newOwned = [...ownedCones, itemId];
        setOwnedCones(newOwned);
        localStorage.setItem('ownedCones', JSON.stringify(newOwned));
        const item = CONES.find(c => c.id === itemId);
        toast.success(`Unlocked ${item?.name}! (Sign in to save progress)`);
      } else {
        const newOwned = [...ownedBoards, itemId];
        setOwnedBoards(newOwned);
        localStorage.setItem('ownedBoards', JSON.stringify(newOwned));
        const item = BOARDS.find(b => b.id === itemId);
        toast.success(`Unlocked ${item?.name}! (Sign in to save progress)`);
      }
      return;
    }

    const { data, error } = await supabase.rpc('purchase_cosmetic', {
      p_item_type: type,
      p_item_id: itemId,
      p_cost: selectedCrate.cost
    });

    if (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase item');
      return;
    }

    const result = data as { success: boolean; error?: string; item_type?: string; item_id?: string };
    
    if (!result.success) {
      toast.error(result.error || 'Failed to purchase item');
      return;
    }

    if (type === 'cone') {
      setOwnedCones(prev => [...prev, itemId]);
      const item = CONES.find(c => c.id === itemId);
      toast.success(`Unlocked ${item?.name}!`);
    } else {
      setOwnedBoards(prev => [...prev, itemId]);
      const item = BOARDS.find(b => b.id === itemId);
      toast.success(`Unlocked ${item?.name}!`);
    }

    await reloadProfile();
  }, [selectedCrate, user, ownedCones, ownedBoards, reloadProfile]);

  const getRarityColor = useCallback((rarity: Rarity) => {
    const colors = {
      rare: 'from-blue-500 to-cyan-600',
      epic: 'from-purple-500 to-pink-600',
      mythic: 'from-red-500 to-orange-600',
      legendary: 'from-yellow-400 to-orange-500'
    };
    return colors[rarity];
  }, []);

  const getRarityBorder = useCallback((rarity: Rarity) => {
    const borders = {
      rare: 'border-blue-500',
      epic: 'border-purple-500',
      mythic: 'border-red-500',
      legendary: 'border-yellow-400'
    };
    return borders[rarity];
  }, []);

  // Memoized grouped items to prevent recalculation
  const conesGrouped = useMemo(() => ({
    legendary: CONES.filter(i => i.rarity === 'legendary'),
    mythic: CONES.filter(i => i.rarity === 'mythic'),
    epic: CONES.filter(i => i.rarity === 'epic'),
    rare: CONES.filter(i => i.rarity === 'rare')
  }), []);

  const boardsGrouped = useMemo(() => ({
    legendary: BOARDS.filter(i => i.rarity === 'legendary'),
    mythic: BOARDS.filter(i => i.rarity === 'mythic'),
    epic: BOARDS.filter(i => i.rarity === 'epic'),
    rare: BOARDS.filter(i => i.rarity === 'rare')
  }), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex items-center justify-between border-b border-border/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <h1 className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
          Customization Hub
        </h1>
        
        <BlingCurrency />
      </header>

      {/* Main content */}
      <main className="relative z-10 p-4 pb-20">
        <Tabs defaultValue="cones" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="cones" className="gap-2">
              <Palette className="w-4 h-4" />
              Cones
            </TabsTrigger>
            <TabsTrigger value="boards" className="gap-2">
              <LayoutGrid className="w-4 h-4" />
              Boards
            </TabsTrigger>
            <TabsTrigger value="crates" className="gap-2">
              <Package className="w-4 h-4" />
              Crates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cones" className="space-y-6 animate-fade-in">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              (['legendary', 'mythic', 'epic', 'rare'] as const).map(rarity => (
                <div key={rarity}>
                  <h3 className={`text-lg font-bold mb-4 capitalize bg-gradient-to-r ${getRarityColor(rarity)} bg-clip-text text-transparent`}>
                    {rarity} ({conesGrouped[rarity].length})
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {conesGrouped[rarity].map(cone => (
                      <ConeCard
                        key={cone.id}
                        cone={cone}
                        owned={ownedCones.includes(cone.id)}
                        selected={coneStyle === cone.id}
                        onSelect={() => ownedCones.includes(cone.id) && setConeStyle(cone.id)}
                        getRarityBorder={getRarityBorder}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="boards" className="space-y-6 animate-fade-in">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              (['legendary', 'mythic', 'epic', 'rare'] as const).map(rarity => (
                <div key={rarity}>
                  <h3 className={`text-lg font-bold mb-4 capitalize bg-gradient-to-r ${getRarityColor(rarity)} bg-clip-text text-transparent`}>
                    {rarity} ({boardsGrouped[rarity].length})
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {boardsGrouped[rarity].map(board => (
                      <BoardCard
                        key={board.id}
                        board={board}
                        owned={ownedBoards.includes(board.id)}
                        selected={boardTheme === board.id}
                        onSelect={() => ownedBoards.includes(board.id) && setBoardTheme(board.id)}
                        getRarityBorder={getRarityBorder}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="crates" className="space-y-8 animate-fade-in">
            {/* Cone Crates */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-center bg-gradient-primary bg-clip-text text-transparent">
                Cone Crates
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CRATES.map(crate => (
                  <CrateCard
                    key={`cone-${crate.rarity}`}
                    crate={crate}
                    type="cone"
                    canAfford={!!profile && profile.coins >= crate.cost}
                    onPurchase={() => handleCratePurchase(crate, 'cone')}
                    getRarityColor={getRarityColor}
                    getRarityBorder={getRarityBorder}
                  />
                ))}
              </div>
            </div>

            {/* Board Crates */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-center bg-gradient-secondary bg-clip-text text-transparent">
                Board Crates
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CRATES.map(crate => (
                  <CrateCard
                    key={`board-${crate.rarity}`}
                    crate={crate}
                    type="board"
                    canAfford={!!profile && profile.coins >= crate.cost}
                    onPurchase={() => handleCratePurchase(crate, 'board')}
                    getRarityColor={getRarityColor}
                    getRarityBorder={getRarityBorder}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Crate Opening Modal */}
      {selectedCrate && (
        <CrateOpening 
          isOpen={crateOpening} 
          onClose={() => {
            setCrateOpening(false);
            setSelectedCrate(null);
          }}
          crate={selectedCrate}
          crateType={selectedCrateType}
          onReward={handleReward}
        />
      )}
    </div>
  );
};

export default Customization;
