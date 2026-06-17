import { Board } from './types';

export function getConflicts(
  board: Board,
  row: number,
  col: number
): Array<{ row: number; col: number }> {
  const conflicts: Array<{ row: number; col: number }> = [];
  const cellValue = board[row][col].value;

  if (cellValue === 0) {
    return conflicts;
  }

  // Check row
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i].value === cellValue) {
      conflicts.push({ row, col: i });
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== row && board[i][col].value === cellValue) {
      conflicts.push({ row: i, col });
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
        (currentRow !== row || currentCol !== col) &&
        board[currentRow][currentCol].value === cellValue
      ) {
        if (!conflicts.find(c => c.row === currentRow && c.col === currentCol)) {
          conflicts.push({ row: currentRow, col: currentCol });
        }
      }
    }
  }

  return conflicts;
}

export function isBoardComplete(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === 0) {
        return false;
      }

      const conflicts = getConflicts(board, row, col);
      if (conflicts.length > 0) {
        return false;
      }
    }
  }
  return true;
}
