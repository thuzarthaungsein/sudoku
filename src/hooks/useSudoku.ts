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

  // Timer logic
  useEffect(() => {
    if (isComplete || isGameOver) return;

    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete, isGameOver]);

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
}
