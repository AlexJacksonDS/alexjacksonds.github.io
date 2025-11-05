"use client";

import { useState, KeyboardEvent } from "react";
import { Col, Container, FormGroup, FormLabel, Row } from "react-bootstrap";
import { OtherPlayer, Player, PlayerScore } from "../../types/hearts";
import ScoreBoard from "../../components/Hearts/ScoreBoard/ScoreBoard";
import CardPlayArea from "../../components/Hearts/CardPlayArea/CardPlayArea";
import "./Hearts.scss";
import { otherPlayersFour, otherPlayersThree } from "@/helpers/nextPlayerMaps";
import useSignalR from "@/hooks/useSignalR";

export default function Hearts() {
  const [name, setName] = useState("");
  const [nameDisabled, setNameDisabled] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gameIdDisabled, setGameIdDisabled] = useState(false);
  const [connectedToGame, setConnectedToGame] = useState(false);
  const [isStartable, setIsStartable] = useState(false);
  const [isHeartsBroken, setIsHeartsBroken] = useState(false);
  const [hasPassOccured, setHasPassOccured] = useState(false);
  const [passDirection, setPassDirection] = useState("");
  const [cardsToPass, setCardsToPass] = useState<string[]>([]);
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [currentLead, setCurrentLead] = useState("");
  const [player, setPlayer] = useState<Player>();
  const [leftPlayer, setLeftPlayer] = useState<OtherPlayer>();
  const [topPlayer, setTopPlayer] = useState<OtherPlayer>();
  const [rightPlayer, setRightPlayer] = useState<OtherPlayer>();

  const signalRConnection = useSignalR("hearts", [
    ["joinFailed", joinFailed],
    ["state", handleNewState],
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
    setIsStartable(false);
    setIsHeartsBroken(false);
    setHasPassOccured(false);
    setPassDirection("");
    setCardsToPass([]);
    setScores([]);
    setCurrentPlayer("");
    setCurrentLead("");
    setPlayer(undefined);
    setLeftPlayer(undefined);
    setTopPlayer(undefined);
    setRightPlayer(undefined);
  }

  const nameOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key != "Enter") return;
    setNameDisabled(true);
  };

  const gameIdOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key != "Enter") return;
    if (signalRConnection) {
      signalRConnection
        .send("joinGame", name, gameId)
        .then(() => setGameIdDisabled(true));
    }
  };

  const startGame = () => {
    if (signalRConnection) {
      signalRConnection
        .send("startGame", gameId)
        .then(() => setIsStartable(false));
    }
  };

  const selectCard = (card: string) => {
    if (hasPassOccured && selectedCardIsValid(card)) {
      if (signalRConnection) {
        signalRConnection.send("takeTurn", gameId, card);
      }
      return;
    }
    if (cardsToPass.includes(card)) {
      setCardsToPass((oldArray) => [...oldArray.filter((c) => c !== card)]);
      return;
    }
    if (cardsToPass.length !== 3) {
      if (!cardsToPass.includes(card)) {
        setCardsToPass((oldArray) => [...oldArray, card]);
      }
    }
  };

  const passCards = () => {
    if (!hasPassOccured && cardsToPass.length === 3) {
      if (signalRConnection) {
        signalRConnection.send("passCards", gameId, cardsToPass);
        setCardsToPass([]);
      }
    }
  };

  const validCards = (): string[] => {
    const validCards: string[] = [];
    if (player) {
      for (const card of player.hand) {
        if (selectedCardIsValid(card)) {
          validCards.push(card);
        }
      }
    }

    return validCards;
  };

  const selectedCardIsValid = (card: string): boolean => {
    // Must lead with 2 of clubs
    if (player?.hand.includes("2C") && card !== "2C") {
      return false;
    }

    if (currentLead) {
      const leadSuit = currentLead.charAt(1);

      // Must follow suit
      if (
        player?.hand.some((c) => c.charAt(1) === leadSuit) &&
        card.charAt(1) !== leadSuit
      ) {
        return false;
      }

      // Not points on the first trick
      if (currentLead === "2C" && (card === "QS" || card.charAt(1) === "H")) {
        return false;
      }
    } else {
      // Must not lead hearts unless forced
      if (
        !isHeartsBroken &&
        card.charAt(1) === "H" &&
        player?.hand.some((c) => c.charAt(1) !== "H")
      ) {
        return false;
      }
    }

    return true;
  };

  return (
    <main>
      <Container>
        <Row>
          <Col>
            <Container hidden={connectedToGame}>
              <FormGroup>
                <FormLabel>Username: </FormLabel>
                <input
                  className="form-control"
                  value={name}
                  onInput={(e) => setName((e.target as HTMLInputElement).value)}
                  onKeyUp={(e) => nameOnKeyUp(e)}
                  disabled={nameDisabled}
                  placeholder="Enter to submit"
                />
              </FormGroup>
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
              hidden={!isStartable}
            >
              Start game
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Container hidden={!connectedToGame}>
              <ScoreBoard scores={scores} />
            </Container>
          </Col>
        </Row>
        <Row className="pass-details">
          <Col className="pass-display button-visible">
            {connectedToGame ? getPassDirectionString() : ""}
          </Col>
          <Col className="pass-display button">
            <button
              className="btn btn-primary"
              onClick={passCards}
              disabled={hasPassOccured || cardsToPass.length !== 3}
            >
              Pass Cards
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            {connectedToGame && player && leftPlayer && topPlayer ? (
              <CardPlayArea
                currentPlayerId={currentPlayer}
                cardsToHighlight={
                  hasPassOccured && currentPlayer === player.id
                    ? validCards()
                    : cardsToPass
                }
                player={player}
                leftPlayer={leftPlayer}
                topPlayer={topPlayer}
                rightPlayer={rightPlayer}
                selectCard={selectCard}
              />
            ) : null}
          </Col>
        </Row>
      </Container>
    </main>
  );

  function getPassDirectionString(): string {
    if (hasPassOccured) {
      switch (passDirection) {
        case "Left":
        case "Right":
        case "Opposite":
          return `Cards were passed ${passDirection}`;
        case "None":
          return "Cards were not passed";
      }
    } else {
      switch (passDirection) {
        case "Left":
        case "Right":
        case "Opposite":
          return `Select cards to pass ${passDirection}`;
        case "None":
          return "Cards were not passed";
      }
    }
    return "";
  }

  function handleNewState(state: any) {
    const myPlayerOrder: number = state.player.playerOrder;
    if (state.otherPlayerDetails.length === 2) {
      const otherPlayerPositions = otherPlayersThree.get(myPlayerOrder);

      if (otherPlayerPositions) {
        const playerOnLeft = state.otherPlayerDetails.find(
          (p: any) => p.playerOrder === otherPlayerPositions[0]
        );
        setLeftPlayer(playerOnLeft);
        const playerOnTop = state.otherPlayerDetails.find(
          (p: any) => p.playerOrder === otherPlayerPositions[1]
        );
        setTopPlayer(playerOnTop);
      }
    } else if (state.otherPlayerDetails.length === 3) {
      const otherPlayerPositions = otherPlayersFour.get(myPlayerOrder);
      if (otherPlayerPositions) {
        const playerOnLeft = state.otherPlayerDetails.find(
          (p: any) => p.playerOrder === otherPlayerPositions[0]
        );
        setLeftPlayer(playerOnLeft);
        const playerOnTop = state.otherPlayerDetails.find(
          (p: any) => p.playerOrder === otherPlayerPositions[1]
        );
        setTopPlayer(playerOnTop);

        const playerOnRight = state.otherPlayerDetails.find(
          (p: any) => p.playerOrder === otherPlayerPositions[2]
        );
        setRightPlayer(playerOnRight);
      }
    }
    setPlayer(state.player);
    setCurrentPlayer(state.currentPlayer);
    setCurrentLead(state.currentLead);
    setIsStartable(state.isStartable);
    setHasPassOccured(state.hasPassOccured);
    setPassDirection(state.passDirection);
    setIsHeartsBroken(state.isHeartsBroken);
    setScores(state.playerScores);
    setConnectedToGame(true);
  }
}
