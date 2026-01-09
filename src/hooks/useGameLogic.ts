import { useState, useCallback, useEffect } from "react";
import { GameState, GameConfig, CellData, MoveResult, CellStack, getTopCone } from "@/types/game";
import { useAI } from "./useAI";
import { CONES } from "@/data/cones";
import { aiMemory } from "@/services/AIMemoryService";

const initialInventory = (): number[] => [1, 2, 3, 4];

const createInitialState = (): GameState => ({
  board: Array(9).fill(null),
  currentPlayer: 1,
  playerInventories: [initialInventory(), initialInventory()],
  gameStatus: "playing",
  winner: null,
  playerMoves: [0, 0],
  playerHistory: [[], []],
});

export interface GobbledPieceEvent {
  piece: CellData;
  fromPosition: number;
  toPlayer: number;
  returned: boolean;
}

export const useGameLogic = (config: GameConfig) => {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [gobbledPiece, setGobbledPiece] = useState<GobbledPieceEvent | null>(null);
  const { makeAIMove } = useAI();
  
  // Set random cone for bot at game start
  useEffect(() => {
    if (config.mode === 'ai') {
      const allCones = CONES;
      const randomCone = allCones[Math.floor(Math.random() * allCones.length)];
      sessionStorage.setItem('botConeStyle', randomCone.id);
    }
  }, [config.mode]);

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

  // Validate move: can place if empty OR if placing a LARGER cone on top
  const isValidMove = useCallback((position: number, coneSize: number): boolean => {
    if (gameState.gameStatus !== "playing") return false;
    
    const stack = gameState.board[position];
    const topCone = getTopCone(stack);
    const currentInventory = gameState.playerInventories[gameState.currentPlayer - 1];
    
    // Check if player has this cone size in inventory
    if (!currentInventory.includes(coneSize)) return false;
    
    // Can place on empty cell
    if (!topCone) return true;
    
    // Can place ONLY if new cone is LARGER than existing top cone
    return coneSize > topCone.size;
  }, [gameState]);

  const getAvailableCones = useCallback((player: number): number[] => {
    return gameState.playerInventories[player - 1];
  }, [gameState]);

  // Clear gobbled piece animation
  const clearGobbledPiece = useCallback(() => {
    setGobbledPiece(null);
  }, []);

  const makeMove = useCallback((position: number, coneSize: number): MoveResult => {
    if (!isValidMove(position, coneSize)) {
      return { success: false };
    }

    let gobbledEvent: GobbledPieceEvent | null = null;

    setGameState(prevState => {
      const newBoard: (CellStack | null)[] = prevState.board.map(stack => 
        stack ? [...stack] : null
      );
      const newInventories: [number[], number[]] = [
        [...prevState.playerInventories[0]],
        [...prevState.playerInventories[1]]
      ];
      const newPlayerMoves: [number, number] = [...prevState.playerMoves];
      const newPlayerHistory: [CellData[], CellData[]] = [
        [...prevState.playerHistory[0]],
        [...prevState.playerHistory[1]]
      ];
      
      const currentPlayer = prevState.currentPlayer;
      const currentInventory = newInventories[currentPlayer - 1];
      
      // Create the new cone
      const newCone: CellData = { player: currentPlayer, size: coneSize };
      
      // STACKING: Check if gobbling an opponent's piece
      const existingStack = newBoard[position];
      const topCone = getTopCone(existingStack);
      
      if (existingStack && topCone) {
        // GOBBLING: A larger cone is covering a smaller one
        const gobbledPlayer = topCone.player;
        const gobbledPlayerInventory = newInventories[gobbledPlayer - 1];
        const gobbledPlayerMoves = newPlayerMoves[gobbledPlayer - 1];
        
        // Check CONDITIONAL RETURN conditions:
        // 1. Gobbled player has 0 pieces left in inventory, OR
        // 2. Gobbled player has made 4+ moves
        const shouldReturnToInventory = 
          gobbledPlayerInventory.length === 0 || 
          gobbledPlayerMoves >= 4;
        
        if (shouldReturnToInventory) {
          // Remove the top cone from stack and return to owner's inventory
          const removedCone = existingStack.pop();
          if (removedCone) {
            newInventories[gobbledPlayer - 1].push(removedCone.size);
            
            // Trigger fly-back animation
            gobbledEvent = {
              piece: removedCone,
              fromPosition: position,
              toPlayer: gobbledPlayer,
              returned: true
            };
          }
          
          // If stack is empty after removal, set to null before adding new cone
          if (existingStack.length === 0) {
            newBoard[position] = [newCone];
          } else {
            existingStack.push(newCone);
          }
        } else {
          // Piece stays hidden under the new cone (standard behavior)
          existingStack.push(newCone);
          newBoard[position] = existingStack;
        }
      } else {
        // Create new stack with just this cone
        newBoard[position] = [newCone];
      }
      
      // Remove cone from current player's inventory
      const coneIndex = currentInventory.indexOf(coneSize);
      currentInventory.splice(coneIndex, 1);
      
      // Track move history
      newPlayerHistory[currentPlayer - 1].push({ ...newCone, position } as any);
      newPlayerMoves[currentPlayer - 1]++;

      // Handle 4th move return rule - returns oldest cone every 4 moves by this player
      let returnedCone: CellData | undefined;
      if (newPlayerMoves[currentPlayer - 1] >= 4 && newPlayerMoves[currentPlayer - 1] % 4 === 0) {
        const playerHistory = newPlayerHistory[currentPlayer - 1];
        if (playerHistory.length >= 4) {
          const oldestMove = playerHistory.shift();
          if (oldestMove) {
            const oldestPosition = (oldestMove as any).position;
            const stack = newBoard[oldestPosition];
            
            if (stack) {
              // Find and remove the oldest cone from the stack
              const coneIndexInStack = stack.findIndex(
                c => c.player === currentPlayer && c.size === oldestMove.size
              );
              
              if (coneIndexInStack !== -1) {
                const [removed] = stack.splice(coneIndexInStack, 1);
                returnedCone = removed;
                newInventories[currentPlayer - 1].push(removed.size);
                
                // If stack is empty, set cell to null
                if (stack.length === 0) {
                  newBoard[oldestPosition] = null;
                }
              }
            }
          }
        }
      }

      // Track board state for AI memory
      aiMemory.trackBoardState(newBoard);

      // Check for winner
      const winner = checkWinner(newBoard);
      const gameEnded = winner !== null;

      // Record game result for AI learning
      if (gameEnded && config.mode === 'ai') {
        // AI is player 2
        aiMemory.recordGameResult(winner === 2, newBoard);
      }

      return {
        ...prevState,
        board: newBoard,
        playerInventories: newInventories,
        currentPlayer: gameEnded ? prevState.currentPlayer : (currentPlayer === 1 ? 2 : 1) as 1 | 2,
        gameStatus: gameEnded ? "finished" : "playing",
        winner,
        playerMoves: newPlayerMoves,
        playerHistory: newPlayerHistory,
      };
    });

    // Set gobbled piece for animation (after state update)
    if (gobbledEvent) {
      setTimeout(() => setGobbledPiece(gobbledEvent), 50);
    }

    return { success: true };
  }, [isValidMove, checkWinner, config.mode]);

  const resetGame = useCallback(() => {
    setGameState(createInitialState());
    setGobbledPiece(null);
  }, []);

  // AI Move Effect
  useEffect(() => {
    if (config.mode === "ai" && 
        gameState.currentPlayer === 2 && 
        gameState.gameStatus === "playing") {
      
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(gameState, config.difficulty || "normal");
        if (aiMove) {
          makeMove(aiMove.position, aiMove.coneSize);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameStatus, config, makeAIMove, makeMove]);

  // Return top cones for display (backward compatible with existing UI)
  const getDisplayBoard = useCallback((): (CellData | null)[] => {
    return gameState.board.map(stack => getTopCone(stack));
  }, [gameState.board]);

  return {
    board: getDisplayBoard(),
    fullBoard: gameState.board, // Expose full stacks for advanced features
    currentPlayer: gameState.currentPlayer,
    playerInventories: gameState.playerInventories,
    gameStatus: gameState.gameStatus,
    winner: gameState.winner,
    playerMoves: gameState.playerMoves,
    makeMove,
    resetGame,
    isValidMove,
    getAvailableCones,
    gobbledPiece,
    clearGobbledPiece,
  };
};
