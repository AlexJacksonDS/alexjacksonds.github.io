"use client";

import { DropResult, Tile, Types } from "@/types/railRoadInk";
import { useDrop } from "react-dnd";
import DraggableTile from "../DraggableTile/DraggableTile";
import "./DroppableBoardSquare.scss";
import { RailSection, RoadSection } from "../TrackPiece/TrackPiece";

export default function DroppableBoardSquare({
  id,
  isLockedIn,
  isTileValid,
  tile,
  handleStackMove,
  handleClick,
}: {
  id: string;
  isLockedIn: boolean;
  isTileValid: boolean;
  tile?: Tile;
  handleStackMove: (dropResult: DropResult, item: { id: string; tile: Tile }) => void;
  handleClick: any;
}) {
  const [, drop] = useDrop(
    () => ({
      accept: Types.TILE,
      canDrop: () => tile === undefined,
      drop: () => ({ id: id }),
    }),
    [id, tile]
  );

  return (
    <div
      id={id}
      ref={drop}
      className={`board-square droppable x${id.split(",").join(" y")} ${
        !isLockedIn ? (isTileValid ? "valid" : "invalid") : ""
      }`}
    >
      {tile ? (
        <DraggableTile
          id={id}
          tile={tile}
          isDraggable={!isLockedIn}
          handleStackMove={handleStackMove}
          handleClick={handleClick}
        />
      ) : (
        <Placeholder id={id} />
      )}
    </div>
  );
}

function Placeholder({ id }: { id: string }) {
  let placeholder: null | JSX.Element = null;
  switch (id) {
    case "0,1":
    case "0,5":
      placeholder = <RoadSection location={"top"} short={true} />;
      break;
    case "0,3":
      placeholder = <RailSection location={"top"} short={true} />;
      break;
    case "1,0":
    case "5,0":
      placeholder = <RailSection location={"left"} short={true} />;
      break;
    case "3,0":
      placeholder = <RoadSection location={"left"} short={true} />;
      break;
    case "1,6":
    case "5,6":
      placeholder = <RailSection location={"right"} short={true} />;
      break;
    case "3,6":
      placeholder = <RoadSection location={"right"} short={true} />;
      break;
    case "6,1":
    case "6,5":
      placeholder = <RoadSection location={"bottom"} short={true} />;
      break;
    case "6,3":
      placeholder = <RailSection location={"bottom"} short={true} />;
      break;
    default:
  }

  return <div className="unfilled">{placeholder}</div>;
}
