import { Graph, depthFirstTraversal, graphToTree, graphToTreeReverse, maxDepth } from "@/helpers/graph";
import { Orientations, SurroundingSquare, Tile, bridge, dualTypeDice, singleTypeDice } from "@/types/railRoadInk";
import _ from "lodash";
import { rollDice } from "./dice.service";
import { shiftConnections } from "@/helpers/railRoadInk";

const roadStarterSquares = ["-1,1", "-1,5", "3,-1", "3,7", "7,1", "7,5"];
export const starterSquares = [...roadStarterSquares, "-1,3", "1,-1", "5,-1", "1,7", "5,7", "7,3"];

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
      orientation: Orientations.UP,
      inverted: false,
    });
  });

  return diceMap;
}

export function getNextOrientation(orientation: string) {
  switch (orientation) {
    case Orientations.UP:
      return Orientations.RIGHT;
    case Orientations.RIGHT:
      return Orientations.DOWN;
    case Orientations.DOWN:
      return Orientations.LEFT;
    case Orientations.LEFT:
      return Orientations.UP;
    default:
      return Orientations.UP;
  }
}

export function getLongestPathScore(graph: Graph, pieceMap: Map<string, Tile>): number {
  const depths = allIds.map((x) => {
    const startingVertex = pieceMap.get(x)?.tileType.id === bridge ? `${x}t` : x;
    return maxDepth(graphToTree(graph, startingVertex), startingVertex);
  });
  const reverseDepths = allIds.map((x) => {
    const startingVertex = pieceMap.get(x)?.tileType.id === bridge ? `${x}t` : x;
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

export function updateValidityGraph(
  id: string,
  tile: Tile,
  validityGraph: Graph,
  playedPieceMap: Map<string, Tile>,
  lockedPieceMap: Map<string, Tile>
) {
  validityGraph.removeVertex(id);
  validityGraph.addVertex(id);
  const surroundingSquares = getSurroundingSquares(id, playedPieceMap, lockedPieceMap);

  for (const surroundingSquare of surroundingSquares) {
    const [myConnection, surrSqConnection] = getConnectionsForDirection(tile, surroundingSquare);
    populateValidityGraphForDirection(id, myConnection, surroundingSquare.id, surrSqConnection, validityGraph);
  }
}

export function updateMapsAndGraphs(
  playedPieceMap: Map<string, Tile>,
  lockedPieceMap: Map<string, Tile>,
  graph: Graph,
  roadGraph: Graph,
  railGraph: Graph
) {
  for (const [id, tile] of playedPieceMap) {
    lockedPieceMap.set(id, tile);

    if (tile.tileType.id === bridge) {
      graph.addVertex(`${id}r`);
      graph.addVertex(`${id}t`);
      roadGraph.addVertex(`${id}r`);
      railGraph.addVertex(`${id}t`);
    } else {
      graph.addVertex(id);
      if (tile.tileType.defaultConnections.includes("t")) {
        railGraph.addVertex(id);
      }
      if (tile.tileType.defaultConnections.includes("r")) {
        roadGraph.addVertex(id);
      }
    }

    const surroundingSquares = getSurroundingSquares(id, playedPieceMap, lockedPieceMap);

    for (const surroundingSquare of surroundingSquares) {
      const [myConnection, surrSqConnection] = getConnectionsForDirection(tile, surroundingSquare);
      populateGraphForDirection(
        id,
        myConnection,
        tile,
        surroundingSquare.id,
        surrSqConnection,
        surroundingSquare.tile,
        graph,
        roadGraph,
        railGraph
      );
    }
  }
}

function isTileConnectedToExit(graph: Graph, id: string) {
  const test = JSON.stringify(depthFirstTraversal(graph, id));
  return test.includes("-") || test.includes("7");
}

function getConnectedPoints(connectedCount: number) {
  return connectedCount === 12 ? 45 : (connectedCount - 1) * 4;
}

function getConnectionsForDirection(selfTile: Tile, surroundingSquare: SurroundingSquare): [string, string] {
  const selfConnections = shiftConnections(selfTile);
  const tile = surroundingSquare.tile ?? {
    tileType: { id: "blank", defaultConnections: ["u", "u", "u", "u"], isJunction: false },
    orientation: Orientations.UP,
    inverted: false,
  };
  const surrSqConns = shiftConnections(tile);

  switch (surroundingSquare.direction) {
    case Orientations.DOWN:
      return [selfConnections[2], surrSqConns[0]];
    case Orientations.RIGHT:
      return [selfConnections[1], surrSqConns[3]];
    case Orientations.UP:
      return [selfConnections[0], surrSqConns[2]];
    case Orientations.LEFT:
      return [selfConnections[3], surrSqConns[1]];
    default:
      return [selfConnections[0], surrSqConns[2]];
  }
}

function populateGraphForDirection(
  selfId: string,
  selfConn: string,
  selfTile: Tile,
  surrSqId: string,
  surrSqConn: string,
  surrSqTile: Tile | undefined,
  graph: Graph,
  roadGraph: Graph,
  railGraph: Graph
) {
  if (!surrSqTile) return;
  if (!isValidConnection(selfConn, surrSqConn)) return;

  const isRailConnection = selfConn === "t";
  const selfTileIsBridge = selfTile.tileType.id === bridge;
  const surrTileIsBridge = surrSqTile.tileType.id === bridge;

  const selfVertexId = selfTileIsBridge ? `${selfId}${selfConn}` : selfId;
  const surrVertexId = surrTileIsBridge ? `${surrSqId}${selfConn}` : surrSqId;

  if (surrTileIsBridge) {
    graph.addVertex(`${surrSqId}r`);
    roadGraph.addVertex(`${surrSqId}r`);
    graph.addVertex(`${surrSqId}t`);
    railGraph.addVertex(`${surrSqId}t`);
  } else {
    graph.addVertex(surrSqId);

    if (isRailConnection) {
      railGraph.addVertex(surrSqId);
    } else {
      roadGraph.addVertex(surrSqId);
    }
  }

  graph.addEdge(selfVertexId, surrVertexId);
  if (isRailConnection) {
    railGraph.addEdge(selfVertexId, surrVertexId);
  } else {
    roadGraph.addEdge(selfVertexId, surrVertexId);
  }
}

function populateValidityGraphForDirection(
  selfId: string,
  selfConn: string,
  surrSqId: string,
  surrSqConn: string,
  validityGraph: Graph
) {
  if (isValidConnection(selfConn, surrSqConn)) {
    validityGraph.addVertex(surrSqId);
    validityGraph.addEdge(selfId, surrSqId);
  }
}

function getSurroundingSquares(
  squareId: string,
  playedPieceMap: Map<string, Tile>,
  lockedPieceMap: Map<string, Tile>
): SurroundingSquare[] {
  const split = squareId.split(",").map((x) => parseInt(x));
  const ids = [
    { direction: Orientations.DOWN, ids: [split[0] + 1, split[1]] }, //down
    { direction: Orientations.RIGHT, ids: [split[0], split[1] + 1] }, //right
    { direction: Orientations.UP, ids: [split[0] - 1, split[1]] }, //up
    { direction: Orientations.LEFT, ids: [split[0], split[1] - 1] }, //left
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
            ? Orientations.DOWN
            : x.ids[1] === -1
            ? Orientations.RIGHT
            : x.ids[0] === 7
            ? Orientations.UP
            : Orientations.LEFT,
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

function isValidConnection(c1: string, c2: string) {
  return (c1 === "r" && c2 === "r") || (c2 === "t" && c1 === "t");
}

function isRoadToRailConnection(c1: string, c2: string) {
  return (c1 === "r" && c2 === "t") || (c2 === "r" && c1 === "t");
}

function isMistakeConnection(c1: string, c2: string) {
  return (c1 === "r" || c1 === "t") && c2 === "u";
}
