"use client";

import {
  Dispatch,
  SetStateAction,
  useState,
  MouseEvent,
  useRef,
  useEffect,
} from "react";
import {
  Container,
  Form,
  FormGroup,
  Row,
  Col,
  Button,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { Tile } from "@/types/minesweeper";
import { generateBoard, openSquares } from "@/services/minesweeper.service";
import MinesweeperBoard from "../MinesweeperBoard/MinesweeperBoard";

export default function Minesweeper(props: { isHex: boolean }) {
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

  useEffect(() => {
    setInstructions(
      isMobile
        ? "Tap to reveal, long press to flag"
        : "Left click to reveal, right click to flag"
    );
  }, []);

  function handleInput(
    input: string,
    stateUpdater: Dispatch<SetStateAction<string>>,
    numStateUpdater: Dispatch<SetStateAction<number>>
  ) {
    stateUpdater(input);
    if (!Number.isNaN(Number(input))) numStateUpdater(Number(input));
  }

  function controlIsValid(string: string) {
    return (
      string.length > 0 && !Number.isNaN(Number(string)) && Number(string) > 0
    );
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

  function startGame() {
    setGameGenerated(true);
    setIsLost(false);
    setIsGameFinished(false);
    setClicks(0);
    board.current = generateBoard(width, height, mineCount, props.isHex);
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
      openSquares(board, [i, j], props.isHex);
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
              onChange={(e) =>
                handleInput(e.target.value, setWidthString, setWidth)
              }
              isValid={controlIsValid(widthString)}
              isInvalid={!controlIsValid(widthString)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a positive integer
            </Form.Control.Feedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="height">
            <Form.Label>Height</Form.Label>
            <Form.Control
              type="numeric"
              value={heightString}
              onChange={(e) =>
                handleInput(e.target.value, setHeightString, setHeight)
              }
              isValid={controlIsValid(heightString)}
              isInvalid={!controlIsValid(heightString)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a positive integer
            </Form.Control.Feedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="mines">
            <Form.Label>Mines</Form.Label>
            <Form.Control
              type="numeric"
              value={mineCountString}
              onChange={(e) =>
                handleInput(e.target.value, setMineCountString, setMineCount)
              }
              isValid={
                controlIsValid(mineCountString) && mineCount <= width * height
              }
              isInvalid={
                !controlIsValid(mineCountString) || mineCount > width * height
              }
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
          <Button
            variant="primary"
            onClick={startGame}
            disabled={buttonsDisabled}
          >
            Start
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => setDefaults(9, 9, 10)}
            disabled={buttonsDisabled}
          >
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
        <Toast
          bg={"success"}
          show={show}
          onClick={hideToast}
          onClose={() => hideToast()}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Minesweeper</strong>
            <small className="text-muted">Just now</small>
          </Toast.Header>
          <Toast.Body>Victory!</Toast.Body>
        </Toast>
        <Toast
          bg={"danger"}
          show={showFail}
          onClick={hideToast}
          onClose={() => hideToast()}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Minesweeper</strong>
            <small className="text-muted">Just now</small>
          </Toast.Header>
          <Toast.Body>Unlucky first click</Toast.Body>
        </Toast>
      </ToastContainer>

      {gameGenerated ? (
        <MinesweeperBoard
          board={board}
          handleClick={handleClick}
          small={small}
          isLost={isLost}
          isHex={props.isHex}
        />
      ) : null}
    </Container>
  );
}
