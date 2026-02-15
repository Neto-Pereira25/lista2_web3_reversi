import { WebSocketServer } from "ws";
import { GameSession } from "../application/GameSession.js";

export class ReversiServer {
    private wss: WebSocketServer;
    private session: GameSession;

    constructor(port: number) {
        this.wss = new WebSocketServer({ port });
        this.session = new GameSession();

        this.wss.on("connection", (ws) => {
            const client = this.session.addClient(ws);

            ws.send(JSON.stringify({
                type: "WELCOME",
                payload: {
                    playerId: client.id,
                    color: client.color ?? "SPECTATOR"
                }
            }));

            this.session.broadcast();

            ws.on("message", (message) => {
                const data = JSON.parse(message.toString());

                if (data.type === "MOVE") {
                    const success = this.session.handleMove(
                        client.id,
                        data.payload.row,
                        data.payload.col
                    );

                    if (!success) {
                        ws.send(JSON.stringify({
                            type: "ERROR",
                            payload: "Jogada inválida ou não é seu turno"
                        }));
                    }

                    this.session.broadcast();
                }
            });

            ws.on("close", () => {
                this.session.removeClient(client.id);
            });
        });

        console.log(`Servidor rodando na porta ${port}`);
    }
}
