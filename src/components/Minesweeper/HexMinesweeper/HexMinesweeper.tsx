"use client";

import { Dispatch, SetStateAction, useState, MouseEvent, useRef, useEffect, ReactNode, CSSProperties } from "react";
import { Container, Form, FormGroup, Row, Col, Button, ToastContainer, Toast } from "react-bootstrap";
import "./Minesweeper.scss";
import { isMobile } from "react-device-detect";
import _ from "lodash";

class Tile {
  isRevealed: boolean;
  hasFlag: boolean;
  hasQ: boolean;
  value: number;

  constructor() {
    this.isRevealed = false;
    this.hasFlag = false;
    this.hasQ = false;
    this.value = 0;
  }
}

export default function HexMinesweeper() {
  const [width, setWidth] = useState(10);
  const [widthString, setWidthString] = useState("10");
  const [height, setHeight] = useState(10);
  const [heightString, setHeightString] = useState("10");
  const [mineCount, setMineCount] = useState(10);
  const [mineCountString, setMineCountString] = useState("10");

  const [gameGenerated, setGameGenerated] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [small, setSmall] = useState(false);

  const [clicks, setClicks] = useState(0);

  const [show, setShow] = useState(false);
  const [showFail, setShowFail] = useState(false);

  const board = useRef<Tile[][]>([]);

  const [instructions, setInstructions] = useState("");

  const hexCoords = [];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      hexCoords.push([i, j]);
    }
  }

  const rowOffset = _.max(hexCoords.filter((x) => x[0] < 0).map((x) => Math.abs(x[0]))) ?? 0;
  const colOffset = _.max(hexCoords.filter((x) => x[1] < 0).map((x) => Math.abs(x[1]))) ?? 0;

  useEffect(() => {
    setInstructions(isMobile ? "Tap to reveal, long press to flag" : "Left click to reveal, right click to flag");
  },[]);

  function handleInput(
    input: string,
    stateUpdater: Dispatch<SetStateAction<string>>,
    numStateUpdater: Dispatch<SetStateAction<number>>
  ) {
    stateUpdater(input);
    if (!Number.isNaN(Number(input))) numStateUpdater(Number(input));
  }

  function controlIsValid(string: string) {
    return string.length > 0 && !Number.isNaN(Number(string)) && Number(string) > 0;
  }

  function setDefaults(width: number, height: number, mineCount: number) {
    setWidth(width);
    setWidthString(width.toString());
    setHeight(height);
    setHeightString(height.toString());
    setMineCount(mineCount);
    setMineCountString(mineCount.toString());
    setGameGenerated(false);
  }

  function generateBoard() {
    const mineLocations = shuffle(new Array(width * height).fill(0).map((a, i) => (a = i))).slice(0, mineCount);
    const mineCoords = mineLocations.map((x) => {
      const i = Math.floor(x / width);
      return [i, x - i * width];
    });

    const newBoardNulls: (Tile | null)[][] = Array(height)
      .fill(0)
      .map(() => Array(width).fill(null));

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        newBoardNulls[i][j] = new Tile();
      }
    }

    const newBoard = newBoardNulls as Tile[][];

    for (const coords of mineCoords) {
      newBoard[coords[0]][coords[1]].value = -1;
    }

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (newBoard[i][j].value != -1) {
          const adjs = getAdjacentValues(newBoard as Tile[][], [i, j]);
          newBoard[i][j].value = adjs.filter((adj) => adj.tile.value === -1).length;
        }
      }
    }

    setGameGenerated(true);
    setIsLost(false);
    setIsGameFinished(false);
    setClicks(0);
    board.current = newBoard;
  }

  function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getAdjacentValues(board: Tile[][], coords: number[]) {
    const boardHeight = board.length;
    const boardWidth = board[0].length;
    const adjTransforms = [
      [
        [0, 1],
        [-1, 1],
        [-1, 0],
        [0, -1],
        [1, 0],
        [1, 1],
      ],
      // odd rows
      [
        [0, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
      ],
    ];
    const relevantTransforms = adjTransforms[Math.abs(coords[0]) % 2];
    const adjCoords = relevantTransforms
      .map((mod) => [coords[0] + mod[0], coords[1] + mod[1]])
      .filter((coord) => coord[0] >= 0 && coord[0] < boardHeight && coord[1] >= 0 && coord[1] < boardWidth);

    return adjCoords.map((coord) => ({ i: coord[0], j: coord[1], tile: board[coord[0]][coord[1]] }));
  }

  function handleClick(e: MouseEvent<HTMLElement>, i: number, j: number) {
    e.preventDefault();
    if (isGameFinished) return;
    if (e.nativeEvent.button === 0) {
      leftClickTile(i, j);
    } else {
      rightClickTile(i, j);
    }
    if (
      board.current
        .flat()
        .filter((t) => t.value !== -1)
        .every((t) => t.isRevealed)
    ) {
      setShow(true);
      setIsGameFinished(true);
    }
    setClicks(clicks + 1);
  }

  function leftClickTile(i: number, j: number) {
    const tile = board.current[i][j];
    if (tile.hasFlag || tile.hasQ) {
      return;
    }
    if (tile.value === -1) {
      board.current[i][j].isRevealed = true;
      if (clicks === 0) {
        setShowFail(true);
      }
      setIsGameFinished(true);
      setIsLost(true);
    } else {
      openSquares([i, j]);
    }
  }

  function openSquares(startCoord: number[]) {
    const visited: string[] = [];
    const coordStack = [startCoord];

    while (coordStack.length) {
      let currentCoord = coordStack.pop();

      if (currentCoord !== undefined) {
        const stringCoord = `${currentCoord[0]}-${currentCoord[1]}`;
        if (!visited.includes(stringCoord)) {
          visited.push(stringCoord);
          board.current[currentCoord[0]][currentCoord[1]].isRevealed = true;

          if (board.current[currentCoord[0]][currentCoord[1]].value === 0) {
            const adjs = getAdjacentValues(board.current, currentCoord);
            coordStack.push(...adjs.map((adj) => [adj.i, adj.j]));
          }
        }
      }
    }
  }

  function rightClickTile(i: number, j: number) {
    const tile = board.current[i][j];
    if (tile.hasFlag) {
      board.current[i][j].hasFlag = false;
      board.current[i][j].hasQ = true;
    } else if (tile.hasQ) {
      board.current[i][j].hasFlag = false;
      board.current[i][j].hasQ = false;
    } else {
      board.current[i][j].hasFlag = true;
      board.current[i][j].hasQ = false;
    }
  }

  const buttonsDisabled = !(
    controlIsValid(widthString) &&
    controlIsValid(heightString) &&
    controlIsValid(mineCountString) &&
    mineCount <= width * height &&
    (!gameGenerated || isGameFinished)
  );

  function hideToast() {
    setShowFail(false);
    setShow(false);
  }

  const radius = small ? 15 : 30;

  return (
    <Container>
      <Row className="pt-2">
        <Col>{instructions}</Col>
      </Row>
      <Row className="pt-2">
        <Col>
          <FormGroup controlId="width">
            <Form.Label>Width</Form.Label>
            <Form.Control
              type="numeric"
              value={widthString}
              onChange={(e) => handleInput(e.target.value, setWidthString, setWidth)}
              isValid={controlIsValid(widthString)}
              isInvalid={!controlIsValid(widthString)}
            />
            <Form.Control.Feedback type="invalid">Please enter a positive integer</Form.Control.Feedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="height">
            <Form.Label>Height</Form.Label>
            <Form.Control
              type="numeric"
              value={heightString}
              onChange={(e) => handleInput(e.target.value, setHeightString, setHeight)}
              isValid={controlIsValid(heightString)}
              isInvalid={!controlIsValid(heightString)}
            />
            <Form.Control.Feedback type="invalid">Please enter a positive integer</Form.Control.Feedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="mines">
            <Form.Label>Mines</Form.Label>
            <Form.Control
              type="numeric"
              value={mineCountString}
              onChange={(e) => handleInput(e.target.value, setMineCountString, setMineCount)}
              isValid={controlIsValid(mineCountString) && mineCount <= width * height}
              isInvalid={!controlIsValid(mineCountString) || mineCount > width * height}
            />
            <Form.Control.Feedback type="invalid">
              {mineCount <= width * height
                ? "Please enter a positive integer"
                : "More mines than will fit in the board"}
            </Form.Control.Feedback>
          </FormGroup>
        </Col>
      </Row>
      <Row className="pt-2">
        <Col xs={12} lg={4}>
          <Button variant="primary" onClick={generateBoard} disabled={buttonsDisabled}>
            Start
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => setDefaults(9, 9, 10)} disabled={buttonsDisabled}>
            Easy
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => setDefaults(16, 16, 40)}
            disabled={buttonsDisabled}
          >
            Normal
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => setDefaults(30, 16, 99)}
            disabled={buttonsDisabled}
          >
            Hard
          </Button>
        </Col>
        <Col>
          <Form.Check
            type="switch"
            id="toggle-small"
            label="Small UI"
            onChange={() => setSmall(!small)}
            checked={small}
          />
        </Col>
      </Row>

      <ToastContainer position="middle-center">
        <Toast bg={"success"} show={show} onClick={hideToast} onClose={() => hideToast()} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Minesweeper</strong>
            <small className="text-muted">Just now</small>
          </Toast.Header>
          <Toast.Body>Victory!</Toast.Body>
        </Toast>
        <Toast bg={"danger"} show={showFail} onClick={hideToast} onClose={() => hideToast()} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Minesweeper</strong>
            <small className="text-muted">Just now</small>
          </Toast.Header>
          <Toast.Body>Unlucky first click</Toast.Body>
        </Toast>
      </ToastContainer>

      {gameGenerated ? (
        <div className="hex-container">
          {hexCoords.map((x) => {
            console.log(board.current);
            const tile = board.current[x[0]][x[1]];

            if (!tile) return;

            return (
              <OffsetHex
                key={`pz${x[0]}-${x[1]}`}
                row={x[0]}
                column={x[1]}
                rowOffset={rowOffset}
                columnOffset={colOffset}
                radius={radius}
              >
                <div
                  className={
                    "hexagon " +
                    (tile.isRevealed
                      ? ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"][tile.value]
                      : "unrevealed")
                  }
                  onClick={(e) => handleClick(e, x[0], x[1])}
                  onContextMenu={(e) => handleClick(e, x[0], x[1])}
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
                  <div className="hexBottom" style={{
                      width: (radius * 2) / Math.sqrt(2) + "px",
                      height: (radius * 2) / Math.sqrt(2) + "px",
                      left: 1 + ((radius * 2) / 10) * Math.sqrt(2) + "px",
                      bottom: (radius * 2) / (Math.sqrt(2) * -2) + "px",
                    }}/>
                  <div className="symbol-container">{getCharacter(tile)}</div>
                </div>
              </OffsetHex>
            );
          })}
        </div>
      ) : null}
    </Container>
  );

  function getCharacter(tile: Tile) {
    if (tile.isRevealed) {
      if (tile.value > 0) return tile.value.toString();
    }

    if (tile.value === -1 && isLost) {
      return "\uD83D\uDCA3";
    }

    if (tile.hasFlag) return "\uD83D\uDEA9";
    if (tile.hasQ) return "\u2753";

    return "";
  }
}

function OffsetHex({
  row,
  column,
  rowOffset,
  columnOffset,
  children,
  edgeWidth = 0,
  radius = 15,
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
