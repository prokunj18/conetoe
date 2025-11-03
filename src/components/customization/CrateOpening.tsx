import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { CrateType, Rarity } from "@/types/customization";
import { CONES } from "@/data/cones";
import { BOARDS } from "@/data/boards";
import confetti from "canvas-confetti";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Crate3D } from './Crate3D';

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
      <DialogContent className="max-w-2xl bg-gradient-glass border border-card-border backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6 p-6">
          {!reward && !opening && (
            <>
              <div className="w-full h-[400px] rounded-lg overflow-hidden">
                <Canvas shadows className="bg-transparent">
                  <color attach="background" args={['#0a0a0f']} />
                  <PerspectiveCamera makeDefault position={[0, 1, 3]} fov={50} />
                  <OrbitControls 
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={2}
                  />
                  
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
                  <pointLight position={[-5, 5, 0]} intensity={0.5} color="#4A90E2" />
                  
                  <Crate3D rarity={crate.rarity} position={[0, 0, 0]} />
                  
                  <Environment preset="night" />
                </Canvas>
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
            <>
              <div className="w-full h-[400px] rounded-lg overflow-hidden">
                <Canvas shadows className="bg-transparent">
                  <color attach="background" args={['#0a0a0f']} />
                  <PerspectiveCamera makeDefault position={[0, 1, 3]} fov={50} />
                  
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
                  <pointLight position={[-5, 5, 0]} intensity={1} color="#4A90E2" />
                  
                  <Crate3D rarity={crate.rarity} position={[0, 0, 0]} isOpening={true} />
                  
                  <Environment preset="night" />
                </Canvas>
              </div>
              <h2 className="text-2xl font-bold animate-pulse">Opening...</h2>
            </>
          )}

          {reward && (
            <>
              <div className="relative">
                <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden">
                  <Canvas className="bg-transparent">
                    <color attach="background" args={['#0a0a0f']} />
                    <PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={50} />
                    <OrbitControls 
                      enableZoom={false}
                      enablePan={false}
                      autoRotate
                      autoRotateSpeed={1}
                    />
                    
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[3, 3, 3]} intensity={1.5} />
                    <pointLight position={[-2, 2, -2]} intensity={1} color={reward.item.rarity === 'legendary' ? '#FFD700' : '#00ffff'} />
                    
                    {reward.type === 'cone' ? (
                      <group position={[0, 0, 0]}>
                        <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
                          <coneGeometry args={[0.7, 1.5, 32]} />
                          <meshStandardMaterial
                            color={reward.item.preview}
                            emissive={reward.item.preview}
                            emissiveIntensity={0.5}
                            metalness={0.8}
                            roughness={0.2}
                          />
                        </mesh>
                      </group>
                    ) : (
                      <group position={[0, 0, 0]}>
                        <mesh>
                          <boxGeometry args={[1.5, 0.2, 1.5]} />
                          <meshStandardMaterial
                            color={reward.item.preview}
                            emissive={reward.item.preview}
                            emissiveIntensity={0.3}
                            metalness={0.7}
                            roughness={0.3}
                          />
                        </mesh>
                      </group>
                    )}
                  </Canvas>
                </div>
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