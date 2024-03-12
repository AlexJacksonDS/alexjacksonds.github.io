"use client";

import { DropResult, Tile, Types } from "@/types/railRoadInk";
import { useDrag, DragSourceMonitor } from "react-dnd";
import TrackPiece from "../TrackPiece/TrackPiece";
import { MouseEvent } from "react";

export default function DraggableTile({
  id,
  tile,
  isDraggable,
  handleStackMove,
  handleClick,
}: {
  id: string;
  tile: Tile;
  isDraggable: boolean;
  handleStackMove: (dropResult: DropResult, item: { id: string; tile: Tile }) => void;
  handleClick: any;
}) {
  const [, drag] = useDrag(
    () => ({
      type: Types.TILE,
      item: { id, tile },
      canDrag: isDraggable,
      end: (item, mon) => {
        const dropResult = mon.getDropResult<DropResult>();
        if (dropResult) {
          handleStackMove(dropResult, item);
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, tile, isDraggable, handleStackMove]
  );

  const onClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (e.nativeEvent.button === 0) {
      handleClick(id, true);
    } else {
      handleClick(id, false);
    }
  };

  return (
    <div ref={drag} className="board-tile" onClick={onClick} onContextMenu={onClick}>
      <TrackPiece tile={tile} />
    </div>
  );
}
