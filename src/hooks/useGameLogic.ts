import { useState, useCallback, useEffect } from "react";
import { GameState, GameConfig, CellData, MoveResult } from "@/types/game";
import { useAI } from "./useAI";

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

  const isValidMove = useCallback((position: number, coneSize: number): boolean => {
    if (gameState.gameStatus !== "playing") return false;
    
    const cell = gameState.board[position];
    const currentInventory = gameState.playerInventories[gameState.currentPlayer - 1];
    
    // Check if player has this cone size
    if (!currentInventory.includes(coneSize)) return false;
    
    // Can place on empty cell or replace smaller cone
    return !cell || cell.size < coneSize;
  }, [gameState]);

  const getAvailableCones = useCallback((player: number): number[] => {
    return gameState.playerInventories[player - 1];
  }, [gameState]);

  const makeMove = useCallback((position: number, coneSize: number): MoveResult => {
    if (!isValidMove(position, coneSize)) {
      return { success: false };
    }

    setGameState(prevState => {
      const newBoard = [...prevState.board];
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
      
      // Handle replacement
      let replacedCone: CellData | undefined;
      const existingCell = newBoard[position];
      if (existingCell) {
        replacedCone = existingCell;
        // Return replaced cone to its owner
        newInventories[existingCell.player - 1].push(existingCell.size);
      }

      // Place new cone
      const newCone: CellData = { player: currentPlayer, size: coneSize };
      newBoard[position] = newCone;
      
      // Remove cone from inventory
      const coneIndex = currentInventory.indexOf(coneSize);
      currentInventory.splice(coneIndex, 1);
      
      // Track move history
      newPlayerHistory[currentPlayer - 1].push({ ...newCone, position } as any);
      newPlayerMoves[currentPlayer - 1]++;

      // Handle 4th move return rule
      let returnedCone: CellData | undefined;
      if (newPlayerMoves[currentPlayer - 1] % 4 === 0) {
        const playerHistory = newPlayerHistory[currentPlayer - 1];
        if (playerHistory.length >= 4) {
          const oldestMove = playerHistory.shift();
          if (oldestMove) {
            // Find and remove the oldest cone from board
            const oldestPosition = (oldestMove as any).position;
            const oldestCell = newBoard[oldestPosition];
            if (oldestCell && oldestCell.player === currentPlayer) {
              newBoard[oldestPosition] = null;
              newInventories[currentPlayer - 1].push(oldestCell.size);
              returnedCone = oldestCell;
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

  return {
    board: gameState.board,
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