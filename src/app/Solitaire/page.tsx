"use client";

import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { dealSolitaire } from "@/services/solitaire.service";
import "./Solitaire.scss";
import { Card, DropResult, GameState } from "@/types/solitaire";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Stack from "@/components/Draggable/DraggableCardStack/DraggableCardStack";
import { DroppableCardList } from "@/components/Draggable/DroppableCardList/DroppableCardList";

export default function Solitaire() {
  const [isDealt, setIsDealt] = useState(false);
  const [gameState, setGameState] = useState<GameState | undefined>();

  useEffect(() => {
    if (!isDealt) {
      setGameState(dealSolitaire());
      setIsDealt(true);
    }
  });

  const cardColumns = [
    "column-one",
    "column-two",
    "column-three",
    "column-four",
    "column-five",
    "column-six",
    "column-seven",
  ];

  const cardPiles = ["pile-one", "pile-two", "pile-three", "pile-four"];

  function handleStackMove(dropResult: DropResult, stackId: string) {
    if (!gameState) return;

    const newGameState: GameState = JSON.parse(JSON.stringify(gameState));
    const stackDetails = stackId.split("|");
    const sourceZone = stackDetails[0];

    if (sourceZone === dropResult.dropZoneId) {
      return;
    }

    const cardIds = stackDetails[1].split(",");
    const cards = cardIds.map((id) => ({ id, isFaceUp: true }));
    switch (dropResult.dropZoneId) {
      case "column-one":
        newGameState.columnOne = gameState.columnOne.concat(cards);
        break;
      case "column-two":
        newGameState.columnTwo = gameState.columnTwo.concat(cards);
        break;
      case "column-three":
        newGameState.columnThree = gameState.columnThree.concat(cards);
        break;
      case "column-four":
        newGameState.columnFour = gameState.columnFour.concat(cards);
        break;
      case "column-five":
        newGameState.columnFive = gameState.columnFive.concat(cards);
        break;
      case "column-six":
        newGameState.columnSix = gameState.columnSix.concat(cards);
        break;
      case "column-seven":
        newGameState.columnSeven = gameState.columnSeven.concat(cards);
        break;
      case "pile-one":
        newGameState.pileOne = gameState.pileOne.concat(cards);
        break;
      case "pile-two":
        newGameState.pileTwo = gameState.pileTwo.concat(cards);
        break;
      case "pile-three":
        newGameState.pileThree = gameState.pileThree.concat(cards);
        break;
      case "pile-four":
        newGameState.pileFour = gameState.pileFour.concat(cards);
        break;
      default:
        return;
    }
    switch (sourceZone) {
      case "column-one":
        newGameState.columnOne = gameState.columnOne
          .filter((c) => !cardIds.includes(c.id))
          .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
        break;
      case "column-two":
        newGameState.columnTwo = gameState.columnTwo
          .filter((c) => !cardIds.includes(c.id))
          .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
        break;
      case "column-three":
        newGameState.columnThree = gameState.columnThree
          .filter((c) => !cardIds.includes(c.id))
          .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
        break;
      case "column-four":
        newGameState.columnFour = gameState.columnFour
          .filter((c) => !cardIds.includes(c.id))
          .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
        break;
      case "column-five":
        newGameState.columnFive = gameState.columnFive
          .filter((c) => !cardIds.includes(c.id))
          .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
        break;
      case "column-six":
        newGameState.columnSix = gameState.columnSix
          .filter((c) => !cardIds.includes(c.id))
          .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
        break;
      case "column-seven":
        newGameState.columnSeven = gameState.columnSeven
          .filter((c) => !cardIds.includes(c.id))
          .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
        break;
      case "turnedDeck":
        newGameState.turnedDeck = gameState.turnedDeck.filter((c) => !cardIds.includes(c.id));
        break;
      default:
        return;
    }
    setGameState(newGameState);
  }

  function dealThree() {
    if (!gameState) return;

    const newGameState: GameState = JSON.parse(JSON.stringify(gameState));
    newGameState.turnedDeck = newGameState.turnedDeck
      .concat([newGameState.deck.pop() as Card, newGameState.deck.pop() as Card, newGameState.deck.pop() as Card])
      .map((c) => ({ id: c.id, isFaceUp: true }));

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
                          <Stack
                            cards={gameState.deck}
                            stackId="deck"
                            isDeck={true}
                            handleStackMove={handleStackMove}
                          />
                        ) : (
                          <Placeholder />
                        )}
                      </DroppableCardList>
                    </Col>
                    <Col className="turned-deck">
                      <DroppableCardList dropZoneId="turnedDeck">
                        {gameState.turnedDeck.length !== 0 ? (
                          <Stack
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
                          <Stack
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
                          <Stack
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
                          <Stack
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
                          <Stack
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
                      <Stack
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
                      <Stack
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
                      <Stack
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
                      <Stack
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
                      <Stack
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
                      <Stack
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
                      <Stack
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

function Placeholder() {
  return (
    <div className="card-list">
      <div className="placeholder normal"></div>
    </div>
  );
}
