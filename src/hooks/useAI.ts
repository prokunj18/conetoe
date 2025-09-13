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

  const minimax = useCallback((
    gameState: GameState, 
    depth: number, 
    isMaximizing: boolean, 
    alpha: number = -Infinity, 
    beta: number = Infinity
  ): number => {
    // Check terminal states
    const winner = checkWinner(gameState.board);
    if (winner === 2) return 1000 - depth; // AI wins
    if (winner === 1) return -1000 + depth; // Player wins
    if (depth === 0) return evaluateBoard(gameState.board, 2) - evaluateBoard(gameState.board, 1);

    const moves = getAllValidMoves(gameState, isMaximizing ? 2 : 1);
    if (moves.length === 0) return 0; // Draw

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const newState = simulateMove(gameState, move, 2);
        const eval_score = minimax(newState, depth - 1, false, alpha, beta);
        maxEval = Math.max(maxEval, eval_score);
        alpha = Math.max(alpha, eval_score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const newState = simulateMove(gameState, move, 1);
        const eval_score = minimax(newState, depth - 1, true, alpha, beta);
        minEval = Math.min(minEval, eval_score);
        beta = Math.min(beta, eval_score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minEval;
    }
  }, [getAllValidMoves, evaluateBoard]);

  const checkWinner = useCallback((board: (CellData | null)[]): number | null => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[b] && board[c] &&
          board[a]!.player === board[b]!.player &&
          board[b]!.player === board[c]!.player) {
        return board[a]!.player;
      }
    }
    return null;
  }, []);

  const simulateMove = useCallback((gameState: GameState, move: AIMove, player: number): GameState => {
    const newBoard = [...gameState.board];
    const newInventories: [number[], number[]] = [
      [...gameState.playerInventories[0]],
      [...gameState.playerInventories[1]]
    ];
    
    const currentInventory = newInventories[player - 1];
    
    // Handle replacement
    const existingCell = newBoard[move.position];
    if (existingCell) {
      newInventories[existingCell.player - 1].push(existingCell.size);
    }

    // Place new cone
    newBoard[move.position] = { player, size: move.coneSize };
    
    // Remove cone from inventory
    const coneIndex = currentInventory.indexOf(move.coneSize);
    currentInventory.splice(coneIndex, 1);

    return {
      ...gameState,
      board: newBoard,
      playerInventories: newInventories,
      currentPlayer: player === 1 ? 2 : 1 as 1 | 2,
    };
  }, []);

  const makeAIMove = useCallback((gameState: GameState, difficulty: string): AIMove | null => {
    const validMoves = getAllValidMoves(gameState, 2);
    
    if (validMoves.length === 0) return null;

    switch (difficulty) {
      case "easy": {
        // 70% random, 30% try to win/block
        if (Math.random() < 0.7) {
          return validMoves[Math.floor(Math.random() * validMoves.length)];
        }
        // Fall through to basic logic
      }

      case "normal": {
        // Try to win first
        for (const move of validMoves) {
          const testState = simulateMove(gameState, move, 2);
          if (checkWinner(testState.board) === 2) {
            return move;
          }
        }

        // Block opponent wins
        for (const move of validMoves) {
          const testState = simulateMove(gameState, move, 1);
          if (checkWinner(testState.board) === 1) {
            return move;
          }
        }

        // Prefer center and corners
        const priorityMoves = validMoves.filter(m => [4, 0, 2, 6, 8].includes(m.position));
        if (priorityMoves.length > 0) {
          return priorityMoves[Math.floor(Math.random() * priorityMoves.length)];
        }

        return validMoves[Math.floor(Math.random() * validMoves.length)];
      }

      case "hard":
      case "master": {
        let bestMove = validMoves[0];
        let bestScore = -Infinity;

        // Use minimax for unbeatable play
        const searchDepth = difficulty === "master" ? 8 : 6;
        
        for (const move of validMoves) {
          const newState = simulateMove(gameState, move, 2);
          const score = minimax(newState, searchDepth, false);
          
          // Add strategic bonuses
          let adjustedScore = score;
          
          // Prefer center
          if (move.position === 4) adjustedScore += 10;
          
          // Prefer corners
          if ([0, 2, 6, 8].includes(move.position)) adjustedScore += 5;
          
          // Prefer larger cones for control
          adjustedScore += move.coneSize * 2;
          
          // Bonus for capturing opponent pieces
          const cell = gameState.board[move.position];
          if (cell && cell.player === 1) {
            adjustedScore += cell.size * 3;
          }

          if (adjustedScore > bestScore) {
            bestScore = adjustedScore;
            bestMove = move;
          }
        }

        return bestMove;
      }

      default:
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
  }, [getAllValidMoves, minimax, checkWinner, simulateMove]);

  return { makeAIMove };
};