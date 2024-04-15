"use client";

import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { dealFreecell, isMoveLegal, makeMove } from "@/services/freecell.service";
import "./Freecell.scss";
import { GameState } from "@/types/freecell";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import DroppableCardList from "@/components/Draggable/DroppableCardList/DroppableCardList";
import DraggableStack from "@/components/Draggable/DraggableCardStack/DraggableCardStack";
import Placeholder from "@/components/Draggable/CardPlaceholder/Placeholder";
import { VictoryCanvas } from "../../components/Draggable/VictoryCanvas/VictoryCanvas";
import { DropResult } from "@/types/draggableCards";

export default function Freecell() {
  const [isDealt, setIsDealt] = useState(false);
  const [gameState, setGameState] = useState<GameState | undefined>();
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    if (!isDealt) {
      setGameState(dealFreecell());
      setIsWon(false);
      setIsDealt(true);
    }
  }, [isDealt]);

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

  return (
    <main>
      <Container>
        <DndProvider options={HTML5toTouch}>
          {isDealt && gameState ? (
            <>
              <Row>
                <Col>
                  <Row>
                    {[...gameState.slots.keys()].map((key) => {
                      const slot = gameState.slots.get(key)!;
                      return (
                        <Col key={key} className="slot">
                          <DroppableCardList dropZoneId={key}>
                            {slot.length !== 0 ? (
                              <DraggableStack
                                cards={slot}
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
                    <Col></Col>
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
