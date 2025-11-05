"use client";

import { useState, KeyboardEvent, useRef } from "react";
import {
  Button,
  Col,
  Container,
  FormGroup,
  FormLabel,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "./Scout.scss";
import useSignalR from "@/hooks/useSignalR";
import { GameState, ScoutCard } from "@/types/scout";
import ScoreBoard from "@/components/Hearts/ScoreBoard/ScoreBoard";
import CentreCards from "../CentreCards/CentreCards";
import ScoutPlayer from "../ScoutPlayer/ScoutPlayer";
import OtherScoutPlayer from "../OtherScoutPlayer/OtherScoutPlayer";

const otherPlayersTwo = new Map<number, number[]>();
otherPlayersTwo.set(1, [2]);
otherPlayersTwo.set(2, [1]);

const otherPlayersThree = new Map<number, number[]>();
otherPlayersThree.set(1, [2, 3]);
otherPlayersThree.set(2, [3, 1]);
otherPlayersThree.set(3, [1, 2]);

const otherPlayersFour = new Map<number, number[]>();
otherPlayersFour.set(1, [2, 3, 4]);
otherPlayersFour.set(2, [3, 4, 1]);
otherPlayersFour.set(3, [4, 1, 2]);
otherPlayersFour.set(4, [1, 2, 3]);

export default function Scout() {
  const [gameId, setGameId] = useState("");
  const [gameIdDisabled, setGameIdDisabled] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [gameState, setGameState] = useState<GameState>();
  const [errorString, setErrorString] = useState("");
  const [showError, setShowError] = useState(false);

  const [scoutCard, setScoutCard] = useState<ScoutCard>();
  const [isScoutAndShow, setIsScoutAndShow] = useState<boolean>(false);
  const [highlightedCards, setHighlightedCards] = useState<number[]>([]);
  const [highlightedScoutCards, setHighlightedScoutCards] = useState<number[]>(
    []
  );
  const [isScouting, setIsScouting] = useState(false);
  const [scoutIndex, setScoutIndex] = useState(0);

  const signalRConnection = useSignalR("Scout", [
    ["joinFailed", joinFailed],
    ["state", handleNewState],
    ["invalidMove", resetAfterInvalidMove],
    ["gameEnded", gameEnded],
  ]);

  function joinFailed() {
    setGameId("");
    setGameIdDisabled(false);
  }

  function handleNewState(state: GameState) {
    setGameState(state);
    setHighlightedCards([]);
    setClicks(clicks + 1);
    setScoutCard(undefined);
    setHighlightedScoutCards([]);
    setIsScouting(false);
    setScoutIndex(0);
    if (state.player.hasScoutAndShowed) {
      setIsScoutAndShow(false);
    }
  }

  function resetAfterInvalidMove(message: string) {
    setShowError(true);
    setErrorString(message);
  }

  function gameEnded() {
    if (signalRConnection) {
      signalRConnection.send("leaveGame", gameId);
    }
    setGameId("");
    setGameIdDisabled(false);
    setGameState(undefined);
  }

  function gameIdOnKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key != "Enter") return;
    if (signalRConnection && gameId) {
      signalRConnection.send("joinGame", gameId).then(() => {
        setGameIdDisabled(true);
      });
    }
  }

  function startGame() {
    if (signalRConnection) {
      signalRConnection.send("startGame", gameId);
    }
  }

  function scout() {
    if (signalRConnection) {
      signalRConnection
        .send("scout", gameId, scoutCard, scoutIndex, isScoutAndShow)
        .then(() => {
          setScoutCard(undefined);
          setScoutIndex(0);
          setHighlightedScoutCards([]);
        });
    }
  }

  function show() {
    if (signalRConnection) {
      if (highlightedCards.length === 0) {
        return;
      }

      signalRConnection
        .send(
          "show",
          gameId,
          Math.min(...highlightedCards),
          highlightedCards.length,
          isScoutAndShow
        )
        .then(() => setHighlightedCards([]));
    }
  }

  function selectOrientation(flipped: boolean) {
    if (signalRConnection) {
      signalRConnection.send("selectOrientation", gameId, flipped);
    }
  }

  function selectCard(index: number) {
    if (
      gameState?.hasSelectionOccured &&
      gameState.currentPlayer === gameState.player.id
    ) {
      let copy = [...highlightedCards];
      if (!copy.includes(index)) {
        copy.push(index);
      } else {
        copy = copy.filter((x) => x !== index);
      }

      setHighlightedCards(copy);
    }
  }

  function selectScoutCard(card: ScoutCard, index: number) {
    if (
      gameState &&
      gameState.hasSelectionOccured &&
      gameState.currentPlayer === gameState.player.id &&
      (index === 0 || index === gameState.currentTable.length - 1)
    ) {
      setScoutCard(card);
      setHighlightedScoutCards([index]);
      setIsScouting(true);
    }
  }

  function selectScoutLocation(index: number) {
    if (
      gameState &&
      gameState.hasSelectionOccured &&
      gameState.currentPlayer === gameState.player.id
    ) {
      setScoutIndex(index);
    }
  }

  function selectScoutOrientation() {
    if (scoutCard) {
      const flippedScoutCard = {
        ...scoutCard,
        isFlipped: !scoutCard.isFlipped,
      };
      setScoutCard(flippedScoutCard);
    }
  }

  function resetTurn() {
    setShowError(false);
    setErrorString("");
  }

  return (
    <main>
      <Container>
        <Row>
          <Col>
            <Container hidden={gameState !== undefined}>
              <FormGroup>
                <FormLabel>Game ID: </FormLabel>
                <input
                  className="form-control"
                  value={gameId}
                  onInput={(e) =>
                    setGameId((e.target as HTMLInputElement).value)
                  }
                  onKeyUp={(e) => gameIdOnKeyUp(e)}
                  disabled={gameIdDisabled}
                  placeholder="Enter to submit"
                />
              </FormGroup>
            </Container>
            <button
              className="btn btn-primary"
              onClick={startGame}
              hidden={!gameState?.isStartable}
            >
              Start game
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Container>
              {gameState?.playerScores ? (
                <ScoreBoard scores={gameState.playerScores} />
              ) : null}
            </Container>
          </Col>
        </Row>
        <Row>
          <Col>
            {gameState ? (
              <>
                <Row>
                  <Col>
                    <CentreCards
                      cards={gameState.currentTable}
                      cardsToHighlight={highlightedScoutCards}
                      player={
                        gameState.otherPlayerDetails.filter(
                          (p) => p.id === gameState?.currentLead
                        )[0]?.name ?? gameState.player.name
                      }
                      selectScoutCard={selectScoutCard}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Row>
                      <Col>
                        <Button
                          onClick={() => scout()}
                          disabled={gameState.currentTable.length === 0}
                        >
                          Scout
                        </Button>
                      </Col>
                      <Col>
                        <Button onClick={() => show()}>Show</Button>
                      </Col>
                      <Col>
                        {gameState.player.hasScoutAndShowed ? "t" : "f"}
                        {(gameState.currentTable.length === 0).toString()}
                        <Button
                          onClick={() => setIsScoutAndShow(true)}
                          disabled={
                            gameState.player.hasScoutAndShowed ||
                            gameState.currentTable.length === 0
                          }
                        >
                          Start Scout and Show
                        </Button>
                      </Col>
                    </Row>
                    <ScoutPlayer
                      player={gameState.player}
                      cardsToHighlight={highlightedCards}
                      isTurn={gameState.currentPlayer === gameState.player.id}
                      isScouting={isScouting}
                      selectOrientation={selectOrientation}
                      selectCard={selectCard}
                      selectScoutLocation={selectScoutLocation}
                      selectScoutOrientation={selectScoutOrientation}
                      scoutCard={scoutCard}
                      scoutIndex={scoutIndex}
                    />
                  </Col>
                </Row>
                <Row>
                  {gameState.otherPlayerDetails.map((p, i) => (
                    <Col key={i}>
                      <OtherScoutPlayer
                        player={p}
                        isTurn={p.id === gameState?.currentPlayer}
                      />
                    </Col>
                  ))}
                </Row>
              </>
            ) : undefined}
          </Col>
        </Row>
        {errorString ? (
          <ToastContainer position="middle-center">
            <Toast
              bg={"danger"}
              show={showError}
              onClose={() => resetTurn()}
              delay={3000}
              autohide
            >
              <Toast.Header>
                <strong className="me-auto">Scout</strong>
                <small className="text-muted">Just now</small>
              </Toast.Header>
              <Toast.Body>{errorString}</Toast.Body>
            </Toast>
          </ToastContainer>
        ) : null}
      </Container>
    </main>
  );
}
