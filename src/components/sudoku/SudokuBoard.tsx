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
