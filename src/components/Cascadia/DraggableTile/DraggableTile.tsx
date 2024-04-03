"use client";

import { useDrag, DragSourceMonitor } from "react-dnd";
import { DropResult, GamePlayedTile } from "@/types/cascadia";
import Tile from "../Tile/Tile";
import { DragHandlerContext } from "../context";
import { ReactNode, useContext } from "react";

export default function DraggableTile({
  id,
  tile,
  isDraggable,
  children
}: {
  id: string;
  tile: GamePlayedTile;
  isDraggable: boolean;
  children: ReactNode;
}) {
  const context = useContext(DragHandlerContext);
  const [, drag] = useDrag(
    () => ({
      type: "tile",
      item: { id, tile },
      canDrag: isDraggable && context.isMyTurn,
      end: (item, mon) => {
        const dropResult = mon.getDropResult<DropResult>();
        if (dropResult) {
          context.handleDragTile(dropResult, item);
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, tile, isDraggable, context]
  );

  return (
    <div ref={drag} className="draggable-tile">
      <Tile tile={tile.tile}>
        {children}
      </Tile>
    </div>
  );
}
