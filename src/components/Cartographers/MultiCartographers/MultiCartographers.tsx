"use client";

import { CartographersContext } from "../context";
import DisplayBoard from "../DisplayBoard/DisplayBoard";
import { useContext, useEffect, useRef, useState, KeyboardEvent } from "react";
import "./Cartographers.scss";
import { Board, State, Terrain } from "@/types/cartographers";
import Pallet from "../Pallet/Pallet";
import { Button, Col, Container, Form, FormGroup, FormLabel, Row, Toast, ToastContainer } from "react-bootstrap";
import { UserContext } from "@/app/UserContext";
import { useRouter } from "next/navigation";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import ScoreCards from "../ScoreCards/ScoreCards";
import CurrentCard from "../CurrentCard/CurrentCard";

export default function MultiCartographers() {
  const userData = useContext(UserContext);
  const router = useRouter();
  const connectionRef = useRef<HubConnection | undefined>();

  const gameState = useRef<State | undefined>(undefined);

  const [gameId, setGameId] = useState("");
  const [gameIdDisabled, setGameIdDisabled] = useState(false);
  const [connectedToGame, setConnectedToGame] = useState(false);

  const [isInit, setIsInit] = useState(false);

  const [errorString, setErrorString] = useState("");
  const [show, setShow] = useState(false);

  const [board, setBoard] = useState<Board | undefined>();
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [brushTerrain, setBrushTerrain] = useState(Terrain.Empty);

  useEffect(() => {
    if (userData.isReady && !userData.token) {
      router.push("/");
    }

    if (!isInit) {
      if (userData.isLoggedIn && userData.token && userData.accessTokenExpiry) {
        if (!connectionRef.current) {
          connectionRef.current = new HubConnectionBuilder()
            .withUrl("https://ajj-sig-test.azurewebsites.net/cartographers", {
              withCredentials: false,
              accessTokenFactory: async () => getToken(),
            })
            .build();

          connectionRef.current.on("joinFailed", () => {
            setGameId("");
            setGameIdDisabled(false);
          });

          connectionRef.current.on("state", (state: any) => {
            handleNewState(state);
          });

          connectionRef.current.on("invalidMove", (message: string) => {
            resetAfterInvalidMove(message);
          });

          connectionRef.current.on("gameEnded", () => {
            if (connectionRef.current) {
              connectionRef.current.send("leaveGame", gameId);
            }
            setGameId("");
            setGameIdDisabled(false);
            setConnectedToGame(false);
            gameState.current = undefined;
          });

          connectionRef.current.start().catch((err) => console.log(err));
          setIsInit(true);
        }
      }
    }
  }, [userData, isInit, router, gameId, resetAfterInvalidMove, handleNewState, setIsInit]);

  function handleNewState(state: State) {
    gameState.current = state;
    setBoard(JSON.parse(JSON.stringify(state.player.board)));
    setMoveHistory([]);
    setErrorString("");
  }

  function resetAfterInvalidMove(message: string) {
    if (!gameState.current) return;
    setErrorString(message);
    setBoard(JSON.parse(JSON.stringify(gameState.current.player.board)));
    setMoveHistory([]);
    setShow(true);
  }

  async function getToken() {
    if (userData.accessTokenExpiry < Math.floor(new Date().getTime() / 1000)) {
      const newToken = await userData.refresh();
      return newToken;
    }
    return userData.token ?? "";
  }

  function handlePalletClick(terrain: Terrain) {
    setBrushTerrain(terrain);
  }

  function handleTileClick(i: number, j: number) {
    if (!gameState || !board) return;
    if (board[i][j].terrain === Terrain.Empty) {
      const newBoard: Board = [...board];
      newBoard[i][j].terrain = brushTerrain;
      setBoard(newBoard);
      const newMoveHistory = [...moveHistory];
      newMoveHistory.push(`${i},${j}`);
      setMoveHistory(newMoveHistory);
    }
  }

  function undo() {
    if (!gameState || !board) return;
    const newMoveHistory = [...moveHistory];
    const move = newMoveHistory.pop();
    if (move) {
      const coords = move.split(",").map((x) => parseInt(x));
      const newBoard: Board = [...board];
      newBoard[coords[0]][coords[1]].terrain = Terrain.Empty;
      setBoard(newBoard);
      setMoveHistory(newMoveHistory);
    }
  }

  const gameIdOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key != "Enter") return;
    if (connectionRef.current) {
      connectionRef.current.send("joinGame", gameId).then(() => {
        setGameIdDisabled(true);
        setConnectedToGame(true);
      });
    }
  };

  function saveRound() {
    if (connectionRef.current && gameState.current && board) {
      connectionRef.current.send("takeTurn", gameId, gameState.current.player.boardPlayer.id, board);
    }
  }

  const startGame = () => {
    if (connectionRef.current) {
      connectionRef.current.send("startGame", gameId);
    }
  };

  function hideToast() {
    setShow(false);
    setErrorString("");
  }

  function getSeason(roundNumber: number) {
    switch (roundNumber) {
      case 1:
        return "Spring";
      case 2:
        return "Summer";
      case 3:
        return "Autumn";
      case 4:
        return "Winter";
      default:
        return "";
    }
  }

  return (
    <CartographersContext.Provider value={{ handlePalletClick, handleTileClick }}>
      <Container className="cartographers">
        <Row>
          <Col>
            <Container hidden={connectedToGame}>
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
            <button className="btn btn-primary" onClick={startGame} hidden={gameState.current?.isStarted}>
              Start game
            </button>
          </Col>
        </Row>
        {gameState.current && !gameState.current.isStarted ? (
          <Row>
            <Col>
              <h2>Lobby</h2>
              <p>{gameState.current.player.player.name}</p>
              {gameState.current.otherPlayers.map((op) => (
                <p key={op.player.id}>{op.player.name}</p>
              ))}
            </Col>
          </Row>
        ) : null}
        <Row>
          {errorString ? (
            <ToastContainer position="middle-center">
              <Toast bg={"danger"} show={show} onClick={hideToast} onClose={() => hideToast()} delay={3000} autohide>
                <Toast.Header>
                  <strong className="me-auto">Cascadia</strong>
                  <small className="text-muted">Just now</small>
                </Toast.Header>
                <Toast.Body>{errorString}</Toast.Body>
              </Toast>
            </ToastContainer>
          ) : null}
        </Row>
        {gameState.current && board ? (
          <>
            <Row>
              <Col xs={3}>
                <CurrentCard card={gameState.current.terrainCard} isRuin={gameState.current.isRuinTurn} />
              </Col>
              <Col xs={2}>
                <p>Current Season: {getSeason(gameState.current.roundNumber)}</p>
                <p>Round progress: {gameState.current.roundSum}</p>
              </Col>
              <Col>
                <Pallet
                  selectedTerrain={brushTerrain}
                  allowedTerrainTypes={[Terrain.Forest, Terrain.Field, Terrain.Water, Terrain.Town, Terrain.Monster]}
                />
              </Col>
              <Col xs={1} className="d-flex justify-content-center align-items-center">
                <Button className="mb-4" onClick={saveRound}>
                  Submit turn
                </Button>
              </Col>
            </Row>
            <DisplayBoard board={board} />
            <Row>
              <Col>
                <button className="form-control btn btn-primary" type="submit" onClick={undo}>
                  Undo
                </button>
              </Col>
            </Row>

            <ScoreCards
              a={gameState.current.a}
              b={gameState.current.b}
              c={gameState.current.c}
              d={gameState.current.d}
            />

            <Row className="gx-5">
              <Col xs={12} lg={1} className="border">
                <FormGroup className="mb-2">
                  <Form.Label>Coin Tracker</Form.Label>
                  <Form.Control type="number" readOnly={true} value={gameState.current.player.coinTrack} />
                </FormGroup>
              </Col>
              <RoundScores
                season="Spring"
                firstCardScore={gameState.current.player.scores.oneAScore}
                firstCardLetter="A"
                secondCardScore={gameState.current.player.scores.oneBScore}
                secondCardLetter="B"
                coinScore={gameState.current.player.scores.oneCoinScore}
                monsterScore={gameState.current.player.scores.oneMonsterScore}
              />
              <RoundScores
                season="Summer"
                firstCardScore={gameState.current.player.scores.twoBScore}
                firstCardLetter="B"
                secondCardScore={gameState.current.player.scores.twoCScore}
                secondCardLetter="C"
                coinScore={gameState.current.player.scores.twoCoinScore}
                monsterScore={gameState.current.player.scores.twoMonsterScore}
              />
              <RoundScores
                season="Autumn"
                firstCardScore={gameState.current.player.scores.threeCScore}
                firstCardLetter="C"
                secondCardScore={gameState.current.player.scores.threeDScore}
                secondCardLetter="D"
                coinScore={gameState.current.player.scores.threeCoinScore}
                monsterScore={gameState.current.player.scores.threeMonsterScore}
              />
              <RoundScores
                season="Winter"
                firstCardScore={gameState.current.player.scores.fourDScore}
                firstCardLetter="D"
                secondCardScore={gameState.current.player.scores.fourAScore}
                secondCardLetter="A"
                coinScore={gameState.current.player.scores.fourCoinScore}
                monsterScore={gameState.current.player.scores.fourMonsterScore}
              />
              <Col xs={12} lg={1} className="border">
                <p>Total:</p>
                <p className="display-6">
                  {gameState.current.player.scores.oneAScore +
                    gameState.current.player.scores.oneBScore +
                    gameState.current.player.scores.oneCoinScore +
                    gameState.current.player.scores.oneMonsterScore +
                    gameState.current.player.scores.twoBScore +
                    gameState.current.player.scores.twoCScore +
                    gameState.current.player.scores.twoCoinScore +
                    gameState.current.player.scores.twoMonsterScore +
                    gameState.current.player.scores.threeCScore +
                    gameState.current.player.scores.threeDScore +
                    gameState.current.player.scores.threeCoinScore +
                    gameState.current.player.scores.threeMonsterScore +
                    gameState.current.player.scores.fourDScore +
                    gameState.current.player.scores.fourAScore +
                    gameState.current.player.scores.fourCoinScore +
                    gameState.current.player.scores.fourMonsterScore}
                </p>
              </Col>
            </Row>
          </>
        ) : null}
      </Container>
    </CartographersContext.Provider>
  );
}

function RoundScores({
  season,
  firstCardScore,
  firstCardLetter,
  secondCardScore,
  secondCardLetter,
  coinScore,
  monsterScore,
}: {
  season: string;
  firstCardScore: number;
  firstCardLetter: string;
  secondCardScore: number;
  secondCardLetter: string;
  coinScore: number;
  monsterScore: number;
}) {
  return (
    <Col xs={6} lg={2} className="border">
      <Row>
        <Col>{season}</Col>
      </Row>
      <Row>
        <ScoreControl score={firstCardScore} label={firstCardLetter} />
        <ScoreControl score={secondCardScore} label={secondCardLetter} />
        <Col></Col>
      </Row>
      <Row>
        <ScoreControl score={coinScore} label="Coins" />
        <ScoreControl score={monsterScore} label="Monsters" />
        <Col>Total: {firstCardScore + secondCardScore + coinScore + monsterScore}</Col>
      </Row>
    </Col>
  );
}

function ScoreControl({ score, label }: { score: number; label: string }) {
  return (
    <Col xs={6} lg={4}>
      <FormGroup className="mb-2">
        <Form.Label>{label}</Form.Label>
        <input className="form-control" type="text" readOnly={true} value={score} />
      </FormGroup>
    </Col>
  );
}
