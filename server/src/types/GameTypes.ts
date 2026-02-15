export type Cell = "EMPTY" | "BLACK" | "WHITE";

export type PlayerColor = "BLACK" | "WHITE";

export interface GameStateDTO {
    board: Cell[][];
    currentTurn: PlayerColor;
    blackScore: number;
    whiteScore: number;
    gameOver: boolean;
    validMoves: Position[];
    winner?: PlayerColor | "DRAW";
}

export interface Player {
    id: string;
    color: PlayerColor;
}

export interface Position {
    row: number;
    col: number;
}
