export interface CellData {
  player: number;
  size: number;
}

export type Board = (CellData | null)[];

export interface GameState {
  board: Board;
  currentPlayer: 1 | 2;
  playerInventories: [number[], number[]];
  gameStatus: "playing" | "finished";
  winner: number | null;
  playerMoves: [number, number];
  playerHistory: [CellData[], CellData[]];
}

export interface GameConfig {
  mode: "ai" | "local";
  difficulty?: "easy" | "normal" | "hard" | "master";
}

export interface MoveResult {
  success: boolean;
  returnedCone?: CellData;
  replacedCone?: CellData;
  gameEnded?: boolean;
  winner?: number;
}