let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let width = 400;
let height = 400;
let one_third_width;
let one_third_height;

let ai = 'X';
let human = 'O';
let currentPlayer = human;
let result_message = document.getElementById("result_message");


function setup() {
    canvas = createCanvas(width, height);
    canvas.parent('p5canvas');
    frameRate(10);
    one_third_width = width / 3;
    one_third_height = height / 3;
}

function bestMove() {
    let winner = checkWinner();
    if (winner != null) {
        return;
    }
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                board[i][j] = ai;
                let score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = {i, j};
                }
            }
        }
    }
    board[move.i][move.j] = ai;
    currentPlayer = human;
}

let scores = {
    X: 1,
    O: -1,
    tie: 0
};

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = max(score, bestScore);
                }
            }
        }
        return bestScore;

    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    let winner = null;
    let open_spot_exists = false;
    for (let index = 0; index < 3; index++) {
        if (board[index][0] === board[index][1] && board[index][1] === board[index][2] && board[index][0] !== '') {
            winner = board[index][0];
        } else if (board[0][index] === board[1][index] && board[1][index] === board[2][index] && board[0][index] !== '') {
            winner = board[0][index];
        }
    }
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
        winner = board[0][0];
    }
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') {
                open_spot_exists = true;
            }
        }
    }
    if (winner == null && !open_spot_exists) {
        return 'tie';
    } else {
        return winner;
    }
}

function mousePressed() {
    if (currentPlayer == human) {
        let i = floor(mouseY / one_third_height);
        let j = floor(mouseX / one_third_width);
        if (board[i][j] == '') {
            board[i][j] = human;
            currentPlayer = ai;
            bestMove();
        }
    }
}

function draw() {
    background(255);
    let one_by_three_width = width / 3;
    let one_by_three_height = height / 3;
    line(0, 0, 0, height);
    line(0, height, width, height);
    line(width, 0, width, height);
    line(0, 0, width, 0);
    line(one_by_three_width, 0, one_by_three_width, height);
    line(one_by_three_width * 2, 0, one_by_three_width * 2, height);
    line(0, one_by_three_height, width, one_by_three_height);
    line(0, one_by_three_height * 2, width, one_by_three_height * 2);
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let curr_width = one_by_three_width * col;
            let curr_height = one_by_three_height * row;
            let curr_mark = board[row][col];
            if (curr_mark === 'O') {
                ellipseMode(CENTER);
                fill(0, 255, 25);
                ellipse(curr_width + one_by_three_width / 2, curr_height + one_by_three_height / 2, Math.min(width, height) / 6);
            } else if (curr_mark === 'X') {
                start_x = curr_width + width / 12;
                start_y = curr_height + height / 12;
                line(start_x, start_y, start_x + width / 6, start_y + height / 6);
                line(start_x, start_y + height / 6, start_x + width / 6, start_y);
            }
        }
    }
    let result = checkWinner();
    if (result != null) {
        noLoop();
        if (result == 'tie') {
            result_message.innerHTML = "It's a tie!";
        }
        else if (result == human) {
            result_message.innerHTML = `You won!`;
        }
        else {
            result_message.innerHTML = `AI won!`;
        }
    }
}
