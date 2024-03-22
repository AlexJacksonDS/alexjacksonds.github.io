import { isPossibleMove } from '../../../services/draughts.service';
import { getSquareCode, getSquareColour } from '../../../helpers/squareHelper';
import { DraughtsBoard } from '../../../types/draughts';
import DraughtsSquare from '../DraughtsSquare/DraughtsSquare';
import './DraughtsBoard.scss';

export default function DraughtsBoard(props: {
    board: DraughtsBoard;
    selectedSquare?: string;
    possibleMoves: string[];
    onClick: (i: number, j: number) => void;
}) {
    return (
        <div className="grid-container mx-auto">
            {props.board.map((e, i) => {
                return props.board[i].map((e, j) => {
                    var squareCode = getSquareCode(i, j);
                    var squareColour = getSquareColour(i, j);
                    if (!(props.possibleMoves === null)) {
                        return (
                            <DraughtsSquare
                                key={squareCode}
                                colour={squareColour}
                                value={e}
                                onClick={() => props.onClick(i, j)}
                                moveCandidate={isPossibleMove(squareCode, props.possibleMoves)}
                                selected={props.selectedSquare === squareCode}
                            />)
                    }
                    return (
                        <DraughtsSquare
                            key={squareCode}
                            colour={squareColour}
                            value={e}
                            onClick={() => props.onClick(i, j)}
                            moveCandidate={false}
                            selected={props.selectedSquare === squareCode}
                        />)
                })
            })
            }
        </div>
    );
}