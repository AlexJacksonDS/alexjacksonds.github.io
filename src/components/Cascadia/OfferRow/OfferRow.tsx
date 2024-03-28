import { OfferRow } from "@/types/cascadia";
import DraggableTile from "../DraggableTile/DraggableTile";
import "./OfferRow.scss";
import DraggableToken from "../DraggableToken/DraggableToken";
import AnimalToken from "../AnimalToken/AnimalToken";

export default function OfferRow({ offerRow }: { offerRow: OfferRow }) {
  return (
    <div className="offer-row">
      {offerRow.tiles.map((x, i) =>
        x ? (
          <DraggableTile key={"t" + i} id={`${i}`} tile={{ row: NaN, column: NaN, tile: x }} isDraggable={true}>
            <AnimalToken possibleAnimals={x.validAnimals} />
          </DraggableTile>
        ) : (
          <Placeholder key={"t" + i} />
        )
      )}
      {offerRow.animals.map((x, i) =>
        x ? (
          <DraggableToken key={"a" + i} id={`${i}`} animal={x} isDraggable={true} />
        ) : (
          <PlaceholderCircle key={"a" + i} />
        )
      )}
    </div>
  );
}

function Placeholder() {
  return (
    <div className="hexagon unfilled">
      <div className="hexTop unfilled" />
      <div className="hexBottom unfilled" />
    </div>
  );
}

function PlaceholderCircle() {
  return <div className="animal"></div>;
}
