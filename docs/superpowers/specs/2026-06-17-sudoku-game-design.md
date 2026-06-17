# Sudoku Game Design Specification

**Date:** 2026-06-17
**Project:** Interactive Sudoku Game
**Status:** Approved

## Overview

A web-based Sudoku game built with Next.js, TypeScript, and Tailwind CSS. Players can solve puzzles at three difficulty levels with features including pencil notes, undo, timer, and scoring.

## Technical Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React hooks (no external library needed)

## Project Architecture

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata
│   └── page.tsx            # Main game page
├── components/sudoku/
│   ├── SudokuBoard.tsx     # 9×9 grid, keyboard handling
│   ├── SudokuCell.tsx      # Individual cell rendering
│   ├── NumberPad.tsx       # 1-9 input buttons + erase
│   ├── GameControls.tsx    # Difficulty, new game, pencil, undo
│   └── GameStatus.tsx      # Timer, mistakes display
├── hooks/
│   └── useSudoku.ts        # All game state and logic
└── lib/sudoku/
    ├── types.ts            # TypeScript interfaces
    ├── solver.ts           # Backtracking solver
    ├── generator.ts        # Puzzle generation
    └── validator.ts        # Conflict detection
```

### Data Flow

- **Single source of truth:** `useSudoku` hook manages all game state
- **Presentational components:** Receive props and call hook actions
- **Pure game logic:** `lib/sudoku/` contains pure functions with no React dependencies
- **No global state:** React hooks sufficient for this application scope

### Implementation Order (Component-First Approach)

1. UI components with mock data
2. Game state hook and logic
3. Puzzle generation algorithms

This approach allows early UX validation and keeps concerns separated.

## Data Models

### Type Definitions (`lib/sudoku/types.ts`)

```typescript
type Difficulty = 'easy' | 'medium' | 'hard'

interface Cell {
  value: number        // 0 = empty, 1-9 for filled
  given: boolean       // true = pre-filled (immutable)
  notes: Set<number>   // pencil marks (1-9)
  isError: boolean     // true when conflicts with solution
}

type Board = Cell[][]  // 9×9 grid
```

### Game State (in `useSudoku` hook)

| State | Type | Description |
|-------|------|-------------|
| `board` | `Board` | Current game state (9×9 grid of Cells) |
| `solution` | `number[][]` | Correct solution for validation |
| `selectedCell` | `{ row: number; col: number } \| null` | Currently selected cell position |
| `difficulty` | `Difficulty` | Current difficulty level |
| `mistakes` | `number` | Count of wrong placements (max 3) |
| `timeElapsed` | `number` | Seconds since game start |
| `isComplete` | `boolean` | Puzzle solved correctly |
| `isGameOver` | `boolean` | Hit 3 mistakes limit |
| `isPencilMode` | `boolean` | Pencil marks vs number placement mode |
| `previousBoard` | `Board \| null` | Single-move undo state |

### Key Design Decisions

- **`Cell.notes` uses `Set<number>`** for efficient add/remove/check operations
- **Separate `solution` array** keeps validation simple (just compare values)
- **Single `previousBoard`** instead of full history for single-undo feature
- **`isError` flag on cells** allows immediate visual feedback on mistakes

## Sudoku Algorithm Components

### Solver (`lib/sudoku/solver.ts`)

**Core algorithm:** Backtracking

**Functions:**
- `isValid(board: number[][], row: number, col: number, num: number): boolean`
  - Checks if placing `num` at position violates Sudoku rules
  - Validates no duplicates in same row, column, or 3×3 box

- `solve(board: number[][]): boolean`
  - Recursive backtracking solver
  - Mutates board in-place
  - Returns true if solvable, false otherwise

- `cloneBoard(board: number[][]): number[][]`
  - Deep clone utility for board copies

### Generator (`lib/sudoku/generator.ts`)

**Approach:** Simplified generation without unique solution verification (for performance)

**Functions:**
- `generateSolvedBoard(): number[][]`
  - Creates a complete valid Sudoku board
  - Strategy: Fill diagonal 3×3 boxes first (they're independent), then call solver to complete the rest
  - Uses shuffled number arrays for randomness

- `generatePuzzle(difficulty: Difficulty): { puzzle: number[][], solution: number[][] }`
  - Clones solved board
  - Randomly removes cells until target clue count reached
  - **Clue counts:**
    - Easy: 46 clues
    - Medium: 36 clues
    - Hard: 29 clues

**Note:** We're skipping unique solution verification to keep puzzle generation instant. This may occasionally produce puzzles with multiple solutions, but is acceptable for this implementation.

### Validator (`lib/sudoku/validator.ts`)

**Functions:**
- `getConflicts(board: Cell[][], row: number, col: number): Array<{row: number, col: number}>`
  - Returns all positions that conflict with given cell
  - Checks for same value in same row, column, or 3×3 box

- `isBoardComplete(board: Cell[][]): boolean`
  - Checks all cells are filled
  - Verifies no conflicts exist

## Game Logic Hook (`useSudoku`)

### State Management

All game state managed with `useState`, timer with `useEffect`, and actions with `useCallback` to prevent re-render issues.

### Core Actions

**`startNewGame(difficulty: Difficulty)`**
- Generates new puzzle using `generatePuzzle(difficulty)`
- Resets all state: mistakes = 0, timeElapsed = 0, isComplete = false, isGameOver = false
- Initializes board with given cells marked (`given: true`)
- Clears previousBoard

**`selectCell(row: number, col: number)`**
- Updates selectedCell position
- Used for both mouse clicks and keyboard navigation

**`inputNumber(num: 1-9)`**
- **If pencil mode:** Toggle `num` in selected cell's notes Set
- **If normal mode:**
  1. Save current board to previousBoard (for undo)
  2. Place value in cell
  3. Clear cell's notes
  4. Check value against solution
  5. If incorrect: increment mistakes, set cell.isError = true
  6. If correct: set cell.isError = false
  7. Check if board is complete
  8. If mistakes === 3: set isGameOver = true

**`eraseCell()`**
- Only works if selected cell is not a given cell
- Saves current board to previousBoard
- Clears cell value (set to 0)
- Clears cell notes (empty Set)
- Clears cell error flag

**`togglePencilMode()`**
- Flips isPencilMode boolean

**`undo()`**
- Restores previousBoard if it exists
- Clears previousBoard after restoration
- Button disabled when previousBoard === null

### Timer Logic

- `useEffect` with `setInterval` increments timeElapsed every 1000ms
- Interval clears when isComplete or isGameOver becomes true
- Timer pauses automatically on game end

### Completion Check

After each number placement:
1. Check if all cells are filled (no zeros)
2. If filled, compare entire board against solution
3. If match: set isComplete = true, calculate score
4. Timer stops automatically via useEffect dependency

### Undo Behavior

- Before any board mutation (inputNumber, eraseCell), clone current board to previousBoard
- Only one previous state stored (single undo)
- Undo restores the previous board state completely

## UI Components

### SudokuBoard.tsx

**Responsibilities:**
- Renders 9×9 CSS Grid
- Handles keyboard events
- Computes highlight states for cells
- Renders thicker borders for 3×3 box visualization

**Keyboard Handling:**
- Attached to board container with `tabIndex={0}`
- **Arrow keys:** Move selection (wrap at edges)
- **1-9:** Call `inputNumber(num)`
- **Backspace/Delete:** Call `eraseCell()`
- **'p' or 'P':** Toggle pencil mode

**Visual Structure:**
- CSS Grid with 9 columns × 9 rows
- Thicker borders (2-3px) every 3rd row/column for 3×3 boxes
- Passes cell data + computed props to SudokuCell

### SudokuCell.tsx

**Props:**
- `cell: Cell`
- `isSelected: boolean`
- `isHighlighted: boolean`
- `onClick: () => void`

**Rendering Logic:**
- **If `cell.value > 0`:** Display number with styling:
  - `cell.given` → dark, bold (font-weight: 700)
  - `cell.isError` → red text/background (#dc2626 / #fee2e2)
  - User input → medium blue (#3b82f6), font-weight: 500

- **If `cell.value === 0` and `cell.notes.size > 0`:**
  - Render 3×3 mini-grid of note numbers
  - Small gray text (text-xs, #6b7280)
  - Position numbers 1-9 in grid positions matching their values

**Click Handler:**
- Calls `onClick` which triggers `selectCell(row, col)`

### NumberPad.tsx

**Features:**
- Buttons for 1-9 plus Erase button
- Each number button shows remaining count
  - Count = 9 - (number of times that number appears on board)
  - Disabled/grayed when count === 0
- Visual indicator when pencil mode active (subtle background tint on entire pad)
- Click handlers call `inputNumber(num)` or `eraseCell()`

**Layout:**
- Grid or flex layout
- Responsive: stacks or wraps on small screens
- Touch-friendly sizing (min 44px tap targets)

### GameControls.tsx

**Controls:**
- **Difficulty selector:** Three tab-style buttons (Easy/Medium/Hard)
- **New Game button:** Calls `startNewGame(difficulty)`
- **Pencil mode toggle:** Button with icon and active state styling
- **Undo button:** Calls `undo()`, disabled when `previousBoard === null`

**Layout:**
- Horizontal layout on desktop
- May stack vertically on mobile

### GameStatus.tsx

**Display Elements:**
- **Timer:** Formats `timeElapsed` as MM:SS
- **Mistakes indicator:** 3 circles/hearts
  - Filled based on mistakes count (0-3)
  - Visual progression of error tolerance
- **Score:** Hidden during gameplay, only shown on completion

**Layout:**
- Horizontal row above or below board
- Clear, readable typography

### Overlays

**Victory Overlay** (shown when `isComplete === true`):
- Celebration message
- Final score with breakdown:
  - Base points for difficulty
  - Time penalty (timeElapsed × 2)
  - Mistake penalty (mistakes × 200)
- "Play Again" button (calls `startNewGame(difficulty)`)

**Game Over Overlay** (shown when `isGameOver === true`):
- "Game Over" message
- Final time elapsed
- "Try Again" button (calls `startNewGame(difficulty)`)

## Visual Design

### Color Scheme

| Element | Color/Style |
|---------|-------------|
| Board background | White |
| Cell borders | Light gray, 1px |
| 3×3 box borders | Dark gray, 2-3px solid |
| Selected cell | Blue background (#3b82f6) |
| Same row/col/box highlight | Light blue tint (#dbeafe) |
| Same value highlight | Medium blue tint (#bfdbfe) |
| Given numbers | Dark gray/black, font-weight: 700 |
| User numbers | Medium blue (#3b82f6), font-weight: 500 |
| Error cells | Red background (#fee2e2), red text (#dc2626) |
| Pencil notes | Small text (text-xs), gray (#6b7280) |

### Interaction States

- **Buttons:** Hover effects, active states, disabled styling
- **Keyboard focus:** Visible focus ring on board container
- **Pencil mode active:** Visual indicator on toggle button + subtle tint on number pad

### Responsive Design

- Board scales to fit viewport on mobile
- Number pad stacks vertically or wraps on small screens
- Touch-friendly button sizes (minimum 44px tap targets)
- Adaptive spacing for different screen sizes

### Polish & Animation

- Smooth transitions on cell selection (150-200ms)
- Subtle button press feedback
- Victory confetti or celebration animation (optional enhancement)
- Fade transitions for overlays

## Scoring System

### Formula

```
Base points by difficulty:
- Easy: 1000
- Medium: 2000
- Hard: 3500

Final score = basePoints - (timeElapsed × 2) - (mistakes × 200)
Minimum score: 0 (no negative scores)
```

### Display Behavior

- **During gameplay:** Score is hidden
- **On completion:** Score revealed in victory overlay with breakdown showing:
  - Base points
  - Time penalty
  - Mistake penalty
  - Final total

## Feature Scope

### Included Features

- Three difficulty levels (Easy, Medium, Hard)
- Pencil marks for notation
- Single-move undo
- Timer (shows elapsed time)
- Mistake tracking (max 3)
- Score calculation on completion
- Keyboard navigation and input
- Visual conflict highlighting
- Victory and game over states

### Explicitly Excluded

- Unique solution verification (for performance)
- Unlimited undo history (only single undo)
- Live score display during gameplay (hidden until completion)
- Auto-clearing notes in affected cells (only clears notes in the cell where number is placed)
- Hint system
- Pause functionality
- Save/load game state
- Multiplayer features
- Leaderboards

## Implementation Notes

### Critical Details

1. **Notes clearing behavior:** Notes only clear for the cell where a number is placed, not for affected cells in the same row/col/box
2. **Keyboard navigation:** Requires `tabIndex={0}` on board container and `keydown` event listener
3. **Timer pause:** Timer automatically stops when `isComplete` or `isGameOver` becomes true via useEffect dependency
4. **Undo snapshots:** Deep clone full board before each mutation, store only one previous state
5. **useCallback usage:** All actions wrapped in `useCallback` to prevent unnecessary re-renders

### Performance Considerations

- Puzzle generation should be near-instant (< 100ms) due to simplified approach
- Board state updates are localized to minimize re-renders
- CSS Grid for efficient board layout
- Set operations for notes are O(1) for add/remove/check

### Testing Strategy

- Unit tests for solver, generator, validator functions
- Component tests for UI interactions
- Integration tests for game flow (start → play → win/lose)
- Edge cases: empty boards, full boards, invalid inputs

## Success Criteria

The implementation is complete when:

1. Players can start a new game at any difficulty level
2. All input methods work (mouse, keyboard, number pad)
3. Pencil mode allows toggling notes
4. Mistakes are tracked and game ends at 3 mistakes
5. Timer runs and pauses correctly
6. Victory/game over states display correctly
7. Undo restores previous move
8. Score calculates and displays on completion
9. Visual design matches specification
10. No critical bugs or broken interactions
