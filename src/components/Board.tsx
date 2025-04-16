import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { checkWinner, checkDraw, getAIMove, GameState } from '../utils/gameLogic';

interface BoardProps {
  playerMark: 'X' | 'O';
  difficulty: 'easy' | 'medium' | 'impossible';
}

const Board: React.FC<BoardProps> = ({ playerMark, difficulty }) => {
  const [board, setBoard] = useState<GameState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'draw'>('playing');
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
  
  const aiMark = playerMark === 'X' ? 'O' : 'X';

  const updateGameStatus = (newBoard: GameState) => {
    const winner = checkWinner(newBoard);
    if (winner) {
      if (winner === playerMark) {
        setGameStatus('won');
        setStats(prev => ({ ...prev, wins: prev.wins + 1 }));
      } else {
        setGameStatus('lost');
        setStats(prev => ({ ...prev, losses: prev.losses + 1 }));
      }
      return true;
    }
    if (checkDraw(newBoard)) {
      setGameStatus('draw');
      setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      return true;
    }
    return false;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || gameStatus !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = playerMark;
    setBoard(newBoard);

    if (!updateGameStatus(newBoard)) {
      setIsPlayerTurn(false);
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board, difficulty, aiMark, playerMark);
        const newBoard = [...board];
        newBoard[aiMove] = aiMark;
        setBoard(newBoard);
        
        if (!updateGameStatus(newBoard)) {
          setIsPlayerTurn(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, difficulty, aiMark, playerMark]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
  };

  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'won':
        return 'You Won! 🎉';
      case 'lost':
        return 'AI Wins! 🤖';
      case 'draw':
        return "It's a Draw! 🤝";
      default:
        return isPlayerTurn ? 'Your Turn' : 'AI Thinking...';
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <p className={`text-lg font-semibold ${
          gameStatus === 'won' ? 'text-green-500' :
          gameStatus === 'lost' ? 'text-red-500' :
          gameStatus === 'draw' ? 'text-gray-500' :
          'text-pink-500'
        }`}>
          {getStatusMessage()}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className={`w-full aspect-square bg-pink-50 rounded-lg text-3xl font-bold flex items-center justify-center transition-all ${
              cell ? 'cursor-not-allowed' : 'hover:bg-pink-100'
            } ${gameStatus !== 'playing' ? 'cursor-not-allowed' : ''}`}
            disabled={!!cell || gameStatus !== 'playing' || !isPlayerTurn}
          >
            <span className={cell === 'X' ? 'text-pink-500' : 'text-blue-500'}>
              {cell}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <span>Wins: {stats.wins}</span>
        <span>Draws: {stats.draws}</span>
        <span>Losses: {stats.losses}</span>
      </div>
      <button
        onClick={resetGame}
        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        New Game
      </button>
    </div>
  );
};

export default Board;