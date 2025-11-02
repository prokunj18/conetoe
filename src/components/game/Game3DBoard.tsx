import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Cone3D } from './Cone3D';
import { Board3DGrid } from './Board3DGrid';
import { CellData } from '@/types/game';
import { useSettings } from '@/contexts/SettingsContext';

interface Game3DBoardProps {
  board: (CellData | null)[];
  onCellClick: (position: number) => void;
  hoveredCell: number | null;
  onCellHover: (position: number | null) => void;
}

export const Game3DBoard = ({ 
  board, 
  onCellClick, 
  hoveredCell,
  onCellHover 
}: Game3DBoardProps) => {
  const { boardTheme } = useSettings();

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-primary/20 shadow-xl">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 12, 12]} />
        <OrbitControls 
          enablePan={false}
          minDistance={10}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
        />

        {/* Realistic Lighting Setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 15, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 8, -5]} intensity={0.5} />
        <hemisphereLight args={['#87ceeb', '#8b7355', 0.3]} />

        {/* Environment for realistic reflections */}
        <Environment preset="sunset" />

        {/* 3D Game Board */}
        <Board3DGrid 
          board={board}
          boardTheme={boardTheme}
          onCellClick={onCellClick}
          hoveredCell={hoveredCell}
          onCellHover={onCellHover}
        />

        {/* 3D Cones */}
        {board.map((cell, index) => {
          if (!cell) return null;
          
          const row = Math.floor(index / 3);
          const col = index % 3;
          const x = (col - 1) * 3;
          const z = (row - 1) * 3;

          return (
            <Cone3D
              key={index}
              position={[x, 0, z]}
              player={cell.player}
              size={cell.size}
            />
          );
        })}
      </Canvas>
    </div>
  );
};
