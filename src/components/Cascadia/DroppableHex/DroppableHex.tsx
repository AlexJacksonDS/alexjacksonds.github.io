"use client";

import { useDrop } from "react-dnd";
import { GamePlayedTile } from "@/types/cascadia";
import { ReactNode, useContext } from "react";
import "./DroppableHex.scss";
import { DragHandlerContext } from "../context";

export default function DroppableHex({
  row,
  column,
  tile,
  children,
}: {
  row: number;
  column: number;
  tile?: GamePlayedTile;
  children: ReactNode;
  edgeWidth?: number;
  radius?: number;
  handleClick: any;
}) {
  const context = useContext(DragHandlerContext);

  const id = `${row},${column}`;

  const [, drop] = useDrop(
    () => ({
      accept: "tile",
      drop: () => {
        return { row, column };
      },
    }),
    [row, column]
  );

  function onClick() {
    context.handleTileClick(row, column, tile);
  }

  return (
    <div id={id} ref={drop} onClick={onClick}>
      {children}
    </div>
  );
}
