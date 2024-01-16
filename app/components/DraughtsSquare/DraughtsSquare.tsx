import { DraughtsPiece } from "../../types/draughts";
import "./DraughtsSquare.scss";

export default function DraughtsSquare(props: {
  colour: string;
  selected: boolean;
  moveCandidate?: boolean;
  value: DraughtsPiece;
  onClick: any; // (i: number, j: number) => void;
}) {
  function getPieceUnicode(piece: DraughtsPiece): string {
    return {
      0: "",
      1: "\u26C2",
      2: "\u26C0",
      3: "\u26C3",
      4: "\u26C1",
    }[piece];
  }

  return (
    <div
      className={`gridsquare faux-borders${
        props.selected ? " selected" : props.moveCandidate ? " move" : ` ${props.colour}`
      }`}
    >
      <div
        className={`gridsquare ${props.colour}${
          props.value === 1 || props.value === 3 ? " b" : props.value === 2 || props.value === 4 ? " w" : "none"
        }`}
        onClick={props.onClick}
      >
        {props.value ? getPieceUnicode(props.value) : null}
      </div>
    </div>
  );
}
