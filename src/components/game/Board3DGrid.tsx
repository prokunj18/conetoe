import { useMemo } from 'react';
import { CellData } from '@/types/game';
import * as THREE from 'three';

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
  
  // Generate grid cells
  const cells = useMemo(() => {
    const cellArray = [];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const x = (col - 1) * 3;
      const z = (row - 1) * 3;
      cellArray.push({ index: i, x, z });
    }
    return cellArray;
  }, []);

  // Get board material based on theme
  const getBoardColor = () => {
    switch (boardTheme) {
      case 'wooden':
        return '#8b7355';
      case 'neon':
        return '#1a1a2e';
      case 'space':
        return '#0f0f23';
      default:
        return '#374151';
    }
  };

  const getGridColor = () => {
    switch (boardTheme) {
      case 'wooden':
        return '#654321';
      case 'neon':
        return '#00ffff';
      case 'space':
        return '#4169e1';
      default:
        return '#1f2937';
    }
  };

  const boardColor = getBoardColor();
  const gridColor = getGridColor();

  return (
    <group>
      {/* Main Board Platform */}
      <mesh receiveShadow position={[0, -0.2, 0]}>
        <boxGeometry args={[10, 0.4, 10]} />
        <meshStandardMaterial 
          color={boardColor}
          metalness={boardTheme === 'neon' ? 0.8 : 0.2}
          roughness={boardTheme === 'wooden' ? 0.95 : 0.6}
        />
      </mesh>

      {/* Grid Cells */}
      {cells.map(({ index, x, z }) => (
        <mesh
          key={index}
          position={[x, 0.05, z]}
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onCellClick(index);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onCellHover(index);
          }}
          onPointerOut={() => onCellHover(null)}
        >
          <boxGeometry args={[2.7, 0.1, 2.7]} />
          <meshStandardMaterial
            color={hoveredCell === index ? gridColor : boardColor}
            metalness={0.4}
            roughness={0.7}
            emissive={hoveredCell === index ? gridColor : '#000000'}
            emissiveIntensity={hoveredCell === index ? 0.3 : 0}
          />
        </mesh>
      ))}

      {/* Grid Lines */}
      {[0, 1].map((i) => (
        <group key={`lines-${i}`}>
          {/* Horizontal lines */}
          <mesh position={[0, 0.11, (i - 0.5) * 3]}>
            <boxGeometry args={[9, 0.05, 0.1]} />
            <meshStandardMaterial color={gridColor} />
          </mesh>
          {/* Vertical lines */}
          <mesh position={[(i - 0.5) * 3, 0.11, 0]}>
            <boxGeometry args={[0.1, 0.05, 9]} />
            <meshStandardMaterial color={gridColor} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
