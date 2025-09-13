import { useCallback } from "react";
import { GameState, CellData } from "@/types/game";

interface AIMove {
  position: number;
  coneSize: number;
}

export const useAI = () => {
  const evaluateBoard = useCallback((board: (CellData | null)[], player: number): number => {
    let score = 0;
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const cells = [board[a], board[b], board[c]];
      const playerCells = cells.filter(cell => cell?.player === player).length;
      const opponentCells = cells.filter(cell => cell?.player !== player && cell !== null).length;
      
      if (opponentCells === 0) {
        score += playerCells * playerCells;
      } else if (playerCells === 0) {
        score -= opponentCells * opponentCells;
      }
    }

    return score;
  }, []);

  const getAllValidMoves = useCallback((gameState: GameState, player: number): AIMove[] => {
    const moves: AIMove[] = [];
    const inventory = gameState.playerInventories[player - 1];

    for (let position = 0; position < 9; position++) {
      for (const coneSize of inventory) {
        const cell = gameState.board[position];
        if (!cell || cell.size < coneSize) {
          moves.push({ position, coneSize });
        }
      }
    }

    return moves;
  }, []);

  const makeAIMove = useCallback((gameState: GameState, difficulty: string): AIMove | null => {
    const validMoves = getAllValidMoves(gameState, 2);
    
    if (validMoves.length === 0) return null;

    switch (difficulty) {
      case "easy":
        return validMoves[Math.floor(Math.random() * validMoves.length)];

      case "normal": {
        // Try to win first
        for (const move of validMoves) {
          const testBoard = [...gameState.board];
          testBoard[move.position] = { player: 2, size: move.coneSize };
          if (evaluateBoard(testBoard, 2) >= 9) {
            return move;
          }
        }

        // Block opponent wins
        for (const move of validMoves) {
          const testBoard = [...gameState.board];
          testBoard[move.position] = { player: 1, size: move.coneSize };
          if (evaluateBoard(testBoard, 1) >= 9) {
            return move;
          }
        }

        // Random valid move
        return validMoves[Math.floor(Math.random() * validMoves.length)];
      }

      case "hard":
      case "master": {
        let bestMove = validMoves[0];
        let bestScore = -Infinity;

        for (const move of validMoves) {
          const testBoard = [...gameState.board];
          const cell = testBoard[move.position];
          
          // Simulate move
          testBoard[move.position] = { player: 2, size: move.coneSize };
          
          let score = evaluateBoard(testBoard, 2);
          
          // Bonus for center control
          if (move.position === 4) score += 3;
          
          // Bonus for corners
          if ([0, 2, 6, 8].includes(move.position)) score += 2;
          
          // Bonus for using larger cones
          score += move.coneSize;
          
          // Bonus for replacements
          if (cell) score += cell.size;

          if (difficulty === "master") {
            // Look ahead one move
            const opponentMoves = getAllValidMoves({
              ...gameState,
              board: testBoard,
              currentPlayer: 1
            }, 1);
            
            let worstOpponentScore = Infinity;
            for (const opMove of opponentMoves.slice(0, 5)) { // Limit for performance
              const testBoard2 = [...testBoard];
              testBoard2[opMove.position] = { player: 1, size: opMove.coneSize };
              const opScore = evaluateBoard(testBoard2, 1);
              worstOpponentScore = Math.min(worstOpponentScore, opScore);
            }
            score -= worstOpponentScore * 0.5;
          }

          if (score > bestScore) {
            bestScore = score;
            bestMove = move;
          }
        }

        return bestMove;
      }

      default:
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
  }, [getAllValidMoves, evaluateBoard]);

  return { makeAIMove };
};