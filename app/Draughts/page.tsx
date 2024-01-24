"use client";

import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { DraughtsBoard as Board, DraughtsTurn } from "../types/draughts";
import DraughtsBoard from "../components/DraughtsBoard/DraughtsBoard";
import "./Draughts.scss";
import {
  boardFromString,
  boardState,
  boardToString,
  getMovesForSquare,
  initialDraughtsBoard,
  isPossibleMove,
  makeMove,
} from "../services/draughts.service";
import { getSquareCode } from "../helpers/squareHelper";
import getSocket from "../services/socket.service";

export default function Draughts() {
  const socketRef = useRef<Socket<any, any> | undefined>();

  const searchParams = useSearchParams();
  const gameId = searchParams?.get("id");
  const [id, setId] = useState("");
  const [myColour, setMyColour] = useState<DraughtsTurn>();
  const [board, setBoard] = useState<Board>(initialDraughtsBoard);
  const [fen, setFen] = useState(boardToString(board));
  const [currentTurn, setCurrentTurn] = useState<DraughtsTurn>(2);
  const [selectedSquare, setSelectedSquare] = useState<string | undefined>();
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const boardStatus = boardState(board);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = getSocket({ idCallback: handleId, fenCallback: handleFen });
    }

    window.onbeforeunload = () => {
      socketRef.current?.disconnect();
    };
  });

  const handleFen = (fen: string) => {
    setFen(fen);
    const split = fen.split(" ");
    setCurrentTurn(split[1] === "1" ? 1 : 2);
    setBoard(boardFromString(split[0]));
  };

  const handleId = (id: string) => {
    setId(id);
    if (socketRef.current) {
      socketRef.current.emit("newGame", { gameId, fen: `${boardToString(board)} 2`, playerId: id });
    }
  };

  function handleClick(i: number, j: number) {
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
        setFen(boardToString(tempBoard));
        if (socketRef.current) {
          socketRef.current.emit("sendFen", { gameId: gameId, playerId: id, fen: `${boardToString(tempBoard)} ${nextTurn}` });
        }
      }
    }
  }

  return (
    <main>
      <Container>
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
