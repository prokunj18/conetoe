import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface PlayerBench3DProps {
  player: number;
  position: [number, number, number];
  inventory: number[];
  onConeSelect?: (size: number) => void;
  selectedCone?: number | null;
  isCurrentPlayer?: boolean;
}

export const PlayerBench3D = ({ 
  player, 
  position, 
  inventory, 
  onConeSelect, 
  selectedCone,
  isCurrentPlayer = false 
}: PlayerBench3DProps) => {
  const glowRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      // @ts-ignore
      glowRef.current.material.emissiveIntensity = pulse;
    }
  });

  const color = player === 1 ? '#00ffff' : '#ff00ff';
  const accentColor = player === 1 ? '#ff00ff' : '#00ffff';

  // Calculate cone positions and scales
  const conePositions = useMemo(() => {
    const sizes = [1, 2, 3, 4];
    return sizes.map((size, index) => {
      const count = inventory.filter(s => s === size).length;
      const xOffset = (index - 1.5) * 1.2;
      const scale = 0.4 + (size * 0.1);
      return { size, count, x: xOffset, scale, available: count > 0 };
    });
  }, [inventory]);

  return (
    <group position={position} rotation={[0, 0, 0]}>
      {/* Main Bench Platform - Horizontal */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.4, 2.5]} />
        <meshStandardMaterial
          color="#1a0033"
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Top Glass Surface */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[8, 0.1, 2.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={1}
          roughness={0.05}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Neon Edge Glow */}
      <mesh ref={glowRef} position={[0, 0.3, 0]}>
        <boxGeometry args={[8.1, 0.05, 2.6]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inventory Cones on Bench - Horizontal layout */}
      {conePositions.map(({ size, count, x, scale, available }) => {
        const isSelected = selectedCone === size && isCurrentPlayer;
        const canSelect = available && isCurrentPlayer;
        
        return (
          <group 
            key={size} 
            position={[x, 0.5, 0]}
            onClick={(e) => {
              if (canSelect && onConeSelect) {
                e.stopPropagation();
                onConeSelect(size);
              }
            }}
            onPointerOver={(e) => {
              if (canSelect) {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Cone Model - Resting on bench */}
            <mesh 
              rotation={[0, 0, 0]} 
              scale={[scale, scale * 1.4, scale]}
              position={[0, scale * 0.7, 0]}
              castShadow
            >
              <coneGeometry args={[0.8, 1.8, 32]} />
              <meshStandardMaterial
                color={available ? color : '#333333'}
                emissive={available ? (isSelected ? accentColor : color) : '#000000'}
                emissiveIntensity={available ? (isSelected ? 1.5 : 0.7) : 0}
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={available ? 1 : 0.3}
              />
            </mesh>
            
            {/* Selection Ring */}
            {isSelected && (
              <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[scale * 0.9, scale * 1.1, 32]} />
                <meshBasicMaterial color={accentColor} transparent opacity={0.8} />
              </mesh>
            )}
            
            {/* Count Badge */}
            {count > 1 && (
              <>
                <mesh position={[0, scale * 1.6, 0]}>
                  <sphereGeometry args={[0.2, 16, 16]} />
                  <meshBasicMaterial color={accentColor} />
                </mesh>
                <mesh position={[0, scale * 1.6, 0.21]}>
                  <circleGeometry args={[0.15, 16]} />
                  <meshBasicMaterial color="#000000" />
                </mesh>
              </>
            )}

            {/* Glow for available cones */}
            {available && (
              <pointLight
                position={[0, scale * 0.8, 0]}
                color={isSelected ? accentColor : color}
                intensity={isSelected ? 1.5 : 1}
                distance={2}
              />
            )}
          </group>
        );
      })}

      {/* Point Lights for Bench Glow */}
      <pointLight
        position={[0, 0.6, 0]}
        color={color}
        intensity={isCurrentPlayer ? 2 : 1.2}
        distance={5}
      />
      
      {/* Corner accent lights */}
      <pointLight position={[-3.5, 0.4, 1]} color={accentColor} intensity={0.5} distance={2} />
      <pointLight position={[3.5, 0.4, 1]} color={accentColor} intensity={0.5} distance={2} />
      <pointLight position={[-3.5, 0.4, -1]} color={accentColor} intensity={0.5} distance={2} />
      <pointLight position={[3.5, 0.4, -1]} color={accentColor} intensity={0.5} distance={2} />
    </group>
  );
};
