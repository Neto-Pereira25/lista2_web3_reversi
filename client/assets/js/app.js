const socket = new WebSocket("ws://localhost:3000");

const boardDiv = document.getElementById("board");
const gameInfoDiv = document.getElementById("gameInfo");
const playerInfoDiv = document.getElementById("playerInfo");

let myColor = null;
let currentTurn = null;

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "WELCOME") {
        myColor = message.payload.color;
        playerInfoDiv.innerText =
            "Você é: " + myColor;
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

    gameInfoDiv.innerHTML = `
    Turno: ${state.currentTurn}
    | Preto: ${state.blackScore}
    | Branco: ${state.whiteScore}
  `;

    if (state.gameOver) {
        gameInfoDiv.innerHTML += `<br><strong>Fim de jogo! Vencedor: ${state.winner}</strong>`;
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
    msg.innerText = text;

    setTimeout(() => {
        msg.innerText = "";
    }, 3000);
}
