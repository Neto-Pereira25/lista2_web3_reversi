import WebSocket, { WebSocketServer as WSServer } from "ws";
import { RoomManager } from "../application/RoomManager.js";

interface ClientContext {
    id: string;
    socket: WebSocket;
    roomId?: string;
}

export class ReversiServer {
    private wss: WSServer;
    private roomManager: RoomManager;
    private clients: Map<WebSocket, ClientContext>;

    constructor(port: number) {
        this.wss = new WSServer({ port });
        this.roomManager = new RoomManager();
        this.clients = new Map();

        this.initialize();
        console.log(`✅ Servidor Reversi rodando na porta ${port}`);
    }

    private initialize() {
        this.wss.on("connection", (ws: WebSocket) => {
            const context: ClientContext = {
                id: "",
                socket: ws
            };

            this.clients.set(ws, context);

            ws.on("message", (message) => {
                try {
                    const data = JSON.parse(message.toString());

                    switch (data.type) {

                        case "JOIN_ROOM":
                            this.handleJoinRoom(ws, context, data.payload.roomId);
                            break;

                        case "MOVE":
                            this.handleMove(ws, context, data.payload.row, data.payload.col);
                            break;

                        default:
                            this.sendError(ws, "Tipo de mensagem inválido.");
                    }

                } catch (error) {
                    this.sendError(ws, "Erro ao processar mensagem.");
                }
            });

            ws.on("close", () => {
                this.handleDisconnect(ws);
            });
        });
    }

    private handleJoinRoom(
        ws: WebSocket,
        context: ClientContext,
        roomId: string
    ) {
        if (!roomId) {
            this.sendError(ws, "ID da sala inválido.");
            return;
        }

        const room = this.roomManager.getOrCreateRoom(roomId);

        context.roomId = roomId;

        const player = room.addClient(ws);

        context.id = player.id;

        ws.send(JSON.stringify({
            type: "WELCOME",
            payload: {
                playerId: player.id,
                color: player.color ?? "SPECTATOR",
                roomId
            }
        }));

        room.broadcast();
    }

    private handleMove(
        ws: WebSocket,
        context: ClientContext,
        row: number,
        col: number
    ) {
        if (!context.roomId) {
            this.sendError(ws, "Você não está em uma sala.");
            return;
        }

        const room = this.roomManager.getOrCreateRoom(context.roomId);

        const success = room.handleMove(context.id, row, col);

        if (!success) {
            this.sendError(ws, "Jogada inválida ou não é sua vez.");
            return;
        }

        room.broadcast();

        const state = room.getGameState();

        if (state.gameOver) {
            setTimeout(() => {
                this.roomManager.removeRoomIfEmpty(context.roomId!);
            }, 3000);
        }
    }

    private handleDisconnect(ws: WebSocket) {
        const context = this.clients.get(ws);

        if (!context) return;

        if (context.roomId) {
            const room = this.roomManager.getOrCreateRoom(context.roomId);

            room.removeClient(context.id);
            this.roomManager.removeRoomIfEmpty(context.roomId);
        }

        this.clients.delete(ws);
    }

    private sendError(ws: WebSocket, message: string) {
        ws.send(JSON.stringify({
            type: "ERROR",
            payload: message
        }));
    }
}
