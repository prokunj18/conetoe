import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface PlayerBench3DProps {
  player: number;
  position: [number, number, number];
}

export const PlayerBench3D = ({ player, position }: PlayerBench3DProps) => {
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

  return (
    <group position={position}>
      {/* Main Bench Platform */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.3, 6]} />
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
        <boxGeometry args={[2, 0.1, 6]} />
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
        <boxGeometry args={[2.1, 0.05, 6.1]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Side Accent Lights */}
      {[-2.8, 2.8].map((z) => (
        <mesh key={z} position={[0, 0.15, z]}>
          <cylinderGeometry args={[0.1, 0.1, 0.3]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2}
          />
        </mesh>
      ))}

      {/* Point Lights for Glow */}
      <pointLight
        position={[0, 0.5, 0]}
        color={color}
        intensity={1.5}
        distance={4}
      />
    </group>
  );
};
