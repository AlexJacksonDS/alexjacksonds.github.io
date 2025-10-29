import { Square } from "@/types/scrabble";
import ScrabbleSquare from "../Square/Square";
import "./Board.scss";

export default function Board(props: {
    board: Square[][];
}) {
    return (
        <div className="grid-container mx-auto">
            {props.board.map((e, i) => {
                return props.board[i].map((e, j) => {
                    return (
                        <ScrabbleSquare
                            key={j}
                            id={`${i},${j}`}
                            value={e}
                        />)
                })
            })
            }
        </div>
    );
}