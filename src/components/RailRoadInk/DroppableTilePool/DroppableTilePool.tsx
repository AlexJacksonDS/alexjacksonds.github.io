"use client";

import { BoardTile, DropResult, Types } from "@/types/railRoadInk";
import { useDrop } from "react-dnd";
import DraggableTile from "../DraggableTile/DraggableTile";
import "./DroppableTilePool.scss";

export default function DroppableTilePool({
  id,
  boardTiles,
  handleStackMove,
  handleClick
}: {
  id: string;
  boardTiles: BoardTile[];
  handleStackMove: (dropResult: DropResult, stackId: string) => void;
  handleClick: any;
}) {
  const [, drop] = useDrop(
    () => ({
      accept: Types.TILE,
      drop: () => ({ id }),
    }),
    [id]
  );

  return (
    <div id={id} ref={drop} className="tile-pool droppable">
      {boardTiles.map((boardTile) => (
        <DraggableTile key={boardTile.id} boardTile={boardTile} handleStackMove={handleStackMove} handleClick={handleClick} />
      ))}
    </div>
  );
}
