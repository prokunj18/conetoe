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
      // Idle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }

    if (lidRef.current && isOpening) {
      // Lid opening animation
      lidRef.current.rotation.x = Math.min(lidRef.current.rotation.x + 0.05, Math.PI / 2);
      lidRef.current.position.y = Math.min(lidRef.current.position.y + 0.02, 0.8);
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

      {/* Metal Corner Reinforcements */}
      {[
        [-0.45, -0.45, 0.45],
        [0.45, -0.45, 0.45],
        [-0.45, 0.45, 0.45],
        [0.45, 0.45, 0.45],
      ].map((pos, i) => (
        <mesh key={`corner-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial
            color={colors.metal}
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* Metal Bands */}
      {[-0.35, 0.35].map((yPos, i) => (
        <mesh key={`band-${i}`} position={[0, yPos, 0]} castShadow>
          <boxGeometry args={[1.05, 0.08, 1.05]} />
          <meshStandardMaterial
            color={colors.metal}
            roughness={0.2}
            metalness={0.95}
            emissive={colors.glow}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Lid */}
      <mesh ref={lidRef} position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.1, 1.1]} />
        <meshStandardMaterial
          color={colors.wood}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Glow Effect */}
      <pointLight
        position={[0, 0, 0]}
        color={colors.glow}
        intensity={1.5}
        distance={3}
      />
    </group>
  );
};
