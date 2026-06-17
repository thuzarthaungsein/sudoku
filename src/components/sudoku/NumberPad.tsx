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
