import WebSocket, { WebSocketServer } from "ws";
import { Game } from "../core/Game.js";

export class ReversiServer {
    private wss: WebSocketServer;
    private game: Game;

    constructor(port: number) {
        this.wss = new WebSocketServer({ port });
        this.game = new Game();

        this.wss.on("connection", (ws) => {
            this.sendState(ws);

            ws.on("message", (message) => {
                const data = JSON.parse(message.toString());

                if (data.type === "MOVE") {
                    const success = this.game.playMove(data.payload);

                    if (!success) {
                        ws.send(JSON.stringify({
                            type: "ERROR",
                            payload: "Jogada inválida"
                        }));
                    }

                    this.broadcastState();
                }
            });
        });

        console.log(`Servidor rodando na porta ${port}`);
    }

    private sendState(ws: WebSocket) {
        ws.send(JSON.stringify({
            type: "STATE",
            payload: this.game.getState()
        }));
    }

    private broadcastState() {
        const state = JSON.stringify({
            type: "STATE",
            payload: this.game.getState()
        });

        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(state);
            }
        });
    }
}
