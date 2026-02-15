import WebSocket, { WebSocketServer } from "ws";
import { RoomManager } from "../application/RoomManager.js";

interface ClientContext {
    id: string;
    socket: WebSocket;
    roomId?: string;
}

export class ReversiServer {
    private wss: WebSocketServer;
    private roomManager: RoomManager;
    private clients: Map<WebSocket, ClientContext> = new Map();

    constructor(port: number) {
        this.wss = new WebSocketServer({ port });
        this.roomManager = new RoomManager();

        this.wss.on("connection", (ws) => {
            const context: ClientContext = {
                id: "",
                socket: ws
            };

            this.clients.set(ws, context);

            ws.on("message", (message) => {
                const data = JSON.parse(message.toString());

                if (data.type === "JOIN_ROOM") {
                    const room = this.roomManager.getOrCreateRoom(data.payload.roomId);

                    context.roomId = data.payload.roomId;

                    const player = room.addClient(ws);

                    // 🔥 IMPORTANTE: usar o ID retornado pelo GameSession
                    context.id = player.id;

                    ws.send(JSON.stringify({
                        type: "WELCOME",
                        payload: {
                            playerId: player.id,
                            color: player.color ?? "SPECTATOR",
                            roomId: context.roomId
                        }
                    }));

                    room.broadcast();
                }

                if (data.type === "MOVE") {
                    if (!context.roomId) return;

                    const room = this.roomManager.getOrCreateRoom(context.roomId);

                    const success = room.handleMove(
                        context.id,
                        data.payload.row,
                        data.payload.col
                    );

                    if (!success) {
                        ws.send(JSON.stringify({
                            type: "ERROR",
                            payload: "Jogada inválida"
                        }));
                    }

                    room.broadcast();
                }
            });

            ws.on("close", () => {
                const context = this.clients.get(ws);
                if (!context?.roomId) return;

                const room = this.roomManager.getOrCreateRoom(context.roomId);
                room.removeClient(context.id);
                this.roomManager.removeRoomIfEmpty(context.roomId);
            });
        });

        console.log(`Servidor rodando na porta ${port}`);
    }
}
