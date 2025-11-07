import { useRef, useMemo } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { useSettings } from '@/contexts/SettingsContext';
import { getConeStyleColors } from '@/utils/themeColors';
import { CONES } from '@/data/cones';

interface Cone3DProps {
  position: [number, number, number];
  player: number;
  size: number;
  isNew?: boolean;
}

export const Cone3D = ({ position, player, size, isNew = false }: Cone3DProps) => {
  const groupRef = useRef<Group>(null);
  const { coneStyle } = useSettings();

  // Get colors and rarity based on customization
  const colors = useMemo(() => getConeStyleColors(coneStyle, player), [coneStyle, player]);
  const coneData = useMemo(() => CONES.find(c => c.id === coneStyle), [coneStyle]);
  const rarity = coneData?.rarity || 'rare';

  // Scale based on cone size
  const getScale = () => {
    const baseScale = size === 1 ? 0.7 : size === 2 ? 0.9 : 1.1;
    return [baseScale, baseScale * 1.8, baseScale];
  };

  // Smoother animations with rarity-based effects
  useFrame((state) => {
    if (!groupRef.current) return;

    const scale = getScale();
    const time = state.clock.elapsedTime;
    
    if (isNew) {
      // Spawn animation
      if (time < 0.5) {
        const progress = time * 2;
        groupRef.current.scale.setScalar(progress);
        groupRef.current.position.y = (scale[1] * 0.5) + (1 - progress) * 2;
      }
    } else {
      // Base floating
      const float = Math.sin(time * 0.8 + position[0] + position[2]) * 0.03;
      groupRef.current.position.y = (scale[1] * 0.5) + float;
      
      // Rarity-based rotation and effects
      if (rarity === 'legendary') {
        groupRef.current.rotation.y = time * 0.5;
        groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      } else if (rarity === 'mythic') {
        groupRef.current.rotation.y = time * 0.3;
        groupRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
      } else if (rarity === 'epic') {
        groupRef.current.rotation.y = time * 0.2;
      } else {
        groupRef.current.rotation.y = time * 0.15;
      }
    }
  });

  const color = colors.color;
  const rimColor = colors.accent;
  const scale = getScale();
  const [scaleX, scaleY, scaleZ] = scale;

  // Rarity-based material properties
  const getMaterialProps = () => {
    const base = {
      color,
      emissive: color,
      metalness: 0.2,
      roughness: 0.2,
      transmission: 0.5,
      thickness: 0.8,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    };

    switch (rarity) {
      case 'legendary':
        return { ...base, emissiveIntensity: 0.8, metalness: 0.9, clearcoat: 1.5 };
      case 'mythic':
        return { ...base, emissiveIntensity: 0.6, metalness: 0.6, transmission: 0.7 };
      case 'epic':
        return { ...base, emissiveIntensity: 0.4, metalness: 0.4 };
      default:
        return { ...base, emissiveIntensity: 0.3 };
    }
  };

  const materialProps = getMaterialProps();
  const lightIntensity = rarity === 'legendary' ? 2.5 : rarity === 'mythic' ? 2 : rarity === 'epic' ? 1.5 : 1.2;

  return (
    <group ref={groupRef} position={position}>
      {/* Main Cone Body */}
      <mesh
        castShadow
        scale={[scaleX, scaleY, scaleZ]}
        position={[0, scaleY * 0.5, 0]}
      >
        <coneGeometry args={[0.7, 1.5, 32]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      {/* Cone Base Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[scaleX * 0.65, scaleX * 0.8, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={lightIntensity * 0.6}
          metalness={1}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Center Light - Intensity based on rarity */}
      <pointLight
        position={[0, scaleY * 0.8, 0]}
        color={color}
        intensity={lightIntensity}
        distance={rarity === 'legendary' ? 4 : rarity === 'mythic' ? 3 : 2}
        decay={2}
      />

      {/* Legendary glow effect */}
      {rarity === 'legendary' && (
        <>
          <pointLight
            position={[0, scaleY * 0.5, 0]}
            color={rimColor}
            intensity={1.5}
            distance={5}
            decay={2}
          />
          <mesh position={[0, scaleY * 0.7, 0]} scale={[1.2, 1.2, 1.2]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
        </>
      )}

      {/* Mythic particles effect */}
      {rarity === 'mythic' && (
        <pointLight
          position={[0, scaleY * 0.5, 0]}
          color={rimColor}
          intensity={1}
          distance={3.5}
          decay={2}
        />
      )}
    </group>
  );
};
