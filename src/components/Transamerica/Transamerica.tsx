"use client";

import { useState, MouseEvent, useRef } from "react";
import { Button, Container } from "react-bootstrap";
import "./Transamerica.scss";
import _ from "lodash";
import Hex, { ConnectionState } from "./Hex/Hex";
import { blankBoard, isConnectedClick, connectSegment, Tile, isInvalidClick } from "@/services/transamerica.service";

export default function Transamerica() {
  const [rowOffset, setRowOffset] = useState(0);
  const [colOffset, setColOffset] = useState(0);
  const [height, setheight] = useState(0);
  const [width, setWidth] = useState(0);
  const [clicks, setClicks] = useState(0);

  const [gameGenerated, setGameGenerated] = useState(false);
  const board = useRef<Tile[][]>([]);
  const [hexCoords, setHexCoords] = useState<number[][]>([]);

  function generateBoard() {
    const boardDetails = blankBoard();

    setGameGenerated(true);
    board.current = boardDetails.board;
    setRowOffset(boardDetails.rowOffset);
    setColOffset(boardDetails.colOffset);
    setWidth(boardDetails.width);
    setheight(boardDetails.height);
    setClicks(0);
    setHexCoords(boardDetails.hexCoords);
  }

  function handleClick(e: MouseEvent, i: number, j: number, seg: string) {
    e.preventDefault();

    if (isInvalidClick(i, j, seg, board)) {
      return;
    }

    if (clicks === 0 || isConnectedClick(i, j, seg, board)) {
      // Flip clicked
      connectSegment(i, j, seg, board);
      setClicks(clicks + 1);
    }
  }

  const radius = 80;
  const hexContainerStyle = { height: radius * height, width: radius * width * 2.9 };

  return (
    <Container>
      {gameGenerated ? (
        <div className="hex-container" style={hexContainerStyle}>
          {hexCoords.map((x) => {
            const tile = board.current[x[0]][x[1]];

            if (!tile) return;

            return (
              <Hex
                key={`pz${x[0]}-${x[1]}`}
                row={x[0]}
                column={x[1]}
                rowOffset={rowOffset}
                columnOffset={colOffset}
                radius={radius}
                connections={tile.connections}
                onClick={handleClick}
              />
            );
          })}
        </div>
      ) : null}
      <Button variant="secondary" className="ms-2" onClick={generateBoard}>
        Reset Board
      </Button>
    </Container>
  );
}
