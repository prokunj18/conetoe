import { useCallback } from "react";
import { GameState, CellData, CellStack, getTopCone } from "@/types/game";
import { aiMemory } from "@/services/AIMemoryService";

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
      if (opponentCells === 2 && emptyCells === 1) score -= 70; // Higher penalty for opponent threats
      
      // Two in a row where we can gobble the third
      if (playerCells === 2 && opponentCells === 1) {
        const opponentCell = cells.find(c => c?.player === opponent);
        if (opponentCell) {
          score += 60; // Higher bonus for gobble opportunity
        }
      }
      
      // Opponent has two in a row where they could gobble us
      if (opponentCells === 2 && playerCells === 1) {
        const ourCell = cells.find(c => c?.player === player);
        if (ourCell && ourCell.size < 4) {
          score -= 80; // Higher penalty - our piece is in danger
        }
      }
      
      // One piece with potential
      if (playerCells === 1 && emptyCells === 2) score += 5;
      if (opponentCells === 1 && emptyCells === 2) score -= 5;
    }

    // Bonus for center control
    const centerTop = getTopCone(board[4]);
    if (centerTop?.player === player) score += 35;
    if (centerTop?.player === opponent) score -= 35;

    // Bonus for corner control
    for (const corner of [0, 2, 6, 8]) {
      const cornerTop = getTopCone(board[corner]);
      if (cornerTop?.player === player) score += 15;
      if (cornerTop?.player === opponent) score -= 15;
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
                score += 150; // This is actually protecting us
              }
            }
          }
        }
      }
    }

    // Apply AI memory penalty for known losing patterns
    const memoryPenalty = aiMemory.getPatternPenalty(board);
    if (memoryPenalty > 0) {
      score -= memoryPenalty;
    }

    return score;
  }, []);

  // Get all valid moves with stacking support
  // NOTE: inventory may contain duplicates (because returned pieces are identical),
  // but for search purposes identical sizes are interchangeable, so we dedupe to keep branching manageable.
  const getAllValidMoves = useCallback((gameState: GameState, player: number): AIMove[] => {
    const moves: AIMove[] = [];
    const inventory = gameState.playerInventories[player - 1];
    const uniqueSizes = Array.from(new Set(inventory));

    for (let position = 0; position < 9; position++) {
      const stack = gameState.board[position];
      const topCone = getTopCone(stack);

      for (const coneSize of uniqueSizes) {
        if (!topCone || coneSize > topCone.size) {
          moves.push({ position, coneSize });
        }
      }
    }

    return moves;
  }, []);


  // Simulate a move with proper stacking and conditional return logic
  const simulateMove = useCallback((gameState: GameState, move: AIMove, player: number): GameState => {
    const newBoard: (CellStack | null)[] = gameState.board.map(stack => 
      stack ? [...stack] : null
    );
    const newInventories: [number[], number[]] = [
      [...gameState.playerInventories[0]],
      [...gameState.playerInventories[1]]
    ];
    const newPlayerMoves: [number, number] = [...gameState.playerMoves];
    
    const currentInventory = newInventories[player - 1];
    const newCone: CellData = { player, size: move.coneSize };
    
    const existingStack = newBoard[move.position];
    const topCone = getTopCone(existingStack);
    
    if (existingStack && topCone) {
      // GOBBLING: Check conditional return
      const gobbledPlayer = topCone.player;
      const gobbledPlayerInventory = newInventories[gobbledPlayer - 1];
      const gobbledPlayerMoves = newPlayerMoves[gobbledPlayer - 1];
      
      const shouldReturnToInventory = 
        gobbledPlayerInventory.length === 0 || 
        gobbledPlayerMoves >= 4;
      
      if (shouldReturnToInventory) {
        const removedCone = existingStack.pop();
        if (removedCone) {
          newInventories[gobbledPlayer - 1].push(removedCone.size);
        }
        if (existingStack.length === 0) {
          newBoard[move.position] = [newCone];
        } else {
          existingStack.push(newCone);
        }
      } else {
        existingStack.push(newCone);
      }
    } else {
      newBoard[move.position] = [newCone];
    }
    
    // Remove cone from inventory
    const coneIndex = currentInventory.indexOf(move.coneSize);
    currentInventory.splice(coneIndex, 1);
    
    // Track moves
    newPlayerMoves[player - 1]++;

    return {
      ...gameState,
      board: newBoard,
      playerInventories: newInventories,
      playerMoves: newPlayerMoves,
      currentPlayer: player === 1 ? 2 : 1 as 1 | 2,
    };
  }, []);

  // Minimax with alpha-beta pruning, deeper search, and memory awareness
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
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const newState = simulateMove(gameState, move, 1);
        const evalScore = minimax(newState, depth - 1, true, alpha, beta);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minEval;
    }
  }, [getAllValidMoves, evaluateBoard, checkWinner, simulateMove]);

  // Score a move for strategic value (aggressive gobbling priority)
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
      score += 300 + (topCone.size * 75); // Even more valuable to gobble larger pieces
      
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
            score += 150;
          }
          
          // Completing our line by gobbling
          if (otherTops.filter(t => t?.player === player).length === 2) {
            score += 500; // Winning move!
          }
        }
      }
    }
    
    // Bonus for center and corners
    if (move.position === 4) score += 40;
    if ([0, 2, 6, 8].includes(move.position)) score += 20;
    
    // Prefer using smaller cones for empty cells (save big ones for gobbling)
    if (!topCone) {
      score += (5 - move.coneSize) * 8;
    }
    
    // Check if this move creates a threat
    const newState = simulateMove(gameState, move, player);
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (const pattern of winPatterns) {
      if (pattern.includes(move.position)) {
        const cells = pattern.map(p => getTopCone(newState.board[p]));
        const playerCells = cells.filter(c => c?.player === player).length;
        const emptyCells = cells.filter(c => c === null).length;
        
        // Creating a threat (2 in a row with empty/gobbable third)
        if (playerCells === 2 && emptyCells === 1) {
          score += 80;
        }
      }
    }
    
    // Memory-based penalty: avoid moves that lead to known losing patterns
    const memoryPenalty = aiMemory.getPatternPenalty(newState.board);
    score -= memoryPenalty;
    
    return score;
  }, [simulateMove]);

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

      case "hard": {
        // Search depth 6 for hard
        const searchDepth = 6;
        
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
            const blockingMoves = validMoves.filter(m => m.position === oppMove.position);
            if (blockingMoves.length > 0) {
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

      case "master": {
        // MASTER AI: deeper search + alpha-beta + aggressive gobbling + working loss-avoidance.
        // We also use a small transposition cache so we can search deeper without freezing.
        const searchDepth = 12;
        const cache = new Map<string, number>();

        // local helper to hash board stacks (no symmetry here; cache wants exact)
        const hashBoard = (board: (CellStack | null)[]) =>
          board
            .map((stack) => (!stack || stack.length === 0 ? "0" : stack.map((c) => `${c.player}${c.size}`).join("")))
            .join("-");

        const stateKey = (s: GameState, depthLeft: number, maximizing: boolean) => {
          const inv1 = [...s.playerInventories[0]].sort((a, b) => a - b).join("");
          const inv2 = [...s.playerInventories[1]].sort((a, b) => a - b).join("");
          // Include full stacks + inventories + turn in cache key
          return `${hashBoard(s.board)}|${inv1}|${inv2}|p${s.currentPlayer}|m${maximizing ? 1 : 0}|d${depthLeft}`;
        };

        const minimaxCached = (
          s: GameState,
          depthLeft: number,
          maximizing: boolean,
          alpha: number,
          beta: number
        ): number => {
          const winner = checkWinner(s.board);
          if (winner === 2) return 10000 - (searchDepth - depthLeft);
          if (winner === 1) return -10000 + (searchDepth - depthLeft);
          if (depthLeft === 0) return evaluateBoard(s.board, 2);

          const key = stateKey(s, depthLeft, maximizing);
          const cached = cache.get(key);
          if (cached !== undefined) return cached;

          const movesHere = getAllValidMoves(s, maximizing ? 2 : 1);
          if (movesHere.length === 0) return 0;

          // Move ordering: gobbles first, then bigger cones (more decisive), then center/corners.
          movesHere.sort((a, b) => {
            const aTop = getTopCone(s.board[a.position]);
            const bTop = getTopCone(s.board[b.position]);
            const aGob = aTop?.player === (maximizing ? 1 : 2) ? 1 : 0;
            const bGob = bTop?.player === (maximizing ? 1 : 2) ? 1 : 0;
            if (aGob !== bGob) return bGob - aGob;
            if (a.coneSize !== b.coneSize) return b.coneSize - a.coneSize;
            const prio = (p: number) => (p === 4 ? 3 : [0, 2, 6, 8].includes(p) ? 2 : 1);
            return prio(b.position) - prio(a.position);
          });

          let best: number;
          if (maximizing) {
            best = -Infinity;
            for (const mv of movesHere) {
              const ns = simulateMove(s, mv, 2);
              // Hard-avoid learned losing patterns
              if (aiMemory.getPatternPenalty(ns.board) > 0) continue;
              const v = minimaxCached(ns, depthLeft - 1, false, alpha, beta);
              best = Math.max(best, v);
              alpha = Math.max(alpha, v);
              if (beta <= alpha) break;
            }
          } else {
            best = Infinity;
            for (const mv of movesHere) {
              const ns = simulateMove(s, mv, 1);
              const v = minimaxCached(ns, depthLeft - 1, true, alpha, beta);
              best = Math.min(best, v);
              beta = Math.min(beta, v);
              if (beta <= alpha) break;
            }
          }

          cache.set(key, best);
          return best;
        };

        // Immediate win
        for (const move of validMoves) {
          const testState = simulateMove(gameState, move, 2);
          if (checkWinner(testState.board) === 2) return move;
        }

        // Immediate block (by playing the threatened square, often via gobble)
        const opponentMoves = getAllValidMoves(gameState, 1);
        for (const oppMove of opponentMoves) {
          const oppTestState = simulateMove(gameState, oppMove, 1);
          if (checkWinner(oppTestState.board) === 1) {
            const blockingMoves = validMoves.filter((m) => m.position === oppMove.position);
            if (blockingMoves.length > 0) {
              // Prefer smallest that can legally be placed there
              blockingMoves.sort((a, b) => a.coneSize - b.coneSize);
              return blockingMoves[0];
            }
          }
        }

        // Full search: combine cached minimax + strategic aggression + learning
        let bestMove = validMoves[0];
        let bestScore = -Infinity;

        for (const move of validMoves) {
          const ns = simulateMove(gameState, move, 2);

          // If this move leads to a learned losing state, skip it entirely.
          if (aiMemory.getPatternPenalty(ns.board) > 0) continue;

          const minimaxScore = minimaxCached(ns, searchDepth, false, -Infinity, Infinity);
          const strategicScore = scoreMoveStrategically(gameState, move, 2);

          // Extra gobble bonus so it actively disrupts your board.
          const top = getTopCone(gameState.board[move.position]);
          const gobbleBonus = top && top.player === 1 ? 160 + top.size * 40 : 0;

          const total = minimaxScore + strategicScore + gobbleBonus;
          if (total > bestScore) {
            bestScore = total;
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
