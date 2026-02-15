export type ClientMessage =
    | { type: "MOVE"; payload: { row: number; col: number } };

export type ServerMessage =
    | { type: "STATE"; payload: any }
    | { type: "ERROR"; payload: string };
