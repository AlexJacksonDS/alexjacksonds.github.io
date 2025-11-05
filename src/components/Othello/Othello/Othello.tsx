"use client";

import { useState, KeyboardEvent } from "react";
import { Col, Container, FormGroup, FormLabel, Row } from "react-bootstrap";
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
import useSignalR from "@/hooks/useSignalR";

export default function Othello() {
  const [gameId, setGameId] = useState("");
  const [gameIdDisabled, setGameIdDisabled] = useState(false);
  const [connectedToGame, setConnectedToGame] = useState(false);

  const [myColour, setMyColour] = useState<OthelloTurn>();
  const [board, setBoard] = useState<Board>(initialOthelloBoard);
  const [currentTurn, setCurrentTurn] = useState<OthelloTurn>(1);
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
    setCurrentTurn(split[1] === "1" ? 2 : 1);
    setMyColour(split[1] === "1" ? 2 : 1);
    setBoard(boardFromString(split[0]));
  }

  function handleClick(i: number, j: number) {
    if (signalRConnection) {
      if (
        !boardStatus.isBoardFull &&
        (currentTurn === myColour || myColour === undefined)
      ) {
        var possibleMoves = getPossibleMoves(board, currentTurn);
        if (isArrayInArray(possibleMoves, [i, j])) {
          const tempBoard = performMove(board, i, j, currentTurn);
          setBoard(tempBoard);
          setCurrentTurn(
            getPossibleMoves(board, currentTurn === 1 ? 2 : 1).length > 0
              ? currentTurn === 1
                ? 2
                : 1
              : currentTurn
          );
          setMyColour(currentTurn);

          signalRConnection.send(
            "takeTurn",
            gameId,
            `${boardToString(tempBoard)} ${currentTurn}`
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
        <Row>
          <Col>
            <Container hidden={connectedToGame}>
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
            {!boardStatus.isBoardFull ? (
              <div>Current turn: {currentTurn === 1 ? "White" : "Black"}</div>
            ) : null}
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
