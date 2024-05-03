"use client";

import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import "./IcePuzzle.scss";

enum Tile {
  Ice,
  Rock,
  Goal,
  Start,
}

export default function IcePuzzle() {
  const [map, setMap] = useState<Tile[][]>(defaultBoard);
  const currentI = useRef(13);
  const currentJ = useRef(14);
  const [isInit, setIsInit] = useState(false);
  const [needsRerender, setNeedsRerender] = useState(false);

  useEffect(() => {
    if (!isInit) {
      document.addEventListener("keyup", handleKeyPress);
      setIsInit(true);

      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  });

  useEffect(() => setNeedsRerender(false));

  function handleKeyPress(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowLeft":
        movePlayer(0, -1);
        break;
      case "ArrowRight":
        movePlayer(0, 1);
        break;
      case "ArrowUp":
        movePlayer(-1, 0);
        break;
      case "ArrowDown":
        movePlayer(1, 0);
        break;
    }
  }

  function movePlayer(iMod: number, jMod: number) {
    let isRock = false;
    let i = currentI.current + iMod;
    let j = currentJ.current + jMod;
    while (!isRock) {
      if (map[i][j] === Tile.Rock) {
        isRock = true;
      } else {
        i += iMod;
        j += jMod;
      }
    }
    i -= iMod;
    j -= jMod;
    currentI.current = i;
    currentJ.current = j;
    setNeedsRerender(true);
  }

  return (
    <>
      <Container>Arrow keys to move</Container>
      <Container>
        {map.map((r, i) => (
          <Row key={i}>
            {r.map((c, j) => (
              <Col key={j} className="ice-col">
                <div className={"tile " + Object.keys(Tile)[Object.values(Tile).indexOf(c)].toLowerCase()}>
                  {i === currentI.current && j === currentJ.current ? <div className="player"></div> : null}
                </div>
              </Col>
            ))}
          </Row>
        ))}
      </Container>
    </>
  );
}

const defaultBoard = [
  [
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Goal,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Goal,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Ice,
    Tile.Rock,
  ],
  [
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Rock,
    Tile.Start,
    Tile.Rock,
  ],
];
