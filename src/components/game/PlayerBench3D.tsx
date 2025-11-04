import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface PlayerBench3DProps {
  player: number;
  position: [number, number, number];
  inventory: number[];
}

export const PlayerBench3D = ({ player, position, inventory }: PlayerBench3DProps) => {
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
    <group position={position}>
      {/* Main Bench Platform */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.3, 2]} />
        <meshStandardMaterial
          color="#1a0033"
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Top Glass Surface */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[6, 0.1, 2]} />
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
      <mesh ref={glowRef} position={[0, 0.25, 0]}>
        <boxGeometry args={[6.1, 0.05, 2.1]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inventory Cones on Bench */}
      {conePositions.map(({ size, count, x, scale, available }) => (
        <group key={size} position={[x, 0.4, 0]}>
          {/* Cone Model */}
          <mesh rotation={[0, 0, 0]} scale={[scale, scale * 1.2, scale]}>
            <coneGeometry args={[1, 2, 4]} />
            <meshStandardMaterial
              color={available ? color : '#333333'}
              emissive={available ? color : '#000000'}
              emissiveIntensity={available ? 0.6 : 0}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={available ? 0.9 : 0.3}
            />
          </mesh>
          
          {/* Count Badge */}
          {count > 0 && (
            <mesh position={[0, 0.8 * scale, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color={accentColor} />
            </mesh>
          )}

          {/* Glow for available cones */}
          {available && (
            <pointLight
              position={[0, 0.5, 0]}
              color={color}
              intensity={0.8}
              distance={1.5}
            />
          )}
        </group>
      ))}

      {/* Point Lights for Bench Glow */}
      <pointLight
        position={[0, 0.5, 0]}
        color={color}
        intensity={1.5}
        distance={4}
      />
    </group>
  );
};
