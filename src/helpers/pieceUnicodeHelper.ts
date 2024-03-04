import { Square, PieceSymbol, Color } from 'chess.js';

export type BoardSquare = {
    square: Square;
    type: PieceSymbol;
    color: Color;
};

export function getPieceUnicode(piece: BoardSquare): string | undefined {
    return getPieceUnicodeFromString(piece.type + piece.color);
}

export function getPieceUnicodeFromString(piece: string): string | undefined {
    return {
        "kw": "\u2654",
        "qw": "\u2655",
        "rw": "\u2656",
        "bw": "\u2657",
        "nw": "\u2658",
        "pw": "\u2659",
        "kb": "\u265A",
        "qb": "\u265B",
        "rb": "\u265C",
        "bb": "\u265D",
        "nb": "\u265E",
        "pb": "\u265F"
    }[piece];
}
