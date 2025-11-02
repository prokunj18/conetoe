import { useRef } from 'react';
import { CellData } from '@/types/game';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface Board3DGridProps {
  board: (CellData | null)[];
  boardTheme: string;
  onCellClick: (position: number) => void;
  hoveredCell: number | null;
  onCellHover: (position: number | null) => void;
}

export const Board3DGrid = ({ 
  board, 
  boardTheme, 
  onCellClick, 
  hoveredCell,
  onCellHover 
}: Board3DGridProps) => {
  const platformRef = useRef<Mesh>(null);
  
  // Animate platform glow
  useFrame((state) => {
    if (platformRef.current) {
      const glow = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 + 0.8;
      // @ts-ignore
      platformRef.current.material.emissiveIntensity = glow;
    }
  });

  // Generate grid cells
  const cells = [];
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = (col - 1) * 3;
    const z = (row - 1) * 3;
    cells.push({ index: i, x, z });
  }

  return (
    <group>
      {/* Main Platform Base with Multiple Layers */}
      <group position={[0, -0.5, 0]}>
        {/* Bottom Tier - Holographic Platform */}
        <mesh receiveShadow position={[0, -0.3, 0]}>
          <boxGeometry args={[11, 0.3, 11]} />
          <meshStandardMaterial
            color="#1a0033"
            emissive="#6600ff"
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.2}
          />
        </mesh>

        {/* Neon Edge Glow - Bottom */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[11.2, 0.15, 11.2]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
            transparent
            opacity={0.7}
            metalness={1}
          />
        </mesh>

        {/* Second Tier */}
        <mesh receiveShadow>
          <boxGeometry args={[10.5, 0.4, 10.5]} />
          <meshStandardMaterial
            color="#2d004d"
            emissive="#8800ff"
            emissiveIntensity={0.7}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Neon Edge Glow - Middle */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[10.7, 0.1, 10.7]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={2.5}
            transparent
            opacity={0.8}
            metalness={1}
          />
        </mesh>
      </group>

      {/* Main Game Board Platform */}
      <mesh ref={platformRef} receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[10, 0.3, 10]} />
        <meshStandardMaterial
          color="#0a0015"
          emissive="#4400ff"
          emissiveIntensity={0.6}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glass Grid Cells */}
      {cells.map(({ index, x, z }) => (
        <mesh
          key={index}
          position={[x, 0.15, z]}
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onCellClick(index);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onCellHover(index);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            onCellHover(null);
            document.body.style.cursor = 'default';
          }}
        >
          <boxGeometry args={[2.6, 0.2, 2.6]} />
          <meshStandardMaterial
            color={hoveredCell === index ? '#00ffff' : '#1a0033'}
            emissive={hoveredCell === index ? '#00ffff' : '#6600cc'}
            emissiveIntensity={hoveredCell === index ? 1.5 : 0.4}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Neon Grid Lines */}
      {[0, 1].map((i) => (
        <group key={`lines-${i}`}>
          {/* Horizontal lines */}
          <mesh position={[0, 0.26, (i - 0.5) * 3]}>
            <boxGeometry args={[9, 0.08, 0.08]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={3}
              metalness={1}
              roughness={0}
            />
          </mesh>
          {/* Vertical lines */}
          <mesh position={[(i - 0.5) * 3, 0.26, 0]}>
            <boxGeometry args={[0.08, 0.08, 9]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={3}
              metalness={1}
              roughness={0}
            />
          </mesh>
        </group>
      ))}

      {/* Corner Light Accents */}
      {[-4.5, 4.5].map((x) =>
        [-4.5, 4.5].map((z) => (
          <pointLight
            key={`${x}-${z}`}
            position={[x, 0.5, z]}
            color="#00ffff"
            intensity={1}
            distance={2}
          />
        ))
      )}
    </group>
  );
};
