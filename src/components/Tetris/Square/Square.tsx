import { BlockSquare } from "@/types/tetris";
import "./Square.scss";

export default function Square({ square }: { square: BlockSquare }) {
  return <div className={"square " + square}></div>;
}
