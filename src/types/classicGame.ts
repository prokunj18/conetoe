export interface ClassicCellData {
  player: 1 | 2;
}

export type ClassicBoard = (ClassicCellData | null)[];

export interface ClassicGameState {
  board: ClassicBoard;
  currentPlayer: 1 | 2;
  gameStatus: "playing" | "finished" | "draw";
  winner: number | null;
  moveCount: number;
}

export interface ClassicGameConfig {
  mode: "ai" | "local";
  difficulty?: "easy" | "normal" | "hard" | "master";
}

export interface ClassicMoveResult {
  success: boolean;
  gameEnded?: boolean;
  winner?: number | null;
  isDraw?: boolean;
}
