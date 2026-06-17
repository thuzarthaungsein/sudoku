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
