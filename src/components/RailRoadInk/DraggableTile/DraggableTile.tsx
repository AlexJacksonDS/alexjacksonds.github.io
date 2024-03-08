"use client";

import { BoardTile, DropResult, Types } from "@/types/railRoadInk";
import { useDrag, DragSourceMonitor } from "react-dnd";
import TrackPiece from "../TrackPiece/TrackPiece";

export default function DraggableTile({
  boardTile,
  handleStackMove,
  handleClick,
}: {
  boardTile: BoardTile;
  handleStackMove: (dropResult: DropResult, stackId: string) => void;
  handleClick: any
}) {
  const [, drag] = useDrag(
    () => ({
      type: Types.TILE,
      item: { id: boardTile.id },
      canDrag: !boardTile.isLockedIn,
      end: (item, mon) => {
        const dropResult = mon.getDropResult<DropResult>();
        if (dropResult) {
          handleStackMove(dropResult, item.id);
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [boardTile]
  );

  return (
    <div ref={drag} className="board-tile" onClick={() => handleClick(boardTile.id)}>
      {boardTile.tile ? <TrackPiece tile={boardTile.tile} /> : boardTile.id}
    </div>
  );
}
