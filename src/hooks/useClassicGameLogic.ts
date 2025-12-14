import { useState, useCallback, useEffect } from "react";
import { ClassicGameState, ClassicGameConfig, ClassicCellData, ClassicMoveResult } from "@/types/classicGame";
import { useClassicAI } from "./useClassicAI";

const createInitialState = (): ClassicGameState => ({
  board: Array(9).fill(null),
  currentPlayer: 1,
  gameStatus: "playing",
  winner: null,
  moveCount: 0,
});

export const useClassicGameLogic = (config: ClassicGameConfig) => {
  const [gameState, setGameState] = useState<ClassicGameState>(createInitialState);
  const { makeAIMove } = useClassicAI();

  const checkWinner = useCallback((board: (ClassicCellData | null)[]): number | null => {
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

  const checkDraw = useCallback((board: (ClassicCellData | null)[]): boolean => {
    return board.every(cell => cell !== null);
  }, []);

  const isValidMove = useCallback((position: number): boolean => {
    if (gameState.gameStatus !== "playing") return false;
    return gameState.board[position] === null;
  }, [gameState]);

  const makeMove = useCallback((position: number): ClassicMoveResult => {
    if (!isValidMove(position)) {
      return { success: false };
    }

    let result: ClassicMoveResult = { success: true };

    setGameState(prevState => {
      const newBoard = [...prevState.board];
      const currentPlayer = prevState.currentPlayer;

      // Place piece
      newBoard[position] = { player: currentPlayer };

      // Check for winner
      const winner = checkWinner(newBoard);
      const isDraw = !winner && checkDraw(newBoard);

      result = {
        success: true,
        gameEnded: winner !== null || isDraw,
        winner,
        isDraw
      };

      return {
        ...prevState,
        board: newBoard,
        currentPlayer: winner || isDraw ? prevState.currentPlayer : (currentPlayer === 1 ? 2 : 1) as 1 | 2,
        gameStatus: winner ? "finished" : isDraw ? "draw" : "playing",
        winner,
        moveCount: prevState.moveCount + 1,
      };
    });

    return result;
  }, [isValidMove, checkWinner, checkDraw]);

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
        if (aiMove !== null) {
          makeMove(aiMove);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.gameStatus, config, makeAIMove, makeMove]);

  return {
    board: gameState.board,
    currentPlayer: gameState.currentPlayer,
    gameStatus: gameState.gameStatus,
    winner: gameState.winner,
    moveCount: gameState.moveCount,
    makeMove,
    resetGame,
    isValidMove,
  };
};
