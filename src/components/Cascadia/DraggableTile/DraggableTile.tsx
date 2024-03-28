"use client";

import { useDrag, DragSourceMonitor } from "react-dnd";
import { DropResult, GamePlayedTile, GameTile } from "@/types/cascadia";
import Tile from "../Tile/Tile";
import { DragHandlerContext } from "../context";
import { ReactNode, useContext } from "react";
import AnimalToken from "../AnimalToken/AnimalToken";
import DroppableTokenZone from "../DroppableTokenZone/DroppableTokenZone";

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
      canDrag: isDraggable,
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
        {/* {{id.includes("t") ? (
          <AnimalToken possibleAnimals={tile.tile.validAnimals} />
        ) : (
          <DroppableTokenZone
            row={parseInt(id.split(",")[0])}
            column={parseInt(id.split(",")[1])}
            animal={tile.animal}
            possibleAnimals={tile.tile.validAnimals}
          />
        )}} */}
      </Tile>
    </div>
  );
}
