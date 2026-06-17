import { generateSolvedBoard, generatePuzzle } from '../generator';

describe('generateSolvedBoard', () => {
  it('should generate a valid solved 9x9 board', () => {
    const board = generateSolvedBoard();

    expect(board.length).toBe(9);
    expect(board[0].length).toBe(9);

    for (let row of board) {
      for (let val of row) {
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(9);
      }
    }
  });

  it('should generate different boards on multiple calls', () => {
    const board1 = generateSolvedBoard();
    const board2 = generateSolvedBoard();

    expect(board1).not.toEqual(board2);
  });

  it('should generate a valid sudoku solution', () => {
    const board = generateSolvedBoard();

    // Check rows
    for (let row = 0; row < 9; row++) {
      const rowSet = new Set(board[row]);
      expect(rowSet.size).toBe(9);
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      const colSet = new Set(board.map(row => row[col]));
      expect(colSet.size).toBe(9);
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const boxSet = new Set<number>();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            boxSet.add(board[boxRow * 3 + i][boxCol * 3 + j]);
          }
        }
        expect(boxSet.size).toBe(9);
      }
    }
  });
});

describe('generatePuzzle', () => {
  it('should generate easy puzzle with ~46 clues', () => {
    const { puzzle, solution } = generatePuzzle('easy');

    let clueCount = 0;
    for (let row of puzzle) {
      for (let val of row) {
        if (val !== 0) clueCount++;
      }
    }

    expect(clueCount).toBeGreaterThanOrEqual(44);
    expect(clueCount).toBeLessThanOrEqual(48);
  });

  it('should generate medium puzzle with ~36 clues', () => {
    const { puzzle, solution } = generatePuzzle('medium');

    let clueCount = 0;
    for (let row of puzzle) {
      for (let val of row) {
        if (val !== 0) clueCount++;
      }
    }

    expect(clueCount).toBeGreaterThanOrEqual(34);
    expect(clueCount).toBeLessThanOrEqual(38);
  });

  it('should generate hard puzzle with ~29 clues', () => {
    const { puzzle, solution } = generatePuzzle('hard');

    let clueCount = 0;
    for (let row of puzzle) {
      for (let val of row) {
        if (val !== 0) clueCount++;
      }
    }

    expect(clueCount).toBeGreaterThanOrEqual(27);
    expect(clueCount).toBeLessThanOrEqual(31);
  });

  it('should return puzzle and solution where solution is complete', () => {
    const { puzzle, solution } = generatePuzzle('medium');

    for (let row of solution) {
      for (let val of row) {
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(9);
      }
    }
  });

  it('should ensure puzzle is subset of solution', () => {
    const { puzzle, solution } = generatePuzzle('hard');

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== 0) {
          expect(puzzle[row][col]).toBe(solution[row][col]);
        }
      }
    }
  });
});
