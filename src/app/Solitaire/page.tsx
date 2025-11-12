"use client";

import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  dealSolitaire,
  isMoveLegal,
  makeMove,
  turnThreeDeckCards,
} from "@/services/solitaire.service";
import "./Solitaire.scss";
import { GameState } from "@/types/solitaire";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import DroppableCardList from "@/components/Draggable/DroppableCardList/DroppableCardList";
import DraggableStack from "@/components/Draggable/DraggableCardStack/DraggableCardStack";
import Placeholder from "@/components/Draggable/CardPlaceholder/Placeholder";
import { VictoryCanvas } from "../../components/Draggable/VictoryCanvas/VictoryCanvas";
import { DropResult } from "@/types/draggableCards";
import DroppableGoalPiles from "@/components/Draggable/DroppableGoalPiles/DroppableGoalPiles";
import SolitairePlayArea from "@/components/Draggable/SolitairePlayArea/SolitairePlayArea";

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
      const newGameState = makeMove(
        gameState,
        sourceZone,
        dropResult.dropZoneId,
        cardIds
      );
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
        <DndProvider options={HTML5toTouch}>
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
                <DroppableGoalPiles
                  piles={gameState.piles}
                  handleStackMove={handleStackMove}
                />
              </Row>
              <SolitairePlayArea
                columns={gameState.columns}
                handleStackMove={handleStackMove}
              />
            </>
          ) : null}
        </DndProvider>
        {isWon && gameState ? <VictoryCanvas piles={gameState.piles} /> : null}
      </Container>
    </main>
  );
}
