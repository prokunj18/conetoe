import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Cone3D } from './Cone3D';
import { Board3DGrid } from './Board3DGrid';
import { PlayerBench3D } from './PlayerBench3D';
import { CellData } from '@/types/game';
import { useSettings } from '@/contexts/SettingsContext';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Game3DErrorBoundary } from './Game3DErrorBoundary';

interface Game3DBoardProps {
  board: (CellData | null)[];
  onCellClick: (position: number) => void;
  hoveredCell: number | null;
  onCellHover: (position: number | null) => void;
}

const Scene = ({ board, onCellClick, hoveredCell, onCellHover, boardTheme }: any) => {
  return (
    <>
      <color attach="background" args={['#000011']} />
      <PerspectiveCamera makeDefault position={[0, 16, 16]} fov={50} />
      <OrbitControls 
        enablePan={false}
        minDistance={12}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 6}
        enableDamping
        dampingFactor={0.08}
      />

      {/* Optimized Lighting Setup */}
      <ambientLight intensity={0.3} />
      
      {/* Key Light */}
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      
      {/* Fill Light */}
      <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#00ffff" />
      
      {/* Rim Light */}
      <directionalLight position={[0, 5, -15]} intensity={0.6} color="#ff00ff" />
      
      {/* Hemisphere for realistic sky/ground lighting */}
      <hemisphereLight args={['#4400ff', '#00ffff', 0.4]} />

      {/* Fog for depth */}
      <fog attach="fog" args={['#000011', 15, 40]} />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Player Benches */}
      <PlayerBench3D player={1} position={[-7, -0.4, 0]} />
      <PlayerBench3D player={2} position={[7, -0.4, 0]} />

      {/* 3D Game Board */}
      <Board3DGrid 
        board={board}
        boardTheme={boardTheme}
        onCellClick={onCellClick}
        hoveredCell={hoveredCell}
        onCellHover={onCellHover}
      />

      {/* 3D Cones */}
      {board.map((cell: CellData | null, index: number) => {
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

      {/* Optimized Post-processing */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
};

export const Game3DBoard = ({ 
  board, 
  onCellClick, 
  hoveredCell,
  onCellHover 
}: Game3DBoardProps) => {
  const { boardTheme } = useSettings();

  return (
    <Game3DErrorBoundary>
      <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-primary/40 shadow-2xl relative">
        <Canvas 
          shadows 
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false
          }} 
          className="bg-transparent"
          dpr={[1, 2]}
          onCreated={(state) => {
            state.gl.setClearColor('#000011');
          }}
        >
          <Suspense fallback={null}>
            <Scene 
              board={board}
              onCellClick={onCellClick}
              hoveredCell={hoveredCell}
              onCellHover={onCellHover}
              boardTheme={boardTheme}
            />
          </Suspense>
        </Canvas>
      </div>
    </Game3DErrorBoundary>
  );
};

