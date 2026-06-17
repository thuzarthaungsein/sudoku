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
