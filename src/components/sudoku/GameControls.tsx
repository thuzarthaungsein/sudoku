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
