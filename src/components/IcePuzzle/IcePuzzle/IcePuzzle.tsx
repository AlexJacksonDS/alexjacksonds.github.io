"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import "./IcePuzzle.scss";
import { IcePuzzleGenerator, Tile } from "@/services/icePuzzle.service";
import RangeSlider from "react-bootstrap-range-slider";
import { isMobile } from "react-device-detect";

export default function IcePuzzle() {
  const [generator, _] = useState(new IcePuzzleGenerator());
  const map = useRef<Tile[][]>([]);
  const scale = useRef(50);

  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [bypassTimeout, setBypassTimeout] = useState(false);

  const [rawSize, setRawSize] = useState(Math.floor(500 / (Math.max(width, height) + 2)));
  scale.current = rawSize > 50 ? 50 : rawSize;

  const [renderMap, setRenderMap] = useState(false);

  const currentI = useRef(0);
  const currentJ = useRef(0);
  const startI = useRef(0);
  const startJ = useRef(0);
  const [isInit, setIsInit] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rect, setRect] = useState<DOMRect | undefined>(undefined);

  const [showSolution, setShowSolution] = useState(false);
  const [solution, setSolution] = useState("");
  const [generationStats, setGenerationStats] = useState("");

  useEffect(() => {
    if (!rect && renderMap) {
      window.scrollTo(0, 0);
      setRect(document.getElementById("ice-puzzle")?.getBoundingClientRect());
    }
    if (rect && renderMap) {
      drawCurrentPlayerLocation(currentJ.current * scale.current, currentI.current * scale.current);
    }
    if (!isInit) {
      document.addEventListener("keyup", handleKeyPress);
      if (isMobile) {
        setRawSize(Math.floor(window.innerWidth / ((Math.max(width, height) + 2) * 1.5)));
      }

      setIsInit(true);

      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [rect, setRect, renderMap]);

  function drawCurrentPlayerLocation(x: number, y: number) {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        context.reset();
        context.beginPath();
        context.arc(
          x + Math.floor(scale.current / 2),
          y + Math.floor(scale.current / 2),
          Math.floor(scale.current / 4),
          0,
          2 * Math.PI
        );
        context.fillStyle = "red";
        context.strokeStyle = "red";
        context.fill();
        context.stroke();
      }
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    handleKey(e.key);
  }

  function handleKey(key: string) {
    switch (key) {
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

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async function movePlayer(iMod: number, jMod: number) {
    if (map.current.length === 0) return;
    let isRock = false;
    let isStart = false;
    startI.current = currentI.current;
    startJ.current = currentJ.current;
    let i = currentI.current + iMod;
    let j = currentJ.current + jMod;
    while (!isRock && !isStart) {
      if (map.current[i][j] === Tile.Rock) {
        isRock = true;
      } else if (map.current[i][j] === Tile.Start || map.current[i][j] === Tile.Goal) {
        isStart = true;
        drawCurrentPlayerLocation(j * scale.current, i * scale.current);
      } else {
        drawCurrentPlayerLocation(
          j * scale.current - Math.floor((3 * scale.current) / 4) * jMod,
          i * scale.current - Math.floor((3 * scale.current) / 4) * iMod
        );
        await delay(25);
        drawCurrentPlayerLocation(
          j * scale.current - Math.floor(scale.current / 2) * jMod,
          i * scale.current - Math.floor(scale.current / 2) * iMod
        );
        await delay(25);
        drawCurrentPlayerLocation(
          j * scale.current - Math.floor((1 * scale.current) / 4) * jMod,
          i * scale.current - Math.floor((1 * scale.current) / 4) * iMod
        );
        await delay(25);
        drawCurrentPlayerLocation(j * scale.current, i * scale.current);
        i += iMod;
        j += jMod;
        await delay(25);
      }
    }
    if (isRock) {
      i -= iMod;
      j -= jMod;
    }
    currentI.current = i;
    currentJ.current = j;
  }

  async function generateBoard() {
    const game = generator.Generate(width, height, bypassTimeout);
    map.current = game.board;
    currentJ.current = game.start.x;
    currentI.current = game.start.y;
    setSolution(game.solutionString);
    setGenerationStats("Map generated in " + game.timeTaken + "ms in " + game.attempts + " attempts");
    drawCurrentPlayerLocation(currentJ.current * scale.current, currentI.current * scale.current);
    setRect(undefined);
    setRenderMap(true);
  }

  return (
    <>
      {renderMap ? (
        <>
          <Container>Arrow keys or buttons to move</Container>
          <Container>
            <Row>
              <Col xs={4} lg={1}></Col>
              <Col xs={4} lg={1}>
                <Button onClick={() => handleKey("ArrowUp")}>Up</Button>
              </Col>
              <Col xs={4} lg={1}></Col>
            </Row>
            <Row>
              <Col xs={4} lg={1}>
                <Button onClick={() => handleKey("ArrowLeft")}>Left</Button>
              </Col>
              <Col xs={4} lg={1}>
                <Button onClick={() => handleKey("ArrowDown")}>Down</Button>
              </Col>
              <Col xs={4} lg={1}>
                <Button onClick={() => handleKey("ArrowRight")}>Right</Button>
              </Col>
            </Row>
          </Container>
          <Container className="ice-puzzle-container">
            <Container id="ice-puzzle" style={{width: scale.current * (width + 2) + "px"}}>
              {map.current.map((r, i) => (
                <Row key={i} className="m-0 ice-puzzle-row ">
                  {r.map((c, j) => (
                    <Col
                      key={j}
                      style={{
                        width: scale.current + "px",
                        maxWidth: scale.current + "px",
                        padding: 0,
                      }}
                    >
                      <div
                        className={"tile " + Object.keys(Tile)[Object.values(Tile).indexOf(c)].toLowerCase()}
                        style={{ width: scale.current + "px" }}
                      ></div>
                    </Col>
                  ))}
                </Row>
              ))}
            </Container>
          </Container>
          <Container>
            <Row>
              <Col lg={2}>
                <p>{showSolution ? solution : "***********"}</p>
              </Col>
              <Col lg={2}>
                <Button onClick={() => setShowSolution(!showSolution)}>
                  {showSolution ? "Hide" : "Show"} Solution
                </Button>
              </Col>
            </Row>
          </Container>
          <Container>
            <p>{generationStats}</p>
          </Container>
        </>
      ) : null}
      {renderMap && rect && map.current.length > 0 ? (
        <canvas
          ref={canvasRef}
          width={map.current[0].length * scale.current}
          height={map.current.length * scale.current}
          id="player-canvas"
          style={{ zIndex: 500, position: "fixed", top: rect.top, left: rect.left }}
        />
      ) : null}
      <Container>
        <Form>
          <Form.Group as={Row}>
            <Col>
              <Form.Group>
                <Form.Label>Width</Form.Label>
                <RangeSlider
                  value={width}
                  onChange={(e) => {
                    setWidth(parseInt(e.target.value));
                    setRenderMap(false);
                  }}
                  min={10}
                  max={20}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Height</Form.Label>
                <RangeSlider
                  value={height}
                  onChange={(e) => {
                    setHeight(parseInt(e.target.value));
                    setRenderMap(false);
                  }}
                  min={10}
                  max={20}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  onChange={() => setBypassTimeout(!bypassTimeout)}
                  checked={bypassTimeout}
                  label="Bypass timeout"
                />
              </Form.Group>
            </Col>
          </Form.Group>
          <Button onClick={generateBoard}>Generate Map</Button>
          {width >= 15 && height >= 15 ? (
            <p>
              At this size performance of generation will be impacted and map may be very simple/impossible. To bypass
              the performance timeout of 30 seconds select the checkbox above.
            </p>
          ) : null}
        </Form>
      </Container>
    </>
  );
}
