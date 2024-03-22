"use client";

import { useDrag, DragSourceMonitor } from "react-dnd";
import { AnimalTypes, DropResult } from "@/types/cascadia";
import AnimalToken from "../AnimalToken/AnimalToken";
import { useContext } from "react";
import { DragHandlerContext } from "../context";

export default function DraggableToken({
  id,
  animal,
  isDraggable,
}: {
  id: string;
  animal: AnimalTypes;
  isDraggable: boolean;
}) {
  const context = useContext(DragHandlerContext);
  const [, drag] = useDrag(
    () => ({
      type: "token",
      item: { id, animal },
      canDrag: isDraggable,
      end: (item, mon) => {
        const dropResult = mon.getDropResult<DropResult>();
        if (dropResult) {
          context.handleDragToken(dropResult, item);
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, animal, isDraggable, context]
  );

  return (
    <div ref={drag} className="draggable-token">
      <AnimalToken animal={animal} possibleAnimals={[]} />
    </div>
  );
}
