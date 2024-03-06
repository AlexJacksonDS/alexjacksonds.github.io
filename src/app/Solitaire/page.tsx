"use client";

import { Col, Container, Row } from "react-bootstrap";
import { memo, useEffect, useRef, useState } from "react";
import { dealSolitaire, isMoveLegal, makeMove, turnThreeDeckCards } from "@/services/solitaire.service";
import "./Solitaire.scss";
import { Card, DropResult, GameState } from "@/types/solitaire";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableCardList from "@/components/Draggable/DroppableCardList/DroppableCardList";
import DraggableStack from "@/components/Draggable/DraggableCardStack/DraggableCardStack";
import Placeholder from "@/components/CardPlaceholder/Placeholder";

export default function Solitaire() {
  const [isDealt, setIsDealt] = useState(false);
  const [gameState, setGameState] = useState<GameState | undefined>();
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    if (!isDealt) {
      setGameState(dealSolitaire());
      setIsWon(false);
      setIsDealt(true);
    }
  });

  function handleStackMove(dropResult: DropResult, stackId: string) {
    if (!gameState) return;

    const stackDetails = stackId.split("|");
    const sourceZone = stackDetails[0];

    if (sourceZone === dropResult.dropZoneId) {
      return;
    }

    const cardIds = stackDetails[1].split(",");

    if (isMoveLegal(gameState, dropResult.dropZoneId, sourceZone, cardIds)) {
      const newGameState = makeMove(gameState, sourceZone, dropResult.dropZoneId, cardIds);
      setIsWon(newGameState.pileOne.length === 13 && newGameState.pileTwo.length === 13 && newGameState.pileThree.length === 13 && newGameState.pileFour.length === 13);
      setGameState(newGameState);
    }
  }

  function dealThree() {
    if (!gameState) return;

    const newGameState = turnThreeDeckCards(gameState);

    setGameState(newGameState);
  }

  return (
    <main>
      <Container>
        <DndProvider backend={HTML5Backend}>
          {isDealt && gameState ? (
            <>
              <Row>
                <Col>
                  <Row>
                    <Col className="deck" onClick={dealThree}>
                      <DroppableCardList dropZoneId="deck">
                        {gameState.deck.length !== 0 ? (
                          <DraggableStack
                            cards={gameState.deck}
                            stackId="deck"
                            isDeck={true}
                            handleStackMove={handleStackMove}
                          />
                        ) : (
                          <Placeholder isResetDraw={true} />
                        )}
                      </DroppableCardList>
                    </Col>
                    <Col className="turned-deck">
                      <DroppableCardList dropZoneId="turnedDeck">
                        {gameState.turnedDeck.length !== 0 ? (
                          <DraggableStack
                            cards={gameState.turnedDeck}
                            stackId="turnedDeck"
                            isDeck={true}
                            handleStackMove={handleStackMove}
                          />
                        ) : (
                          <Placeholder />
                        )}
                      </DroppableCardList>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col className="pile">
                      <DroppableCardList dropZoneId="pile-one">
                        {gameState.pileOne.length !== 0 ? (
                          <DraggableStack
                            cards={gameState.pileOne}
                            stackId="pile-one"
                            isDeck={false}
                            handleStackMove={handleStackMove}
                          />
                        ) : (
                          <Placeholder />
                        )}
                      </DroppableCardList>
                    </Col>
                    <Col className="pile">
                      <DroppableCardList dropZoneId="pile-two">
                        {gameState.pileTwo.length !== 0 ? (
                          <DraggableStack
                            cards={gameState.pileTwo}
                            stackId="pile-two"
                            isDeck={false}
                            handleStackMove={handleStackMove}
                          />
                        ) : (
                          <Placeholder />
                        )}
                      </DroppableCardList>
                    </Col>
                    <Col className="pile">
                      <DroppableCardList dropZoneId="pile-three">
                        {gameState.pileThree.length !== 0 ? (
                          <DraggableStack
                            cards={gameState.pileThree}
                            stackId="pile-three"
                            isDeck={false}
                            handleStackMove={handleStackMove}
                          />
                        ) : (
                          <Placeholder />
                        )}
                      </DroppableCardList>
                    </Col>
                    <Col className="pile">
                      <DroppableCardList dropZoneId="pile-four">
                        {gameState.pileFour.length !== 0 ? (
                          <DraggableStack
                            cards={gameState.pileFour}
                            stackId="pile-four"
                            isDeck={false}
                            handleStackMove={handleStackMove}
                          />
                        ) : (
                          <Placeholder />
                        )}
                      </DroppableCardList>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="play-area">
                <Col className="column">
                  <DroppableCardList dropZoneId="column-one">
                    {gameState.columnOne.length !== 0 ? (
                      <DraggableStack
                        cards={gameState.columnOne}
                        stackId="column-one"
                        isDeck={false}
                        handleStackMove={handleStackMove}
                      />
                    ) : (
                      <Placeholder />
                    )}
                  </DroppableCardList>
                </Col>
                <Col className="column">
                  <DroppableCardList dropZoneId="column-two">
                    {gameState.columnTwo.length !== 0 ? (
                      <DraggableStack
                        cards={gameState.columnTwo}
                        stackId="column-two"
                        isDeck={false}
                        handleStackMove={handleStackMove}
                      />
                    ) : (
                      <Placeholder />
                    )}
                  </DroppableCardList>
                </Col>
                <Col className="column">
                  <DroppableCardList dropZoneId="column-three">
                    {gameState.columnThree.length !== 0 ? (
                      <DraggableStack
                        cards={gameState.columnThree}
                        stackId="column-three"
                        isDeck={false}
                        handleStackMove={handleStackMove}
                      />
                    ) : (
                      <Placeholder />
                    )}
                  </DroppableCardList>
                </Col>
                <Col className="column">
                  <DroppableCardList dropZoneId="column-four">
                    {gameState.columnFour.length !== 0 ? (
                      <DraggableStack
                        cards={gameState.columnFour}
                        stackId="column-four"
                        isDeck={false}
                        handleStackMove={handleStackMove}
                      />
                    ) : (
                      <Placeholder />
                    )}
                  </DroppableCardList>
                </Col>
                <Col className="column">
                  <DroppableCardList dropZoneId="column-five">
                    {gameState.columnFive.length !== 0 ? (
                      <DraggableStack
                        cards={gameState.columnFive}
                        stackId="column-five"
                        isDeck={false}
                        handleStackMove={handleStackMove}
                      />
                    ) : (
                      <Placeholder />
                    )}
                  </DroppableCardList>
                </Col>
                <Col className="column">
                  <DroppableCardList dropZoneId="column-six">
                    {gameState.columnSix.length !== 0 ? (
                      <DraggableStack
                        cards={gameState.columnSix}
                        stackId="column-six"
                        isDeck={false}
                        handleStackMove={handleStackMove}
                      />
                    ) : (
                      <Placeholder />
                    )}
                  </DroppableCardList>
                </Col>
                <Col className="column">
                  <DroppableCardList dropZoneId="column-seven">
                    {gameState.columnSeven.length !== 0 ? (
                      <DraggableStack
                        cards={gameState.columnSeven}
                        stackId="column-seven"
                        isDeck={false}
                        handleStackMove={handleStackMove}
                      />
                    ) : (
                      <Placeholder />
                    )}
                  </DroppableCardList>
                </Col>
              </Row>
            </>
          ) : null}
        </DndProvider>
        {isWon && gameState ? (
          <VictoryCanvas piles={[gameState.pileOne, gameState.pileTwo, gameState.pileThree, gameState.pileFour]} />
        ) : null}
      </Container>
    </main>
  );
}

const VictoryCanvas = memo(function VictoryCanvas({ piles }: { piles: Card[][] }) {
  const dpr = window.devicePixelRatio;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const rectOne = document.getElementById("pile-one")?.getBoundingClientRect();
    const rectTwo = document.getElementById("pile-two")?.getBoundingClientRect();
    const rectThree = document.getElementById("pile-three")?.getBoundingClientRect();
    const rectFour = document.getElementById("pile-four")?.getBoundingClientRect();
    if (canvasRef.current && rectOne && rectTwo && rectThree && rectFour) {
      const rects = [rectOne, rectTwo, rectThree, rectFour];
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        piles.forEach(function (pile, i) {
          setTimeout(function () {
            const pileReverse = [...pile].reverse();
            pileReverse.forEach(function (card, j) {
              setTimeout(function () {
                const img = document.getElementById(`${card.id}-img`) as HTMLImageElement;
                startFall(canvas, context, img, rects[i]);
              }, j * 1000);
            });
          }, i * 1000);
        });
      }
    }
  }, [piles]);

  function fallIteration(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    img: HTMLImageElement,
    pos: { top: number; left: number },
    dx: number,
    dy: number
  ) {
    context.drawImage(img, pos.left, pos.top, img.width, img.height);
    var newTop = Math.min(canvas.height - img.height, pos.top + dy);
    var newPos = {
      left: pos.left + dx,
      top: newTop,
    };
    if (Math.abs(newTop - (canvas.height - img.height)) < 5) {
      if (dy < 0 || dy > 20) {
        dy *= -1 * 0.7;
        setTimeout(function () {
          fallIteration(canvas, context, img, newPos, dx, dy);
        }, 20);
      }
    } else {
      dy = dy - -3;
      setTimeout(function () {
        fallIteration(canvas, context, img, newPos, dx, dy);
      }, 20);
    }
  }

  function startFall(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    img: HTMLImageElement,
    domRect: DOMRect
  ) {
    var dx = Math.floor(Math.random() * 10) + 5;
    if (Math.floor(Math.random() * 10) > 5) {
      dx = -dx;
    }
    setTimeout(function () {
      fallIteration(canvas, context, img, { top: domRect.top, left: domRect.left }, dx, 0);
    }, 200);
  }

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth * dpr}
      height={window.innerHeight * dpr}
      id="victory-canvas"
      style={{ zIndex: 500, position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
    />
  );
});
