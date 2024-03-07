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
import { VictoryCanvas } from "../../components/VictoryCanvas/VictoryCanvas";

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
      setIsWon([...newGameState.piles.values()].every((p) => p.length === 13));
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
                    {[...gameState.piles.keys()].map((key) => {
                      const pile = gameState.piles.get(key)!;
                      return (
                        <Col key={key} className="pile">
                          <DroppableCardList dropZoneId={key}>
                            {pile.length !== 0 ? (
                              <DraggableStack
                                cards={pile}
                                stackId={key}
                                isDeck={false}
                                handleStackMove={handleStackMove}
                              />
                            ) : (
                              <Placeholder />
                            )}
                          </DroppableCardList>
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              </Row>
              <Row className="play-area">
                {[...gameState.columns.keys()].map((key) => {
                  const column = gameState.columns.get(key)!;
                  return (
                    <Col key={key} className="column">
                      <DroppableCardList dropZoneId={key}>
                        {column.length !== 0 ? (
                          <DraggableStack
                            cards={column}
                            stackId={key}
                            isDeck={false}
                            handleStackMove={handleStackMove}
                          />
                        ) : (
                          <Placeholder />
                        )}
                      </DroppableCardList>
                    </Col>
                  );
                })}
              </Row>
            </>
          ) : null}
        </DndProvider>
        {isWon && gameState ? <VictoryCanvas piles={gameState.piles} /> : null}
      </Container>
    </main>
  );
}


