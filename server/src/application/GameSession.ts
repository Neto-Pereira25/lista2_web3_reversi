import WebSocket from "ws";
import { Game } from "../core/Game.js";
import type { PlayerColor } from "../types/GameTypes.js";
import { randomUUID } from "crypto";

interface ConnectedClient {
    id: string;
    socket: WebSocket;
    color?: PlayerColor;
}

export class GameSession {
    private game: Game;
    private clients: ConnectedClient[] = [];

    constructor() {
        this.game = new Game();
    }

    public addClient(socket: WebSocket): ConnectedClient {
        const client: ConnectedClient = {
            id: randomUUID(),
            socket
        };

        this.assignColor(client);
        this.clients.push(client);

        return client;
    }

    private assignColor(client: ConnectedClient) {
        const blackTaken = this.clients.some(c => c.color === "BLACK");
        const whiteTaken = this.clients.some(c => c.color === "WHITE");

        if (!blackTaken) client.color = "BLACK";
        else if (!whiteTaken) client.color = "WHITE";
    }

    public handleMove(clientId: string, row: number, col: number): boolean {
        const client = this.clients.find(c => c.id === clientId);
        if (!client || !client.color) return false;

        const state = this.game.getState();

        if (state.currentTurn !== client.color) {
            return false;
        }

        return this.game.playMove({ row, col });
    }

    public getGameState() {
        return this.game.getState();
    }

    public broadcast() {
        const message = JSON.stringify({
            type: "STATE",
            payload: this.getGameState()
        });

        this.clients.forEach(c => {
            if (c.socket.readyState === WebSocket.OPEN) {
                c.socket.send(message);
            }
        });
    }

    public removeClient(id: string) {
        this.clients = this.clients.filter(c => c.id !== id);
    }
}
