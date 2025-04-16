// Game state type
export type GameState = (string | null)[];

// Winning combinations
const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6], // Diagonal
];

export const checkWinner = (board: GameState): string | null => {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const checkDraw = (board: GameState): boolean => {
  return board.every((cell) => cell !== null);
};

export const getAvailableMoves = (board: GameState): number[] => {
  return board.reduce<number[]>((moves, cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);
};

// Minimax algorithm with alpha-beta pruning
const minimax = (
  board: GameState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiMark: string,
  playerMark: string
): number => {
  const winner = checkWinner(board);
  if (winner === aiMark) return 10 - depth;
  if (winner === playerMark) return depth - 10;
  if (checkDraw(board)) return 0;

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = aiMark;
      const evaluation = minimax(newBoard, depth + 1, false, alpha, beta, aiMark, playerMark);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = playerMark;
      const evaluation = minimax(newBoard, depth + 1, true, alpha, beta, aiMark, playerMark);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

// AI move based on difficulty
export const getAIMove = (
  board: GameState,
  difficulty: 'easy' | 'medium' | 'impossible',
  aiMark: string,
  playerMark: string
): number => {
  const availableMoves = getAvailableMoves(board);
  
  // Easy: Random move
  if (difficulty === 'easy') {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Medium: 30% random, 70% minimax
  if (difficulty === 'medium' && Math.random() < 0.3) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Medium/Impossible: Use minimax with alpha-beta pruning
  let bestMove = -1;
  let bestScore = -Infinity;

  for (const move of availableMoves) {
    const newBoard = [...board];
    newBoard[move] = aiMark;
    const score = minimax(newBoard, 0, false, -Infinity, Infinity, aiMark, playerMark);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};