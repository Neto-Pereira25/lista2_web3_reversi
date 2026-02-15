import { GameSession } from "../src/application/GameSession";
import WebSocket from "ws";

describe("GameSession Multiplayer Logic", () => {

    let session: GameSession;

    beforeEach(() => {
        session = new GameSession();
    });

    function createMockSocket(): any {
        return {
            send: jest.fn(),
            readyState: 1
        };
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

    test("Deve enviar mensagem para todos clientes conectados", () => {
        const session = new GameSession();

        const s1 = createMockSocket();
        const s2 = createMockSocket();

        session.addClient(s1);
        session.addClient(s2);

        session["broadcast"]();

        expect(s1.send).toHaveBeenCalled();
        expect(s2.send).toHaveBeenCalled();
    });

    test("Não deve enviar mensagem para socket fechado", () => {
        const session = new GameSession();

        const closedSocket = {
            send: jest.fn(),
            readyState: 3 // CLOSED
        } as any;

        session.addClient(closedSocket);

        session["broadcast"]();

        expect(closedSocket.send).not.toHaveBeenCalled();
    });

    test("Deve remover cliente corretamente", () => {
        const session = new GameSession();

        const socket = createMockSocket();
        const client = session.addClient(socket);

        // Garantir que foi adicionado
        expect(session["clients"].length).toBe(1);

        session.removeClient(client.id);

        expect(session["clients"].length).toBe(0);
    });

    test("Não deve permitir jogada fora do turno", () => {
        const session = new GameSession();

        const s1 = createMockSocket();
        const s2 = createMockSocket();

        const id1 = session.addClient(s1); // BLACK
        const id2 = session.addClient(s2); // WHITE

        // WHITE tenta jogar primeiro
        const result = session.handleMove(id2.id, 2, 4);

        expect(result).toBe(false);
    });

    test("Espectador não pode jogar", () => {
        const session = new GameSession();

        const s1 = createMockSocket();
        const s2 = createMockSocket();
        const s3 = createMockSocket();

        session.addClient(s1); // BLACK
        session.addClient(s2); // WHITE
        const spectator = session.addClient(s3); // espectador

        const result = session.handleMove(spectator.id, 2, 4);

        expect(result).toBe(false);
    });

});
