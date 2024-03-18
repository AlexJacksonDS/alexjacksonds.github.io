import { Graph, depthFirstTraversal, graphToTree, graphToTreeReverse, maxDepth } from "@/helpers/graph";
import { Orientiations, SurroundingSquare, Tile, dualTypeDice, singleTypeDice } from "@/types/railRoadInk";
import _ from "lodash";
import { rollDice } from "./dice.service";

const roadStarterSquares = ["-1,1", "-1,5", "3,-1", "3,7", "7,1", "7,5"];
const starterSquares = [...roadStarterSquares, "-1,3", "1,-1", "5,-1", "1,7", "5,7", "7,3"];
export const boardArray = [...Array(7)].map(() => [...Array(7)].map(() => null));
const allIds = boardArray
  .map((_, i) => {
    return boardArray[i].map((_, j) => {
      return `${i},${j}`;
    });
  })
  .flat();

export function rollTileDice(): Map<string, Tile> {
  const diceMap = new Map<string, Tile>();

  const rolledDice = [
    dualTypeDice[rollDice()],
    singleTypeDice[rollDice()],
    singleTypeDice[rollDice()],
    singleTypeDice[rollDice()],
  ];

  rolledDice.map((dice, i) => {
    diceMap.set(`dice,${i}`, {
      tileType: dice,
      orientation: Orientiations.UP,
      inverted: false,
    });
  });

  return diceMap;
}

export function getNextOrientation(orientation: string) {
  switch (orientation) {
    case Orientiations.UP:
      return Orientiations.RIGHT;
    case Orientiations.RIGHT:
      return Orientiations.DOWN;
    case Orientiations.DOWN:
      return Orientiations.LEFT;
    case Orientiations.LEFT:
      return Orientiations.UP;
    default:
      return Orientiations.UP;
  }
}

export function getLongestPathScore(graph: Graph, pieceMap: Map<string, Tile>): number {
  const depths = allIds.map((x) => {
    const startingVertex = pieceMap.get(x)?.tileType.id === "bridge" ? `${x}t` : x;
    return maxDepth(graphToTree(graph, startingVertex), startingVertex);
  });
  const reverseDepths = allIds.map((x) => {
    const startingVertex = pieceMap.get(x)?.tileType.id === "bridge" ? `${x}t` : x;
    return maxDepth(graphToTreeReverse(graph, startingVertex), startingVertex);
  });
  return _.max(depths.concat(reverseDepths)) ?? 0;
}

export function getConnectionScore(graph: Graph): number {
  const uniqTest = _.uniqBy(
    starterSquares.map((x) => _.sortBy(depthFirstTraversal(graph, x).filter((str) => starterSquares.includes(str)))),
    function (item) {
      return JSON.stringify(item);
    }
  );
  const connectedSets = uniqTest.map((y) => getConnectedPoints(y.length));
  return _.sum(connectedSets);
}

export function isTileConnectedToExit(graph: Graph, id: string) {
  const test = JSON.stringify(depthFirstTraversal(graph, id));
  return test.includes("-") || test.includes("7");
}

function getConnectedPoints(connectedCount: number) {
  return connectedCount === 12 ? 45 : (connectedCount - 1) * 4;
}

export function getCentreScore(pieceMap: Map<string, Tile>): number {
  return ["2,2", "2,3", "2,4", "3,2", "3,3", "3,4", "4,2", "4,3", "4,4"]
    .map((squareId) => pieceMap.get(squareId))
    .filter((x) => x !== undefined).length;
}

export function getMistakeScore(pieceMap: Map<string, Tile>): number {
  let mistakeConnections = 0;
  for (const [id, tile] of pieceMap) {
    const surroundingSquares = getSurroundingSquares(id, new Map<string, Tile>(), pieceMap);

    for (const surroundingSquare of surroundingSquares) {
      if (!surroundingSquare.id.includes("-") && !surroundingSquare.id.includes("7")) {
        if (isMistakeConnection(...getConnectionsForDirection(tile, surroundingSquare))) {
          mistakeConnections++;
        }
      }
    }
  }
  return mistakeConnections;
}

function getConnectionsForDirection(selfTile: Tile, surroundingSquare: SurroundingSquare): [string, string] {
  const selfConnections = shiftConnections(selfTile);
  const tile = surroundingSquare.tile ?? {
    tileType: { id: "blank", defaultConnections: ["u", "u", "u", "u"], isJunction: false },
    orientation: Orientiations.UP,
    inverted: false,
  };
  const surrSqConns = shiftConnections(tile);

  switch (surroundingSquare.direction) {
    case "down":
      return [selfConnections[2], surrSqConns[0]];
    case "right":
      return [selfConnections[1], surrSqConns[3]];
    case "up":
      return [selfConnections[0], surrSqConns[2]];
    case "left":
      return [selfConnections[3], surrSqConns[1]];
    default:
      return [selfConnections[0], surrSqConns[2]];
  }
}

export function isTileValid(
  squareId: string,
  tile: Tile | undefined,
  playedPieceMap: Map<string, Tile>,
  lockedPieceMap: Map<string, Tile>,
  validityGraph: Graph
) {
  if (!tile) return true;

  if (!isTileConnectedToExit(validityGraph, squareId)) return false;

  const surroundingSquares = getSurroundingSquares(squareId, playedPieceMap, lockedPieceMap);

  if (surroundingSquares.every((t) => t.tile === undefined)) return false;

  const invalidConnections: boolean[] = [];

  for (const surroundingSquare of surroundingSquares) {
    const connections = getConnectionsForDirection(tile, surroundingSquare);
    invalidConnections.push(isRoadToRailConnection(...connections));
  }

  if (invalidConnections.some((x) => x)) return false;

  return true;
}

export function shiftConnections(tile: Tile) {
  const connections = [...tile.tileType.defaultConnections];
  let shift: number;
  switch (tile.orientation) {
    case Orientiations.UP:
      shift = 0;
      break;
    case Orientiations.RIGHT:
      shift = 3;
      break;
    case Orientiations.DOWN:
      shift = 2;
      break;
    case Orientiations.LEFT:
      shift = 1;
      break;
    default:
      shift = 0;
  }
  const rotatedConnections = connections.slice(shift, 4).concat(connections.slice(0, shift));
  if (tile.inverted) {
    const temp = rotatedConnections[1];
    rotatedConnections[1] = rotatedConnections[3];
    rotatedConnections[3] = temp;
  }
  return rotatedConnections;
}

export function getSurroundingSquares(
  squareId: string,
  playedPieceMap: Map<string, Tile>,
  lockedPieceMap: Map<string, Tile>
): SurroundingSquare[] {
  const split = squareId.split(",").map((x) => parseInt(x));
  const ids = [
    { direction: "down", ids: [split[0] + 1, split[1]] }, //down
    { direction: "right", ids: [split[0], split[1] + 1] }, //right
    { direction: "up", ids: [split[0] - 1, split[1]] }, //up
    { direction: "left", ids: [split[0], split[1] - 1] }, //left
  ];
  return ids.map((x) => {
    const id = `${x.ids[0]},${x.ids[1]}`;
    let tile = playedPieceMap.get(id);
    if (!tile) {
      tile = lockedPieceMap.get(id);
    }
    if (starterSquares.includes(id)) {
      const isRoad = roadStarterSquares.includes(id);
      tile = {
        tileType: {
          id: `start${isRoad ? "r" : "t"}`,
          defaultConnections: isRoad ? ["r", "u", "u", "u"] : ["t", "u", "u", "u"],
          isJunction: false,
        },
        orientation:
          x.ids[0] === -1
            ? Orientiations.DOWN
            : x.ids[1] === -1
            ? Orientiations.RIGHT
            : x.ids[0] === 7
            ? Orientiations.UP
            : Orientiations.LEFT,
        inverted: false,
      };
    }
    return {
      direction: x.direction,
      id: id,
      tile: tile,
    };
  });
}

function isRoadToRailConnection(c1: string, c2: string) {
  return (c1 === "r" && c2 === "t") || (c2 === "r" && c1 === "t");
}

function isMistakeConnection(c1: string, c2: string) {
  return (c1 === "r" || c1 === "t") && c2 === "u";
}
