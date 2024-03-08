"use client";

import { BoardTile, DropResult, Types } from "@/types/railRoadInk";
import { useDrop } from "react-dnd";
import DraggableTile from "../DraggableTile/DraggableTile";
import "./DroppableBoardSquare.scss";

export default function DroppableBoardSquare({
  boardTile,
  handleStackMove,
  handleClick
}: {
  boardTile: BoardTile;
  handleStackMove: (dropResult: DropResult, stackId: string) => void;
  handleClick: any
}) {
  const [, drop] = useDrop(
    () => ({
      accept: Types.TILE,
      drop: () => ({ id: boardTile.id }),
    }),
    [boardTile]
  );

  return (
    <div id={boardTile.id} ref={drop} className="board-square droppable">
      <DraggableTile boardTile={boardTile} handleStackMove={handleStackMove} handleClick={handleClick}/>
    </div>
  );
}
