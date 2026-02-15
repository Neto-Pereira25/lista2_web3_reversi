import { GameSession } from "../src/application/GameSession";
import WebSocket from "ws";

describe("GameSession Multiplayer Logic", () => {

    let session: GameSession;

    beforeEach(() => {
        session = new GameSession();
    });

    function createMockSocket(): WebSocket {
        return {
            send: jest.fn(),
            readyState: WebSocket.OPEN
        } as unknown as WebSocket;
    }

    test("Primeiro jogador deve receber BLACK", () => {
        const socket = createMockSocket();
        const player = session.addClient(socket);

        expect(player.color).toBe("BLACK");
    });

    test("Segundo jogador deve receber WHITE", () => {
        const s1 = createMockSocket();
        const s2 = createMockSocket();

        session.addClient(s1);
        const player2 = session.addClient(s2);

        expect(player2.color).toBe("WHITE");
    });

    test("Terceiro jogador deve ser espectador", () => {
        const s1 = createMockSocket();
        const s2 = createMockSocket();
        const s3 = createMockSocket();

        session.addClient(s1);
        session.addClient(s2);
        const spectator = session.addClient(s3);

        expect(spectator.color).toBeUndefined();
    });

});
