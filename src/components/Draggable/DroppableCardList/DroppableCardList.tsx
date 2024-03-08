"use client";

import { useDrop } from "react-dnd";
import { ItemTypes } from "@/types/draggableCards";

export default function DroppableCardList({ dropZoneId, children }: { dropZoneId: string; children: React.ReactNode }) {
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.STACK,
      drop: () => ({ dropZoneId }),
    }),
    [dropZoneId]
  );

  return (
    <div id={dropZoneId} ref={drop} className="droppable">
      {children}
    </div>
  );
}
