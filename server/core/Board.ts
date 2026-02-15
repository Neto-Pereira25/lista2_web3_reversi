import { Cell, PlayerColor, Position } from "../types/GameTypes.js";
import { DIRECTIONS } from "./Directions.js";

export class Board {
    private grid: Cell[][];

    constructor() {
        this.grid = this.createInitialBoard();
    }

    private createInitialBoard(): Cell[][] {
        const board: Cell[][] = Array.from({ length: 8 }, () =>
            Array(8).fill("EMPTY")
        );

        board[3][3] = "BLACK";
        board[4][4] = "BLACK";
        board[3][4] = "WHITE";
        board[4][3] = "WHITE";

        return board;
    }

    public getBoard(): Cell[][] {
        return this.grid;
    }

    public isValidMove(pos: Position, player: PlayerColor): boolean {
        if (this.grid[pos.row][pos.col] !== "EMPTY") return false;

        const opponent: PlayerColor = player === "BLACK" ? "WHITE" : "BLACK";

        for (const [dx, dy] of DIRECTIONS) {
            let r = pos.row + dx;
            let c = pos.col + dy;
            let foundOpponent = false;

            while (this.isInside(r, c) && this.grid[r][c] === opponent) {
                foundOpponent = true;
                r += dx;
                c += dy;
            }

            if (
                foundOpponent &&
                this.isInside(r, c) &&
                this.grid[r][c] === player
            ) {
                return true;
            }
        }

        return false;
    }

    public applyMove(pos: Position, player: PlayerColor): boolean {
        if (!this.isValidMove(pos, player)) return false;

        const opponent: PlayerColor = player === "BLACK" ? "WHITE" : "BLACK";

        this.grid[pos.row][pos.col] = player;

        for (const [dx, dy] of DIRECTIONS) {
            let r = pos.row + dx;
            let c = pos.col + dy;
            const toFlip: Position[] = [];

            while (this.isInside(r, c) && this.grid[r][c] === opponent) {
                toFlip.push({ row: r, col: c });
                r += dx;
                c += dy;
            }

            if (this.isInside(r, c) && this.grid[r][c] === player) {
                for (const p of toFlip) {
                    this.grid[p.row][p.col] = player;
                }
            }
        }

        return true;
    }

    public hasValidMoves(player: PlayerColor): boolean {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.isValidMove({ row: r, col: c }, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    public countPieces(): { black: number; white: number } {
        let black = 0;
        let white = 0;

        for (const row of this.grid) {
            for (const cell of row) {
                if (cell === "BLACK") black++;
                if (cell === "WHITE") white++;
            }
        }

        return { black, white };
    }

    private isInside(r: number, c: number): boolean {
        return r >= 0 && r < 8 && c >= 0 && c < 8;
    }
}
