"use client";

import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { DraughtsBoard as Board, DraughtsPiece } from "../types/draughts";
import DraughtsBoard from "../components/DraughtsBoard/DraughtsBoard";
import "./Draughts.scss";

export default function Othello() {
  const searchParams = useSearchParams();
  const gameId = searchParams?.get("id");
  const [id, setId] = useState("");
  const [myColour, setMyColour] = useState<1 | 2>();
  const [board, setBoard] = useState<Board>([
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
  ]);
  const [fen, setFen] = useState(boardToString(board));
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(2);
  let [socket, setSocket] = useState<Socket<any, any> | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<string | undefined>();
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

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
        setCurrentTurn(split[1] === "1" ? 1 : 2);
        setBoard(boardFromString(split[0]));
      });
      setSocket(socket);
    }

    window.onbeforeunload = () => {
      socket?.disconnect();
    };
  });

  const blackMoveDistances = [
    [1, -1],
    [1, 1],
    [2, -2],
    [2, 2],
  ];

  const whiteMoveDistances = [
    [-1, -1],
    [-1, 1],
    [-2, -2],
    [-2, 2],
  ];

  type Moves = {
    startI: number;
    startJ: number;
    endI: number;
    endJ: number;
    isJump: boolean;
  };

  function getAllCurrentValidMoves(): Moves[] {
    let possibleMoves = [];
    let moveCandidates = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === currentTurn || board[i][j] === currentTurn + 2) {
          if (board[i][j] === 1) {
            for (let k = 0; k < blackMoveDistances.length; k++) {
              if (
                isValidPlaceToMove(i + blackMoveDistances[k][0], j + blackMoveDistances[k][1], blackMoveDistances[k], 1)
              ) {
                moveCandidates.push({
                  startI: i,
                  startJ: j,
                  endI: i + blackMoveDistances[k][0],
                  endJ: j + blackMoveDistances[k][1],
                  isJump: blackMoveDistances[k][0] === 2,
                });
              }
            }
          }
          if (board[i][j] === 2) {
            for (let k = 0; k < whiteMoveDistances.length; k++) {
              if (
                isValidPlaceToMove(i + whiteMoveDistances[k][0], j + whiteMoveDistances[k][1], whiteMoveDistances[k], 2)
              ) {
                moveCandidates.push({
                  startI: i,
                  startJ: j,
                  endI: i + whiteMoveDistances[k][0],
                  endJ: j + whiteMoveDistances[k][1],
                  isJump: whiteMoveDistances[k][0] === -2,
                });
              }
            }
          }
          if (board[i][j] > 2) {
            for (let k = 0; k < whiteMoveDistances.length; k++) {
              if (
                isValidPlaceToMove(
                  i + whiteMoveDistances[k][0],
                  j + whiteMoveDistances[k][1],
                  whiteMoveDistances[k],
                  board[i][j]
                )
              ) {
                moveCandidates.push({
                  startI: i,
                  startJ: j,
                  endI: i + whiteMoveDistances[k][0],
                  endJ: j + whiteMoveDistances[k][1],
                  isJump: whiteMoveDistances[k][0] === -2,
                });
              }
            }
            for (let k = 0; k < blackMoveDistances.length; k++) {
              if (
                isValidPlaceToMove(
                  i + blackMoveDistances[k][0],
                  j + blackMoveDistances[k][1],
                  blackMoveDistances[k],
                  board[i][j]
                )
              ) {
                moveCandidates.push({
                  startI: i,
                  startJ: j,
                  endI: i + blackMoveDistances[k][0],
                  endJ: j + blackMoveDistances[k][1],
                  isJump: blackMoveDistances[k][0] === 2,
                });
              }
            }
          }
        }
      }
    }
    for (let i = 0; i < moveCandidates.length; i++) {
      let mc = moveCandidates[i];
      if (
        mc.isJump &&
        board[(mc.endI + mc.startI) / 2][(mc.endJ + mc.startJ) / 2] !== board[mc.startI][mc.startJ] &&
        (board[(mc.endI + mc.startI) / 2][(mc.endJ + mc.startJ) / 2] !== board[mc.startI][mc.startJ] + 2 ||
          board[(mc.endI + mc.startI) / 2][(mc.endJ + mc.startJ) / 2] !== board[mc.startI][mc.startJ] - 2) &&
        board[(mc.endI + mc.startI) / 2][(mc.endJ + mc.startJ) / 2] !== 0
      ) {
        possibleMoves.push(mc);
      }
    }
    if (possibleMoves.length === 0) {
      for (let i = 0; i < moveCandidates.length; i++) {
        let mc = moveCandidates[i];
        if (!mc.isJump) {
          possibleMoves.push(mc);
        }
      }
    }
    return possibleMoves;
  }

  function isValidPlaceToMove(row: number, column: number, attemptedMove: number[], movingPiece: DraughtsPiece) {
    if (row < 0 || row > 7 || column < 0 || column > 7) return false;
    if (board[row][column] === 0) {
      if (Math.abs(attemptedMove[0]) === 2) {
        const moveBackToJumpedLocation = attemptedMove.map((x) => -x / 2);
        const jumpedPiece = board[row + moveBackToJumpedLocation[0]][column + moveBackToJumpedLocation[1]];
        if (jumpedPiece === movingPiece || jumpedPiece + 2 === movingPiece || jumpedPiece - 2 === movingPiece) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  function getSquareCode(row: number, col: number) {
    return ["a", "b", "c", "d", "e", "f", "g", "h"][col] + [8, 7, 6, 5, 4, 3, 2, 1][row];
  }

  function getRowColFromSquareCode(code: string) {
    const split = code.split("");
    return [
      [8, 7, 6, 5, 4, 3, 2, 1].indexOf(parseInt(split[1])),
      ["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(split[0]),
    ];
  }

  function handleClick(i: number, j: number) {
    if (!isWon() && (currentTurn === myColour || myColour === undefined)) {
      if (currentTurn === board[i][j] || currentTurn + 2 === board[i][j]) {
        let allMoves = getAllCurrentValidMoves();
        let movesForClickedSquare = allMoves.filter(function (m) {
          return m.startI === i && m.startJ === j;
        });
        let moveSquares = movesForClickedSquare.map((m) => {
          return getSquareCode(m.endI, m.endJ);
        });
        setSelectedSquare(getSquareCode(i, j));
        setPossibleMoves(moveSquares);
      } else if (selectedSquare && possibleMoves) {
        let tempBoard = board;
        let cs = getRowColFromSquareCode(selectedSquare);
        let swapTurn = true;
        if (isPossibleMove(getSquareCode(i, j), possibleMoves)) {
          if (tempBoard[cs[0]][cs[1]] < 3 && (i === 0 || i === 7)) {
            tempBoard[i][j] = (tempBoard[cs[0]][cs[1]] + 2) as DraughtsPiece;
          } else {
            tempBoard[i][j] = tempBoard[cs[0]][cs[1]];
          }
          tempBoard[cs[0]][cs[1]] = 0;
          if (Math.abs(cs[0] - i) === 2) {
            tempBoard[(cs[0] + i) / 2][(cs[1] + j) / 2] = 0;
            let allMoves = getAllCurrentValidMoves();
            let movesForClickedSquare = allMoves.filter(function (m) {
              return m.startI === i && m.startJ === j && m.isJump;
            });
            if (movesForClickedSquare.length > 0) {
              swapTurn = false;
            }
          }
          const nextTurn = swapTurn ? (currentTurn === 1 ? 2 : 1) : currentTurn;
          setSelectedSquare(undefined);
          setPossibleMoves([]);
          setBoard(tempBoard);
          setCurrentTurn(nextTurn);
          if (!myColour) {
            setMyColour(currentTurn);
          }
          setFen(boardToString(tempBoard));
          if (socket) {
            socket.emit("sendFen", { gameId: gameId, playerId: id, fen: `${boardToString(tempBoard)} ${nextTurn}` });
          }
        }
      }
    }
  }

  function isPossibleMove(squareCode: string, possibleMoves: string[]) {
    var matches = possibleMoves.filter((s) => s.includes(squareCode));
    return matches.length > 0;
  }

  function isWon() {
    let blackCount = 0;
    let whiteCount = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 1 || board[i][j] === 3) {
          blackCount++;
        }
        if (board[i][j] === 2 || board[i][j] === 4) {
          whiteCount++;
        }
      }
    }
    return blackCount === 0 || whiteCount === 0;
  }

  function boardState(): { isWon: boolean; blackCount: number; whiteCount: number } {
    let blackCount = 0;
    let whiteCount = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 1 || board[i][j] === 3) {
          blackCount++;
        }
        if (board[i][j] === 2 || board[i][j] === 4) {
          whiteCount++;
        }
      }
    }
    return { isWon: blackCount === 0 || whiteCount === 0, blackCount, whiteCount };
  }

  function boardToString(board: Board) {
    return board.map((i) => i.join("")).join("/");
  }

  function boardFromString(string: string): Board {
    return string.split("/").map((str) => Array.from(str).map((v) => parseInt(v) as 0 | 1 | 2));
  }

  const boardStatus = boardState();
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
