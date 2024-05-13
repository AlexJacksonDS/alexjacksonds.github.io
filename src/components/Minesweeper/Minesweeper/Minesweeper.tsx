"use client";

import { Dispatch, SetStateAction, useState, MouseEvent, useRef, useEffect } from "react";
import { Container, Form, FormGroup, Row, Col, Button } from "react-bootstrap";
import "./Minesweeper.scss";
import { isMobile } from "react-device-detect";

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

export default function Minesweeper() {
  const [width, setWidth] = useState(10);
  const [widthString, setWidthString] = useState("10");
  const [height, setHeight] = useState(10);
  const [heightString, setHeightString] = useState("10");
  const [mineCount, setMineCount] = useState(10);
  const [mineCountString, setMineCountString] = useState("10");

  const [gameGenerated, setGameGenerated] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [small, setSmall] = useState(true);

  const [clicks, setClicks] = useState(0);

  const board = useRef<Tile[][]>([]);

  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    setInstructions(isMobile ? "Tap to reveal, long press to flag" : "Left click to reveal, right click to flag");
  });

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
  }

  function generateBoard() {
    const mineLocations = shuffle(new Array(width * height).fill(0).map((a, i) => (a = i))).slice(0, mineCount);
    const mineCoords = mineLocations.map((x) => {
      const y = Math.floor(x / height);
      return [y, x - y * height];
    });

    const newBoardNulls: (Tile | null)[][] = Array(width)
      .fill(0)
      .map(() => Array(height).fill(null));

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        newBoardNulls[i][j] = new Tile();
      }
    }

    const newBoard = newBoardNulls as Tile[][];

    for (const coords of mineCoords) {
      newBoard[coords[0]][coords[1]].value = -1;
    }

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
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
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getAdjacentValues(board: Tile[][], coords: number[]) {
    const boardHeight = board.length;
    const boardWidth = board[0].length;
    const adjModifiers = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ];
    const adjCoords = adjModifiers
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
      {gameGenerated ? (
        <Row className="pt-2">
          <Col>
            <div className="minesweeper">
              {board.current.map((r, i) => (
                <Row key={i} className="m-0">
                  {r.map((c, j) => (
                    <Col
                      key={j}
                      style={{
                        width: small ? 10 : 40 + "px",
                        maxWidth: small ? 10 : 40 + "px",
                        padding: 0,
                      }}
                    >
                      <div
                        className={
                          "tile " +
                          (c.isRevealed
                            ? ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight"][c.value]
                            : "unrevealed ")
                        }
                        style={{
                          width: small ? 10 : 40 + "px",
                          fontSize: small ? 5 : 20 + "px",
                          borderWidth: small ? 1 : 3 + "px",
                          padding: small ? 0 : "2px 10px",
                        }}
                        onClick={(e) => handleClick(e, i, j)}
                        onContextMenu={(e) => handleClick(e, i, j)}
                      >
                        {getCharacter(c)}
                      </div>
                    </Col>
                  ))}
                </Row>
              ))}
            </div>
          </Col>
        </Row>
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
