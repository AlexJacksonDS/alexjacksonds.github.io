import { BoardSquare, getPieceUnicode } from '../../../helpers/pieceUnicodeHelper';
import { Square } from 'chess.js';
import './ChessSquare.scss';

export default function ChessSquare(props: {
    colour: string;
    selected: boolean;
    moveCandidate?: boolean;
    value: BoardSquare | null;
    previousMove?: boolean;
    onClick: (clickedSquare?: Square) => void;
}) {
    return (
        <div className={`gridsquare faux-borders${props.selected ? " selected" : (props.moveCandidate ? " move" : (props.previousMove ? " previous-move" : ` ${props.colour}`))}`}>
            <div
                className={`gridsquare ${props.colour}${props.value?.color ? ` ${props.value.color}` : ""}`}
                onClick={() => props.onClick(props.value?.square)}
            >
                {props.value ? getPieceUnicode(props.value) : null}
            </div>
        </div>
    );
}