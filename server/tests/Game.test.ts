import { Game } from "../src/core/Game";

describe("Game Flow", () => {

    let game: Game;

    beforeEach(() => {
        game = new Game();
    });

    test("Deve iniciar com turno BLACK", () => {
        const state = game.getState();
        expect(state.currentTurn).toBe("BLACK");
    });

    test("Após jogada válida, turno deve alternar", () => {
        game.playMove({ row: 2, col: 4 });

        const state = game.getState();
        expect(state.currentTurn).toBe("WHITE");
    });

    test("Não deve permitir jogada inválida", () => {
        const success = game.playMove({ row: 0, col: 0 });
        expect(success).toBe(false);
    });

    test("Deve terminar jogo quando ninguém puder jogar", () => {
        const board = game["board"];

        // Forçar estado final manualmente
        const grid = board.getBoard();
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                grid[r][c] = "BLACK";
            }
        }

        game["checkGameOver"]();

        const state = game.getState();
        expect(state.gameOver).toBe(true);
    });

    test("Deve trocar turno se jogador atual não tiver jogadas válidas", () => {
        const game = new Game();
        const board = game["board"].getBoard();

        // Forçar cenário onde WHITE não pode jogar
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                board[r][c] = "BLACK";
            }
        }

        board[7][7] = null;

        game["checkGameOver"]();

        const state = game.getState();
        expect(state.gameOver).toBe(true);
    });

    test("Deve identificar empate corretamente", () => {
        const game = new Game();
        const grid = game["board"].getBoard();

        let toggle = true;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                grid[r][c] = toggle ? "BLACK" : "WHITE";
                toggle = !toggle;
            }
        }

        game["checkGameOver"]();
        const state = game.getState();

        expect(state.winner).toBe("DRAW");
    });

    test("Deve declarar BLACK vencedor", () => {
        const game = new Game();
        const grid = game["board"].getBoard();

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                grid[r][c] = "BLACK";
            }
        }

        game["checkGameOver"]();
        const state = game.getState();

        expect(state.winner).toBe("BLACK");
    });

    test("Deve declarar WHITE vencedor", () => {
        const game = new Game();
        const grid = game["board"].getBoard();

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                grid[r][c] = "WHITE";
            }
        }

        game["checkGameOver"]();
        const state = game.getState();

        expect(state.winner).toBe("WHITE");
    });

});
