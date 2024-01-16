import { getSquareCode, getSquareColour } from '../../helpers/squareHelper';
import { Color, PieceSymbol, Square } from 'chess.js';
import ChessSquare from '../ChessSquare/ChessSquare';
import './ChessBoard.scss';

type BoardSquare = {
    square: Square;
    type: PieceSymbol;
    color: Color;
};
type Board = (BoardSquare | null)[][];

export default function ChessBoard(props: {
    board: Board;
    possibleMoves: string[];
    selectedSquare?: string;
    previousMove?: string;
    onClick: (clickedSquare?: Square) => void;
}) {
    function isPossibleMove(squareCode: string, possibleMoves: string[], selectedSquare?: string) {
        var matches = possibleMoves.filter(s => s.includes(squareCode));
        return matches.length > 0 || isCastle(squareCode, possibleMoves, selectedSquare)
    }

    function isCastle(squareCode: string, possibleMoves: string[], selectedSquare?: string) {
        if (selectedSquare === 'e1') {
            if (squareCode === 'g1') {
                return possibleMoves.includes('O-O')
            } else if (squareCode === 'c1') {
                return possibleMoves.includes('O-O-O')
            }
        }
        if (selectedSquare === 'e8') {
            if (squareCode === 'g8') {
                return possibleMoves.includes('O-O')
            } else if (squareCode === 'c8') {
                return possibleMoves.includes('O-O-O')
            }
        }
    }

    return (
        <div className="grid-container mx-auto">
            {props.board.map((e, i) => {
                return props.board[i].map((e, j) => {
                    var squareColour = getSquareColour(i, j);
                    var squareCode = getSquareCode(i, j);
                    if (!(props.possibleMoves === null)) {
                        return (
                            <ChessSquare
                                key={squareCode}
                                colour={squareColour}
                                value={e}
                                onClick={() => props.onClick(squareCode as Square)}
                                selected={props.selectedSquare === squareCode}
                                moveCandidate={isPossibleMove(squareCode, props.possibleMoves, props.selectedSquare)}
                                previousMove={props.previousMove?.includes(squareCode)}
                            />)
                    }
                    return (
                        <ChessSquare
                            key={squareCode}
                            colour={squareColour}
                            value={e}
                            onClick={() => props.onClick(squareCode as Square)}
                            selected={props.selectedSquare === squareCode}
                            moveCandidate={false}
                            previousMove={props.previousMove?.includes(squareCode)}
                        />)
                })
            })
            }
        </div>
    );
}