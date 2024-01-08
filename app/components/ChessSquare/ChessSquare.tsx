import { Square, PieceSymbol, Color } from 'chess.js';
import './ChessSquare.scss';

type BoardSquare = {
    square: Square;
    type: PieceSymbol;
    color: Color;
};

export default function ChessSquare(props: {
    colour: string;
    selected: boolean;
    moveCandidate?: boolean;
    value: BoardSquare | null;
    onClick: (clickedSquare?: Square) => void;
}) {
    function getPieceUnicode(piece: BoardSquare) {
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
        }[piece.type + piece.color];
    }

    return (
        <div className={`gridsquare faux-borders${props.selected ? " selected" : (props.moveCandidate ? " move" : ` ${props.colour}`)}`}>
            <div
                className={`gridsquare ${props.colour}${props.value?.color ? ` ${props.value.color}` : ""}`}
                onClick={() => props.onClick(props.value?.square)}
            >
                {props.value ? getPieceUnicode(props.value) : null}
            </div>
        </div>
    );
}