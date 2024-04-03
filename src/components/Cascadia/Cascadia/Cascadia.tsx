"use client";

import {
  AnimalTypes,
  ClientGameState,
  DropResult,
  GamePlayedTile,
  GameTile,
  OfferRow,
  Orientation,
  TurnTile,
  TurnToken,
} from "@/types/cascadia";
import PlayZone from "../PlayZone/PlayZone";
import OfferRowDisplay from "../OfferRow/OfferRow";
import { useEffect, useRef, useState, KeyboardEvent, useContext } from "react";
import { Button, Col, Container, FormGroup, FormLabel, Row } from "react-bootstrap";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { DndProvider } from "react-dnd-multi-backend";
import _ from "lodash";
import "./Cascadia.scss";
import { DragHandlerContext } from "../context";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { UserContext } from "@/app/UserContext";
import { useRouter } from "next/navigation";

export default function Cascadia() {
  const userData = useContext(UserContext);
  const router = useRouter();
  const connectionRef = useRef<HubConnection | undefined>();

  const [gameId, setGameId] = useState("");
  const [gameIdDisabled, setGameIdDisabled] = useState(false);
  const [connectedToGame, setConnectedToGame] = useState(false);

  const [turnTile, setTurnTile] = useState<TurnTile | undefined>(undefined);
  const [turnToken, setTurnToken] = useState<TurnToken | undefined>(undefined);
  const [isInit, setIsInit] = useState(false);
  const [offerRow, setOfferRow] = useState<OfferRow>({ tiles: [], animals: [] });
  const [gameState, setGameState] = useState<ClientGameState | undefined>(undefined);
  const [playedTiles, setPlayedTiles] = useState<GamePlayedTile[]>(gameState?.myDetails.playedTiles ?? []);
  const [myTurn, setMyTurn] = useState(false);
  const [errorString, setErrorString] = useState("");

  useEffect(() => {
    if (!userData.token && isInit) {
      router.push("/");
    }

    if (!isInit) {
      if (userData.isLoggedIn && userData.token && userData.accessTokenExpiry) {
        if (!connectionRef.current) {
          connectionRef.current = new HubConnectionBuilder()
            .withUrl("http://localhost:5101/cascadia", {
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

          connectionRef.current.on("invalidMove", (message: string, state: any) => {
            resetAfterInvalidMove(message, state);
          });

          connectionRef.current.on("gameEnded", () => {
            if (connectionRef.current) {
              connectionRef.current.send("leaveGame", gameId);
            }
            setGameId("");
            setGameIdDisabled(false);
            setConnectedToGame(false);
            setTurnTile(undefined);
            setTurnToken(undefined);
            setGameState(undefined);
            setMyTurn(false);
          });

          connectionRef.current.start().catch((err) => console.log(err));
          setIsInit(true);
        }
      }
    }
  }, [userData, isInit, router]);

  async function getToken() {
    if (userData.accessTokenExpiry < Math.floor(new Date().getTime() / 1000)) {
      const newToken = await userData.refresh();
      return newToken;
    }
    return userData.token ?? "";
  }

  function resetAfterInvalidMove(message: string, state: ClientGameState) {
    handleNewState(state);
    setTurnTile(undefined);
    setTurnToken(undefined);
    setErrorString(message);
  }

  function handleNewState(state: ClientGameState) {
    setMyTurn(state.currentPlayer === state.myDetails.player.id);
    setPlayedTiles(state.myDetails.playedTiles);
    setOfferRow({ tiles: [...state.offerTiles], animals: [...state.offerTokens] });
    setGameState(state);
    setErrorString("");
  }

  const handleDragTile = (dropResult: DropResult, item: { id: string; tile: GamePlayedTile }) => {
    if (!gameState) return;

    if (turnToken && turnTile && turnTile.row === turnToken.row && turnToken.column === turnTile.column) {
      setTurnToken({
        row: dropResult.row,
        column: dropResult.column,
        tokenIndex: turnToken.tokenIndex,
        animal: turnToken.animal,
      });
    }

    setTurnTile({
      row: dropResult.row,
      column: dropResult.column,
      tileIndex: parseInt(item.id),
      tile: item.tile.tile,
    });

    const offerRowTiles: (GameTile | undefined)[] = [...gameState.offerTiles];
    offerRowTiles[parseInt(item.id)] = undefined;
    setOfferRow({
      tiles: offerRowTiles,
      animals: offerRow.animals,
    });
  };

  const handleDragToken = (dropResult: DropResult, item: { id: string; animal: AnimalTypes }) => {
    if (!gameState) return;

    setTurnToken({
      row: dropResult.row,
      column: dropResult.column,
      tokenIndex: parseInt(item.id),
      animal: item.animal,
    });
    const offerRowTokens: (AnimalTypes | undefined)[] = [...gameState.offerTokens];
    offerRowTokens[parseInt(item.id)] = undefined;
    setOfferRow({
      tiles: offerRow.tiles,
      animals: offerRowTokens,
    });
  };

  const handleTileClick = (row: number, column: number, tile?: GamePlayedTile) => {
    if (!tile) return;

    if (turnTile && row === turnTile.row && column == turnTile.column) {
      setTurnTile({
        row: turnTile.row,
        column: turnTile.column,
        tileIndex: turnTile.tileIndex,
        tile: { ...turnTile.tile, orientation: getNextOrientation(tile.tile.orientation) },
      });
    }
  };

  function saveRound() {
    if (connectionRef.current && turnTile && turnToken) {
      connectionRef.current.send("takeTurn", gameId, { turnTile, turnToken, requiresNatureToken: false });
      setTurnTile(undefined);
      setTurnToken(undefined);
    }
  }

  function freeFlush() {
    if (connectionRef.current) {
      connectionRef.current.send("freeFlush", gameId);
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

  const startGame = () => {
    if (connectionRef.current) {
      connectionRef.current.send("startGame", gameId);
    }
  };

  const displayFreeFlushButton = myTurn && Object.values(_.countBy(gameState?.offerTokens)).includes(3);

  const displaySaveButton = myTurn && turnTile && turnToken;

  return isInit ? (
    <Container className="cascadia">
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
          <button className="btn btn-primary" onClick={startGame} hidden={!gameState?.isStartable}>
            Start game
          </button>
        </Col>
      </Row>
      {gameState ? (
        <DndProvider options={HTML5toTouch}>
          <DragHandlerContext.Provider value={{ handleDragTile, handleDragToken, handleTileClick, isMyTurn: myTurn }}>
            <Row>
              <Col xl={4}>
                <OfferRowDisplay offerRow={offerRow} />
              </Col>
            </Row>
            <Row>
              {myTurn ? (
                <p>It's your turn</p>
              ) : (
                <p>
                  It's {gameState.otherPlayers.find((op) => op.player.id === gameState.currentPlayer)?.player.name}'s
                  turn
                </p>
              )}
              {displaySaveButton ? (
                <FormGroup>
                  <Button className="save-button mx-auto" onClick={saveRound}>
                    Save Round
                  </Button>
                </FormGroup>
              ) : null}
              {displayFreeFlushButton ? (
                <FormGroup>
                  <Button className="save-button mx-auto" onClick={freeFlush}>
                    Free Triple Flush
                  </Button>
                </FormGroup>
              ) : null}
              <Container>
                {"\uD83C\uDF32"} : {gameState.myDetails.tokens}
              </Container>
              {errorString ? <Container>{errorString}</Container> : null}
            </Row>
            <Row>
              <Col>
                <PlayZone
                  playedTiles={playedTiles}
                  playedTokens={gameState.myDetails.playedTokens}
                  turnTile={turnTile}
                  turnToken={turnToken}
                />
              </Col>
            </Row>
          </DragHandlerContext.Provider>
        </DndProvider>
      ) : null}
    </Container>
  ) : null;
}

function getNextOrientation(orientation: Orientation) {
  switch (orientation) {
    case Orientation.TOP:
      return Orientation.TOPRIGHT;
    case Orientation.TOPRIGHT:
      return Orientation.BOTTOMRIGHT;
    case Orientation.BOTTOMRIGHT:
      return Orientation.BOTTOM;
    case Orientation.BOTTOM:
      return Orientation.BOTTOMLEFT;
    case Orientation.BOTTOMLEFT:
      return Orientation.TOPLEFT;
    case Orientation.TOPLEFT:
      return Orientation.TOP;
  }
}
