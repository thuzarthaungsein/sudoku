export function cloneBoard(board: number[][]): number[][] {
  return board.map(row => [...row]);
}

export function isValid(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) {
      return false;
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num && i !== row) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const currentRow = boxRow + i;
      const currentCol = boxCol + j;
      if (
        board[currentRow][currentCol] === num &&
        (currentRow !== row || currentCol !== col)
      ) {
        return false;
      }
    }
  }

  return true;
}

export function solve(board: number[][]): boolean {
  // Find next empty cell
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        // Try numbers 1-9
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;

            if (solve(board)) {
              return true;
            }

            // Backtrack
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  // No empty cells, puzzle solved
  return true;
}
