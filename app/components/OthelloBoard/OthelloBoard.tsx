import OthelloSquare from '../OthelloSquare/OthelloSquare';
import './OthelloBoard.scss';

type Board = (0 | 1 | 2)[][];

export default function OthelloBoard(props: {
    board: Board;
    possibleMoves: number[][];
    onClick: (i: number, j: number) => void;
}) {
    function getSquareCode(row: number, col: number) {
        return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][col] + [8, 7, 6, 5, 4, 3, 2, 1][row]
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
                    if (!(props.possibleMoves === null)) {
                        return (
                            <OthelloSquare
                                key={squareCode}
                                value={e}
                                onClick={() => props.onClick(i, j)}
                                moveCandidate={isArrayInArray(props.possibleMoves, [i, j])}
                            />)
                    }
                    return (
                        <OthelloSquare
                            key={squareCode}
                            value={e}
                            onClick={() => props.onClick(i, j)}
                            moveCandidate={false}
                        />)
                })
            })
            }
        </div>
    );
}