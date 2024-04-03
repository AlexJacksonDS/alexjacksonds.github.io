import { CSSProperties, ReactNode } from "react";

export function OffsetHex({
  row,
  column,
  rowOffset,
  columnOffset,
  children,
  edgeWidth = 5,
  radius = 50,
}: {
  row: number;
  column: number;
  rowOffset: number;
  columnOffset: number;
  children: ReactNode;
  edgeWidth?: number;
  radius?: number;
}) {
  const edgeLength = (radius * 2) / Math.sqrt(3);
  const fullHexHeight = edgeLength * 2 + edgeWidth * 2;
  const fullHexWidth = edgeLength * Math.sqrt(3) + edgeWidth * 2;
  const displayColumn = column + columnOffset + (row % 2 == 0 ? 0.5 : 0);

  const style: CSSProperties = {
    top: `${10 + fullHexHeight * 0.75 * (row + rowOffset)}px`,
    left: `${10 + fullHexWidth * displayColumn}px`,
    width: `${fullHexWidth}px`,
    height: `${fullHexHeight}px`,
    position: "absolute",
  };
  return (
    <div className="hex" style={style}>
      {children}
    </div>
  );
}
