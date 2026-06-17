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
