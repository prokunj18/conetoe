export interface CellData {
  player: number;
  size: number;
}

// A cell can now contain a STACK of cones (bottom to top)
export type CellStack = CellData[];

export type Board = (CellStack | null)[];

// Helper to get the top cone of a stack
export const getTopCone = (stack: CellStack | null): CellData | null => {
  if (!stack || stack.length === 0) return null;
  return stack[stack.length - 1];
};

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
