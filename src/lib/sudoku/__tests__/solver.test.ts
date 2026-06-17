import { cloneBoard, isValid, solve } from '../solver';

describe('cloneBoard', () => {
  it('should create a deep copy of the board', () => {
    const original: number[][] = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const cloned = cloneBoard(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[0]).not.toBe(original[0]);

    cloned[0][0] = 99;
    expect(original[0][0]).toBe(1);
  });
});

describe('isValid', () => {
  it('should return false for duplicate in row', () => {
    const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
    board[0][0] = 5;
    board[0][4] = 5;

    expect(isValid(board, 0, 8, 5)).toBe(false);
  });

  it('should return false for duplicate in column', () => {
    const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
    board[0][0] = 5;
    board[4][0] = 5;

    expect(isValid(board, 8, 0, 5)).toBe(false);
  });

  it('should return false for duplicate in 3x3 box', () => {
    const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
    board[0][0] = 5;

    expect(isValid(board, 2, 2, 5)).toBe(false);
  });

  it('should return true for valid placement', () => {
    const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
    board[0][0] = 1;
    board[1][1] = 2;

    expect(isValid(board, 0, 1, 3)).toBe(true);
  });
});

describe('solve', () => {
  it('should solve a valid sudoku puzzle', () => {
    const board: number[][] = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];

    const result = solve(board);

    expect(result).toBe(true);
    expect(board[0][2]).toBeGreaterThan(0);
    expect(board).toEqual([
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ]);
  });

  it('should return false for unsolvable puzzle', () => {
    const board: number[][] = [
      [5, 5, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const result = solve(board);

    expect(result).toBe(false);
  });
});
