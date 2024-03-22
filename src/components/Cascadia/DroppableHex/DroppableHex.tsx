"use client";

import { useDrop } from "react-dnd";
import DraggableTile from "../DraggableTile/DraggableTile";
import { GamePlayedTile } from "@/types/cascadia";
import { CSSProperties, useContext } from "react";
import "./DroppableHex.scss";
import { DragHandlerContext } from "../context";

export default function DroppableHex({
  row,
  column,
  tile,
  rowOffset,
  columnOffset,
  edgeWidth = 5,
  radius = 50,
}: {
  row: number;
  column: number;
  tile?: GamePlayedTile;
  rowOffset: number;
  columnOffset: number;
  edgeWidth?: number;
  radius?: number;
  handleClick: any;
}) {
  const context = useContext(DragHandlerContext);

  const edgeLength = (radius * 2) / Math.sqrt(3);
  const fullHexHeight = edgeLength * 2 + edgeWidth * 2;
  const fullHexWidth = edgeLength * Math.sqrt(3) + edgeWidth * 2;
  const displayColumn = column + columnOffset + (row % 2 == 0 ? 0.5 : 0);

  const style: CSSProperties = {
    top: `${fullHexHeight * 0.75 * (row + rowOffset)}px`,
    left: `${fullHexWidth * displayColumn}px`,
    width: `${fullHexWidth}px`,
    height: `${fullHexHeight}px`,
    position: "absolute",
  };

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
    <div id={id} ref={drop} className="hex" style={style} onClick={onClick}>
      {tile ? <DraggableTile id={id} tile={tile} isDraggable={true} /> : <Placeholder />}
    </div>
  );
}

function Placeholder() {
  return (
    <div className="hexagon unfilled">
      <div className="hexTop unfilled" />
      <div className="hexBottom unfilled" />
    </div>
  );
}
