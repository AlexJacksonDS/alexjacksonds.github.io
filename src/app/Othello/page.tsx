"use client";

import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import OthelloBoard from "../../components/Othello/OthelloBoard/OthelloBoard";
import { isArrayInArray } from "../../helpers/arrayHelper";
import getSocket from "../../services/socket.service";
import {
  boardFromString,
  boardState,
  boardToString,
  getPossibleMoves,
  initialOthelloBoard,
  performMove,
} from "../../services/othello.service";
import { OthelloBoard as Board, OthelloTurn } from "../../types/othello";

export default function Othello() {
  const socketRef = useRef<Socket<any, any> | undefined>();
  
  const searchParams = useSearchParams();
  const gameId = searchParams?.get("id");
  const [id, setId] = useState("");
  const [myColour, setMyColour] = useState<OthelloTurn>();
  const [board, setBoard] = useState<Board>(initialOthelloBoard);
  const [fen, setFen] = useState(boardToString(board));
  const [currentTurn, setCurrentTurn] = useState<OthelloTurn>(1);
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
    setCurrentTurn(split[1] === "1" ? 2 : 1);
    setMyColour(split[1] === "1" ? 2 : 1);
    setBoard(boardFromString(split[0]));
  };

  const handleId = (id: string) => {
    setId(id);
    if (socketRef.current) {
      socketRef.current.emit("newGame", { gameId, fen: `${boardToString(board)} 2`, playerId: id });
    }
  };

  function handleClick(i: number, j: number) {
    console.log(myColour);
    if (!boardStatus.isBoardFull && (currentTurn === myColour || myColour === undefined)) {
      var possibleMoves = getPossibleMoves(board, currentTurn);
      if (isArrayInArray(possibleMoves, [i, j])) {
        const tempBoard = performMove(board, i, j, currentTurn);
        setBoard(tempBoard);
        setCurrentTurn(
          getPossibleMoves(board, currentTurn === 1 ? 2 : 1).length > 0 ? (currentTurn === 1 ? 2 : 1) : currentTurn
        );
        setMyColour(currentTurn);
        setFen(boardToString(tempBoard));
        if (socketRef.current) {
          socketRef.current.emit("sendFen", { gameId: gameId, playerId: id, fen: `${boardToString(tempBoard)} ${currentTurn}` });
        }
      }
    }
  }

  return (
    <main>
      <Container>
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
