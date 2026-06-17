export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Cell {
  value: number;
  given: boolean;
  notes: Set<number>;
  isError: boolean;
}

export type Board = Cell[][];

export interface GameState {
  board: Board;
  solution: number[][];
  selectedCell: { row: number; col: number } | null;
  difficulty: Difficulty;
  mistakes: number;
  timeElapsed: number;
  isComplete: boolean;
  isGameOver: boolean;
  isPencilMode: boolean;
  previousBoard: Board | null;
  score: number;
}
