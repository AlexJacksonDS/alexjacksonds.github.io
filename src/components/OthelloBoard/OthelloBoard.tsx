import { isArrayInArray } from "../../helpers/arrayHelper";
import { getSquareCode } from "../../helpers/squareHelper";
import OthelloSquare from "../OthelloSquare/OthelloSquare";
import "./OthelloBoard.scss";

type Board = (0 | 1 | 2)[][];

export default function OthelloBoard(props: {
  board: Board;
  possibleMoves: number[][];
  onClick: (i: number, j: number) => void;
}) {
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
              />
            );
          }
          return <OthelloSquare key={squareCode} value={e} onClick={() => props.onClick(i, j)} moveCandidate={false} />;
        });
      })}
    </div>
  );
}
