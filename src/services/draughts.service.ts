import { getRowColFromSquareCode, getSquareCode } from "../helpers/squareHelper";
import { DraughtsBoard, DraughtsMove, DraughtsPiece, DraughtsTurn } from "../types/draughts";

export const initialDraughtsBoard: DraughtsBoard = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
  ];

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

export function boardToString(board: DraughtsBoard) {
  return board.map((i) => i.join("")).join("/");
}

export function boardFromString(string: string): DraughtsBoard {
  return string.split("/").map((str) => Array.from(str).map((v) => parseInt(v) as DraughtsPiece));
}

export function boardState(board: DraughtsBoard): { isWon: boolean; blackCount: number; whiteCount: number } {
  const flatBoard = board.flat(Infinity);
  const blackCount = flatBoard.filter((x) => x === 1 || x === 3).length;
  const whiteCount = flatBoard.filter((x) => x === 2 || x === 4).length;
  return { isWon: blackCount === 0 || whiteCount === 0, blackCount, whiteCount };
}

export function isPossibleMove(squareCode: string, possibleMoves: string[]) {
  return possibleMoves.filter((s) => s.includes(squareCode)).length > 0;
}

export function getMovesForSquare(board: DraughtsBoard, currentTurn: DraughtsTurn, i: number, j: number) {
  let allMoves = getAllCurrentValidMoves(board, currentTurn);
  let movesForClickedSquare = allMoves.filter(function (m) {
    return m.startI === i && m.startJ === j;
  });
  let moveSquares = movesForClickedSquare.map((m) => {
    return getSquareCode(m.endI, m.endJ);
  });
  return moveSquares;
}

export function makeMove(
  board: DraughtsBoard,
  i: number,
  j: number,
  selectedSquare: string,
  currentTurn: DraughtsTurn
) {
  let tempBoard = board;
  let cs = getRowColFromSquareCode(selectedSquare);
  let swapTurn = true;

  if (tempBoard[cs[0]][cs[1]] < 3 && (i === 0 || i === 7)) {
    tempBoard[i][j] = (tempBoard[cs[0]][cs[1]] + 2) as DraughtsPiece;
  } else {
    tempBoard[i][j] = tempBoard[cs[0]][cs[1]];
  }
  tempBoard[cs[0]][cs[1]] = 0;
  if (Math.abs(cs[0] - i) === 2) {
    tempBoard[(cs[0] + i) / 2][(cs[1] + j) / 2] = 0;
    let allMoves = getAllCurrentValidMoves(tempBoard, currentTurn);
    let movesForClickedSquare = allMoves.filter(function (m) {
      return m.startI === i && m.startJ === j && m.isJump;
    });
    if (movesForClickedSquare.length > 0) {
      swapTurn = false;
    }
  }
  const nextTurn = swapTurn ? (currentTurn === 1 ? 2 : 1) : currentTurn;
  return { tempBoard, nextTurn };
}

function getAllCurrentValidMoves(board: DraughtsBoard, currentTurn: DraughtsTurn): DraughtsMove[] {
  let possibleMoves = [];
  let moveCandidates = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === currentTurn || board[i][j] === currentTurn + 2) {
        if (board[i][j] === 1) {
          for (let k = 0; k < blackMoveDistances.length; k++) {
            if (
              isValidPlaceToMove(
                board,
                i + blackMoveDistances[k][0],
                j + blackMoveDistances[k][1],
                blackMoveDistances[k],
                1
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
        if (board[i][j] === 2) {
          for (let k = 0; k < whiteMoveDistances.length; k++) {
            if (
              isValidPlaceToMove(
                board,
                i + whiteMoveDistances[k][0],
                j + whiteMoveDistances[k][1],
                whiteMoveDistances[k],
                2
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
        }
        if (board[i][j] > 2) {
          for (let k = 0; k < whiteMoveDistances.length; k++) {
            if (
              isValidPlaceToMove(
                board,
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
                board,
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

function isValidPlaceToMove(
  board: DraughtsBoard,
  row: number,
  column: number,
  attemptedMove: number[],
  movingPiece: DraughtsPiece
) {
  if (row < 0 || row > 7 || column < 0 || column > 7) return false;
  if (board[row][column] === 0) {
    if (Math.abs(attemptedMove[0]) === 2) {
      const moveBackToJumpedLocation = attemptedMove.map((x) => -x / 2);
      const jumpedPiece = board[row + moveBackToJumpedLocation[0]][column + moveBackToJumpedLocation[1]];
      if (
        jumpedPiece === movingPiece ||
        jumpedPiece + 2 === movingPiece ||
        jumpedPiece - 2 === movingPiece ||
        jumpedPiece === 0
      ) {
        return false;
      }
    }
    return true;
  }
  return false;
}
