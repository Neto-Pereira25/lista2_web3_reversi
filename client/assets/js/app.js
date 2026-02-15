const socket = new WebSocket("ws://localhost:3000");

const boardDiv = document.getElementById("board");
const gameInfoDiv = document.getElementById("gameInfo");
const playerInfoDiv = document.getElementById("playerInfo");

const playerBadge = document.getElementById("playerBadge");
const turnBadge = document.getElementById("turnBadge");
const blackScoreSpan = document.getElementById("blackScore");
const whiteScoreSpan = document.getElementById("whiteScore");

let myColor = null;
let currentTurn = null;
let gameFinished = false;

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "WELCOME") {
        myColor = message.payload.color;

        if (myColor === "BLACK") {
            playerBadge.className = "badge bg-dark";
            playerBadge.innerText = "Preto";
        } else if (myColor === "WHITE") {
            playerBadge.className = "badge bg-light text-dark";
            playerBadge.innerText = "Branco";
        } else {
            playerBadge.className = "badge bg-secondary";
            playerBadge.innerText = "Espectador";
        }
    }

    if (message.type === "STATE") {
        currentTurn = message.payload.currentTurn;
        renderBoard(message.payload);
    }

    if (message.type === "ERROR") {
        showMessage(message.payload);
    }
};

function renderBoard(state) {
    boardDiv.innerHTML = "";

    currentTurn = state.currentTurn;

    // Atualizar turno
    if (state.currentTurn === "BLACK") {
        turnBadge.className = "badge bg-dark";
        turnBadge.innerText = "Preto";
    } else {
        turnBadge.className = "badge bg-light text-dark";
        turnBadge.innerText = "Branco";
    }

    // Atualizar placar
    blackScoreSpan.innerText = state.blackScore;
    whiteScoreSpan.innerText = state.whiteScore;

    if (state.gameOver && !gameFinished) {
        gameFinished = true;
        showGameOverModal(state.winner);
    }


    state.board.forEach((row, r) => {
        row.forEach((cell, c) => {
            const cellDiv = document.createElement("div");
            cellDiv.className = "cell";

            if (cell !== "EMPTY") {
                cellDiv.classList.add(cell.toLowerCase());
            }

            // 🔥 destacar jogadas válidas
            const isValid = state.validMoves.some(
                m => m.row === r && m.col === c
            );

            if (isValid) {
                cellDiv.classList.add("valid");
            }

            cellDiv.onclick = () => {

                if (myColor === "SPECTATOR") {
                    showMessage("Você é espectador e não pode jogar.");
                    return;
                }

                if (currentTurn !== myColor) {
                    showMessage("Não é sua vez de jogar.");
                    return;
                }

                socket.send(JSON.stringify({
                    type: "MOVE",
                    payload: { row: r, col: c }
                }));
            };

            boardDiv.appendChild(cellDiv);
        });
    });
}

function joinRoom() {
    const roomId = document.getElementById("roomInput").value;

    socket.send(JSON.stringify({
        type: "JOIN_ROOM",
        payload: { roomId }
    }));
}

function showMessage(text) {
    const msg = document.getElementById("message");

    msg.innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    setTimeout(() => {
        msg.innerHTML = "";
    }, 3000);
}

function showGameOverModal(winner) {

    const modalResult = document.getElementById("modalResult");

    if (winner === "DRAW") {
        modalResult.innerText = "A partida terminou em empate!";
    } else {
        modalResult.innerText =
            winner === "BLACK"
                ? "Jogador Preto venceu!"
                : "Jogador Branco venceu!";
    }

    const modal = new bootstrap.Modal(
        document.getElementById("gameOverModal")
    );

    modal.show();
}

function closeModal() {
    const modalElement = document.getElementById("gameOverModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    // Reset cliente
    boardDiv.innerHTML = "";
    gameFinished = false;
}
