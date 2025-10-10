import { BlockSquare } from "@/types/tetris";
import Square from "../Square/Square";

export default function Row({ squares }: { squares: BlockSquare[] }) {
  return (
    <div className="row">
      {squares.map((s, i) => (
        <Square key={i} square={s} />
      ))}
    </div>
  );
}
