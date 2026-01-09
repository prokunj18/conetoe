import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConePreview } from "./ConePreview";
import { CellData } from "@/types/game";

interface FlyBackAnimationProps {
  piece: CellData | null;
  fromPosition: number | null;
  toPlayer: number;
  onComplete: () => void;
}

export const FlyBackAnimation = ({ 
  piece, 
  fromPosition, 
  toPlayer, 
  onComplete 
}: FlyBackAnimationProps) => {
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [endPos, setEndPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (piece && fromPosition !== null) {
      // Get position of the board cell
      const cellElement = document.querySelector(`[data-cell-index="${fromPosition}"]`);
      // Get position of the inventory slot for this player
      const inventoryElement = document.querySelector(`[data-inventory-player="${toPlayer}"]`);
      
      if (cellElement && inventoryElement) {
        const cellRect = cellElement.getBoundingClientRect();
        const invRect = inventoryElement.getBoundingClientRect();
        
        setStartPos({
          x: cellRect.left + cellRect.width / 2,
          y: cellRect.top + cellRect.height / 2
        });
        
        setEndPos({
          x: invRect.left + invRect.width / 2,
          y: invRect.top + invRect.height / 2
        });
      } else {
        // Fallback: just complete without animation
        onComplete();
      }
    }
  }, [piece, fromPosition, toPlayer, onComplete]);

  if (!piece || !startPos || !endPos) return null;

  const midX = (startPos.x + endPos.x) / 2;
  const midY = Math.min(startPos.y, endPos.y) - 100; // Arc upward

  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div
        initial={{ 
          position: "fixed",
          left: startPos.x,
          top: startPos.y,
          x: "-50%",
          y: "-50%",
          scale: 1,
          opacity: 1,
          zIndex: 1000
        }}
        animate={{
          left: [startPos.x, midX, endPos.x],
          top: [startPos.y, midY, endPos.y],
          scale: [1, 1.3, 0.8],
          rotate: [0, 180, 360],
          opacity: [1, 1, 0]
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
          times: [0, 0.5, 1]
        }}
        onAnimationComplete={onComplete}
        className="pointer-events-none"
      >
        <div className="relative">
          {/* Glow trail effect */}
          <motion.div
            className={`absolute inset-0 rounded-full blur-xl ${
              piece.player === 1 
                ? "bg-gradient-to-r from-pink-500 to-violet-500" 
                : "bg-gradient-to-r from-cyan-500 to-blue-500"
            }`}
            initial={{ opacity: 0.8, scale: 1.5 }}
            animate={{ opacity: [0.8, 1, 0], scale: [1.5, 2, 1] }}
            transition={{ duration: 0.8 }}
          />
          
          {/* The piece itself */}
          <ConePreview 
            player={piece.player} 
            size={piece.size}
            className="drop-shadow-2xl"
          />
          
          {/* Sparkle particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                piece.player === 1 ? "bg-pink-400" : "bg-cyan-400"
              }`}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1, 
                scale: 1 
              }}
              animate={{
                x: Math.cos((i / 6) * Math.PI * 2) * 40,
                y: Math.sin((i / 6) * Math.PI * 2) * 40,
                opacity: 0,
                scale: 0
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
