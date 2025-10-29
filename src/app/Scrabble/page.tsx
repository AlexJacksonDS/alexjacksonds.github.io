"use client";

import { useState, KeyboardEvent, useRef } from "react";
import { Button, Col, Container, FormGroup, FormLabel, Row, Toast, ToastContainer } from "react-bootstrap";
import { OtherPlayer, Player, PlayerScore, Tile } from "../../types/scrabble";
import ScoreBoard from "../../components/Hearts/ScoreBoard/ScoreBoard";
import "./Scrabble.scss";
import useSignalR from "@/hooks/useSignalR";
import { Square } from "@/types/scrabble";
import Board from "@/components/Scrabble/Board/Board";
import ScrabblePlayer from "@/components/Scrabble/ScrabblePlayer/ScrabblePlayer";
import ScrabbleOtherPlayer from "@/components/Scrabble/OtherPlayer/OtherPlayer";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { DropResult } from "@/types/railRoadInk";

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

export default function Scrabble() {
  const [name, setName] = useState("");
  const [nameDisabled, setNameDisabled] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gameIdDisabled, setGameIdDisabled] = useState(false);
  const [connectedToGame, setConnectedToGame] = useState(false);
  const [isStartable, setIsStartable] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [clicks, setClicks] = useState(0);
  const [player, setPlayer] = useState<Player>();
  const [leftPlayer, setLeftPlayer] = useState<OtherPlayer>();
  const [topPlayer, setTopPlayer] = useState<OtherPlayer>();
  const [rightPlayer, setRightPlayer] = useState<OtherPlayer>();
  const gameState = useRef<any | undefined>(undefined);
  const [errorString, setErrorString] = useState("");
  const [show, setShow] = useState(false);
  const [toSubmit, setToSubmit] = useState<{ coords: number[]; tile: Tile }[]>([]);
  const board = useRef<Square[][] | undefined>();
  const [stateBoard, setStateBoard] = useState<Square[][] | undefined>();
  const [showLetterInput, setShowLetterInput] = useState(false);
  const [wildLetter, setWildLetter] = useState("");

  const signalRConnection = useSignalR("scrabble", [
    ["joinFailed", joinFailed],
    ["state", handleNewState],
    ["invalidMove", resetAfterInvalidMove],
    ["gameEnded", gameEnded],
  ]);

  function joinFailed() {
    setGameId("");
    setGameIdDisabled(false);
  }

  function handleNewState(state: any) {
    const myPlayerOrder: number = state.player.playerOrder;
    if (state.otherPlayerDetails.length === 1) {
      const otherPlayerPositions = otherPlayersTwo.get(myPlayerOrder);

      if (otherPlayerPositions) {
        const playerOnTop = state.otherPlayerDetails.find((p: any) => p.playerOrder === otherPlayerPositions[0]);
        setTopPlayer(playerOnTop);
      }
    } else if (state.otherPlayerDetails.length === 2) {
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
    board.current = state.board;
    setStateBoard(state.board);
    setPlayer(state.player);
    setCurrentPlayer(state.currentPlayer);
    setIsStartable(state.isStartable);
    setScores(state.playerScores);
    setConnectedToGame(true);
    setIsEnded(state.isEnded);
    setToSubmit([]);
  }

  function resetAfterInvalidMove(message: string) {
    setShow(true);
    setErrorString(message);
  }

  function gameEnded() {
    if (signalRConnection) {
      signalRConnection.send("leaveGame", gameId);
    }
    setGameId("");
    setGameIdDisabled(false);
    setConnectedToGame(false);
    gameState.current = undefined;
  }

  function nameOnKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key != "Enter") return;
    setNameDisabled(true);
  }

  function gameIdOnKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key != "Enter") return;
    if (signalRConnection && name && gameId) {
      signalRConnection.send("joinGame", name, gameId).then(() => {
        setGameIdDisabled(true);
        setConnectedToGame(true);
      });
    }
  }

  function setPlayedWildLetter() {
    if (board.current) {
      if (!/[A-Za-z]/.test(wildLetter)) return;
      var toSubmitCopy = [...toSubmit];
      var playedTile = toSubmitCopy.filter((x) => x.tile.actualLetter === "?")[0];
      toSubmitCopy.splice(toSubmitCopy.indexOf(playedTile), 1);
      toSubmitCopy.push({
        ...playedTile,
        tile: {
          ...playedTile.tile,
          actualLetter: wildLetter.toUpperCase(),
        },
      });
      board.current[playedTile.coords[0]][playedTile.coords[1]].tile!.actualLetter = wildLetter.toUpperCase();
      setShowLetterInput(false);
    }
  }

  function startGame() {
    if (signalRConnection) {
      signalRConnection.send("startGame", gameId);
    }
  }

  function handleTileMove(dropResult: DropResult, item: { tile: Tile }) {
    if (board.current && player) {
      const i = parseInt(dropResult.id.split(",")[0]);
      const j = parseInt(dropResult.id.split(",")[1]);
      board.current[i][j].tile = item.tile;
      player.hand.splice(player.hand.indexOf(item.tile), 1);
      setClicks(clicks + 1);
      setPlayer(player);
      var toSubmitCopy = [...toSubmit];
      toSubmitCopy.push({ coords: [i, j], tile: item.tile });
      setToSubmit(toSubmitCopy);
      if (item.tile.actualLetter === "?") {
        setShowLetterInput(true);
      }
    }
  }

  function takeTurn() {
    if (signalRConnection && toSubmit.length > 0) {
      signalRConnection.send("takeTurn", gameId, { newTiles: toSubmit });
    }
  }

  function resetTurn() {
    if (board.current && player) {
      for (var ts of toSubmit) {
        board.current[ts.coords[0]][ts.coords[1]].tile = undefined;
        player.hand.push(ts.tile);
      }
      setClicks(clicks + 1);
      setPlayer(player);
      setToSubmit([]);
      setShow(false);
      setErrorString("");
    }
  }

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
        <Row>
          <Col>
            {connectedToGame && player && topPlayer && board.current ? (
              <DndProvider options={HTML5toTouch}>
                <Board {...{ board: board.current }} />
                {currentPlayer && !isEnded ? (
                  <>
                    <Row>
                      <ScrabblePlayer
                        player={player}
                        isTurn={player.id === currentPlayer}
                        handleTileMove={handleTileMove}
                      />
                    </Row>
                    <Row>
                      <Container className="player-buttons">
                        <Row>
                          <Col>
                            <Button onClick={resetTurn}>Reset Turn</Button>
                          </Col>
                          <Col>
                            <Button onClick={takeTurn}>Submit Word</Button>
                          </Col>
                        </Row>
                      </Container>
                    </Row>
                    <Row>
                      {leftPlayer ? (
                        <Col>
                          <ScrabbleOtherPlayer player={leftPlayer} />
                        </Col>
                      ) : undefined}
                      <Col>
                        <ScrabbleOtherPlayer player={topPlayer} />
                      </Col>
                      {rightPlayer ? (
                        <Col>
                          <ScrabbleOtherPlayer player={rightPlayer} />
                        </Col>
                      ) : undefined}
                    </Row>
                  </>
                ) : undefined}
              </DndProvider>
            ) : undefined}
          </Col>
        </Row>
        {errorString ? (
          <ToastContainer position="middle-center">
            <Toast bg={"danger"} show={show} onClose={() => resetTurn()} delay={3000} autohide>
              <Toast.Header>
                <strong className="me-auto">Scrabble</strong>
                <small className="text-muted">Just now</small>
              </Toast.Header>
              <Toast.Body>{errorString}</Toast.Body>
            </Toast>
          </ToastContainer>
        ) : null}

        <ToastContainer position="middle-center">
          <Toast bg={"warning"} show={showLetterInput}>
            <Toast.Header>
              <strong className="me-auto">Scrabble</strong>
              <small className="text-muted">Just now</small>
            </Toast.Header>
            <Toast.Body>
              <FormGroup>
                <FormLabel>Wildcard Letter: </FormLabel>
                <input
                  className="form-control"
                  value={wildLetter}
                  onInput={(e) => setWildLetter((e.target as HTMLInputElement).value)}
                />
                <Button onClick={setPlayedWildLetter}>Submit</Button>
              </FormGroup>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </main>
  );
}
