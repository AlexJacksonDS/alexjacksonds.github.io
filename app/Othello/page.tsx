"use client";

import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import OthelloBoard from "../components/OthelloBoard/OthelloBoard";

type Board = (0 | 1 | 2)[][];

export default function Othello() {
  const searchParams = useSearchParams();
  const gameId = searchParams?.get("id");
  const [id, setId] = useState("");
  const [myColour, setMyColour] = useState<1 | 2>();
  const [board, setBoard] = useState<Board>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [fen, setFen] = useState(boardToString(board));
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  let [socket, setSocket] = useState<Socket<any, any> | null>(null);

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:8080"); //io("https://ajj-test.azurewebsites.net");
      socket.on("id", (id: string) => {
        setId(id);
        if (socket) {
          socket.emit("newGame", { gameId, fen: `${boardToString(board)} 2`, playerId: id });
        }
      });

      socket.on("fen", (fen: string) => {
        setFen(fen);
        const split = fen.split(" ");
        setCurrentTurn(split[1] === "1" ? 2 : 1);
        setMyColour(split[1] === "1" ? 2 : 1);
        setBoard(boardFromString(split[0]));
      });
      setSocket(socket);
    }

    window.onbeforeunload = () => {
      socket?.disconnect();
    };
  });

  function getPossibleMoves(player: 1 | 2) {
    return board
      .map((e, i) =>
        e
          .map((f, j) => {
            if (f === 0 && isValidPositionForTurn(i, j, player)) {
              return [i, j];
            }
          })
          .filter((k): k is number[] => k !== undefined)
      )
      .flat(1)
      .filter((l) => l !== undefined);
  }

  function isValidPositionForTurn(i: number, j: number, player: 1 | 2) {
    if (hasCorrectPieceInAdjacentSquare(i, j, player)) {
      var validStrings = getBoardStringsFromSquare(i, j).filter(function (s) {
        return s.includes("1") && s.includes("2") && s[0] !== player.toString() && s[0] !== "0";
      });
      return validStrings.length > 0;
    }
    return false;
  }

  function hasCorrectPieceInAdjacentSquare(i: number, j: number, turn: number) {
    return getTransformations(i, j)
      .map((e) => [e[0](1), e[1](1)])
      .map((e) => {
        return e[0] >= 0 && e[0] < 8 && e[1] >= 0 && e[1] < 8 && (board[e[0]][e[1]] === turn || board[e[0]][e[1]] === 0)
          ? "F"
          : "T";
      })
      .includes("T");
  }

  function handleClick(i: number, j: number) {
    console.log(myColour);
    if (!isBoardFull() && (currentTurn === myColour || myColour === undefined)) {
      var possibleMoves = getPossibleMoves(currentTurn);
      if (isArrayInArray(possibleMoves, [i, j])) {
        const tempBoard = performMove(i, j);
        setBoard(tempBoard);
        setCurrentTurn(
          getPossibleMoves(currentTurn === 1 ? 2 : 1).length > 0 ? (currentTurn === 1 ? 2 : 1) : currentTurn
        );
        setMyColour(currentTurn);
        setFen(boardToString(tempBoard));
        if (socket) {
          socket.emit("sendFen", { gameId: gameId, playerId: id, fen: `${boardToString(tempBoard)} ${currentTurn}` });
        }
      }
    }
  }

  function isArrayInArray(array: any[], item: any) {
    return array.some(function (element) {
      return JSON.stringify(element) === JSON.stringify(item);
    });
  }

  function performMove(i: number, j: number) {
    var tempBoard = board;
    tempBoard[i][j] = currentTurn;
    getTransformations(i, j).map((t) => performLineMove(tempBoard, t[0], t[1]));
    return tempBoard;
  }

  function performLineMove(tempBoard: Board, iTransform: (z: number) => number, jTransform: (z: number) => number) {
    for (var k = 1; iTransform(k) >= 0 && iTransform(k) <= 7 && jTransform(k) >= 0 && jTransform(k) <= 7; k++) {
      if (doesBoardSquareNeedSetting(iTransform(k), jTransform(k))) {
        tempBoard[iTransform(k)][jTransform(k)] = currentTurn;
      } else {
        break;
      }
    }
  }

  function doesBoardSquareNeedSetting(x: number, y: number) {
    return board[x][y] !== currentTurn && board[x][y] !== 0;
  }

  function getBoardStringsFromSquare(i: number, j: number) {
    return getTransformations(i, j).map((t) => getBoardString(t[0], t[1]));
  }

  function getTransformations(i: number, j: number) {
    return [
      [(z: number) => i - z, () => j],
      [(z: number) => i + z, () => j],
      [() => i, (z: number) => j - z],
      [() => i, (z: number) => j + z],
      [(z: number) => i - z, (z: number) => j - z],
      [(z: number) => i + z, (z: number) => j - z],
      [(z: number) => i - z, (z: number) => j + z],
      [(z: number) => i + z, (z: number) => j + z],
    ];
  }

  function getBoardString(iTransform: (z: number) => number, jTransform: (z: number) => number) {
    let string = "";
    for (var k = 1; iTransform(k) >= 0 && iTransform(k) <= 7 && jTransform(k) >= 0 && jTransform(k) <= 7; k++) {
      string += board[iTransform(k)][jTransform(k)];
    }
    return string;
  }

  function isBoardFull() {
    return !board.flat(Infinity).includes(0);
  }

  function getScore(player: number) {
    return board.flat(Infinity).filter((i) => i === player).length;
  }

  function boardToString(board: Board) {
    return board.map((i) => i.join("")).join("/");
  }

  function boardFromString(string: string): Board {
    return string.split("/").map((str) => Array.from(str).map((v) => parseInt(v) as 0 | 1 | 2));
  }

  const playerOneScore = getScore(1);
  const playerTwoScore = getScore(2);

  return (
    <main>
      <Container>
        <Row className="g-0-bottom">
          <Col className="g-0">
            <Container className="faux-borders-thin">
              <OthelloBoard
                board={board}
                onClick={(i: number, j: number) => handleClick(i, j)}
                possibleMoves={getPossibleMoves(currentTurn)}
              />
            </Container>
          </Col>
        </Row>
        <Row className="black-background g-0-top text-center">
          <Col>
            {!isBoardFull() ? <div>Current turn: {currentTurn === 1 ? "White" : "Black"}</div> : null}
            <div>White score: {playerOneScore}</div>
            <div>Black score: {playerTwoScore}</div>
            {isBoardFull() ? (
              playerOneScore > playerTwoScore ? (
                <div>White wins</div>
              ) : playerOneScore === playerTwoScore ? (
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
