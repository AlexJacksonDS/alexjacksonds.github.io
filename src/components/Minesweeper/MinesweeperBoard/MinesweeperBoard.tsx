import { Tile } from "@/types/minesweeper";
import { MutableRefObject, MouseEvent } from "react";
import "./MinesweeperBoard.scss";
import SquareBoard from "./SquareBoard";
import HexBoard from "./HexBoard";

export default function MinesweeperBoard(props: {
  board: MutableRefObject<Tile[][]>;
  handleClick: (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    i: number,
    j: number
  ) => void;
  small: boolean;
  isLost: boolean;
  isHex: boolean;
}) {
  return props.isHex ? (
    <HexBoard
      board={props.board}
      handleClick={props.handleClick}
      small={props.small}
      isLost={props.isLost}
    />
  ) : (
    <SquareBoard
      board={props.board}
      handleClick={props.handleClick}
      small={props.small}
      isLost={props.isLost}
    />
  );
}
