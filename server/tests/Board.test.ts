import { Board } from "../src/core/Board";

describe("Board - Reversi Rules", () => {

    let board: Board;

    beforeEach(() => {
        board = new Board();
    });

    test("Deve iniciar com 4 peças centrais corretas", () => {
        const grid = board.getBoard();

        expect(grid[3][3]).toBe("BLACK");
        expect(grid[4][4]).toBe("BLACK");
        expect(grid[3][4]).toBe("WHITE");
        expect(grid[4][3]).toBe("WHITE");
    });

    test("Jogada inicial válida para BLACK em (2,3)", () => {
        const isValid = board.isValidMove({ row: 2, col: 4 }, "BLACK");
        expect(isValid).toBe(true);
    });

    test("Jogada inválida em casa ocupada", () => {
        const isValid = board.isValidMove({ row: 3, col: 3 }, "BLACK");
        expect(isValid).toBe(false);
    });

    test("Aplicar jogada deve virar peças corretamente", () => {
        board.applyMove({ row: 2, col: 3 }, "BLACK");

        const grid = board.getBoard();
        expect(grid[3][3]).toBe("BLACK");
    });

});
