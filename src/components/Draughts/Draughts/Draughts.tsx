"use client";

import { useContext, useEffect, useRef, useState, KeyboardEvent } from "react";
import { Col, Container, FormGroup, FormLabel, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { DraughtsBoard as Board, DraughtsTurn } from "../../../types/draughts";
import DraughtsBoard from "..//DraughtsBoard/DraughtsBoard";
import "./Draughts.scss";
import {
  boardFromString,
  boardState,
  boardToString,
  getMovesForSquare,
  initialDraughtsBoard,
  isPossibleMove,
  makeMove,
} from "../../../services/draughts.service";
import { getSquareCode } from "../../../helpers/squareHelper";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { UserContext } from "@/app/UserContext";

export default function Draughts() {
  const [isInit, setIsInit] = useState(false);
  const userData = useContext(UserContext);
  const router = useRouter();
  const connectionRef = useRef<HubConnection | undefined>();

  const [gameId, setGameId] = useState("");
  const [gameIdDisabled, setGameIdDisabled] = useState(false);
  const [connectedToGame, setConnectedToGame] = useState(false);

  const [myColour, setMyColour] = useState<DraughtsTurn>();
  const [board, setBoard] = useState<Board>(initialDraughtsBoard);
  const [currentTurn, setCurrentTurn] = useState<DraughtsTurn>(2);
  const [selectedSquare, setSelectedSquare] = useState<string | undefined>();
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const boardStatus = boardState(board);

  useEffect(() => {
    if (userData.isReady && !userData.token) {
      router.push("/");
    }

    if (!isInit) {
      if (userData.isLoggedIn && userData.token && userData.accessTokenExpiry) {
        if (!connectionRef.current) {
          connectionRef.current = new HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API}/fen`, {
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
    setCurrentTurn(split[1] === "1" ? 1 : 2);
    setBoard(boardFromString(split[0]));
  };

  function handleClick(i: number, j: number) {
    if (connectionRef.current) {
      if (!boardStatus.isWon && (currentTurn === myColour || myColour === undefined)) {
        if (currentTurn === board[i][j] || currentTurn + 2 === board[i][j]) {
          const moveSquares = getMovesForSquare(board, currentTurn, i, j);
          setSelectedSquare(getSquareCode(i, j));
          setPossibleMoves(moveSquares);
        } else if (selectedSquare && possibleMoves && isPossibleMove(getSquareCode(i, j), possibleMoves)) {
          const { tempBoard, nextTurn } = makeMove(board, i, j, selectedSquare, currentTurn);
          setSelectedSquare(undefined);
          setPossibleMoves([]);
          setBoard(tempBoard);
          setCurrentTurn(nextTurn);
          if (!myColour) {
            setMyColour(currentTurn);
          }

          connectionRef.current.send("takeTurn", gameId, `${boardToString(tempBoard)} ${nextTurn}`);
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
            <Container className="faux-borders-extra-thin">
              <Container className="captured-pieces"></Container>
            </Container>
          </Col>
          <Col className="g-0">
            <Container className="faux-borders-thin">
              <DraughtsBoard
                board={board}
                onClick={(i: number, j: number) => handleClick(i, j)}
                possibleMoves={possibleMoves}
                selectedSquare={selectedSquare}
              />
            </Container>
          </Col>
          <Col className="g-0">
            <Container className="faux-borders-extra-thin">
              <Container className="captured-pieces"></Container>
            </Container>
          </Col>
        </Row>
        <Row className="black-background g-0-top text-center">
          <Col>
            {!boardStatus.isWon ? <div>Current turn: {currentTurn === 2 ? "White" : "Black"}</div> : null}
            {boardStatus.isWon ? <div>{boardStatus.blackCount > 0 ? "Black" : "White"} wins</div> : null}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
