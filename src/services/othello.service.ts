import { OthelloBoard, OthelloPiece, OthelloTurn } from "../types/othello";

export const initialOthelloBoard: OthelloBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

export function getPossibleMoves(board: OthelloBoard, player: OthelloTurn) {
  return board
    .map((e, i) =>
      e
        .map((f, j) => {
          if (f === 0 && isValidPositionForTurn(board, i, j, player)) {
            return [i, j];
          }
        })
        .filter((k): k is number[] => k !== undefined)
    )
    .flat(1)
    .filter((l) => l !== undefined);
}

function isValidPositionForTurn(board: OthelloBoard, i: number, j: number, player: OthelloTurn) {
  if (hasCorrectPieceInAdjacentSquare(board, i, j, player)) {
    var validStrings = getBoardStringsFromSquare(board, i, j).filter(function (s) {
      return s.includes("1") && s.includes("2") && s[0] !== player.toString() && s[0] !== "0";
    });
    return validStrings.length > 0;
  }
  return false;
}

function hasCorrectPieceInAdjacentSquare(board: OthelloBoard, i: number, j: number, turn: OthelloTurn) {
  return getTransformations(i, j)
    .map((e) => [e[0](1), e[1](1)])
    .map((e) => {
      return e[0] >= 0 && e[0] < 8 && e[1] >= 0 && e[1] < 8 && (board[e[0]][e[1]] === turn || board[e[0]][e[1]] === 0)
        ? "F"
        : "T";
    })
    .includes("T");
}

export function performMove(board: OthelloBoard, i: number, j: number, currentTurn: OthelloTurn) {
  var tempBoard = board;
  tempBoard[i][j] = currentTurn;
  getTransformations(i, j).map((t) => performLineMove(tempBoard, currentTurn, t[0], t[1]));
  return tempBoard;
}

function performLineMove(
  board: OthelloBoard,
  currentTurn: OthelloTurn,
  iTransform: (z: number) => number,
  jTransform: (z: number) => number
) {
  for (var k = 1; iTransform(k) >= 0 && iTransform(k) <= 7 && jTransform(k) >= 0 && jTransform(k) <= 7; k++) {
    if (doesBoardSquareNeedSetting(board, currentTurn, iTransform(k), jTransform(k))) {
      board[iTransform(k)][jTransform(k)] = currentTurn;
    } else {
      break;
    }
  }
}

function doesBoardSquareNeedSetting(board: OthelloBoard, currentTurn: OthelloTurn, x: number, y: number) {
  return board[x][y] !== currentTurn && board[x][y] !== 0;
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

function getBoardStringsFromSquare(board: OthelloBoard, i: number, j: number) {
  return getTransformations(i, j).map((t) => getBoardString(board, t[0], t[1]));
}

function getBoardString(board: OthelloBoard, iTransform: (z: number) => number, jTransform: (z: number) => number) {
  let string = "";
  for (var k = 1; iTransform(k) >= 0 && iTransform(k) <= 7 && jTransform(k) >= 0 && jTransform(k) <= 7; k++) {
    string += board[iTransform(k)][jTransform(k)];
  }
  return string;
}

export function boardState(board: OthelloBoard) {
  const flatBoard = board.flat(Infinity);
  return {
    isBoardFull: flatBoard.includes(0),
    whiteScore: flatBoard.filter((i) => i === 1).length,
    blackScore: flatBoard.filter((i) => i === 2).length,
  };
}

export function boardToString(board: OthelloBoard) {
  return board.map((i) => i.join("")).join("/");
}

export function boardFromString(string: string): OthelloBoard {
  return string.split("/").map((str) => Array.from(str).map((v) => parseInt(v) as OthelloPiece));
}
