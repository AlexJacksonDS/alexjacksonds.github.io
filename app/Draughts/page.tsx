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
        if (board[i][j] === currentTurn || board[i][j] === currentTurn + 10) {
          if (board[i][j] === 1) {
            for (let k = 0; k < blackMoveDistances.length; k++) {
              if (isValidPlaceToMove(i + blackMoveDistances[k][0], j + blackMoveDistances[k][1])) {
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
              if (isValidPlaceToMove(i + whiteMoveDistances[k][0], j + whiteMoveDistances[k][1])) {
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
              if (isValidPlaceToMove(i + whiteMoveDistances[k][0], j + whiteMoveDistances[k][1])) {
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
              if (isValidPlaceToMove(i + blackMoveDistances[k][0], j + blackMoveDistances[k][1])) {
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
        (board[(mc.endI + mc.startI) / 2][(mc.endJ + mc.startJ) / 2] !== board[mc.startI][mc.startJ] + 10 ||
          board[(mc.endI + mc.startI) / 2][(mc.endJ + mc.startJ) / 2] !== board[mc.startI][mc.startJ] - 10) &&
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

  function isValidPlaceToMove(row: number, column: number) {
    if (row < 0 || row > 7 || column < 0 || column > 7) return false;
    if (board[row][column] == 0) {
      return true;
    }
    return false;
  }

  // function getPossibleMoves(player: 1 | 2) {
  //   return board
  //     .map((e, i) =>
  //       e
  //         .map((f, j) => {
  //           if (f === 0 && isValidPositionForTurn(i, j, player)) {
  //             return [i, j];
  //           }
  //         })
  //         .filter((k): k is number[] => k !== undefined)
  //     )
  //     .flat(1)
  //     .filter((l) => l !== undefined);
  // }

  // function isValidPositionForTurn(i: number, j: number, player: 1 | 2) {
  //   if (hasCorrectPieceInAdjacentSquare(i, j, player)) {
  //     let validStrings = getBoardStringsFromSquare(i, j).filter(function (s) {
  //       return s.includes("1") && s.includes("2") && s[0] !== player.toString() && s[0] !== "0";
  //     });
  //     return validStrings.length > 0;
  //   }
  //   return false;
  // }

  // function hasCorrectPieceInAdjacentSquare(i: number, j: number, turn: number) {
  //   return getTransformations(i, j)
  //     .map((e) => [e[0](1), e[1](1)])
  //     .map((e) => {
  //       return e[0] >= 0 && e[0] < 8 && e[1] >= 0 && e[1] < 8 && (board[e[0]][e[1]] === turn || board[e[0]][e[1]] === 0)
  //         ? "F"
  //         : "T";
  //     })
  //     .includes("T");
  // }

  function getSquareCode(row: number, col: number) {
    return ["a", "b", "c", "d", "e", "f", "g", "h"][col] + [8, 7, 6, 5, 4, 3, 2, 1][row];
  }

  function getRowColFromSquareCode(code: string) {
    const split = code.split("");
    return [
      ["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(split[0]),
      [8, 7, 6, 5, 4, 3, 2, 1].indexOf(parseInt(split[1])),
    ];
  }

  function handleClick(i: number, j: number) {
    console.log(i + " " + j)
    console.log(isWon());
    console.log(currentTurn + " " + myColour);
    if (!isWon() && (currentTurn === myColour || myColour === undefined)) {
      console.log(currentTurn + " " + myColour);
      if (currentTurn === board[i][j] || currentTurn + 10 === board[i][j]) {
        console.log("t")
        let allMoves = getAllCurrentValidMoves();
        let movesForClickedSquare = allMoves.filter(function (m) {
          return m.startI === i && m.startJ === j;
        });
        let moveSquares = movesForClickedSquare.map((m) => {
          return getSquareCode(m.endI, m.endJ);
        });
        setSelectedSquare(getSquareCode(i, j));
        setPossibleMoves(moveSquares);
      }
      if (selectedSquare && possibleMoves) {
        console.log(selectedSquare);
        console.log(possibleMoves);
        let tempBoard = board;
        let cs = getRowColFromSquareCode(selectedSquare);
        let swapTurn = true;
        if (isArrayInArray(possibleMoves, [i, j])) {
          if (tempBoard[cs[0]][cs[1]] < 3 && (i === 0 || i === 7)) {
            tempBoard[i][j] = (tempBoard[cs[0]][cs[1]] + 10) as DraughtsPiece;
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
          setBoard(tempBoard);
          setCurrentTurn(swapTurn ? (currentTurn === 1 ? 2 : 1) : currentTurn);
          setMyColour(currentTurn);
          setFen(boardToString(tempBoard));
          if (socket) {
            socket.emit("sendFen", { gameId: gameId, playerId: id, fen: `${boardToString(tempBoard)} ${currentTurn}` });
          }
        }
      }
    }
  }

  function isWon() {
    let blackCount = 0;
    let whiteCount = 0;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 1 || board[i][j] === 11) {
          blackCount++;
        }
        if (board[i][j] === 2 || board[i][j] === 12) {
          whiteCount++;
        }
      }
    }
    return blackCount === 0 || whiteCount === 0;
  }

  function isArrayInArray(array: any[], item: any) {
    return array.some(function (element) {
      return JSON.stringify(element) === JSON.stringify(item);
    });
  }

  // function performMove(i: number, j: number) {
  //   let tempBoard = board;
  //   tempBoard[i][j] = currentTurn;
  //   getTransformations(i, j).map((t) => performLineMove(tempBoard, t[0], t[1]));
  //   return tempBoard;
  // }

  // function performLineMove(tempBoard: Board, iTransform: (z: number) => number, jTransform: (z: number) => number) {
  //   for (let k = 1; iTransform(k) >= 0 && iTransform(k) <= 7 && jTransform(k) >= 0 && jTransform(k) <= 7; k++) {
  //     if (doesBoardSquareNeedSetting(iTransform(k), jTransform(k))) {
  //       tempBoard[iTransform(k)][jTransform(k)] = currentTurn;
  //     } else {
  //       break;
  //     }
  //   }
  // }

  // function doesBoardSquareNeedSetting(x: number, y: number) {
  //   return board[x][y] !== currentTurn && board[x][y] !== 0;
  // }

  // function getBoardStringsFromSquare(i: number, j: number) {
  //   return getTransformations(i, j).map((t) => getBoardString(t[0], t[1]));
  // }

  // function getTransformations(i: number, j: number) {
  //   return [
  //     [(z: number) => i - z, () => j],
  //     [(z: number) => i + z, () => j],
  //     [() => i, (z: number) => j - z],
  //     [() => i, (z: number) => j + z],
  //     [(z: number) => i - z, (z: number) => j - z],
  //     [(z: number) => i + z, (z: number) => j - z],
  //     [(z: number) => i - z, (z: number) => j + z],
  //     [(z: number) => i + z, (z: number) => j + z],
  //   ];
  // }

  // function getBoardString(iTransform: (z: number) => number, jTransform: (z: number) => number) {
  //   let string = "";
  //   for (let k = 1; iTransform(k) >= 0 && iTransform(k) <= 7 && jTransform(k) >= 0 && jTransform(k) <= 7; k++) {
  //     string += board[iTransform(k)][jTransform(k)];
  //   }
  //   return string;
  // }

  // function isBoardFull() {
  //   return !board.flat(Infinity).includes(0);
  // }

  // function getScore(player: number) {
  //   return board.flat(Infinity).filter((i) => i === player).length;
  // }

  function boardToString(board: Board) {
    return board.map((i) => i.join("")).join("/");
  }

  function boardFromString(string: string): Board {
    return string.split("/").map((str) => Array.from(str).map((v) => parseInt(v) as 0 | 1 | 2));
  }

  // const playerOneScore = getScore(1);
  // const playerTwoScore = getScore(2);

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
            {!isWon() ? <div>Current turn: {currentTurn === 2 ? "White" : "Black"}</div> : null}
            {/* <div>White score: {playerOneScore}</div>
            <div>Black score: {playerTwoScore}</div>
            {isBoardFull() ? (
              playerOneScore > playerTwoScore ? (
                <div>White wins</div>
              ) : playerOneScore === playerTwoScore ? (
                <div>Draw</div>
              ) : (
                <div>Black wins</div>
              )
            ) : null} */}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
