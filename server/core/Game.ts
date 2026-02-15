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
        this.currentTurn = this.currentTurn === "BLACK" ? "WHITE" : "BLACK";
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
        return {
            board: this.board.getBoard(),
            currentTurn: this.currentTurn,
            blackScore: scores.black,
            whiteScore: scores.white,
            gameOver: this.gameOver,
        };
    }
}
