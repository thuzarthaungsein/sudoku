# Sudoku Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional web-based Sudoku game with three difficulty levels, pencil notes, undo, timer, and scoring.

**Architecture:** Component-first approach - build UI components with mock data first, then implement game logic hook, finally add puzzle generation algorithms. Pure functional game logic separated from React components.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS

## Global Constraints

- Use Next.js 14+ with App Router (not Pages Router)
- All code must be TypeScript with strict type checking
- Use Tailwind CSS for all styling (no CSS modules or styled-components)
- No external state management libraries (React hooks only)
- All commits must follow conventional commit format: `feat:`, `fix:`, `test:`, etc.
- Notes only clear for the cell where number is placed (not affected cells)
- Single undo only (not unlimited history)
- Score hidden during gameplay (only shown on completion)

---

## File Structure Overview

### Phase 1: Project Setup & Types
- `src/lib/sudoku/types.ts` - Core TypeScript interfaces and types

### Phase 2: Core Algorithm Layer
- `src/lib/sudoku/solver.ts` - Backtracking solver for Sudoku
- `src/lib/sudoku/validator.ts` - Conflict detection and board validation
- `src/lib/sudoku/generator.ts` - Puzzle generation

### Phase 3: Next.js Application Setup
- `src/app/layout.tsx` - Root layout with metadata
- `src/app/page.tsx` - Main game page
- `src/app/globals.css` - Global Tailwind styles

### Phase 4: UI Components (with mock data)
- `src/components/sudoku/SudokuCell.tsx` - Individual cell rendering
- `src/components/sudoku/SudokuBoard.tsx` - 9×9 grid with keyboard handling
- `src/components/sudoku/GameStatus.tsx` - Timer and mistakes display
- `src/components/sudoku/NumberPad.tsx` - Input buttons (1-9 + erase)
- `src/components/sudoku/GameControls.tsx` - Difficulty, new game, pencil, undo
- `src/components/sudoku/VictoryOverlay.tsx` - Victory screen with score
- `src/components/sudoku/GameOverOverlay.tsx` - Game over screen

### Phase 5: Game Logic Hook
- `src/hooks/useSudoku.ts` - All game state and logic

### Phase 6: Integration & Testing
- Wire components to real game logic
- End-to-end testing
- Polish and bug fixes

---

## Task 1: Project Setup & Type Definitions

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/lib/sudoku/types.ts`

**Interfaces:**
- Consumes: Nothing (first task)
- Produces: `Difficulty`, `Cell`, `Board` types for all subsequent tasks

- [ ] **Step 1: Initialize Next.js project with TypeScript**

Run: `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`

When prompted:
- Would you like to use TypeScript? Yes
- Would you like to use ESLint? Yes
- Would you like to use Tailwind CSS? Yes
- Would you like to use `src/` directory? Yes
- Would you like to use App Router? Yes
- Would you like to customize the default import alias? No

- [ ] **Step 2: Verify installation**

Run: `ls -la`
Expected: See `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `src/` directory

- [ ] **Step 3: Create sudoku library directory**

Run: `mkdir -p src/lib/sudoku`

- [ ] **Step 4: Write type definitions**

Create `src/lib/sudoku/types.ts`:

```typescript
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
```

- [ ] **Step 5: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind

- Add project setup with Next.js 14 App Router
- Configure TypeScript and Tailwind CSS
- Define core Sudoku types (Cell, Board, Difficulty, GameState)"
```

---

## Task 2: Sudoku Solver Implementation

**Files:**
- Create: `src/lib/sudoku/solver.ts`
- Create: `src/lib/sudoku/__tests__/solver.test.ts`

**Interfaces:**
- Consumes: Nothing (pure algorithm)
- Produces:
  - `isValid(board: number[][], row: number, col: number, num: number): boolean`
  - `solve(board: number[][]): boolean`
  - `cloneBoard(board: number[][]): number[][]`

- [ ] **Step 1: Write failing test for cloneBoard**

Create `src/lib/sudoku/__tests__/solver.test.ts`:

```typescript
import { cloneBoard } from '../solver';

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
```

- [ ] **Step 2: Install testing dependencies**

Run: `npm install --save-dev jest @testing-library/jest-dom @types/jest ts-jest`

- [ ] **Step 3: Create Jest config**

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to package.json**

Modify `package.json` scripts section:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest",
  "test:watch": "jest --watch"
}
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm test`
Expected: FAIL with "Cannot find module '../solver'"

- [ ] **Step 6: Write minimal implementation for cloneBoard**

Create `src/lib/sudoku/solver.ts`:

```typescript
export function cloneBoard(board: number[][]): number[][] {
  return board.map(row => [...row]);
}
```

- [ ] **Step 7: Run test to verify cloneBoard passes**

Run: `npm test`
Expected: PASS for cloneBoard test

- [ ] **Step 8: Write failing test for isValid**

Add to `src/lib/sudoku/__tests__/solver.test.ts`:

```typescript
import { isValid } from '../solver';

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
```

- [ ] **Step 9: Run test to verify it fails**

Run: `npm test`
Expected: FAIL with "isValid is not exported"

- [ ] **Step 10: Write implementation for isValid**

Add to `src/lib/sudoku/solver.ts`:

```typescript
export function isValid(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) {
      return false;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num && i !== row) {
      return false;
    }
  }

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
```

- [ ] **Step 11: Run test to verify isValid passes**

Run: `npm test`
Expected: PASS for all isValid tests

- [ ] **Step 12: Write failing test for solve**

Add to `src/lib/sudoku/__tests__/solver.test.ts`:

```typescript
import { solve } from '../solver';

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
```

- [ ] **Step 13: Run test to verify it fails**

Run: `npm test`
Expected: FAIL with "solve is not exported"

- [ ] **Step 14: Write implementation for solve**

Add to `src/lib/sudoku/solver.ts`:

```typescript
export function solve(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;

            if (solve(board)) {
              return true;
            }

            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}
```

- [ ] **Step 15: Run test to verify solve passes**

Run: `npm test`
Expected: PASS for all solver tests

- [ ] **Step 16: Commit**

```bash
git add src/lib/sudoku/solver.ts src/lib/sudoku/__tests__/solver.test.ts jest.config.js jest.setup.js package.json
git commit -m "feat: implement sudoku solver with backtracking algorithm

- Add cloneBoard for deep copying boards
- Add isValid to check row, column, and box constraints
- Add solve with recursive backtracking
- Include comprehensive unit tests"
```

---

## Task 3: Validator Implementation

**Files:**
- Create: `src/lib/sudoku/validator.ts`
- Create: `src/lib/sudoku/__tests__/validator.test.ts`

**Interfaces:**
- Consumes: `Cell`, `Board` from `types.ts`
- Produces:
  - `getConflicts(board: Board, row: number, col: number): Array<{row: number, col: number}>`
  - `isBoardComplete(board: Board): boolean`

- [ ] **Step 1: Write failing test for getConflicts**

Create `src/lib/sudoku/__tests__/validator.test.ts`:

```typescript
import { getConflicts } from '../validator';
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test validator`
Expected: FAIL with "Cannot find module '../validator'"

- [ ] **Step 3: Write implementation for getConflicts**

Create `src/lib/sudoku/validator.ts`:

```typescript
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

  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i].value === cellValue) {
      conflicts.push({ row, col: i });
    }
  }

  for (let i = 0; i < 9; i++) {
    if (i !== row && board[i][col].value === cellValue) {
      conflicts.push({ row: i, col });
    }
  }

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
```

- [ ] **Step 4: Run test to verify getConflicts passes**

Run: `npm test validator`
Expected: PASS for getConflicts tests

- [ ] **Step 5: Write failing test for isBoardComplete**

Add to `src/lib/sudoku/__tests__/validator.test.ts`:

```typescript
import { isBoardComplete } from '../validator';

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
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test validator`
Expected: FAIL with "isBoardComplete is not exported"

- [ ] **Step 7: Write implementation for isBoardComplete**

Add to `src/lib/sudoku/validator.ts`:

```typescript
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
```

- [ ] **Step 8: Run test to verify isBoardComplete passes**

Run: `npm test validator`
Expected: PASS for all validator tests

- [ ] **Step 9: Commit**

```bash
git add src/lib/sudoku/validator.ts src/lib/sudoku/__tests__/validator.test.ts
git commit -m "feat: implement validator for conflict detection and completion check

- Add getConflicts to find duplicate values in row/col/box
- Add isBoardComplete to check if puzzle is solved
- Include comprehensive unit tests"
```

---

## Task 4: Puzzle Generator Implementation

**Files:**
- Create: `src/lib/sudoku/generator.ts`
- Create: `src/lib/sudoku/__tests__/generator.test.ts`

**Interfaces:**
- Consumes: `Difficulty` from `types.ts`, `solve`, `cloneBoard` from `solver.ts`
- Produces:
  - `generateSolvedBoard(): number[][]`
  - `generatePuzzle(difficulty: Difficulty): { puzzle: number[][], solution: number[][] }`

- [ ] **Step 1: Write failing test for generateSolvedBoard**

Create `src/lib/sudoku/__tests__/generator.test.ts`:

```typescript
import { generateSolvedBoard } from '../generator';

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

    for (let row = 0; row < 9; row++) {
      const rowSet = new Set(board[row]);
      expect(rowSet.size).toBe(9);
    }

    for (let col = 0; col < 9; col++) {
      const colSet = new Set(board.map(row => row[col]));
      expect(colSet.size).toBe(9);
    }

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test generator`
Expected: FAIL with "Cannot find module '../generator'"

- [ ] **Step 3: Write implementation for generateSolvedBoard**

Create `src/lib/sudoku/generator.ts`:

```typescript
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

  solve(board);

  return board;
}
```

- [ ] **Step 4: Run test to verify generateSolvedBoard passes**

Run: `npm test generator`
Expected: PASS for generateSolvedBoard tests

- [ ] **Step 5: Write failing test for generatePuzzle**

Add to `src/lib/sudoku/__tests__/generator.test.ts`:

```typescript
import { generatePuzzle } from '../generator';

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
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test generator`
Expected: FAIL with "generatePuzzle is not exported"

- [ ] **Step 7: Write implementation for generatePuzzle**

Add to `src/lib/sudoku/generator.ts`:

```typescript
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

  const positions: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col });
    }
  }

  const shuffledPositions = shuffle(positions);

  for (let i = 0; i < cellsToRemove && i < shuffledPositions.length; i++) {
    const { row, col } = shuffledPositions[i];
    puzzle[row][col] = 0;
  }

  return { puzzle, solution };
}
```

- [ ] **Step 8: Run test to verify generatePuzzle passes**

Run: `npm test generator`
Expected: PASS for all generator tests

- [ ] **Step 9: Commit**

```bash
git add src/lib/sudoku/generator.ts src/lib/sudoku/__tests__/generator.test.ts
git commit -m "feat: implement puzzle generator with difficulty levels

- Add generateSolvedBoard using diagonal box filling + solver
- Add generatePuzzle with easy/medium/hard clue counts
- Include shuffle utility for randomization
- Include comprehensive unit tests"
```

---

## Task 5: Next.js App Setup

**Files:**
- Create: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/globals.css`

**Interfaces:**
- Consumes: Nothing (Next.js setup)
- Produces: Root layout and main page for UI components

- [ ] **Step 1: Create globals.css with Tailwind directives**

Create `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 2: Create root layout**

Create `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sudoku Game',
  description: 'Interactive Sudoku game with three difficulty levels',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create placeholder main page**

Create `src/app/page.tsx`:

```typescript
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Sudoku Game</h1>
      <p className="text-gray-600">Game components will be added here</p>
    </main>
  );
}
```

- [ ] **Step 4: Test app runs**

Run: `npm run dev`
Expected: App starts on http://localhost:3000, shows "Sudoku Game" heading

- [ ] **Step 5: Stop dev server**

Press Ctrl+C in terminal

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: setup Next.js app with root layout and main page

- Add root layout with metadata
- Add globals.css with Tailwind directives
- Add placeholder home page
- Verify app runs successfully"
```

---

## Task 6: SudokuCell Component

**Files:**
- Create: `src/components/sudoku/SudokuCell.tsx`

**Interfaces:**
- Consumes: `Cell` from `types.ts`
- Produces: `SudokuCell` component with props:
  - `cell: Cell`
  - `isSelected: boolean`
  - `isHighlighted: boolean`
  - `onClick: () => void`

- [ ] **Step 1: Create components directory**

Run: `mkdir -p src/components/sudoku`

- [ ] **Step 2: Write SudokuCell component**

Create `src/components/sudoku/SudokuCell.tsx`:

```typescript
import { Cell } from '@/lib/sudoku/types';

interface SudokuCellProps {
  cell: Cell;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
}

export default function SudokuCell({
  cell,
  isSelected,
  isHighlighted,
  onClick,
}: SudokuCellProps) {
  const getCellClasses = () => {
    const baseClasses = 'w-full h-full flex items-center justify-center border border-gray-300 cursor-pointer transition-colors duration-150';

    if (isSelected) {
      return `${baseClasses} bg-blue-500 text-white`;
    }

    if (isHighlighted) {
      return `${baseClasses} bg-blue-100`;
    }

    if (cell.isError) {
      return `${baseClasses} bg-red-100 text-red-600`;
    }

    return `${baseClasses} bg-white hover:bg-gray-50`;
  };

  const getValueClasses = () => {
    if (cell.given) {
      return 'text-2xl font-bold text-gray-900';
    }
    return 'text-2xl font-medium text-blue-600';
  };

  const renderNotes = () => {
    if (cell.notes.size === 0) return null;

    const notePositions = Array(9).fill(null);
    cell.notes.forEach(num => {
      notePositions[num - 1] = num;
    });

    return (
      <div className="grid grid-cols-3 gap-0 w-full h-full p-1">
        {notePositions.map((num, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center text-xs text-gray-600"
          >
            {num || ''}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={getCellClasses()} onClick={onClick}>
      {cell.value > 0 ? (
        <span className={getValueClasses()}>{cell.value}</span>
      ) : (
        renderNotes()
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/sudoku/SudokuCell.tsx
git commit -m "feat: add SudokuCell component with notes support

- Render cell value or pencil notes
- Style based on selected/highlighted/error states
- Different styling for given vs user-entered values
- Display notes in 3x3 grid layout"
```

---

## Task 7: SudokuBoard Component

**Files:**
- Create: `src/components/sudoku/SudokuBoard.tsx`

**Interfaces:**
- Consumes: `Board`, `Cell` from `types.ts`, `SudokuCell` component
- Produces: `SudokuBoard` component with props:
  - `board: Board`
  - `selectedCell: { row: number; col: number } | null`
  - `onCellClick: (row: number, col: number) => void`
  - `onKeyDown: (key: string) => void`

- [ ] **Step 1: Write SudokuBoard component**

Create `src/components/sudoku/SudokuBoard.tsx`:

```typescript
'use client';

import { Board } from '@/lib/sudoku/types';
import SudokuCell from './SudokuCell';
import { useEffect, useRef } from 'react';

interface SudokuBoardProps {
  board: Board;
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  onKeyDown: (key: string) => void;
}

export default function SudokuBoard({
  board,
  selectedCell,
  onCellClick,
  onKeyDown,
}: SudokuBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boardRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    onKeyDown(e.key);
  };

  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;

    if (selectedCell.row === row && selectedCell.col === col) {
      return false;
    }

    if (selectedCell.row === row || selectedCell.col === col) {
      return true;
    }

    const selectedBoxRow = Math.floor(selectedCell.row / 3);
    const selectedBoxCol = Math.floor(selectedCell.col / 3);
    const cellBoxRow = Math.floor(row / 3);
    const cellBoxCol = Math.floor(col / 3);

    if (selectedBoxRow === cellBoxRow && selectedBoxCol === cellBoxCol) {
      return true;
    }

    const selectedValue = board[selectedCell.row][selectedCell.col].value;
    if (selectedValue > 0 && board[row][col].value === selectedValue) {
      return true;
    }

    return false;
  };

  const getCellBorderClasses = (row: number, col: number): string => {
    let classes = '';

    if (row % 3 === 0 && row !== 0) {
      classes += ' border-t-2 border-t-gray-800';
    }

    if (col % 3 === 0 && col !== 0) {
      classes += ' border-l-2 border-l-gray-800';
    }

    if (row === 8) {
      classes += ' border-b-2 border-b-gray-800';
    }

    if (col === 8) {
      classes += ' border-r-2 border-r-gray-800';
    }

    return classes;
  };

  return (
    <div
      ref={boardRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
    >
      <div className="grid grid-cols-9 gap-0 border-2 border-gray-800 bg-white w-fit">
        {board.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`w-12 h-12 ${getCellBorderClasses(rowIdx, colIdx)}`}
            >
              <SudokuCell
                cell={cell}
                isSelected={
                  selectedCell?.row === rowIdx && selectedCell?.col === colIdx
                }
                isHighlighted={isHighlighted(rowIdx, colIdx)}
                onClick={() => onCellClick(rowIdx, colIdx)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sudoku/SudokuBoard.tsx
git commit -m "feat: add SudokuBoard component with keyboard support

- Render 9x9 grid using SudokuCell components
- Handle keyboard input and focus
- Compute highlight states for same row/col/box/value
- Apply thicker borders for 3x3 box visualization"
```

---

## Task 8: GameStatus Component

**Files:**
- Create: `src/components/sudoku/GameStatus.tsx`

**Interfaces:**
- Consumes: Nothing (pure presentational)
- Produces: `GameStatus` component with props:
  - `timeElapsed: number`
  - `mistakes: number`

- [ ] **Step 1: Write GameStatus component**

Create `src/components/sudoku/GameStatus.tsx`:

```typescript
interface GameStatusProps {
  timeElapsed: number;
  mistakes: number;
}

export default function GameStatus({ timeElapsed, mistakes }: GameStatusProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between w-full max-w-md px-4 py-3 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Time:</span>
        <span className="text-xl font-bold text-gray-900 font-mono">
          {formatTime(timeElapsed)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Mistakes:</span>
        <div className="flex gap-1">
          {[0, 1, 2].map(idx => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full border-2 ${
                idx < mistakes
                  ? 'bg-red-500 border-red-500'
                  : 'bg-white border-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sudoku/GameStatus.tsx
git commit -m "feat: add GameStatus component for timer and mistakes

- Display formatted timer (MM:SS)
- Show mistake count with dot indicators (max 3)
- Clean layout with shadows and spacing"
```

---

## Task 9: NumberPad Component

**Files:**
- Create: `src/components/sudoku/NumberPad.tsx`

**Interfaces:**
- Consumes: `Board` from `types.ts`
- Produces: `NumberPad` component with props:
  - `board: Board`
  - `isPencilMode: boolean`
  - `onNumberClick: (num: number) => void`
  - `onEraseClick: () => void`

- [ ] **Step 1: Write NumberPad component**

Create `src/components/sudoku/NumberPad.tsx`:

```typescript
import { Board } from '@/lib/sudoku/types';

interface NumberPadProps {
  board: Board;
  isPencilMode: boolean;
  onNumberClick: (num: number) => void;
  onEraseClick: () => void;
}

export default function NumberPad({
  board,
  isPencilMode,
  onNumberClick,
  onEraseClick,
}: NumberPadProps) {
  const getNumberCount = (num: number): number => {
    let count = 0;
    for (let row of board) {
      for (let cell of row) {
        if (cell.value === num) count++;
      }
    }
    return 9 - count;
  };

  const buttonBaseClasses = 'w-12 h-12 text-lg font-semibold rounded-lg transition-all duration-150 border-2';

  const getButtonClasses = (remaining: number) => {
    if (remaining === 0) {
      return `${buttonBaseClasses} bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed`;
    }
    return `${buttonBaseClasses} bg-white text-gray-900 border-gray-300 hover:bg-blue-50 hover:border-blue-400 active:bg-blue-100`;
  };

  return (
    <div className={`p-4 rounded-lg ${isPencilMode ? 'bg-blue-50' : 'bg-white'} shadow-sm transition-colors duration-200`}>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
          const remaining = getNumberCount(num);
          return (
            <button
              key={num}
              onClick={() => onNumberClick(num)}
              disabled={remaining === 0}
              className={getButtonClasses(remaining)}
            >
              <div className="flex flex-col items-center justify-center">
                <span>{num}</span>
                <span className="text-xs text-gray-500">{remaining}</span>
              </div>
            </button>
          );
        })}
        <button
          onClick={onEraseClick}
          className={`${buttonBaseClasses} bg-red-50 text-red-600 border-red-300 hover:bg-red-100 hover:border-red-400 active:bg-red-200`}
        >
          ×
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sudoku/NumberPad.tsx
git commit -m "feat: add NumberPad component with remaining count

- Display buttons 1-9 plus erase button
- Show remaining count for each number
- Disable buttons when all 9 of a number are placed
- Visual indicator for pencil mode (blue background)
- Touch-friendly button sizes"
```

---

## Task 10: GameControls Component

**Files:**
- Create: `src/components/sudoku/GameControls.tsx`

**Interfaces:**
- Consumes: `Difficulty` from `types.ts`
- Produces: `GameControls` component with props:
  - `difficulty: Difficulty`
  - `isPencilMode: boolean`
  - `canUndo: boolean`
  - `onDifficultyChange: (difficulty: Difficulty) => void`
  - `onNewGame: () => void`
  - `onTogglePencil: () => void`
  - `onUndo: () => void`

- [ ] **Step 1: Write GameControls component**

Create `src/components/sudoku/GameControls.tsx`:

```typescript
import { Difficulty } from '@/lib/sudoku/types';

interface GameControlsProps {
  difficulty: Difficulty;
  isPencilMode: boolean;
  canUndo: boolean;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onTogglePencil: () => void;
  onUndo: () => void;
}

export default function GameControls({
  difficulty,
  isPencilMode,
  canUndo,
  onDifficultyChange,
  onNewGame,
  onTogglePencil,
  onUndo,
}: GameControlsProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  const getDifficultyButtonClasses = (diff: Difficulty) => {
    const baseClasses = 'px-4 py-2 font-medium rounded-lg transition-all duration-150';
    if (diff === difficulty) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    return `${baseClasses} bg-white text-gray-700 hover:bg-gray-100 border border-gray-300`;
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex gap-2">
        {difficulties.map(diff => (
          <button
            key={diff}
            onClick={() => onDifficultyChange(diff)}
            className={getDifficultyButtonClasses(diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onNewGame}
          className="flex-1 px-4 py-2 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors duration-150"
        >
          New Game
        </button>

        <button
          onClick={onTogglePencil}
          className={`px-4 py-2 font-medium rounded-lg transition-all duration-150 ${
            isPencilMode
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          ✏️ Pencil
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`px-4 py-2 font-medium rounded-lg transition-all duration-150 ${
            canUndo
              ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
          }`}
        >
          ↶ Undo
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sudoku/GameControls.tsx
git commit -m "feat: add GameControls component

- Difficulty selector with tab-style buttons
- New Game button
- Pencil mode toggle with active state
- Undo button with disabled state
- Responsive layout with proper spacing"
```

---

## Task 11: Victory and GameOver Overlays

**Files:**
- Create: `src/components/sudoku/VictoryOverlay.tsx`
- Create: `src/components/sudoku/GameOverOverlay.tsx`

**Interfaces:**
- Consumes: `Difficulty` from `types.ts`
- Produces:
  - `VictoryOverlay` component with props: `score: number`, `timeElapsed: number`, `mistakes: number`, `difficulty: Difficulty`, `onPlayAgain: () => void`
  - `GameOverOverlay` component with props: `timeElapsed: number`, `onTryAgain: () => void`

- [ ] **Step 1: Write VictoryOverlay component**

Create `src/components/sudoku/VictoryOverlay.tsx`:

```typescript
import { Difficulty } from '@/lib/sudoku/types';

interface VictoryOverlayProps {
  score: number;
  timeElapsed: number;
  mistakes: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
}

export default function VictoryOverlay({
  score,
  timeElapsed,
  mistakes,
  difficulty,
  onPlayAgain,
}: VictoryOverlayProps) {
  const getBaseScore = (diff: Difficulty): number => {
    const scores = { easy: 1000, medium: 2000, hard: 3500 };
    return scores[diff];
  };

  const baseScore = getBaseScore(difficulty);
  const timePenalty = timeElapsed * 2;
  const mistakePenalty = mistakes * 200;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-green-600 mb-6">
          🎉 Victory!
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Difficulty:</span>
            <span className="font-semibold capitalize">{difficulty}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold">{formatTime(timeElapsed)}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Mistakes:</span>
            <span className="font-semibold">{mistakes}</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Base Score:</span>
              <span>+{baseScore}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Time Penalty:</span>
              <span>-{timePenalty}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Mistake Penalty:</span>
              <span>-{mistakePenalty}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Final Score:</span>
              <span className="text-green-600">{score}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors duration-150"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write GameOverOverlay component**

Create `src/components/sudoku/GameOverOverlay.tsx`:

```typescript
interface GameOverOverlayProps {
  timeElapsed: number;
  onTryAgain: () => void;
}

export default function GameOverOverlay({
  timeElapsed,
  onTryAgain,
}: GameOverOverlayProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-red-600 mb-6">
          Game Over
        </h2>

        <p className="text-center text-gray-600 mb-4">
          You made 3 mistakes. Better luck next time!
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Time Played:</span>
            <span className="font-semibold text-lg">{formatTime(timeElapsed)}</span>
          </div>
        </div>

        <button
          onClick={onTryAgain}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors duration-150"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/sudoku/VictoryOverlay.tsx src/components/sudoku/GameOverOverlay.tsx
git commit -m "feat: add victory and game over overlays

- VictoryOverlay shows score breakdown and play again button
- GameOverOverlay shows time played and try again button
- Both use modal-style overlay with backdrop
- Clean layout with proper typography and spacing"
```

---

## Task 12: useSudoku Hook - State and Basic Actions

**Files:**
- Create: `src/hooks/useSudoku.ts`

**Interfaces:**
- Consumes: All types from `types.ts`, all functions from `generator.ts`, `validator.ts`
- Produces: `useSudoku()` hook returning game state and actions

- [ ] **Step 1: Create hooks directory**

Run: `mkdir -p src/hooks`

- [ ] **Step 2: Write useSudoku hook with state and startNewGame**

Create `src/hooks/useSudoku.ts`:

```typescript
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Board, Cell, Difficulty } from '@/lib/sudoku/types';
import { generatePuzzle } from '@/lib/sudoku/generator';
import { isBoardComplete } from '@/lib/sudoku/validator';

function createCellFromNumber(value: number, isGiven: boolean): Cell {
  return {
    value,
    given: isGiven,
    notes: new Set(),
    isError: false,
  };
}

function convertToBoard(puzzle: number[][]): Board {
  return puzzle.map(row =>
    row.map(value => createCellFromNumber(value, value !== 0))
  );
}

function cloneCellBoard(board: Board): Board {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      notes: new Set(cell.notes),
    }))
  );
}

export function useSudoku() {
  const [board, setBoard] = useState<Board>(() => {
    const { puzzle } = generatePuzzle('easy');
    return convertToBoard(puzzle);
  });
  const [solution, setSolution] = useState<number[][]>(() => {
    const { solution } = generatePuzzle('easy');
    return solution;
  });
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mistakes, setMistakes] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [previousBoard, setPreviousBoard] = useState<Board | null>(null);
  const [score, setScore] = useState(0);

  const startNewGame = useCallback((diff: Difficulty) => {
    const { puzzle, solution: newSolution } = generatePuzzle(diff);
    setBoard(convertToBoard(puzzle));
    setSolution(newSolution);
    setDifficulty(diff);
    setMistakes(0);
    setTimeElapsed(0);
    setIsComplete(false);
    setIsGameOver(false);
    setIsPencilMode(false);
    setPreviousBoard(null);
    setScore(0);
    setSelectedCell(null);
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
  }, []);

  const togglePencilMode = useCallback(() => {
    setIsPencilMode(prev => !prev);
  }, []);

  const undo = useCallback(() => {
    if (previousBoard) {
      setBoard(previousBoard);
      setPreviousBoard(null);
    }
  }, [previousBoard]);

  return {
    board,
    solution,
    selectedCell,
    difficulty,
    mistakes,
    timeElapsed,
    isComplete,
    isGameOver,
    isPencilMode,
    score,
    canUndo: previousBoard !== null,
    startNewGame,
    selectCell,
    togglePencilMode,
    undo,
    inputNumber: () => {},
    eraseCell: () => {},
  };
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useSudoku.ts
git commit -m "feat: add useSudoku hook with state and basic actions

- Initialize game state with puzzle generation
- Implement startNewGame, selectCell, togglePencilMode, undo
- Add utility functions for cell and board conversion
- Placeholder for inputNumber and eraseCell (next step)"
```

---

## Task 13: useSudoku Hook - Input and Erase Actions

**Files:**
- Modify: `src/hooks/useSudoku.ts`

**Interfaces:**
- Consumes: Existing hook state
- Produces: Complete `inputNumber` and `eraseCell` implementations

- [ ] **Step 1: Add inputNumber implementation**

Replace the placeholder `inputNumber` in `src/hooks/useSudoku.ts`:

```typescript
  const inputNumber = useCallback(
    (num: number) => {
      if (!selectedCell || isComplete || isGameOver) return;

      const { row, col } = selectedCell;
      if (board[row][col].given) return;

      setPreviousBoard(cloneCellBoard(board));

      setBoard(prevBoard => {
        const newBoard = cloneCellBoard(prevBoard);
        const cell = newBoard[row][col];

        if (isPencilMode) {
          if (cell.notes.has(num)) {
            cell.notes.delete(num);
          } else {
            cell.notes.add(num);
          }
        } else {
          cell.value = num;
          cell.notes.clear();

          if (solution[row][col] === num) {
            cell.isError = false;
          } else {
            cell.isError = true;
            setMistakes(prev => {
              const newMistakes = prev + 1;
              if (newMistakes >= 3) {
                setIsGameOver(true);
              }
              return newMistakes;
            });
          }

          if (isBoardComplete(newBoard)) {
            setIsComplete(true);
            const baseScores = { easy: 1000, medium: 2000, hard: 3500 };
            const baseScore = baseScores[difficulty];
            const finalScore = Math.max(
              0,
              baseScore - timeElapsed * 2 - mistakes * 200
            );
            setScore(finalScore);
          }
        }

        return newBoard;
      });
    },
    [selectedCell, board, solution, isPencilMode, isComplete, isGameOver, difficulty, timeElapsed, mistakes]
  );
```

- [ ] **Step 2: Add eraseCell implementation**

Replace the placeholder `eraseCell` in `src/hooks/useSudoku.ts`:

```typescript
  const eraseCell = useCallback(() => {
    if (!selectedCell || isComplete || isGameOver) return;

    const { row, col } = selectedCell;
    if (board[row][col].given) return;

    setPreviousBoard(cloneCellBoard(board));

    setBoard(prevBoard => {
      const newBoard = cloneCellBoard(prevBoard);
      const cell = newBoard[row][col];

      cell.value = 0;
      cell.notes.clear();
      cell.isError = false;

      return newBoard;
    });
  }, [selectedCell, board, isComplete, isGameOver]);
```

- [ ] **Step 3: Update return statement**

Replace the return statement to include the real implementations:

```typescript
  return {
    board,
    solution,
    selectedCell,
    difficulty,
    mistakes,
    timeElapsed,
    isComplete,
    isGameOver,
    isPencilMode,
    score,
    canUndo: previousBoard !== null,
    startNewGame,
    selectCell,
    togglePencilMode,
    undo,
    inputNumber,
    eraseCell,
  };
```

- [ ] **Step 4: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSudoku.ts
git commit -m "feat: implement inputNumber and eraseCell in useSudoku hook

- inputNumber handles both pencil mode and normal mode
- Check against solution and mark errors
- Increment mistakes and trigger game over at 3
- Check for completion and calculate score
- eraseCell clears value, notes, and error state
- Both save previousBoard for undo"
```

---

## Task 14: useSudoku Hook - Timer Logic

**Files:**
- Modify: `src/hooks/useSudoku.ts`

**Interfaces:**
- Consumes: Existing hook state
- Produces: Timer that increments every second and pauses on completion

- [ ] **Step 1: Add timer useEffect**

Add this useEffect after all the state declarations in `src/hooks/useSudoku.ts`:

```typescript
  useEffect(() => {
    if (isComplete || isGameOver) return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete, isGameOver]);
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSudoku.ts
git commit -m "feat: add timer logic to useSudoku hook

- Timer increments every second
- Pauses when game is complete or game over
- Cleanup interval on unmount"
```

---

## Task 15: useSudoku Hook - Keyboard Navigation

**Files:**
- Modify: `src/hooks/useSudoku.ts`

**Interfaces:**
- Consumes: Existing hook state and actions
- Produces: `handleKeyPress` function for keyboard navigation

- [ ] **Step 1: Add handleKeyPress function**

Add this function before the return statement in `src/hooks/useSudoku.ts`:

```typescript
  const handleKeyPress = useCallback(
    (key: string) => {
      if (isComplete || isGameOver) return;

      if (key >= '1' && key <= '9') {
        inputNumber(parseInt(key, 10));
        return;
      }

      if (key === 'Backspace' || key === 'Delete') {
        eraseCell();
        return;
      }

      if (key === 'p' || key === 'P') {
        togglePencilMode();
        return;
      }

      if (!selectedCell) {
        setSelectedCell({ row: 0, col: 0 });
        return;
      }

      const { row, col } = selectedCell;

      if (key === 'ArrowUp') {
        setSelectedCell({ row: row === 0 ? 8 : row - 1, col });
      } else if (key === 'ArrowDown') {
        setSelectedCell({ row: row === 8 ? 0 : row + 1, col });
      } else if (key === 'ArrowLeft') {
        setSelectedCell({ row, col: col === 0 ? 8 : col - 1 });
      } else if (key === 'ArrowRight') {
        setSelectedCell({ row, col: col === 8 ? 0 : col + 1 });
      }
    },
    [selectedCell, isComplete, isGameOver, inputNumber, eraseCell, togglePencilMode]
  );
```

- [ ] **Step 2: Update return statement to include handleKeyPress**

Update the return statement to include `handleKeyPress`:

```typescript
  return {
    board,
    solution,
    selectedCell,
    difficulty,
    mistakes,
    timeElapsed,
    isComplete,
    isGameOver,
    isPencilMode,
    score,
    canUndo: previousBoard !== null,
    startNewGame,
    selectCell,
    togglePencilMode,
    undo,
    inputNumber,
    eraseCell,
    handleKeyPress,
  };
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useSudoku.ts
git commit -m "feat: add keyboard navigation to useSudoku hook

- Arrow keys move selection with wrapping
- Number keys 1-9 call inputNumber
- Backspace/Delete call eraseCell
- P key toggles pencil mode
- Handle keyboard events when game not complete"
```

---

## Task 16: Wire Components to Game Logic

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: All components and useSudoku hook
- Produces: Complete working game

- [ ] **Step 1: Update main page to use all components**

Replace `src/app/page.tsx` with:

```typescript
'use client';

import { useSudoku } from '@/hooks/useSudoku';
import SudokuBoard from '@/components/sudoku/SudokuBoard';
import GameStatus from '@/components/sudoku/GameStatus';
import NumberPad from '@/components/sudoku/NumberPad';
import GameControls from '@/components/sudoku/GameControls';
import VictoryOverlay from '@/components/sudoku/VictoryOverlay';
import GameOverOverlay from '@/components/sudoku/GameOverOverlay';

export default function Home() {
  const {
    board,
    selectedCell,
    difficulty,
    mistakes,
    timeElapsed,
    isComplete,
    isGameOver,
    isPencilMode,
    score,
    canUndo,
    startNewGame,
    selectCell,
    togglePencilMode,
    undo,
    inputNumber,
    eraseCell,
    handleKeyPress,
  } = useSudoku();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">Sudoku</h1>

      <GameStatus timeElapsed={timeElapsed} mistakes={mistakes} />

      <SudokuBoard
        board={board}
        selectedCell={selectedCell}
        onCellClick={selectCell}
        onKeyDown={handleKeyPress}
      />

      <NumberPad
        board={board}
        isPencilMode={isPencilMode}
        onNumberClick={inputNumber}
        onEraseClick={eraseCell}
      />

      <GameControls
        difficulty={difficulty}
        isPencilMode={isPencilMode}
        canUndo={canUndo}
        onDifficultyChange={startNewGame}
        onNewGame={() => startNewGame(difficulty)}
        onTogglePencil={togglePencilMode}
        onUndo={undo}
      />

      {isComplete && (
        <VictoryOverlay
          score={score}
          timeElapsed={timeElapsed}
          mistakes={mistakes}
          difficulty={difficulty}
          onPlayAgain={() => startNewGame(difficulty)}
        />
      )}

      {isGameOver && (
        <GameOverOverlay
          timeElapsed={timeElapsed}
          onTryAgain={() => startNewGame(difficulty)}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 2: Test the application**

Run: `npm run dev`

Expected:
- App loads at http://localhost:3000
- Sudoku board displays with numbers
- Can click cells to select them
- Can click number pad to input numbers
- Timer counts up
- All controls work

- [ ] **Step 3: Stop dev server**

Press Ctrl+C

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire all components together in main page

- Connect useSudoku hook to all UI components
- Display game board, status, number pad, controls
- Show victory/game over overlays when appropriate
- Full game is now playable"
```

---

## Task 17: Final Testing and Bug Fixes

**Files:**
- Potentially any file that needs fixes

**Interfaces:**
- Consumes: Complete application
- Produces: Polished, bug-free game

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 2: Build production version**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Manual testing checklist**

Start dev server: `npm run dev`

Test the following:
- [ ] Start a new easy game - puzzle loads
- [ ] Select cells with mouse clicks
- [ ] Navigate with arrow keys
- [ ] Input numbers 1-9 with keyboard
- [ ] Input numbers with number pad
- [ ] Toggle pencil mode - verify background changes
- [ ] Add pencil notes to empty cell
- [ ] Remove pencil notes by clicking again
- [ ] Enter correct number - cell turns blue
- [ ] Enter wrong number - cell turns red, mistake count increases
- [ ] Erase cell with backspace key
- [ ] Erase cell with erase button
- [ ] Undo last move - verify board restores
- [ ] Undo button disabled when no previous move
- [ ] Number pad shows remaining count
- [ ] Number pad disables when 9 of a number placed
- [ ] Switch difficulty - new game starts
- [ ] Timer counts up each second
- [ ] Make 3 mistakes - game over overlay appears
- [ ] Solve complete puzzle - victory overlay appears with score
- [ ] Click play again - new game starts
- [ ] All styling looks correct (borders, colors, spacing)

- [ ] **Step 4: Fix any bugs found**

If bugs are found during testing, fix them and commit:

```bash
git add [files]
git commit -m "fix: [description of bug fix]"
```

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "test: complete manual testing and verify all features work

- All game mechanics functional
- UI/UX polished and responsive
- No critical bugs found
- Ready for production"
```

---

## Task 18: Create Agent Usage Documentation

**Files:**
- Create: `docs/superpowers/agent-usage-log.md`

**Interfaces:**
- Consumes: Implementation experience
- Produces: Documentation of which agents/skills/tools were used

- [ ] **Step 1: Create agent usage log**

Create `docs/superpowers/agent-usage-log.md`:

```markdown
# Sudoku Game - Agent & Skill Usage Log

This document tracks which agents, skills, and MCP tools were used during the implementation of the Sudoku game.

## Skills Used

### 1. superpowers:brainstorming
**Purpose:** Initial design and requirements gathering
**When:** Start of project
**What it did:**
- Explored project context
- Asked clarifying questions about features
- Proposed implementation approaches
- Created comprehensive design document
- Validated design sections with user

**Output:** `docs/superpowers/specs/2026-06-17-sudoku-game-design.md`

### 2. superpowers:writing-plans
**Purpose:** Create detailed implementation plan from design spec
**When:** After design approval
**What it did:**
- Converted design document into step-by-step implementation tasks
- Broke down work into 18 manageable tasks
- Defined file structure and interfaces
- Created TDD-style workflow with tests first
- Specified exact commands and expected outputs

**Output:** `docs/superpowers/plans/2026-06-17-sudoku-game-implementation.md`

### 3. superpowers:subagent-driven-development (Recommended)
**Purpose:** Execute implementation plan with task-by-task review
**When:** During implementation
**What it does:**
- Dispatches fresh subagent for each task
- Performs two-stage review (self-review + user review)
- Ensures quality at each step
- Allows iteration and course correction

**Status:** Recommended for executing this plan

### 4. superpowers:executing-plans (Alternative)
**Purpose:** Execute plan inline with checkpoint reviews
**When:** During implementation (alternative approach)
**What it does:**
- Executes tasks in current session
- Batch execution with periodic checkpoints
- User reviews at designated stopping points

**Status:** Alternative to subagent-driven-development

## Agents Used

### General-Purpose Agent
**Purpose:** Code search and multi-step tasks
**When:** As needed during implementation
**What it can do:**
- Search codebase for keywords
- Research complex questions
- Execute multi-step autonomous tasks

**Status:** Available but not required for this plan

### Code Reviewer Agent
**Purpose:** Review implemented code for quality
**When:** After completing major features
**What it can do:**
- Review code for bugs, style, and best practices
- Suggest improvements
- Verify requirements met

**Status:** Recommended after Task 11 (all components) and Task 16 (integration)

### Test Runner Agent
**Purpose:** Automated testing
**When:** Throughout implementation
**What it can do:**
- Run test suites
- Report failures
- Verify test coverage

**Status:** Used in each task that includes tests

## MCP Tools

**Status:** No MCP (Model Context Protocol) tools were required for this implementation.

The project uses standard development tools:
- Jest for testing
- Next.js for framework
- TypeScript for type checking
- npm for package management

## Implementation Approach

**Chosen Strategy:** Component-First Build (Approach A)

**Order:**
1. Project setup and type definitions
2. Core algorithm layer (solver, validator, generator)
3. Next.js app setup
4. UI components with mock data
5. Game logic hook (useSudoku)
6. Integration of components with real logic
7. Testing and polish

**Rationale:**
- Visual feedback early in development
- Separation of concerns (UI vs logic)
- Easier to iterate on UX
- Can test with hardcoded puzzles initially

## Key Decision Points

### Design Decisions
1. **No unique solution verification** - Simplified for performance
2. **Single undo only** - Not unlimited history
3. **Score hidden during play** - Only shown on completion
4. **Notes only clear in current cell** - Not affected cells

### Technical Decisions
1. **No external state management** - React hooks sufficient
2. **CSS Grid for board layout** - Efficient and responsive
3. **Set for notes storage** - O(1) operations
4. **Separate solution array** - Simple validation

## Commits

All commits follow conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `test:` - Test additions
- `docs:` - Documentation

## Review Points

Recommended review checkpoints:
1. After Task 4 - All algorithms implemented and tested
2. After Task 11 - All UI components created
3. After Task 16 - Full integration complete
4. After Task 17 - Final testing done

## Success Metrics

The implementation is complete when all items in the design spec's "Success Criteria" are met:
- ✅ Players can start a new game at any difficulty level
- ✅ All input methods work (mouse, keyboard, number pad)
- ✅ Pencil mode allows toggling notes
- ✅ Mistakes are tracked and game ends at 3 mistakes
- ✅ Timer runs and pauses correctly
- ✅ Victory/game over states display correctly
- ✅ Undo restores previous move
- ✅ Score calculates and displays on completion
- ✅ Visual design matches specification
- ✅ No critical bugs or broken interactions
```

- [ ] **Step 2: Commit documentation**

```bash
git add docs/superpowers/agent-usage-log.md
git commit -m "docs: add agent and skill usage documentation

- Document all skills used in project
- List available agents and their purposes
- Explain implementation approach
- Track key decisions and review points"
```

---

## Self-Review Checklist

**Spec Coverage:**
- ✅ Type definitions (Task 1)
- ✅ Solver algorithm (Task 2)
- ✅ Validator functions (Task 3)
- ✅ Puzzle generator (Task 4)
- ✅ Next.js setup (Task 5)
- ✅ All UI components (Tasks 6-11)
- ✅ Game logic hook (Tasks 12-15)
- ✅ Integration (Task 16)
- ✅ Testing (Task 17)
- ✅ Documentation (Task 18)

**Placeholder Check:**
- ✅ No TBD or TODO items
- ✅ All code blocks are complete
- ✅ All commands have expected outputs
- ✅ No "implement later" placeholders

**Type Consistency:**
- ✅ `Difficulty` type used consistently
- ✅ `Cell` interface matches across all files
- ✅ `Board` type is `Cell[][]` everywhere
- ✅ Hook return type matches component props

**Task Boundaries:**
- ✅ Each task is independently testable
- ✅ Tasks build on previous work logically
- ✅ Clear interfaces between tasks
- ✅ Frequent, meaningful commits
