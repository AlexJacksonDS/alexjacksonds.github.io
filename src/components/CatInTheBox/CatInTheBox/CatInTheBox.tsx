"use client";

import { GameState } from "@/types/catInTheBox";
import { useState, KeyboardEvent, ChangeEvent } from "react";
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
import _ from "lodash";
import "./CatInTheBox.scss";
import PlayedCards from "../PlayedCards/PlayedCards";
import OtherPlayerDetails from "../OtherPlayerDetails/OtherPlayerDetails";
import PlayerDetails from "../PlayerDetails/PlayerDetails";
import useSignalR from "@/hooks/useSignalR";
import GameIdForm from "@/components/GameIdForm/GameIdForm";

export default function CatInTheBox() {
  const [gameId, setGameId] = useState("");
  const [gameIdDisabled, setGameIdDisabled] = useState(false);
  const [connectedToGame, setConnectedToGame] = useState(false);

  const [gameState, setGameState] = useState<GameState | undefined>(undefined);
  const [myTurn, setMyTurn] = useState(false);
  const [errorString, setErrorString] = useState("");
  const [show, setShow] = useState(false);

  const [bet, setBet] = useState(1);
  const [card, setCard] = useState(0);
  const [colour, setColour] = useState(0);

  const [warningMessage, setWarningMessage] = useState("");

  const betValues =
    gameState?.otherPlayerDetails.length &&
    gameState.otherPlayerDetails.length > 2
      ? [1, 2, 3]
      : [1, 3, 4];

  const signalRConnection = useSignalR("scout", [
    ["joinFailed", joinFailed],
    ["state", handleNewState],
    ["invalidMove", resetAfterInvalidMove],
    ["gameEnded", gameEnded],
  ]);

  function joinFailed() {
    setGameId("");
    setGameIdDisabled(false);
  }

  function gameEnded() {
    if (signalRConnection) {
      signalRConnection.send("leaveGame", gameId);
    }
    setGameId("");
    setGameIdDisabled(false);
    setConnectedToGame(false);
    setGameState(undefined);
    setMyTurn(false);
  }

  function resetAfterInvalidMove(message: string, state: GameState) {
    handleNewState(state);
    setErrorString(message);
    setShow(true);
  }

  function handleNewState(state: GameState) {
    setMyTurn(state.currentPlayer === state.myDetails.player.id);
    setGameState(state);
    setErrorString("");
  }

  function clickCard(card: number) {
    if (gameState && !gameState.allDiscarded) {
      setCard(card);
    }
  }

  function clickBoardSquare(card: number, colour: number) {
    if (gameState && gameState.allBet) {
      if (slotIsFilled(card, colour)) {
        return;
      }
      const playerLegalMoves = getLegalMoves();
      if (
        playerLegalMoves.length !== 0 &&
        !playerLegalMoves.find((x) => x.card === card && x.colour === colour)
      ) {
        return;
      } else {
        setCard(card);
        setColour(colour);
        if (
          gameState.currentLead &&
          gameState.currentLead.colour !== colour &&
          playerHasColour(gameState.currentLead.colour)
        ) {
          setWarningMessage(
            `Warning: This will declare you have no ${colourToString(
              gameState.currentLead.colour
            )}s`
          );
        } else if (
          gameState.currentLead === null &&
          !gameState.isRedBroken &&
          colour === 1
        ) {
          setWarningMessage(
            `Warning: This will declare you have no blues, yellows or greens`
          );
        } else {
          setWarningMessage("");
        }
      }
    }
  }

  function getLegalMoves() {
    if (!gameState) return [];

    const legalMoves = [];

    for (const key in gameState.playedCards) {
      for (const key2 in (gameState.playedCards as any)[key]) {
        if (((gameState.playedCards as any)[key] as any)[key2] === 6) {
          if (
            gameState.myDetails.currentHand
              .map((x) => x.toString())
              .includes(key2)
          ) {
            if ((gameState.myDetails as any)[`has${key}`]) {
              legalMoves.push({
                card: parseInt(key2),
                colour: keyToColour(key),
              });
            }
          }
        }
      }
    }

    return legalMoves;
  }

  function slotIsFilled(card: number, colour: number) {
    if (!gameState) return true;
    if (colour === 1) {
      return (gameState.playedCards.Red as any)[card.toString()] !== 6;
    }
    if (colour === 2) {
      return (gameState.playedCards.Blue as any)[card.toString()] !== 6;
    }
    if (colour === 3) {
      return (gameState.playedCards.Yellow as any)[card.toString()] !== 6;
    }
    if (colour === 4) {
      return (gameState.playedCards.Green as any)[card.toString()] !== 6;
    }
  }

  function colourToString(colour: number) {
    switch (colour) {
      case 1:
        return "red";
      case 2:
        return "blue";
      case 3:
        return "yellow";
      case 4:
        return "green";
      default:
        return "";
    }
  }

  function keyToColour(key: string) {
    switch (key) {
      case "Red":
        return 1;
      case "Blue":
        return 2;
      case "Yellow":
        return 3;
      case "Green":
        return 4;
      default:
        return 0;
    }
  }

  function playerHasColour(colour: number) {
    if (gameState) {
      if (colour === 1 && !gameState.myDetails.hasRed) {
        return false;
      }
      if (colour === 2 && !gameState.myDetails.hasBlue) {
        return false;
      }
      if (colour === 3 && !gameState.myDetails.hasYellow) {
        return false;
      }
      if (colour === 4 && !gameState.myDetails.hasGreen) {
        return false;
      }
      return true;
    }
    return false;
  }

  function saveRound() {
    if (signalRConnection && card && colour && myTurn) {
      signalRConnection.send("takeTurn", gameId, { card, colour });
      setCard(0);
      setColour(0);
      setWarningMessage("");
    }
  }

  function onBetChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setBet(parseInt(value));
  }

  function submitBet() {
    if (signalRConnection && bet && myTurn) {
      signalRConnection.send("placeBet", gameId, bet);
      setBet(1);
    }
  }

  function discardCard() {
    if (signalRConnection && card) {
      signalRConnection.send("discardCard", gameId, card);
      setCard(0);
    }
  }

  const gameIdOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key != "Enter") return;
    if (signalRConnection) {
      signalRConnection.send("joinGame", gameId).then(() => {
        setGameIdDisabled(true);
        setConnectedToGame(true);
      });
    }
  };

  const startGame = () => {
    if (signalRConnection) {
      signalRConnection.send("startGame", gameId);
    }
  };

  function hideToast() {
    setShow(false);
    setErrorString("");
  }

  return (
    <Container className="catInTheBox">
      <GameIdForm
        connectedToGame={connectedToGame}
        gameId={gameId}
        setGameId={setGameId}
        gameIdOnKeyUp={gameIdOnKeyUp}
        gameIdDisabled={gameIdDisabled}
        startGame={startGame}
        isStartable={gameState?.isStartable ?? false}
      />
      {gameState && gameState.isStarted ? (
        <Row>
          {errorString ? (
            <ToastContainer position="middle-center">
              <Toast
                bg={"danger"}
                show={show}
                onClick={hideToast}
                onClose={() => hideToast()}
                delay={3000}
                autohide
              >
                <Toast.Header>
                  <strong className="me-auto">CatInTheBox</strong>
                  <small className="text-muted">Just now</small>
                </Toast.Header>
                <Toast.Body>{errorString}</Toast.Body>
              </Toast>
            </ToastContainer>
          ) : null}
          <Col xs={8}>
            <Row className="pt-2">
              <Col>
                <PlayedCards
                  playedCards={gameState.playedCards}
                  isBasicBoard={gameState.isBasicBoard}
                  handleClick={clickBoardSquare}
                />
              </Col>
              <Col xs={2}>
                {gameState.currentLead ? (
                  <>
                    <div
                      className={
                        "hand-card card-colour-" + gameState.currentLead.colour
                      }
                    >
                      {gameState.currentLead.card}
                    </div>
                    <div>Current Lead</div>
                  </>
                ) : (
                  <>
                    <div className="hand-card card-placeholder"></div>
                    <div>Current Lead</div>
                  </>
                )}
              </Col>
            </Row>
            <Row className="pt-2">
              {!gameState.allDiscarded ? (
                <Col>
                  {!gameState.allDiscarded && card ? (
                    <div className="hand-card">{card}</div>
                  ) : (
                    <div className="hand-card card-placeholder">
                      Click card to discard
                    </div>
                  )}
                  <Button
                    className="save-button"
                    onClick={discardCard}
                    disabled={gameState.allDiscarded || !card}
                  >
                    Discard
                  </Button>
                </Col>
              ) : null}
              {gameState.allDiscarded && !gameState.allBet ? (
                <Col>
                  <select
                    onChange={onBetChange}
                    disabled={gameState.allBet || !myTurn}
                  >
                    {betValues.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <Button
                    className="save-button"
                    onClick={submitBet}
                    disabled={
                      gameState.allBet || !gameState.allDiscarded || !myTurn
                    }
                  >
                    Submit Bet
                  </Button>
                </Col>
              ) : null}
              {gameState.allBet && myTurn ? (
                <Col>
                  {colour && card ? (
                    <div className={"hand-card card-colour-" + colour}>
                      {card}
                    </div>
                  ) : (
                    <div className="hand-card card-placeholder">
                      Click Board cell to play
                    </div>
                  )}
                  {warningMessage ? <div>{warningMessage}</div> : null}
                  <Button
                    className="save-button"
                    disabled={!card || !colour}
                    onClick={saveRound}
                  >
                    Submit turn
                  </Button>
                </Col>
              ) : null}
            </Row>
            <Row className="pt-2">
              <Col>
                <PlayerDetails
                  playerDetails={gameState.myDetails}
                  handleClick={clickCard}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={4}>
            {gameState.otherPlayerDetails.map((opd) => (
              <OtherPlayerDetails key={opd.player.id} playerDetails={opd} />
            ))}
          </Col>
        </Row>
      ) : null}
      {gameState && !gameState.isStarted ? (
        <Row>
          <Col>
            <h2>Lobby</h2>
            <p>{gameState.myDetails.player.name}</p>
            {gameState.otherPlayerDetails.map((op) => (
              <p key={op.player.id}>{op.player.name}</p>
            ))}
          </Col>
        </Row>
      ) : null}
    </Container>
  );
}
