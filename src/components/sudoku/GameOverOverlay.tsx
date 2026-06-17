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
