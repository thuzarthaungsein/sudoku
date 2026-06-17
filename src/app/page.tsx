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
