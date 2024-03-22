import { OfferRow } from "@/types/cascadia";
import DraggableTile from "../DraggableTile/DraggableTile";
import "./OfferRow.scss";
import DraggableToken from "../DraggableToken/DraggableToken";

export default function OfferRow({ offerRow }: { offerRow: OfferRow }) {
  return (
    <div className="offer-row">
      {offerRow.tiles.map((x, i) => (
        <DraggableTile key={"t" + i} id={"t" + i} tile={{ row: NaN, column: NaN, tile: x }} isDraggable={true} />
      ))}
      {offerRow.animals.map((x, i) => (
        <DraggableToken key={"a" + i} id={"a" + i} animal={x} isDraggable={true} />
      ))}
    </div>
  );
}
