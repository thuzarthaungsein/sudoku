import { getConflicts, isBoardComplete } from '../validator';
import { Board, Cell } from '../types';

function createEmptyCell(): Cell {
  return {
    value: 0,
    given: false,
    notes: new Set(),
    isError: false,
  };
}

describe('getConflicts', () => {
  it('should return empty array when no conflicts', () => {
    const board: Board = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => createEmptyCell())
    );
    board[0][0].value = 1;
    board[1][1].value = 2;

    const conflicts = getConflicts(board, 0, 0);

    expect(conflicts).toEqual([]);
  });

  it('should detect conflict in same row', () => {
    const board: Board = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => createEmptyCell())
    );
    board[0][0].value = 5;
    board[0][4].value = 5;

    const conflicts = getConflicts(board, 0, 0);

    expect(conflicts).toContainEqual({ row: 0, col: 4 });
  });

  it('should detect conflict in same column', () => {
    const board: Board = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => createEmptyCell())
    );
    board[0][0].value = 5;
    board[4][0].value = 5;

    const conflicts = getConflicts(board, 0, 0);

    expect(conflicts).toContainEqual({ row: 4, col: 0 });
  });

  it('should detect conflict in same 3x3 box', () => {
    const board: Board = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => createEmptyCell())
    );
    board[0][0].value = 5;
    board[2][2].value = 5;

    const conflicts = getConflicts(board, 0, 0);

    expect(conflicts).toContainEqual({ row: 2, col: 2 });
  });

  it('should ignore cells with value 0', () => {
    const board: Board = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => createEmptyCell())
    );
    board[0][0].value = 5;
    board[0][1].value = 0;

    const conflicts = getConflicts(board, 0, 0);

    expect(conflicts).toEqual([]);
  });
});

describe('isBoardComplete', () => {
  it('should return false when board has empty cells', () => {
    const board: Board = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => createEmptyCell())
    );

    expect(isBoardComplete(board)).toBe(false);
  });

  it('should return false when board has conflicts', () => {
    const board: Board = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({ ...createEmptyCell(), value: 1 }))
    );

    expect(isBoardComplete(board)).toBe(false);
  });

  it('should return true when board is completely filled with no conflicts', () => {
    const board: Board = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ].map(row => row.map(value => ({ ...createEmptyCell(), value })));

    expect(isBoardComplete(board)).toBe(true);
  });
});
