import type { GameStateDTO, PlayerColor, Position } from "../types/GameTypes.js";
import { Board } from "./Board.js";

export class Game {
    private board: Board;
    private currentTurn: PlayerColor;
    private gameOver: boolean = false;

    constructor() {
        this.board = new Board();
        this.currentTurn = "BLACK";
    }

    public playMove(pos: Position): boolean {
        if (this.gameOver) return false;

        const success = this.board.applyMove(pos, this.currentTurn);
        if (!success) return false;

        this.switchTurn();
        this.checkGameOver();

        return true;
    }

    private switchTurn() {
        const next = this.currentTurn === "BLACK" ? "WHITE" : "BLACK";

        if (this.board.hasValidMoves(next)) {
            this.currentTurn = next;
        } else if (this.board.hasValidMoves(this.currentTurn)) {
            // mantém turno atual (adversário sem jogadas)
        } else {
            this.gameOver = true;
        }
    }

    private checkGameOver() {
        if (
            !this.board.hasValidMoves("BLACK") &&
            !this.board.hasValidMoves("WHITE")
        ) {
            this.gameOver = true;
        }
    }

    public getState(): GameStateDTO {
        const scores = this.board.countPieces();

        let winner: PlayerColor | "DRAW" | undefined;

        if (this.gameOver) {
            if (scores.black > scores.white) winner = "BLACK";
            else if (scores.white > scores.black) winner = "WHITE";
            else winner = "DRAW";
        }

        return {
            board: this.board.getBoard(),
            currentTurn: this.currentTurn,
            blackScore: scores.black,
            whiteScore: scores.white,
            gameOver: this.gameOver,
            validMoves: this.getValidMoves(this.currentTurn),
            ...(winner !== undefined && { winner })
        };
    }


    public getValidMoves(player: PlayerColor): Position[] {
        const moves: Position[] = [];

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.board.isValidMove({ row: r, col: c }, player)) {
                    moves.push({ row: r, col: c });
                }
            }
        }

        return moves;
    }
}
