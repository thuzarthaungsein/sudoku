import { Difficulty } from './types';
import { solve, cloneBoard } from './solver';

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateSolvedBoard(): number[][] {
  const board: number[][] = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  // Fill diagonal 3x3 boxes (they are independent)
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (let box = 0; box < 3; box++) {
    const startRow = box * 3;
    const startCol = box * 3;
    let idx = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[startRow + i][startCol + j] = numbers[idx++];
      }
    }
  }

  // Solve the rest
  solve(board);

  return board;
}

export function generatePuzzle(
  difficulty: Difficulty
): { puzzle: number[][]; solution: number[][] } {
  const solution = generateSolvedBoard();
  const puzzle = cloneBoard(solution);

  const clueCountMap = {
    easy: 46,
    medium: 36,
    hard: 29,
  };

  const targetClues = clueCountMap[difficulty];
  const cellsToRemove = 81 - targetClues;

  // Create list of all positions
  const positions: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col });
    }
  }

  const shuffledPositions = shuffle(positions);

  // Remove cells
  for (let i = 0; i < cellsToRemove && i < shuffledPositions.length; i++) {
    const { row, col } = shuffledPositions[i];
    puzzle[row][col] = 0;
  }

  return { puzzle, solution };
}
