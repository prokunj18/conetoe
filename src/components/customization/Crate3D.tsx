import { useRef } from 'react';
import { Group, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Rarity } from '@/types/customization';

interface Crate3DProps {
  rarity: Rarity;
  position: [number, number, number];
  isOpening?: boolean;
}

export const Crate3D = ({ rarity, position, isOpening = false }: Crate3DProps) => {
  const groupRef = useRef<Group>(null);
  const lidRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (groupRef.current && !isOpening) {
      // Simplified idle animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }

    if (lidRef.current && isOpening) {
      // Simplified opening animation
      const progress = Math.min((state.clock.elapsedTime % 3) / 0.8, 1);
      lidRef.current.position.y = 0.5 + progress * 0.5;
      lidRef.current.rotation.x = progress * 0.5;
    }
  });

  const getCrateColors = () => {
    const colors = {
      rare: { wood: '#6B4423', metal: '#8B9DC3', glow: '#4A90E2' },
      epic: { wood: '#8B4789', metal: '#C084FC', glow: '#A855F7' },
      mythic: { wood: '#B83A28', metal: '#FB923C', glow: '#F97316' },
      legendary: { wood: '#D4AF37', metal: '#FDE047', glow: '#FACC15' }
    };
    return colors[rarity];
  };

  const colors = getCrateColors();

  return (
    <group ref={groupRef} position={position}>
      {/* Main Crate Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={colors.wood}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Wood Planks */}
      {[-0.3, 0, 0.3].map((offset, i) => (
        <mesh key={`plank-${i}`} position={[0, offset, 0.51]} castShadow>
          <boxGeometry args={[0.9, 0.15, 0.02]} />
          <meshStandardMaterial
            color={colors.wood}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      ))}

      {/* Simplified Metal Corners */}
      {[
        [-0.45, -0.45, 0.45],
        [0.45, -0.45, 0.45],
      ].map((pos, i) => (
        <mesh key={`corner-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial
            color={colors.metal}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* Simplified Metal Band */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.05, 0.08, 1.05]} />
        <meshStandardMaterial
          color={colors.metal}
          roughness={0.2}
          metalness={0.95}
          emissive={colors.glow}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Lid */}
      <mesh ref={lidRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[1.1, 0.1, 1.1]} />
        <meshStandardMaterial
          color={colors.wood}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Simplified Glow */}
      <pointLight
        position={[0, 0, 0]}
        color={colors.glow}
        intensity={1}
        distance={2}
      />
    </group>
  );
};
