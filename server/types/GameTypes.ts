export type Cell = "EMPTY" | "BLACK" | "WHITE";

export type PlayerColor = "BLACK" | "WHITE";

export interface Position {
    row: number;
    col: number;
}

export interface GameStateDTO {
    board: Cell[][];
    currentTurn: PlayerColor;
    blackScore: number;
    whiteScore: number;
    gameOver: boolean;
}
