import { Tile } from "@/types/minesweeper";
import { MutableRefObject } from "react";

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateBoard(
  width: number,
  height: number,
  mineCount: number,
  isHex: boolean
) {
  const mineLocations = shuffle(
    new Array(width * height).fill(0).map((a, i) => (a = i))
  ).slice(0, mineCount);
  const mineCoords = mineLocations.map((x) => {
    const i = Math.floor(x / width);
    return [i, x - i * width];
  });

  const newBoardNulls: (Tile | null)[][] = Array(height)
    .fill(0)
    .map(() => Array(width).fill(null));

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      newBoardNulls[i][j] = new Tile();
    }
  }

  const newBoard = newBoardNulls as Tile[][];

  for (const coords of mineCoords) {
    newBoard[coords[0]][coords[1]].value = -1;
  }

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (newBoard[i][j].value != -1) {
        const adjs = getAdjacentValues(newBoard as Tile[][], [i, j], isHex);
        newBoard[i][j].value = adjs.filter(
          (adj) => adj.tile.value === -1
        ).length;
      }
    }
  }
  return newBoard;
}

const squareTransforms = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];

const hexEvenTransforms = [
  [0, 1],
  [-1, 1],
  [-1, 0],
  [0, -1],
  [1, 0],
  [1, 1],
];
const hexOddTransforms = [
  [0, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
];

function getAdjacentValues(board: Tile[][], coords: number[], isHex: boolean) {
  const boardHeight = board.length;
  const boardWidth = board[0].length;

  const isEven = Math.abs(coords[0]) % 2 === 0;

  const relevantTransforms: number[][] = isHex
    ? isEven
      ? hexEvenTransforms
      : hexOddTransforms
    : squareTransforms;

  const adjCoords = relevantTransforms
    .map((mod) => [coords[0] + mod[0], coords[1] + mod[1]])
    .filter(
      (coord) =>
        coord[0] >= 0 &&
        coord[0] < boardHeight &&
        coord[1] >= 0 &&
        coord[1] < boardWidth
    );

  return adjCoords.map((coord) => ({
    i: coord[0],
    j: coord[1],
    tile: board[coord[0]][coord[1]],
  }));
}

export function openSquares(
  board: MutableRefObject<Tile[][]>,
  startCoord: number[],
  isHex: boolean
) {
  const visited: string[] = [];
  const coordStack = [startCoord];

  while (coordStack.length) {
    let currentCoord = coordStack.pop();

    if (currentCoord !== undefined) {
      const stringCoord = `${currentCoord[0]}-${currentCoord[1]}`;
      if (!visited.includes(stringCoord)) {
        visited.push(stringCoord);
        board.current[currentCoord[0]][currentCoord[1]].isRevealed = true;

        if (board.current[currentCoord[0]][currentCoord[1]].value === 0) {
          const adjs = getAdjacentValues(board.current, currentCoord, isHex);
          coordStack.push(...adjs.map((adj) => [adj.i, adj.j]));
        }
      }
    }
  }
}

export function getCharacter(tile: Tile, isLost: boolean) {
  if (tile.isRevealed) {
    if (tile.value > 0) return tile.value.toString();
  }

  if (tile.value === -1 && isLost) {
    return "\uD83D\uDCA3";
  }

  if (tile.hasFlag) return "\uD83D\uDEA9";
  if (tile.hasQ) return "\u2753";

  return "";
}
