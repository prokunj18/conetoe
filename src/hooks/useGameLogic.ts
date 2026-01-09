import { useState, useCallback, useEffect } from "react";
import { GameState, GameConfig, CellData, MoveResult, CellStack, getTopCone } from "@/types/game";
import { useAI } from "./useAI";
import { CONES } from "@/data/cones";

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

export const useGameLogic = (config: GameConfig) => {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
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

  const makeMove = useCallback((position: number, coneSize: number): MoveResult => {
    if (!isValidMove(position, coneSize)) {
      return { success: false };
    }

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
      
      // STACKING: Add cone on top of existing stack (don't return old cone to inventory!)
      const existingStack = newBoard[position];
      if (existingStack) {
        // Push new cone on top of the stack
        existingStack.push(newCone);
        newBoard[position] = existingStack;
      } else {
        // Create new stack with just this cone
        newBoard[position] = [newCone];
      }
      
      // Remove cone from inventory
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

      // Check for winner
      const winner = checkWinner(newBoard);
      const gameEnded = winner !== null;

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

    return { success: true };
  }, [isValidMove, checkWinner]);

  const resetGame = useCallback(() => {
    setGameState(createInitialState());
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
  };
};
