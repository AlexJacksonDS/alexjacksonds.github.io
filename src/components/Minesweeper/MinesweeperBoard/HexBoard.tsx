import { OffsetHex } from "@/components/OffsetHex/OffsetHex";
import { getCharacter } from "@/services/minesweeper.service";
import { Tile } from "@/types/minesweeper";
import { MutableRefObject, MouseEvent } from "react";
import _ from "lodash";

export default function HexBoard(props: {
  board: MutableRefObject<Tile[][]>;
  handleClick: (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    i: number,
    j: number
  ) => void;
  small: boolean;
  isLost: boolean;
}) {
  const hexCoords = [];
  for (let i = 0; i < props.board.current[0].length; i++) {
    for (let j = 0; j < props.board.current.length; j++) {
      hexCoords.push([i, j]);
    }
  }

  const rowOffset =
    _.max(hexCoords.filter((x) => x[0] < 0).map((x) => Math.abs(x[0]))) ?? 0;
  const colOffset =
    _.max(hexCoords.filter((x) => x[1] < 0).map((x) => Math.abs(x[1]))) ?? 0;
  const radius = props.small ? 15 : 30;
  return (
    <div className="hex-container">
      {hexCoords.map((x) => {
        console.log(props.board.current);
        const tile = props.board.current[x[0]][x[1]];

        if (!tile) return;

        return (
          <OffsetHex
            key={`pz${x[0]}-${x[1]}`}
            row={x[0]}
            column={x[1]}
            rowOffset={rowOffset}
            columnOffset={colOffset}
            radius={radius}
            edgeWidth={0}
          >
            <div
              className={
                "hexagon " +
                (tile.isRevealed
                  ? [
                      "zero",
                      "one",
                      "two",
                      "three",
                      "four",
                      "five",
                      "six",
                      "seven",
                      "eight",
                    ][tile.value]
                  : "unrevealed")
              }
              onClick={(e) => props.handleClick(e, x[0], x[1])}
              onContextMenu={(e) => props.handleClick(e, x[0], x[1])}
              style={{
                width: radius * 2,
                height: (radius * 2) / Math.sqrt(3) + "px",
                margin: `${(radius * 2) / (Math.sqrt(3) * 2)}px 0`,
                fontSize: radius + "px",
              }}
            >
              <div
                className="hexTop"
                style={{
                  width: (radius * 2) / Math.sqrt(2) + "px",
                  height: (radius * 2) / Math.sqrt(2) + "px",
                  left: 1 + ((radius * 2) / 10) * Math.sqrt(2) + "px",
                  top: (radius * 2) / (Math.sqrt(2) * -2) + "px",
                }}
              />
              <div
                className="hexBottom"
                style={{
                  width: (radius * 2) / Math.sqrt(2) + "px",
                  height: (radius * 2) / Math.sqrt(2) + "px",
                  left: 1 + ((radius * 2) / 10) * Math.sqrt(2) + "px",
                  bottom: (radius * 2) / (Math.sqrt(2) * -2) + "px",
                }}
              />
              <div className="symbol-container">
                {getCharacter(tile, props.isLost)}
              </div>
            </div>
          </OffsetHex>
        );
      })}
    </div>
  );
}
