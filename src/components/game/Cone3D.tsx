import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { useSettings } from '@/contexts/SettingsContext';

interface Cone3DProps {
  position: [number, number, number];
  player: number;
  size: number;
}

export const Cone3D = ({ position, player, size }: Cone3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  // Holographic iridescent animation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const float = Math.sin(state.clock.elapsedTime * 1.5 + position[0] + position[2]) * 0.05;
      meshRef.current.position.y = (getScale()[1] * 0.5) + float;
      
      // Subtle rotation for holographic effect
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }

    if (ringRef.current) {
      // Pulsing glow ring
      const pulse = (Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5) * 0.3 + 0.7;
      ringRef.current.scale.setScalar(pulse);
    }
  });

  // Get holographic colors based on player
  const getHolographicColor = () => {
    return player === 1 ? '#00ffff' : '#ff00ff';
  };

  const getRimColor = () => {
    return player === 1 ? '#ff00ff' : '#00ffff';
  };

  // Scale based on cone size
  const getScale = () => {
    const baseScale = size === 1 ? 0.7 : size === 2 ? 0.9 : 1.1;
    return [baseScale, baseScale * 1.8, baseScale];
  };

  const color = getHolographicColor();
  const rimColor = getRimColor();
  const scale = getScale();
  const [scaleX, scaleY, scaleZ] = scale;

  return (
    <group position={position}>
      {/* Main Holographic Cone */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        scale={[scaleX, scaleY, scaleZ]}
        position={[0, scaleY * 0.5, 0]}
      >
        <coneGeometry args={[0.7, 1.5, 32]} />
        <MeshTransmissionMaterial
          color={color}
          thickness={0.5}
          roughness={0.1}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.5}
          anisotropy={1}
          distortion={0.3}
          distortionScale={0.2}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={rimColor}
        />
      </mesh>

      {/* Cone Base Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[scaleX * 0.65, scaleX * 0.8, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          metalness={1}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Pulsing Glow Ring */}
      <mesh ref={ringRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[scaleX * 0.85, scaleX * 0.95, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Center Light Point */}
      <pointLight
        position={[0, scaleY * 0.8, 0]}
        color={color}
        intensity={2}
        distance={3}
      />
    </group>
  );
};
