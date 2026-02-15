export type ClientMessage =
    | { type: "JOIN_ROOM"; payload: { roomId: string } }
    | { type: "MOVE"; payload: { row: number; col: number } };

export type ServerMessage =
    | { type: "WELCOME"; payload: any }
    | { type: "STATE"; payload: any }
    | { type: "ERROR"; payload: string };