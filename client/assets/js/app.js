const socket = new WebSocket("ws://localhost:3000");

const boardDiv = document.getElementById("board");
const infoDiv = document.getElementById("info");

let myColor = null;

socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "WELCOME") {
        myColor = message.payload.color;
        alert("Você é: " + myColor);
    }

    if (message.type === "STATE") {
        renderBoard(message.payload);
    }
};

function renderBoard(state) {
    boardDiv.innerHTML = "";

    infoDiv.innerHTML = `
    Turno: ${state.currentTurn}
    | Preto: ${state.blackScore}
    | Branco: ${state.whiteScore}
  `;

    if (state.gameOver) {
        infoDiv.innerHTML += `<br><strong>Fim de jogo! Vencedor: ${state.winner}</strong>`;
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
