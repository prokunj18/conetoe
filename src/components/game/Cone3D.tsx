import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { useSettings } from '@/contexts/SettingsContext';

interface Cone3DProps {
  position: [number, number, number];
  player: number;
  size: number;
}

export const Cone3D = ({ position, player, size }: Cone3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { coneStyle } = useSettings();

  // Animate cone on placement
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.y = scale;
    }
  });

  // Get realistic material colors based on player and cone style
  const getConeColor = () => {
    // Player 1 colors
    if (player === 1) {
      switch (coneStyle) {
        case 'fire': return '#ff4500';
        case 'emerald': return '#10b981';
        case 'galaxy': return '#4169e1';
        case 'golden': return '#ffd700';
        case 'arctic': return '#00ced1';
        case 'shadow': return '#2d3748';
        case 'rainbow': return '#9333ea';
        case 'chrome': return '#94a3b8';
        case 'plasma': return '#06b6d4';
        default: return '#3b82f6'; // classic
      }
    }
    // Player 2 colors
    switch (coneStyle) {
      case 'fire': return '#dc2626';
      case 'emerald': return '#059669';
      case 'galaxy': return '#9370db';
      case 'golden': return '#f59e0b';
      case 'arctic': return '#0891b2';
      case 'shadow': return '#1a202c';
      case 'rainbow': return '#ec4899';
      case 'chrome': return '#64748b';
      case 'plasma': return '#ec4899';
      default: return '#ec4899'; // classic
    }
  };

  // Scale based on cone size
  const getScale = () => {
    const baseScale = size === 1 ? 0.6 : size === 2 ? 0.8 : 1.0;
    return [baseScale, baseScale * 1.5, baseScale];
  };

  const color = getConeColor();
  const scale = getScale();
  const [scaleX, scaleY, scaleZ] = scale;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={[scaleX, scaleY, scaleZ]}
        position={[0, scaleY * 0.5, 0]}
      >
        <coneGeometry args={[0.8, 1.5, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={coneStyle === 'chrome' || coneStyle === 'golden' ? 0.9 : 0.3}
          roughness={coneStyle === 'shadow' ? 0.9 : 0.4}
          emissive={coneStyle === 'plasma' || coneStyle === 'fire' ? color : '#000000'}
          emissiveIntensity={coneStyle === 'plasma' || coneStyle === 'fire' ? 0.4 : 0}
        />
      </mesh>

      {/* Hover indicator */}
      {hovered && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.1, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};
