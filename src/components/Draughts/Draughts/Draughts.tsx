"use client";

import { useState, KeyboardEvent } from "react";
import { Col, Container, FormGroup, FormLabel, Row } from "react-bootstrap";
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
import useSignalR from "@/hooks/useSignalR";
import GameIdForm from "@/components/GameIdForm/GameIdForm";

export default function Draughts() {
  const [gameId, setGameId] = useState("");
  const [gameIdDisabled, setGameIdDisabled] = useState(false);
  const [connectedToGame, setConnectedToGame] = useState(false);

  const [myColour, setMyColour] = useState<DraughtsTurn>();
  const [board, setBoard] = useState<Board>(initialDraughtsBoard);
  const [currentTurn, setCurrentTurn] = useState<DraughtsTurn>(2);
  const [selectedSquare, setSelectedSquare] = useState<string | undefined>();
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const boardStatus = boardState(board);

  const signalRConnection = useSignalR("fen", [
    ["joinFailed", joinFailed],
    ["fen", handleFen],
  ]);

  function joinFailed() {
    setGameId("");
    setGameIdDisabled(false);
  }

  function handleFen(fen: string) {
    const split = fen.split(" ");
    setCurrentTurn(split[1] === "1" ? 1 : 2);
    setBoard(boardFromString(split[0]));
  }

  function handleClick(i: number, j: number) {
    if (signalRConnection) {
      if (
        !boardStatus.isWon &&
        (currentTurn === myColour || myColour === undefined)
      ) {
        if (currentTurn === board[i][j] || currentTurn + 2 === board[i][j]) {
          const moveSquares = getMovesForSquare(board, currentTurn, i, j);
          setSelectedSquare(getSquareCode(i, j));
          setPossibleMoves(moveSquares);
        } else if (
          selectedSquare &&
          possibleMoves &&
          isPossibleMove(getSquareCode(i, j), possibleMoves)
        ) {
          const { tempBoard, nextTurn } = makeMove(
            board,
            i,
            j,
            selectedSquare,
            currentTurn
          );
          setSelectedSquare(undefined);
          setPossibleMoves([]);
          setBoard(tempBoard);
          setCurrentTurn(nextTurn);
          if (!myColour) {
            setMyColour(currentTurn);
          }

          signalRConnection.send(
            "takeTurn",
            gameId,
            `${boardToString(tempBoard)} ${nextTurn}`
          );
        }
      }
    }
  }

  const gameIdOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key != "Enter") return;
    if (signalRConnection) {
      signalRConnection
        .send("joinGame", gameId, boardToString(board))
        .then(() => {
          setGameIdDisabled(true);
          setConnectedToGame(true);
        });
    }
  };

  return (
    <main>
      <Container>
        <GameIdForm
          connectedToGame={connectedToGame}
          gameId={gameId}
          setGameId={setGameId}
          gameIdOnKeyUp={gameIdOnKeyUp}
          gameIdDisabled={gameIdDisabled}
        />
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
            {!boardStatus.isWon ? (
              <div>Current turn: {currentTurn === 2 ? "White" : "Black"}</div>
            ) : null}
            {boardStatus.isWon ? (
              <div>{boardStatus.blackCount > 0 ? "Black" : "White"} wins</div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
