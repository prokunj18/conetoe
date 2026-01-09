import { useCallback } from "react";
import { GameState, CellData, CellStack, getTopCone } from "@/types/game";

interface AIMove {
  position: number;
  coneSize: number;
}

export const useAI = () => {
  // Check winner based on TOP-MOST visible cones only
  const checkWinner = useCallback((board: (CellStack | null)[]): number | null => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const topA = getTopCone(board[a]);
      const topB = getTopCone(board[b]);
      const topC = getTopCone(board[c]);
      
      if (topA && topB && topC &&
          topA.player === topB.player &&
          topB.player === topC.player) {
        return topA.player;
      }
    }
    return null;
  }, []);

  // Evaluate board with stacking awareness
  const evaluateBoard = useCallback((board: (CellStack | null)[], player: number): number => {
    let score = 0;
    const opponent = player === 1 ? 2 : 1;
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const topA = getTopCone(board[a]);
      const topB = getTopCone(board[b]);
      const topC = getTopCone(board[c]);
      const cells = [topA, topB, topC];
      
      const playerCells = cells.filter(cell => cell?.player === player).length;
      const opponentCells = cells.filter(cell => cell?.player === opponent).length;
      const emptyCells = cells.filter(cell => cell === null).length;
      
      // Winning position
      if (playerCells === 3) score += 1000;
      if (opponentCells === 3) score -= 1000;
      
      // Two in a row with empty third
      if (playerCells === 2 && emptyCells === 1) score += 50;
      if (opponentCells === 2 && emptyCells === 1) score -= 50;
      
      // Two in a row where we can gobble the third
      if (playerCells === 2 && opponentCells === 1) {
        // Check if we can gobble the opponent's piece
        const opponentCell = cells.find(c => c?.player === opponent);
        if (opponentCell) {
          score += 30; // Potential gobble opportunity
        }
      }
      
      // Opponent has two in a row where they could gobble us
      if (opponentCells === 2 && playerCells === 1) {
        const ourCell = cells.find(c => c?.player === player);
        if (ourCell && ourCell.size < 4) {
          score -= 40; // Our piece is in danger
        }
      }
      
      // One piece with potential
      if (playerCells === 1 && emptyCells === 2) score += 5;
      if (opponentCells === 1 && emptyCells === 2) score -= 5;
    }

    // Bonus for center control
    const centerTop = getTopCone(board[4]);
    if (centerTop?.player === player) score += 25;
    if (centerTop?.player === opponent) score -= 25;

    // Bonus for corner control
    for (const corner of [0, 2, 6, 8]) {
      const cornerTop = getTopCone(board[corner]);
      if (cornerTop?.player === player) score += 10;
      if (cornerTop?.player === opponent) score -= 10;
    }

    // Evaluate hidden pieces danger - check if moving a top piece would expose opponent's winning piece
    for (let i = 0; i < 9; i++) {
      const stack = board[i];
      if (stack && stack.length > 1) {
        const topCone = stack[stack.length - 1];
        const underCone = stack[stack.length - 2];
        
        if (topCone.player === player && underCone.player === opponent) {
          // We have a piece covering opponent's piece - check if it's in a winning line
          for (const pattern of winPatterns) {
            if (pattern.includes(i)) {
              const [a, b, c] = pattern;
              const others = [a, b, c].filter(p => p !== i);
              const otherTops = others.map(p => getTopCone(board[p]));
              
              if (otherTops.every(t => t?.player === opponent)) {
                // If we move our piece, opponent wins! Don't move this piece.
                score += 100; // This is actually protecting us
              }
            }
          }
        }
      }
    }

    return score;
  }, []);

  // Get all valid moves with stacking support
  const getAllValidMoves = useCallback((gameState: GameState, player: number): AIMove[] => {
    const moves: AIMove[] = [];
    const inventory = gameState.playerInventories[player - 1];

    for (let position = 0; position < 9; position++) {
      for (const coneSize of inventory) {
        const stack = gameState.board[position];
        const topCone = getTopCone(stack);
        
        // Can place on empty cell or on top of smaller cone
        if (!topCone || coneSize > topCone.size) {
          moves.push({ position, coneSize });
        }
      }
    }

    return moves;
  }, []);

  // Simulate a move with proper stacking
  const simulateMove = useCallback((gameState: GameState, move: AIMove, player: number): GameState => {
    const newBoard: (CellStack | null)[] = gameState.board.map(stack => 
      stack ? [...stack] : null
    );
    const newInventories: [number[], number[]] = [
      [...gameState.playerInventories[0]],
      [...gameState.playerInventories[1]]
    ];
    
    const currentInventory = newInventories[player - 1];
    const newCone: CellData = { player, size: move.coneSize };
    
    // Add cone to stack (STACKING - don't return old cone)
    const existingStack = newBoard[move.position];
    if (existingStack) {
      existingStack.push(newCone);
    } else {
      newBoard[move.position] = [newCone];
    }
    
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

  // Minimax with alpha-beta pruning and stacking awareness
  const minimax = useCallback((
    gameState: GameState, 
    depth: number, 
    isMaximizing: boolean, 
    alpha: number = -Infinity, 
    beta: number = Infinity
  ): number => {
    const winner = checkWinner(gameState.board);
    if (winner === 2) return 10000 - depth; // AI wins (prefer faster wins)
    if (winner === 1) return -10000 + depth; // Player wins (delay losses)
    if (depth === 0) return evaluateBoard(gameState.board, 2);

    const moves = getAllValidMoves(gameState, isMaximizing ? 2 : 1);
    if (moves.length === 0) return 0; // No moves = draw

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const newState = simulateMove(gameState, move, 2);
        const evalScore = minimax(newState, depth - 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const newState = simulateMove(gameState, move, 1);
        const evalScore = minimax(newState, depth - 1, true, alpha, beta);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }, [getAllValidMoves, evaluateBoard, checkWinner, simulateMove]);

  // Score a move for strategic value (gobbling priority)
  const scoreMoveStrategically = useCallback((
    gameState: GameState, 
    move: AIMove,
    player: number
  ): number => {
    let score = 0;
    const opponent = player === 1 ? 2 : 1;
    const stack = gameState.board[move.position];
    const topCone = getTopCone(stack);
    
    // GOBBLING PRIORITY: Huge bonus for covering opponent's piece
    if (topCone && topCone.player === opponent) {
      score += 200 + (topCone.size * 50); // More valuable to gobble larger pieces
      
      // Extra bonus if the gobbled piece was part of a line
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      
      for (const pattern of winPatterns) {
        if (pattern.includes(move.position)) {
          const [a, b, c] = pattern;
          const others = [a, b, c].filter(p => p !== move.position);
          const otherTops = others.map(p => getTopCone(gameState.board[p]));
          
          // Breaking opponent's two-in-a-row
          if (otherTops.filter(t => t?.player === opponent).length >= 1) {
            score += 100;
          }
        }
      }
    }
    
    // Bonus for center and corners
    if (move.position === 4) score += 30;
    if ([0, 2, 6, 8].includes(move.position)) score += 15;
    
    // Prefer using smaller cones when possible (save big ones for gobbling)
    if (!topCone) {
      score += (5 - move.coneSize) * 5; // Prefer smaller for empty cells
    }
    
    // Check if this move would expose a dangerous hidden piece if we later move away
    // (Penalty for creating risky stacks where opponent is underneath)
    if (stack && stack.length > 0) {
      const hasOpponentUnderneath = stack.some(c => c.player === opponent);
      if (hasOpponentUnderneath) {
        score -= 20; // Small penalty, we might want to do this anyway
      }
    }
    
    return score;
  }, []);

  const makeAIMove = useCallback((gameState: GameState, difficulty: string): AIMove | null => {
    const validMoves = getAllValidMoves(gameState, 2);
    
    if (validMoves.length === 0) return null;

    switch (difficulty) {
      case "easy": {
        // 60% random, 40% try to win/block
        if (Math.random() < 0.6) {
          return validMoves[Math.floor(Math.random() * validMoves.length)];
        }
        
        // Try to win
        for (const move of validMoves) {
          const testState = simulateMove(gameState, move, 2);
          if (checkWinner(testState.board) === 2) {
            return move;
          }
        }
        
        return validMoves[Math.floor(Math.random() * validMoves.length)];
      }

      case "normal": {
        // Try to win first
        for (const move of validMoves) {
          const testState = simulateMove(gameState, move, 2);
          if (checkWinner(testState.board) === 2) {
            return move;
          }
        }

        // Block opponent wins by gobbling their pieces
        const opponentMoves = getAllValidMoves(gameState, 1);
        for (const oppMove of opponentMoves) {
          const oppTestState = simulateMove(gameState, oppMove, 1);
          if (checkWinner(oppTestState.board) === 1) {
            // Find a move that blocks this
            for (const move of validMoves) {
              if (move.position === oppMove.position) {
                return move; // Gobble the position they need
              }
            }
          }
        }

        // Look for gobbling opportunities
        const gobbleMoves = validMoves.filter(move => {
          const topCone = getTopCone(gameState.board[move.position]);
          return topCone && topCone.player === 1;
        });
        
        if (gobbleMoves.length > 0 && Math.random() < 0.5) {
          return gobbleMoves[Math.floor(Math.random() * gobbleMoves.length)];
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
        // Search depth based on difficulty
        const searchDepth = difficulty === "master" ? 7 : 5;
        
        // First check for immediate wins
        for (const move of validMoves) {
          const testState = simulateMove(gameState, move, 2);
          if (checkWinner(testState.board) === 2) {
            return move;
          }
        }
        
        // Then block immediate opponent wins
        const opponentMoves = getAllValidMoves(gameState, 1);
        for (const oppMove of opponentMoves) {
          const oppTestState = simulateMove(gameState, oppMove, 1);
          if (checkWinner(oppTestState.board) === 1) {
            // Find the best blocking move
            const blockingMoves = validMoves.filter(m => m.position === oppMove.position);
            if (blockingMoves.length > 0) {
              // Prefer smallest cone that can block
              blockingMoves.sort((a, b) => a.coneSize - b.coneSize);
              return blockingMoves[0];
            }
          }
        }
        
        // Use minimax with strategic scoring
        let bestMove = validMoves[0];
        let bestScore = -Infinity;
        
        for (const move of validMoves) {
          const newState = simulateMove(gameState, move, 2);
          const minimaxScore = minimax(newState, searchDepth, false);
          const strategicScore = scoreMoveStrategically(gameState, move, 2);
          const totalScore = minimaxScore + strategicScore;
          
          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestMove = move;
          }
        }

        return bestMove;
      }

      default:
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
  }, [getAllValidMoves, minimax, checkWinner, simulateMove, scoreMoveStrategically]);

  return { makeAIMove };
};
