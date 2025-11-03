import { useRef, useMemo } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';

interface Cone3DProps {
  position: [number, number, number];
  player: number;
  size: number;
  isNew?: boolean;
}

export const Cone3D = ({ position, player, size, isNew = false }: Cone3DProps) => {
  const groupRef = useRef<Group>(null);

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

  // Smoother animations with reduced frequency
  useFrame((state) => {
    if (!groupRef.current) return;

    const scale = getScale();
    
    if (isNew) {
      // Spawn animation
      const elapsed = state.clock.elapsedTime;
      if (elapsed < 0.5) {
        const progress = elapsed * 2;
        groupRef.current.scale.setScalar(progress);
        groupRef.current.position.y = (scale[1] * 0.5) + (1 - progress) * 2;
      }
    } else {
      // Gentle floating - reduced amplitude
      const float = Math.sin(state.clock.elapsedTime * 0.8 + position[0] + position[2]) * 0.03;
      groupRef.current.position.y = (scale[1] * 0.5) + float;
      
      // Slow rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const color = getHolographicColor();
  const rimColor = getRimColor();
  const scale = getScale();
  const [scaleX, scaleY, scaleZ] = scale;

  return (
    <group ref={groupRef} position={position}>
      {/* Main Holographic Cone */}
      <mesh
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
          emissiveIntensity={1.2}
          metalness={1}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Center Light Point */}
      <pointLight
        position={[0, scaleY * 0.8, 0]}
        color={color}
        intensity={1.5}
        distance={2.5}
        decay={2}
      />
    </group>
  );
};
