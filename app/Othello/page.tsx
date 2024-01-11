'use client';

import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import OthelloBoard from "../components/OthelloBoard/OthelloBoard";

type Board = (0 | 1 | 2)[][];

export default function Chess() {
  const searchParams = useSearchParams();
  const gameId = searchParams?.get("id");
  const [id, setId] = useState("");
  const [fen, setFen] = useState("");
  const [myColour, setMyColour] = useState<1 | 2>();
  const [board, setBoard] = useState<Board>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  let [socket, setSocket] = useState<Socket<any, any> | null>(null);

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:8080");//io("https://ajj-test.azurewebsites.net");
      socket.on('id', (id: string) => {
        setId(id);
        if (socket) {
          socket.emit('newGame', { gameId, fen: `${boardToString(board)} 2`, playerId: id });
        }
      });

      socket.on('fen', (fen: string) => {
        setFen(fen);
        const split = fen.split(" ");
        setCurrentTurn(split[1] === "1" ? 2 : 1)
        setMyColour(split[1] === "1" ? 2 : 1);
        setBoard(boardFromString(split[0]));
      });
      setSocket(socket);
    }

    window.onbeforeunload = () => {
      socket?.disconnect();
    }
  })

  function getPossibleMoves(player: 0 | 1 | 2) {
    var possibleMoves = [];
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0 && isValidPositionForTurn(board, i, j, player)) {
          possibleMoves.push([i, j]);
        }
      }
    }
    return possibleMoves;
  }

  function isValidPositionForTurn(board: Board, i: number, j: number, player: 0 | 1 | 2) {
    if (hasCorrectPieceInAdjacentSquare(board, i, j, player)) {
      var boardStrings = getBoardStringsFromSquare(i, j, board);
      var possibleValidStrings = boardStrings.filter(function (s) { return s.includes("1") && s.includes("2") && s[0] !== player.toString() })
      var validStrings = possibleValidStrings.filter(isValidString)
      return validStrings.length > 0;
    } else {
      return false;
    }
  }

  function hasCorrectPieceInAdjacentSquare(board: Board, i: number, j: number, turn: number) {
    var adjCoords = [[i, j + 1], [i, j - 1], [i + 1, j], [i - 1, j], [i + 1, j + 1], [i - 1, j - 1], [i + 1, j - 1], [i - 1, j + 1]];
    var adjContainsOppositePiece = [];
    for (var k = 0; k < adjCoords.length; k++) {
      if (adjCoords[k][0] >= 0 && adjCoords[k][0] < 8 && adjCoords[k][1] >= 0 && adjCoords[k][1] < 8) {
        if (board[adjCoords[k][0]][adjCoords[k][1]] === turn || board[adjCoords[k][0]][adjCoords[k][1]] === 0) {
          adjContainsOppositePiece.push("F");
        } else {
          adjContainsOppositePiece.push("T");
        }
      }
    }
    return adjContainsOppositePiece.includes("T");
  }

  function isValidString(str: string) {
    var startCharacter = str[0];
    if (startCharacter === "0") {
      return false;
    }
    for (var i = 0; i < str.length; i++) {
      if (str[i] === startCharacter) {
        continue;
      }
      if (str[i] === "0") {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  function handleClick(i: number, j: number) {
    console.log(myColour);
    if (!isBoardFull() && (currentTurn === myColour || myColour === undefined)) {
      var possibleMoves = getPossibleMoves(currentTurn);
      if (isArrayInArray(possibleMoves, [i, j])) {
        const tempBoard = performMove(i, j);
        tempBoard[i][j] = currentTurn;
        var possibleOpponentMoves = getPossibleMoves(currentTurn === 1 ? 2 : 1);
        var flipTurn = possibleOpponentMoves.length > 0;
        setBoard(tempBoard);
        setCurrentTurn(flipTurn ? (currentTurn === 1 ? 2 : 1) : currentTurn);
        setMyColour(currentTurn);
        setFen(boardToString(tempBoard));
        if (socket) {
          socket.emit('sendFen', { gameId: gameId, playerId: id, fen: `${boardToString(tempBoard)} ${currentTurn}`  });
        }
      }
    }
  }

  function isArrayInArray(array: any[], item: any) {
    var itemAsString = JSON.stringify(item);
    var contains = array.some(function (element) {
      return JSON.stringify(element) === itemAsString;
    });
    return contains;
  }

  function isNeededDirection(str: string, turn: number) {
    return str.includes("1") && str.includes("2") && str[0] !== turn.toString() && isValidString(str);
  }

  function performMove(i: number, j: number) {
    var tempBoard = board;
    var turn = currentTurn;
    if (isNeededDirection(getUpBoardString(i, j, tempBoard), turn)) {
      for (var k = 1; i - k >= 0; k++) {
        if (tempBoard[i - k][j] !== turn && tempBoard[i - k][j] !== 0) {
          tempBoard[i - k][j] = turn;
        } else {
          break;
        }
      }
    }

    if (isNeededDirection(getDownBoardString(i, j, tempBoard), turn)) {
      for (var k = 1; i + k <= 7; k++) {
        if (tempBoard[i + k][j] !== turn && tempBoard[i + k][j] !== 0) {
          tempBoard[i + k][j] = turn;
        } else {
          break;
        }
      }
    }

    if (isNeededDirection(getLeftBoardString(i, j, tempBoard), turn)) {
      for (var k = 1; j - k >= 0; k++) {
        if (tempBoard[i][j - k] !== turn && tempBoard[i][j - k] !== 0) {
          tempBoard[i][j - k] = turn;
        } else {
          break;
        }
      }
    }

    if (isNeededDirection(getRightBoardString(i, j, tempBoard), turn)) {
      for (var k = 1; j + k <= 7; k++) {
        if (tempBoard[i][j + k] !== turn && tempBoard[i][j + k] !== 0) {
          tempBoard[i][j + k] = turn;
        } else {
          break;
        }
      }
    }

    if (isNeededDirection(getUpLeftString(i, j, tempBoard), turn)) {
      for (var k = 1; i - k >= 0 && j - k >= 0; k++) {
        if (tempBoard[i - k][j - k] !== turn && tempBoard[i - k][j - k] !== 0) {
          tempBoard[i - k][j - k] = turn;
        } else {
          break;
        }
      }
    }

    if (isNeededDirection(getDownLeftString(i, j, tempBoard), turn)) {
      for (var k = 1; i + k <= 7 && j - k >= 0; k++) {
        if (tempBoard[i + k][j - k] !== turn && tempBoard[i + k][j - k] !== 0) {
          tempBoard[i + k][j - k] = turn;
        } else {
          break;
        }
      }
    }

    if (isNeededDirection(getUpRightString(i, j, tempBoard), turn)) {
      for (var k = 1; i - k >= 0 && j + k <= 7; k++) {
        if (tempBoard[i - k][j + k] !== turn && tempBoard[i - k][j + k] !== 0) {
          tempBoard[i - k][j + k] = turn;
        } else {
          break;
        }
      }
    }

    if (isNeededDirection(getDownRightString(i, j, tempBoard), turn)) {
      for (var k = 1; j + k <= 7 && i + k <= 7; k++) {
        if (tempBoard[i + k][j + k] !== turn && tempBoard[i + k][j + k] !== 0) {
          tempBoard[i + k][j + k] = turn;
        } else {
          break;
        }
      }
    }

    return tempBoard;
  }

  function getBoardStringsFromSquare(i: number, j: number, board: Board) {
    return [
      getUpBoardString(i, j, board),
      getDownBoardString(i, j, board),
      getLeftBoardString(i, j, board),
      getRightBoardString(i, j, board),
      getUpLeftString(i, j, board),
      getDownLeftString(i, j, board),
      getUpRightString(i, j, board),
      getDownRightString(i, j, board)
    ];
  }

  function getUpBoardString(i: number, j: number, board: Board) {
    var string = "";
    for (var k = 1; i - k >= 0; k++) {
      string = string + board[i - k][j];
    }
    return string
  }

  function getDownBoardString(i: number, j: number, board: Board) {
    var string = "";
    for (var k = 1; i + k <= 7; k++) {
      string = string + board[i + k][j];
    }
    return string;
  }

  function getLeftBoardString(i: number, j: number, board: Board) {
    var string = "";
    for (var k = 1; j - k >= 0; k++) {
      string = string + board[i][j - k];
    }
    return string;
  }

  function getRightBoardString(i: number, j: number, board: Board) {
    var string = "";
    for (var k = 1; j + k <= 7; k++) {
      string = string + board[i][j + k];
    }
    return string;
  }

  function getUpLeftString(i: number, j: number, board: Board) {
    var string = "";
    for (var k = 1; i - k >= 0 && j - k >= 0; k++) {
      string = string + board[i - k][j - k];
    }
    return string;
  }

  function getUpRightString(i: number, j: number, board: Board) {
    var string = "";
    for (var k = 1; i - k >= 0 && j + k <= 7; k++) {
      string = string + board[i - k][j + k];
    }
    return string;
  }

  function getDownLeftString(i: number, j: number, board: Board) {
    var string = "";
    for (var k = 1; i + k <= 7 && j - k >= 0; k++) {
      string = string + board[i + k][j - k];
    }
    return string;
  }

  function getDownRightString(i: number, j: number, board: Board) {
    var string = "";
    for (var k = 1; j + k <= 7 && i + k <= 7; k++) {
      string = string + board[i + k][j + k];
    }
    return string;
  }

  function isBoardFull() {
    return !board.flat(Infinity).includes(0);
  }

  function getScore(player: number) {
    return board.flat(Infinity).filter(i => i === player).length;
  }

  function boardToString(board: Board) {
    return board.map(i => i.join(",")).join(",");
  }

  function boardFromString(string: string): Board {
    var stringArray = string.split(",");
    var board = new Array(8);
    for (var i = 0; i < board.length; i++) {
      board[i] = new Array(8);
    }
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[i].length; j++) {
        board[i][j] = parseInt(stringArray[i * 8 + j]);
      }
    }
    return board;
  }

  var playerOneScore = getScore(1);
  var playerTwoScore = getScore(2);
  var winner = playerOneScore > playerTwoScore ? <div>White wins</div> : <div>Black wins</div>;
  var winner = playerOneScore === playerTwoScore ? <div>Draw</div> : winner;

  return (
    <main>
      <Container>
        <Row className="g-0-bottom">
          <Col className="g-0">
            <Container className="faux-borders-thin">
              <OthelloBoard board={board}
                onClick={(i: number, j: number) => handleClick(i, j)}
                possibleMoves={getPossibleMoves(currentTurn)} />
            </Container>
          </Col>
        </Row>
        <Row className="black-background g-0-top text-center">
          <Col>
            {!isBoardFull() ? <div>Current turn: {currentTurn === 1 ? "White" : "Black"}</div> : null}
            <div>White score: {playerOneScore}</div>
            <div>Black score: {playerTwoScore}</div>
            {isBoardFull() ? (playerOneScore > playerTwoScore ? <div>White wins</div> : <div>Black wins</div>) : null}
          </Col>
        </Row>
      </Container>
    </main>
  )
}