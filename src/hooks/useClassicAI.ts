import { useCallback } from "react";
import { ClassicGameState, ClassicCellData } from "@/types/classicGame";

export const useClassicAI = () => {
  const checkWinner = useCallback((board: (ClassicCellData | null)[]): number | null => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
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

  const getEmptyCells = useCallback((board: (ClassicCellData | null)[]): number[] => {
    return board.map((cell, index) => cell === null ? index : -1).filter(i => i !== -1);
  }, []);

  const minimax = useCallback((
    board: (ClassicCellData | null)[],
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number
  ): number => {
    const winner = checkWinner(board);
    if (winner === 2) return 10 - depth;
    if (winner === 1) return depth - 10;
    
    const emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const cell of emptyCells) {
        const newBoard = [...board];
        newBoard[cell] = { player: 2 };
        const evalScore = minimax(newBoard, depth + 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const cell of emptyCells) {
        const newBoard = [...board];
        newBoard[cell] = { player: 1 };
        const evalScore = minimax(newBoard, depth + 1, true, alpha, beta);
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }, [checkWinner, getEmptyCells]);

  const findWinningMove = useCallback((board: (ClassicCellData | null)[], player: 1 | 2): number | null => {
    const emptyCells = getEmptyCells(board);
    for (const cell of emptyCells) {
      const testBoard = [...board];
      testBoard[cell] = { player };
      if (checkWinner(testBoard) === player) {
        return cell;
      }
    }
    return null;
  }, [checkWinner, getEmptyCells]);

  const makeAIMove = useCallback((gameState: ClassicGameState, difficulty: string): number | null => {
    const emptyCells = getEmptyCells(gameState.board);
    if (emptyCells.length === 0) return null;

    // Easy: Random moves with occasional smart moves
    if (difficulty === "easy") {
      if (Math.random() < 0.3) {
        const winMove = findWinningMove(gameState.board, 2);
        if (winMove !== null) return winMove;
      }
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // Normal: Block wins and sometimes win
    if (difficulty === "normal") {
      const winMove = findWinningMove(gameState.board, 2);
      if (winMove !== null) return winMove;

      const blockMove = findWinningMove(gameState.board, 1);
      if (blockMove !== null) return blockMove;

      // Prefer center
      if (gameState.board[4] === null) return 4;

      // Prefer corners
      const corners = [0, 2, 6, 8].filter(c => gameState.board[c] === null);
      if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // Hard & Master: Use minimax
    let bestMove = emptyCells[0];
    let bestScore = -Infinity;

    for (const cell of emptyCells) {
      const newBoard = [...gameState.board];
      newBoard[cell] = { player: 2 };
      const score = minimax(newBoard, 0, false, -Infinity, Infinity);
      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }
    }

    return bestMove;
  }, [getEmptyCells, findWinningMove, minimax]);

  return { makeAIMove };
};
