import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  onComplete,
}: FlyBackAnimationProps) => {
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [endPos, setEndPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!piece || fromPosition === null) return;

    let raf1 = 0;
    let raf2 = 0;

    // Wait for layout to settle (state updates + DOM paint)
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const cellElement = document.querySelector(`[data-cell-index="${fromPosition}"]`);
        const inventoryElement = document.querySelector(`[data-inventory-player="${toPlayer}"]`);

        if (!cellElement || !inventoryElement) {
          onComplete();
          return;
        }

        const cellRect = (cellElement as HTMLElement).getBoundingClientRect();
        const invRect = (inventoryElement as HTMLElement).getBoundingClientRect();

        // If either rect is 0-sized, we won't see anything—fallback safely.
        if (cellRect.width === 0 || cellRect.height === 0 || invRect.width === 0 || invRect.height === 0) {
          onComplete();
          return;
        }

        setStartPos({
          x: cellRect.left + cellRect.width / 2,
          y: cellRect.top + cellRect.height / 2,
        });

        setEndPos({
          x: invRect.left + invRect.width / 2,
          y: invRect.top + invRect.height / 2,
        });
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [piece, fromPosition, toPlayer, onComplete]);

  if (!piece || !startPos || !endPos) return null;

  const midX = (startPos.x + endPos.x) / 2;
  const midY = Math.min(startPos.y, endPos.y) - 120;

  const node = (
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
          zIndex: 9999,
        }}
        animate={{
          left: [startPos.x, midX, endPos.x],
          top: [startPos.y, midY, endPos.y],
          scale: [1, 1.25, 0.85],
          rotate: [0, 180, 360],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
          times: [0, 0.5, 1],
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
            initial={{ opacity: 0.7, scale: 1.6 }}
            animate={{ opacity: [0.7, 1, 0], scale: [1.6, 2.1, 1] }}
            transition={{ duration: 0.8 }}
          />

          {/* The piece itself */}
          <ConePreview player={piece.player} size={piece.size} className="drop-shadow-2xl" />

          {/* Sparkle particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${piece.player === 1 ? "bg-pink-400" : "bg-cyan-400"}`}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i / 6) * Math.PI * 2) * 40,
                y: Math.sin((i / 6) * Math.PI * 2) * 40,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(node, document.body);
};

