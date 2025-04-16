import React, { useState } from 'react';
import { Settings, Home, Trophy } from 'lucide-react';
import Board from './components/Board';
import DifficultySelector from './components/DifficultySelector';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'impossible'>('easy');
  const [playerMark, setPlayerMark] = useState<'X' | 'O'>('X');

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleMainMenu = () => {
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {!gameStarted ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-pink-600 mb-8">Tic Tac Toe</h1>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Choose Your Mark</h2>
              <div className="flex justify-center gap-4">
                <button
                  className={`w-16 h-16 rounded-lg text-2xl font-bold transition-all ${
                    playerMark === 'X'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setPlayerMark('X')}
                >
                  X
                </button>
                <button
                  className={`w-16 h-16 rounded-lg text-2xl font-bold transition-all ${
                    playerMark === 'O'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setPlayerMark('O')}
                >
                  O
                </button>
              </div>
            </div>
            <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
            <button
              onClick={handleStartGame}
              className="w-full bg-pink-500 text-white py-4 rounded-lg text-xl font-semibold hover:bg-pink-600 transition-colors mt-8"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-pink-500" />
                <span className="text-gray-700">Difficulty: {difficulty}</span>
              </div>
              <button
                onClick={handleMainMenu}
                className="flex items-center gap-2 text-pink-500 hover:text-pink-600"
              >
                <Home className="w-5 h-5" />
                Menu
              </button>
            </div>
            <Board playerMark={playerMark} difficulty={difficulty} />
            <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-pink-500" />
                <span>Wins: 0</span>
              </div>
              <span>Draws: 0</span>
              <span>Losses: 0</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;