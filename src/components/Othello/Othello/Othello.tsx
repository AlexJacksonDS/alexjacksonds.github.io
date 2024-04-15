"use client";

import { useContext, useEffect, useRef, useState, KeyboardEvent } from "react";
import { Col, Container, FormGroup, FormLabel, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import OthelloBoard from "..//OthelloBoard/OthelloBoard";
import { isArrayInArray } from "../../../helpers/arrayHelper";
import {
  boardFromString,
  boardState,
  boardToString,
  getPossibleMoves,
  initialOthelloBoard,
  performMove,
} from "../../../services/othello.service";
import { OthelloBoard as Board, OthelloTurn } from "../../../types/othello";
import { UserContext } from "@/app/UserContext";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export default function Othello() {
  const [isInit, setIsInit] = useState(false);
  const userData = useContext(UserContext);
  const router = useRouter();
  const connectionRef = useRef<HubConnection | undefined>();

  const [gameId, setGameId] = useState("");
  const [gameIdDisabled, setGameIdDisabled] = useState(false);
  const [connectedToGame, setConnectedToGame] = useState(false);

  const [myColour, setMyColour] = useState<OthelloTurn>();
  const [board, setBoard] = useState<Board>(initialOthelloBoard);
  const [currentTurn, setCurrentTurn] = useState<OthelloTurn>(1);
  const boardStatus = boardState(board);

  useEffect(() => {
    if (userData.isReady && !userData.token) {
      router.push("/");
    }

    if (!isInit) {
      if (userData.isLoggedIn && userData.token && userData.accessTokenExpiry) {
        if (!connectionRef.current) {
          connectionRef.current = new HubConnectionBuilder()
            .withUrl("https://ajj-sig-test.azurewebsites.net/fen", {
              withCredentials: false,
              accessTokenFactory: async () => getToken(),
            })
            .build();

          connectionRef.current.on("joinFailed", () => {
            setGameId("");
            setGameIdDisabled(false);
          });

          connectionRef.current.on("fen", (fen: string) => {
            handleFen(fen);
          });

          connectionRef.current.start().catch((err) => console.log(err));
          setIsInit(true);
        }
      }
    }
  }, [userData, isInit, router, gameId]);

  async function getToken() {
    if (userData.accessTokenExpiry < Math.floor(new Date().getTime() / 1000)) {
      const newToken = await userData.refresh();
      return newToken;
    }
    return userData.token ?? "";
  }

  const handleFen = (fen: string) => {
    const split = fen.split(" ");
    setCurrentTurn(split[1] === "1" ? 2 : 1);
    setMyColour(split[1] === "1" ? 2 : 1);
    setBoard(boardFromString(split[0]));
  };

  function handleClick(i: number, j: number) {
    if (connectionRef.current) {
      if (!boardStatus.isBoardFull && (currentTurn === myColour || myColour === undefined)) {
        var possibleMoves = getPossibleMoves(board, currentTurn);
        if (isArrayInArray(possibleMoves, [i, j])) {
          const tempBoard = performMove(board, i, j, currentTurn);
          setBoard(tempBoard);
          setCurrentTurn(
            getPossibleMoves(board, currentTurn === 1 ? 2 : 1).length > 0 ? (currentTurn === 1 ? 2 : 1) : currentTurn
          );
          setMyColour(currentTurn);

          connectionRef.current.send("takeTurn", gameId, `${boardToString(tempBoard)} ${currentTurn}`);
        }
      }
    }
  }

  const gameIdOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key != "Enter") return;
    if (connectionRef.current) {
      connectionRef.current.send("joinGame", gameId, boardToString(board)).then(() => {
        setGameIdDisabled(true);
        setConnectedToGame(true);
      });
    }
  };

  return (
    <main>
      <Container>
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
          </Col>
        </Row>
        <Row className="g-0-bottom">
          <Col className="g-0">
            <Container className="faux-borders-thin">
              <OthelloBoard
                board={board}
                onClick={(i: number, j: number) => handleClick(i, j)}
                possibleMoves={getPossibleMoves(board, currentTurn)}
              />
            </Container>
          </Col>
        </Row>
        <Row className="black-background g-0-top text-center">
          <Col>
            {!boardStatus.isBoardFull ? <div>Current turn: {currentTurn === 1 ? "White" : "Black"}</div> : null}
            <div>White score: {boardStatus.whiteScore}</div>
            <div>Black score: {boardStatus.blackScore}</div>
            {boardStatus.isBoardFull ? (
              boardStatus.whiteScore > boardStatus.blackScore ? (
                <div>White wins</div>
              ) : boardStatus.whiteScore === boardStatus.blackScore ? (
                <div>Draw</div>
              ) : (
                <div>Black wins</div>
              )
            ) : null}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
