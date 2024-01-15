import { DraughtsBoard } from '@/app/types/draughts';
import DraughtsSquare from '../DraughtsSquare/DraughtsSquare';
import './DraughtsBoard.scss';

export default function DraughtsBoard(props: {
    board: DraughtsBoard;
    selectedSquare?: string;
    possibleMoves: string[];
    onClick: (i: number, j: number) => void;
}) {
    function isPossibleMove(squareCode: string, possibleMoves: string[]) {
        var matches = possibleMoves.filter(s => s.includes(squareCode));
        return matches.length > 0
    }

    function getSquareCode(row: number, col: number) {
        return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][col] + [8, 7, 6, 5, 4, 3, 2, 1][row]
    }

    function getSquareColour(row: number, col: number) {
        return (row + col) % 2 == 0 ? 'light' : 'dark';
    }

    function isArrayInArray(array: any[], item: any) {
        var itemAsString = JSON.stringify(item);
        var contains = array.some(function (element) {
          return JSON.stringify(element) === itemAsString;
        });
        return contains;
      }

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