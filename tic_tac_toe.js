// JavaScript file for implementing the minimax algorithm for tic-tac-toe

// Function to check if there are moves left on the board
function isMovesLeft(board) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '_') {
                return true;
            }
        }
    }
    return false;
}

// Function to evaluate the board and return a score
function evaluate(board) {
    // Check rows for victory
    for (let row = 0; row < 3; row++) {
        if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
            if (board[row][0] === 'X') {
                return +10;
            } else if (board[row][0] === 'O') {
                return -10;
            }
        }
    }

    // Check columns for victory
    for (let col = 0; col < 3; col++) {
        if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
            if (board[0][col] === 'X') {
                return +10;
            } else if (board[0][col] === 'O') {
                return -10;
            }
        }
    }

    // Check diagonals for victory
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        if (board[0][0] === 'X') {
            return +10;
        } else if (board[0][0] === 'O') {
            return -10;
        }
    }

    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        if (board[0][2] === 'X') {
            return +10;
        } else if (board[0][2] === 'O') {
            return -10;
        }
    }

    // No one has won
    return 0;
}

// Minimax algorithm
function minimax(board, depth, isMax) {
    let score = evaluate(board);

    // If Maximizer has won the game return his/her evaluated score
    if (score === 10) {
        return score - depth;
    }

    // If Minimizer has won the game return his/her evaluated score
    if (score === -10) {
        return score + depth;
    }

    // If there are no more moves and no winner then it is a tie
    if (!isMovesLeft(board)) {
        return 0;
    }

    // If this maximizer's move
    if (isMax) {
        let best = -1000;

        // Traverse all cells
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if cell is empty
                if (board[i][j] === '_') {
                    // Make the move
                    board[i][j] = 'X';

                    // Call minimax recursively and choose the maximum value
                    best = Math.max(best, minimax(board, depth + 1, !isMax));

                    // Undo the move
                    board[i][j] = '_';
                }
            }
        }
        return best;
    }

    // If this minimizer's move
    else {
        let best = 1000;

        // Traverse all cells
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if cell is empty
                if (board[i][j] === '_') {
                    // Make the move
                    board[i][j] = 'O';

                    // Call minimax recursively and choose the minimum value
                    best = Math.min(best, minimax(board, depth + 1, !isMax));

                    // Undo the move
                    board[i][j] = '_';
                }
            }
        }
        return best;
    }
}

// Function to find the best move for the player
function findBestMove(board) {
    let bestVal = -1000;
    let bestMove = { row: -1, col: -1 };

    // Traverse all cells, evaluate minimax function for all empty cells.
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // Check if cell is empty
            if (board[i][j] === '_') {
                // Make the move
                board[i][j] = 'X';

                // compute evaluation function for this move.
                let moveVal = minimax(board, 0, false);

                // Undo the move
                board[i][j] = '_';

                // If the value of the current move is more than the best value, then update best
                if (moveVal > bestVal) {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }

    console.log(`The best move is row: ${bestMove.row}, col: ${bestMove.col}`);
    return bestMove;
}

document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('resetButton');
    const resultElement = document.getElementById('result');
    const resetButtonModal = document.getElementById('reset-button-modal');
    const overlay = document.getElementById('overlay');

    let board = [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']];
    let currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
    let gameEnded = false;

    function updateTurnMessage() {
        if (gameEnded) return;
        resultElement.textContent = currentPlayer === 'X' ? "Player's Turn" : "Computer's Turn";
    }

    function checkGameOver() {
        const score = evaluate(board);
        const winnerNameElement = document.getElementById('winner-name');

        if (score === 10) {
            winnerNameElement.textContent = 'You Win!';
            overlay.style.display = 'flex';
            gameEnded = true;
        } else if (score === -10) {
            winnerNameElement.textContent = 'You Lose!';
            overlay.style.display = 'flex';
            gameEnded = true;
        } else if (!isMovesLeft(board)) {
            winnerNameElement.textContent = 'Draw!';
            overlay.style.display = 'flex';
            gameEnded = true;
        }

        const okButton = document.getElementById('ok-button');
        okButton.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
    }

    function makeAIMove() {
        if (gameEnded || currentPlayer !== 'O') return;
        const bestMove = findBestMove(board);
        if (bestMove.row !== -1 && bestMove.col !== -1) {
            board[bestMove.row][bestMove.col] = 'O';
            const bestMoveIndex = bestMove.row * 3 + bestMove.col;
            cells[bestMoveIndex].textContent = 'O';
        }
        checkGameOver();
        currentPlayer = 'X';
        updateTurnMessage();
    }

    function resetGame() {
        board = [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']];
        cells.forEach(cell => {
            cell.textContent = '';
        });
        currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
        gameEnded = false;
        updateTurnMessage();
        if (currentPlayer === 'O') {
            makeAIMove();
        }
    }

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (gameEnded || currentPlayer !== 'X') return;

            const row = Math.floor(index / 3);
            const col = index % 3;

            if (board[row][col] === '_') {
                board[row][col] = currentPlayer;
                cell.textContent = currentPlayer;

                // Check if game is over
                checkGameOver();
                if (gameEnded) return;

                // Switch to AI
                currentPlayer = 'O';
                updateTurnMessage();
                makeAIMove();
            }
        });
    });

    resetButton.addEventListener('click', resetGame);
    resetButtonModal.addEventListener('click', () => {
        overlay.style.display = 'none';
        resetGame();
    });

    // Initial turn message
    updateTurnMessage();

    // If computer starts, make the first move
    if (currentPlayer === 'O') {
        makeAIMove();
    }
});
