"use client";

import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { dealSolitaire, isMoveLegal, makeMove, turnThreeDeckCards } from "@/services/solitaire.service";
import "./Solitaire.scss";
import { DropResult, GameState } from "@/types/solitaire";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableCardList from "@/components/Draggable/DroppableCardList/DroppableCardList";
import DraggableStack from "@/components/Draggable/DraggableCardStack/DraggableCardStack";
import Placeholder from "@/components/CardPlaceholder/Placeholder";

export default function Solitaire() {
  const [isDealt, setIsDealt] = useState(false);
  const [gameState, setGameState] = useState<GameState | undefined>();

  useEffect(() => {
    if (!isDealt) {
      setGameState(dealSolitaire());
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

    if (isMoveLegal(gameState, dropResult.dropZoneId, cardIds)) {
      const newGameState = makeMove(gameState, sourceZone, dropResult.dropZoneId, cardIds);
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
      <Container style={{pointerEvents: "none"}}>
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
      </Container>
    </main>
  );
}
