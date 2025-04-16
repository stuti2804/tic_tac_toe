// Game state
let gameState = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    difficulty: 'easy',
    timeAttackMode: false,
    timer: null,
    timeLeft: 10,
    moveHistory: [],
    stats: {
        wins: 0,
        draws: 0,
        losses: 0
    }
};

// DOM Elements
const playerMarkerSelect = document.getElementById('playerMarker');
const difficultySelect = document.getElementById('difficulty');
const timeAttackCheckbox = document.getElementById('timeAttack');
const timerDisplay = document.getElementById('timer');
const cells = document.querySelectorAll('.cell');
const undoButton = document.getElementById('undoMove');
const showNextMoveButton = document.getElementById('showNextMove');
const resetButton = document.getElementById('resetGame');
const statusDisplay = document.getElementById('status');
const statsDisplay = {
    wins: document.getElementById('wins'),
    draws: document.getElementById('draws'),
    losses: document.getElementById('losses')
};

// Winning combinations
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Initialize game
function initGame() {
    gameState.board = Array(9).fill(null);
    gameState.currentPlayer = playerMarkerSelect.value;
    gameState.moveHistory = [];
    updateBoard();
    updateStatus('Your Turn');
    
    if (gameState.timeAttackMode) {
        startTimer();
    }
}

// Update board display
function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = gameState.board[index] || '';
        cell.classList.remove('highlight');
    });
}

// Update status message
function updateStatus(message) {
    statusDisplay.textContent = message;
}

// Update stats display
function updateStats() {
    statsDisplay.wins.textContent = gameState.stats.wins;
    statsDisplay.draws.textContent = gameState.stats.draws;
    statsDisplay.losses.textContent = gameState.stats.losses;
}

// Check for winner
function checkWinner(board) {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Check for draw
function checkDraw(board) {
    return board.every(cell => cell !== null);
}

// Get AI move based on difficulty
function getAIMove(board, difficulty) {
    const availableMoves = board.reduce((moves, cell, index) => {
        if (cell === null) moves.push(index);
        return moves;
    }, []);

    if (difficulty === 'easy') {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    const aiMark = playerMarkerSelect.value === 'X' ? 'O' : 'X';
    const playerMark = playerMarkerSelect.value;

    if (difficulty === 'medium' && Math.random() < 0.3) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Minimax algorithm for medium/impossible
    function minimax(board, depth, isMaximizing) {
        const winner = checkWinner(board);
        if (winner === aiMark) return 10 - depth;
        if (winner === playerMark) return depth - 10;
        if (checkDraw(board)) return 0;

        const moves = board.reduce((acc, cell, idx) => {
            if (cell === null) acc.push(idx);
            return acc;
        }, []);

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (const move of moves) {
                const newBoard = [...board];
                newBoard[move] = aiMark;
                const score = minimax(newBoard, depth + 1, false);
                bestScore = Math.max(score, bestScore);
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (const move of moves) {
                const newBoard = [...board];
                newBoard[move] = playerMark;
                const score = minimax(newBoard, depth + 1, true);
                bestScore = Math.min(score, bestScore);
            }
            return bestScore;
        }
    }

    let bestScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = aiMark;
        const score = minimax(newBoard, 0, false);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}

// Handle player move
function handlePlayerMove(index) {
    if (gameState.board[index] !== null) return;
    
    // Make player move
    gameState.board[index] = gameState.currentPlayer;
    gameState.moveHistory.push({
        index,
        player: gameState.currentPlayer
    });
    
    updateBoard();
    
    // Check game state
    const winner = checkWinner(gameState.board);
    if (winner) {
        handleGameEnd(winner === playerMarkerSelect.value ? 'win' : 'lose');
        return;
    }
    
    if (checkDraw(gameState.board)) {
        handleGameEnd('draw');
        return;
    }
    
    // AI's turn
    makeAIMove();
}

// Make AI move
function makeAIMove() {
    const aiMove = getAIMove(gameState.board, gameState.difficulty);
    const aiMark = playerMarkerSelect.value === 'X' ? 'O' : 'X';
    
    setTimeout(() => {
        gameState.board[aiMove] = aiMark;
        gameState.moveHistory.push({
            index: aiMove,
            player: aiMark
        });
        
        updateBoard();
        
        const winner = checkWinner(gameState.board);
        if (winner) {
            handleGameEnd(winner === playerMarkerSelect.value ? 'win' : 'lose');
            return;
        }
        
        if (checkDraw(gameState.board)) {
            handleGameEnd('draw');
            return;
        }
        
        if (gameState.timeAttackMode) {
            startTimer();
        }
        
        updateStatus('Your Turn');
    }, 500);
}

// Handle game end
function handleGameEnd(result) {
    clearTimer();
    
    switch (result) {
        case 'win':
            gameState.stats.wins++;
            updateStatus('You Won! 🎉');
            break;
        case 'lose':
            gameState.stats.losses++;
            updateStatus('AI Wins! 🤖');
            break;
        case 'draw':
            gameState.stats.draws++;
            updateStatus("It's a Draw! 🤝");
            break;
    }
    
    updateStats();
}

// Timer functions
function startTimer() {
    clearTimer();
    gameState.timeLeft = 10;
    updateTimerDisplay();
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            clearTimer();
            makeAIMove();
        }
    }, 1000);
}

function clearTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
}

function updateTimerDisplay() {
    timerDisplay.textContent = `Time left: ${gameState.timeLeft}s`;
}

// Power-up: Undo move
function undoMove() {
    if (gameState.moveHistory.length < 2) return;
    
    // Remove last two moves (AI and player)
    gameState.moveHistory.pop();
    gameState.moveHistory.pop();
    
    // Reconstruct board
    gameState.board = Array(9).fill(null);
    gameState.moveHistory.forEach(move => {
        gameState.board[move.index] = move.player;
    });
    
    updateBoard();
    updateStatus('Your Turn');
    
    if (gameState.timeAttackMode) {
        startTimer();
    }
}

// Power-up: Show AI's next move
function showNextMove() {
    const aiMove = getAIMove(gameState.board, gameState.difficulty);
    cells[aiMove].classList.add('highlight');
    
    setTimeout(() => {
        cells[aiMove].classList.remove('highlight');
    }, 1000);
}

// Event Listeners
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handlePlayerMove(index));
});

playerMarkerSelect.addEventListener('change', initGame);
difficultySelect.addEventListener('change', (e) => {
    gameState.difficulty = e.target.value;
    initGame();
});

timeAttackCheckbox.addEventListener('change', (e) => {
    gameState.timeAttackMode = e.target.checked;
    timerDisplay.classList.toggle('hidden', !e.target.checked);
    if (e.target.checked) {
        startTimer();
    } else {
        clearTimer();
    }
});

undoButton.addEventListener('click', undoMove);
showNextMoveButton.addEventListener('click', showNextMove);
resetButton.addEventListener('click', initGame);

// Initialize the game
initGame();