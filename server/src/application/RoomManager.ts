import { GameSession } from "./GameSession.js";

export class RoomManager {
    private rooms: Map<string, GameSession> = new Map();

    public getOrCreateRoom(roomId: string): GameSession {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new GameSession());
        }

        return this.rooms.get(roomId)!;
    }

    public removeRoomIfEmpty(roomId: string) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        if (room.isEmpty()) {
            this.rooms.delete(roomId);
        }
    }
}