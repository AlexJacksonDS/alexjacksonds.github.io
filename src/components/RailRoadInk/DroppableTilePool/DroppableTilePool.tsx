"use client";

import { DropResult, Pools, Tile, Types } from "@/types/railRoadInk";
import { useDrop } from "react-dnd";
import DraggableTile from "../DraggableTile/DraggableTile";

export default function DroppableTilePool({
  id,
  tiles,
  handleStackMove,
  handleClick,
}: {
  id: string;
  tiles: Map<string, Tile>;
  handleStackMove: (dropResult: DropResult, item: { id: string; tile: Tile }) => void;
  handleClick: any;
}) {
  const [, drop] = useDrop(
    () => ({
      accept: Types.TILE,
      drop: () => ({ id }),
    }),
    [id]
  );

  const isOutOfSpecials = id === Pools.SPECIALS && [...tiles.keys()].length <= 3;

  return (
    <div id={id} ref={drop} className="tile-pool droppable">
      {[...tiles.keys()].map((key) => {
        const tile = tiles.get(key);
        return tile ? (
          <DraggableTile
            key={key}
            id={key}
            tile={tile}
            isDraggable={isOutOfSpecials ? false : true}
            handleStackMove={handleStackMove}
            handleClick={handleClick}
          />
        ) : null;
      })}
    </div>
  );
}
