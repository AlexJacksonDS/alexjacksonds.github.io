"use client";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState, KeyboardEvent } from "react";
import { Col, Container, FormGroup, FormLabel, Row } from "react-bootstrap";
import { OtherPlayer, Player, PlayerScore } from "../types/hearts";
import ScoreBoard from "../components/ScoreBoard/ScoreBoard";
import CardPlayArea from "../components/CardPlayArea/CardPlayArea";
import "./Hearts.scss";

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
  let [connection, setConnection] = useState<HubConnection | undefined>(undefined);

  useEffect(() => {
    if (!connection) {
      connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5101/hearts", { withCredentials: false })
        .build();

      connection.on("joinFailed", () => {
        setGameId("");
        setGameIdDisabled(false);
      });

      connection.on("state", (state: any) => {
        handleNewState(state);
      });

      connection.start().catch((err) => console.log(err));
      setConnection(connection);
    }
  });

  const nameOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key != "Enter") return;
    setNameDisabled(true);
  };

  const gameIdOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key != "Enter") return;
    if (connection) {
      connection.send("joinGame", name, gameId).then(() => setGameIdDisabled(true));
    }
  };

  const startGame = () => {
    if (connection) {
      connection.send("startGame", gameId).then(() => setIsStartable(false));
    }
  };

  const selectCard = (card: string) => {
    if (hasPassOccured && selectedCardIsValid(card)) {
      if (connection) {
        connection.send("takeTurn", gameId, card);
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
      if (connection) {
        connection.send("passCards", gameId, cardsToPass);
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
      if (player?.hand.some((c) => c.charAt(1) === leadSuit) && card.charAt(1) !== leadSuit) {
        return false;
      }
    } else {
      // Must not lead hearts unless forced
      if (!isHeartsBroken && card.charAt(1) === "H" && player?.hand.some((c) => c.charAt(1) !== "H")) {
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
                  onInput={(e) => setGameId((e.target as HTMLInputElement).value)}
                  onKeyUp={(e) => gameIdOnKeyUp(e)}
                  disabled={gameIdDisabled}
                  placeholder="Enter to submit"
                />
              </FormGroup>
            </Container>
            <button className="btn btn-primary" onClick={startGame} hidden={!isStartable}>
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
          <Col className="pass-display button-visible">{connectedToGame ? getPassDirectionString() : ""}</Col>
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
                cardsToHighlight={hasPassOccured && currentPlayer === player.id ? validCards() : cardsToPass}
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
    console.log(state);
    const myPlayerOrder: number = state.player.playerOrder;
    if (state.otherPlayerDetails.length === 2) {
      const otherPlayerPositions = otherPlayersThree.get(myPlayerOrder);

      if (otherPlayerPositions) {
        const playerOnLeft = state.otherPlayerDetails.find((p: any) => p.playerOrder === otherPlayerPositions[0]);
        setLeftPlayer(playerOnLeft);
        const playerOnTop = state.otherPlayerDetails.find((p: any) => p.playerOrder === otherPlayerPositions[1]);
        setTopPlayer(playerOnTop);
      }
    } else if (state.otherPlayerDetails.length === 3) {
      const otherPlayerPositions = otherPlayersFour.get(myPlayerOrder);
      if (otherPlayerPositions) {
        const playerOnLeft = state.otherPlayerDetails.find((p: any) => p.playerOrder === otherPlayerPositions[0]);
        setLeftPlayer(playerOnLeft);
        const playerOnTop = state.otherPlayerDetails.find((p: any) => p.playerOrder === otherPlayerPositions[1]);
        setTopPlayer(playerOnTop);

        const playerOnRight = state.otherPlayerDetails.find((p: any) => p.playerOrder === otherPlayerPositions[2]);
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

const otherPlayersThree = new Map<number, number[]>();
otherPlayersThree.set(1, [2, 3]);
otherPlayersThree.set(2, [3, 1]);
otherPlayersThree.set(3, [1, 2]);

const otherPlayersFour = new Map<number, number[]>();
otherPlayersFour.set(1, [2, 3, 4]);
otherPlayersFour.set(2, [3, 4, 1]);
otherPlayersFour.set(3, [4, 1, 2]);
otherPlayersFour.set(4, [1, 2, 3]);
