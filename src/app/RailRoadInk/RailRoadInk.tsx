"use client";
import DroppableBoardSquare from "@/components/RailRoadInk/DroppableBoardSquare/DroppableBoardSquare";
import { DropResult, Orientiations, Tile, specials } from "@/types/railRoadInk";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import DroppableTilePool from "@/components/RailRoadInk/DroppableTilePool/DroppableTilePool";
import _ from "lodash";
import { useState, useEffect } from "react";
import { shiftConnections } from "@/helpers/railRoadInk";
import { Graph } from "@/helpers/graph";
import {
  boardArray,
  getCentreScore,
  getConnectionScore,
  getLongestPathScore,
  getMistakeScore,
  getNextOrientation,
  getSurroundingSquares,
  isTileValid,
  rollTileDice,
} from "@/services/railRoadInk.service";
import { isMobile } from "react-device-detect";

const roadStarterSquares = ["-1,1", "-1,5", "3,-1", "3,7", "7,1", "7,5"];
const starterSquares = [...roadStarterSquares, "-1,3", "1,-1", "5,-1", "1,7", "5,7", "7,3"];

export default function RailRoadInk() {
  const [lockedPieceMap, setLockedPieceMap] = useState(new Map<string, Tile>());
  const [playedPieceMap, setPlayedPieceMap] = useState(new Map<string, Tile>());
  const [specialsMap, setSpecialsMap] = useState(new Map<string, Tile>());
  const [diceMap, setDiceMap] = useState(new Map<string, Tile>());
  const [isInit, setIsInit] = useState(false);
  const [round, setRound] = useState(1);
  const [connectionScore, setConnectionScore] = useState(0);
  const [roadScore, setRoadScore] = useState(0);
  const [railScore, setRailScore] = useState(0);
  const [centreScore, setCentreScore] = useState(0);
  const [mistakeScore, setMistakeScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [graph, setGraph] = useState(new Graph());
  const [validityGraph, setValidityGraph] = useState(new Graph());
  const [roadGraph, setRoadGraph] = useState(new Graph());
  const [railGraph, setRailGraph] = useState(new Graph());
  const [spin, setSpin] = useState("");
  const [flip, setFlip] = useState("");

  useEffect(() => {
    if (!isInit) {
      starterSquares.map((x) => {
        graph.addVertex(x);
        validityGraph.addVertex(x);
      });
      setGraph(graph);
      setValidityGraph(validityGraph);

      specials.map((dice, i) => {
        specialsMap.set(`specials,${i}`, {
          tileType: dice,
          orientation: Orientiations.UP,
          inverted: false,
        });
      });

      setSpecialsMap(new Map<string, Tile>(specialsMap));
      setDiceMap(new Map<string, Tile>(rollTileDice()));
      setIsInit(true);
    }

    setSpin(isMobile ? "Tap to spin" : "Left click to spin");
    setFlip(isMobile ? "Hold to flip" : "Right click to flip");
  });

  const totalScore = connectionScore + roadScore + railScore + centreScore - mistakeScore;
  const allDiceUsed = [...diceMap.keys()].length === 0;
  let allPlayedTilesValid = true;
  for (const [squareId, tile] of playedPieceMap) {
    allPlayedTilesValid =
      allPlayedTilesValid && isTileValid(squareId, tile, playedPieceMap, lockedPieceMap, validityGraph);
  }
  const noMoreThanFivePlayed = [...playedPieceMap.keys()].length <= 5;
  const saveEnabled = !gameComplete && allDiceUsed && allPlayedTilesValid && noMoreThanFivePlayed;

  function handleTileClick(id: string, isLeftClick: boolean) {
    if (id.includes("dice") || id.includes("specials")) return;

    const tile = playedPieceMap.get(id);

    if (tile) {
      if (isLeftClick) {
        tile.orientation = getNextOrientation(tile.orientation);
      } else {
        tile.inverted = !tile.inverted;
      }

      playedPieceMap.set(id, tile);
      updateValidityGraph(id, tile);
      setPlayedPieceMap(new Map(playedPieceMap));
    }
  }

  const handleStackMove = (dropResult: DropResult, item: { id: string; tile: Tile }) => {
    const ids = [0, 1, 2, 3, 4, 5];
    if (dropResult.id === "dice") {
      if (item.id.includes("specials") || item.id.includes("dice")) return;
      if (specials.includes(item.tile.tileType)) return;

      playedPieceMap.delete(item.id);
      validityGraph.removeVertex(item.id);
      const existingIds = [...diceMap.keys()].map((key) => parseInt(_.last(key)!));
      const availableIds = ids.filter((x) => !existingIds.includes(x));
      const lowestId = Math.min(...availableIds);
      setDiceMap(new Map(diceMap.set(`dice,${lowestId}`, item.tile)));
      setPlayedPieceMap(new Map(playedPieceMap));
    } else if (dropResult.id === "specials") {
      if (item.id.includes("dice") || item.id.includes("specials")) return;
      if (!specials.includes(item.tile.tileType)) return;

      playedPieceMap.delete(item.id);
      validityGraph.removeVertex(item.id);
      const existingIds = [...specialsMap.keys()].map((key) => parseInt(_.last(key)!));
      const availableIds = ids.filter((x) => !existingIds.includes(x));
      const lowestId = Math.min(...availableIds);
      setSpecialsMap(new Map(specialsMap.set(`specials,${lowestId}`, item.tile)));
      setPlayedPieceMap(new Map(playedPieceMap));
    } else {
      if (!item.id.includes("dice") || !item.id.includes("specials")) {
        playedPieceMap.delete(item.id);
        validityGraph.removeVertex(item.id);
      }

      if (item.id.includes("dice")) {
        diceMap.delete(item.id);
      } else if (item.id.includes("specials")) {
        specialsMap.delete(item.id);
      }

      updateValidityGraph(dropResult.id, item.tile);
      setPlayedPieceMap(new Map(playedPieceMap.set(dropResult.id, item.tile)));
      setDiceMap(new Map(diceMap));
      setSpecialsMap(new Map(specialsMap));
    }
  };

  function updateValidityGraph(id: string, tile: Tile) {
    validityGraph.removeVertex(id);
    validityGraph.addVertex(id);
    const surroundingSquares = getSurroundingSquares(id, playedPieceMap, lockedPieceMap);
    const myConnections = shiftConnections(tile);

    for (const surroundingSquare of surroundingSquares) {
      if (surroundingSquare.tile) {
        const surrSqConns = shiftConnections(surroundingSquare.tile);
        switch (surroundingSquare.direction) {
          case "down":
            populateValidityGraphForDirection(id, myConnections[2], surroundingSquare.id, surrSqConns[0]);
            break;
          case "right":
            populateValidityGraphForDirection(id, myConnections[1], surroundingSquare.id, surrSqConns[3]);
            break;
          case "up":
            populateValidityGraphForDirection(id, myConnections[0], surroundingSquare.id, surrSqConns[2]);
            break;
          case "left":
            populateValidityGraphForDirection(id, myConnections[3], surroundingSquare.id, surrSqConns[1]);
            break;
          default:
        }
      }
    }
    setValidityGraph(validityGraph);
  }

  function isValidConnection(c1: string, c2: string) {
    return (c1 === "r" && c2 === "r") || (c2 === "t" && c1 === "t");
  }

  function saveRound() {
    const nextRound = round + 1;
    for (const [id, tile] of playedPieceMap) {
      lockedPieceMap.set(id, tile);

      if (tile.tileType.id === "bridge") {
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
      const myConnections = shiftConnections(tile);

      for (const surroundingSquare of surroundingSquares) {
        if (surroundingSquare.tile) {
          const surrSqConns = shiftConnections(surroundingSquare.tile);
          switch (surroundingSquare.direction) {
            case "down":
              populateGraphForDirection(
                id,
                myConnections[2],
                tile,
                surroundingSquare.id,
                surrSqConns[0],
                surroundingSquare.tile
              );
              break;
            case "right":
              populateGraphForDirection(
                id,
                myConnections[1],
                tile,
                surroundingSquare.id,
                surrSqConns[3],
                surroundingSquare.tile
              );
              break;
            case "up":
              populateGraphForDirection(
                id,
                myConnections[0],
                tile,
                surroundingSquare.id,
                surrSqConns[2],
                surroundingSquare.tile
              );
              break;
            case "left":
              populateGraphForDirection(
                id,
                myConnections[3],
                tile,
                surroundingSquare.id,
                surrSqConns[1],
                surroundingSquare.tile
              );
              break;
            default:
          }
        }
      }
    }
    setGraph(graph);
    setRailGraph(railGraph);
    setRoadGraph(roadGraph);

    if (nextRound < 8) {
      setDiceMap(new Map<string, Tile>(rollTileDice()));
    } else {
      setGameComplete(true);
    }

    setConnectionScore(getConnectionScore(graph));
    setRailScore(getLongestPathScore(railGraph, lockedPieceMap));
    setRoadScore(getLongestPathScore(roadGraph, lockedPieceMap));
    setCentreScore(getCentreScore(lockedPieceMap));
    setMistakeScore(getMistakeScore(lockedPieceMap));
    setLockedPieceMap(new Map(lockedPieceMap));
    setPlayedPieceMap(new Map<string, Tile>());
    setRound(nextRound);
  }

  return (
    <main>
      <Container>
        <DndProvider options={HTML5toTouch}>
          <Row>
            <Col xs={4}>
              <p className="text-center">{spin}</p>
            </Col>
            <Col xs={4}>
              {gameComplete ? (
                <p className="text-center">
                  <strong>Game complete</strong>
                </p>
              ) : (
                <p className="text-center">
                  <strong>Round {round}</strong>
                </p>
              )}
            </Col>
            <Col xs={4}>
              <p className="text-center">{flip}</p>
            </Col>
          </Row>
          <Row>
            <Col lg={2}>
              <Container className="specials-container">
                <p>Specials</p>
                <DroppableTilePool
                  id="specials"
                  tiles={specialsMap}
                  handleStackMove={handleStackMove}
                  handleClick={handleTileClick}
                />
              </Container>
            </Col>
            <Col lg={8}>
              <Container className="board-container">
                {boardArray.map((_, i) => {
                  return boardArray[i].map((_, j) => {
                    const id = `${i},${j}`;
                    let tile = playedPieceMap.get(id);
                    let isLocked = false;
                    let isValid = true;
                    if (!tile) {
                      tile = lockedPieceMap.get(id);
                      if (tile) {
                        isLocked = true;
                      }
                    } else {
                      isValid = isTileValid(id, tile, playedPieceMap, lockedPieceMap, validityGraph);
                    }
                    return (
                      <DroppableBoardSquare
                        key={id}
                        id={id}
                        isTileValid={isValid}
                        isLockedIn={isLocked}
                        tile={tile}
                        handleStackMove={handleStackMove}
                        handleClick={handleTileClick}
                      />
                    );
                  });
                })}
              </Container>
            </Col>
            <Col lg={2}>
              <Container className="dice-container">
                <p>Dice</p>
                <DroppableTilePool
                  id="dice"
                  tiles={diceMap}
                  handleStackMove={handleStackMove}
                  handleClick={handleTileClick}
                />
              </Container>
            </Col>
          </Row>
          <Row className="pt-3">
            <Button className="save-button mx-auto" disabled={!saveEnabled} onClick={saveRound}>
              Save Round
            </Button>
            {!allDiceUsed ? <p className="text-center">Not all dice used</p> : ""}
            {!allPlayedTilesValid ? <p className="text-center">Not all tiles are in valid locations</p> : ""}
            {!noMoreThanFivePlayed ? <p className="text-center">To many specials used this round</p> : ""}
          </Row>
          <Row>
            <Col lg={4}></Col>
            <Col lg={4}>
              <Table responsive bordered size="sm">
                <thead>
                  <tr>
                    <th>Connections</th>
                    <th>Road</th>
                    <th>Rail</th>
                    <th>Centre</th>
                    <th>Mistakes</th>
                    <th>Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{connectionScore}</td>
                    <td>{roadScore}</td>
                    <td>{railScore}</td>
                    <td>{centreScore}</td>
                    <td>
                      {mistakeScore ? "-" : ""}
                      {mistakeScore}
                    </td>
                    <td>{totalScore}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </DndProvider>
      </Container>
    </main>
  );

  function populateGraphForDirection(
    selfId: string,
    selfConn: string,
    selfTile: Tile,
    surrSqId: string,
    surrSqConn: string,
    surrSqTile: Tile
  ) {
    if (!isValidConnection(selfConn, surrSqConn)) return;

    const isRailConnection = selfConn === "t";
    const selfTileIsBridge = selfTile.tileType.id === "bridge";
    const surrTileIsBridge = surrSqTile.tileType.id === "bridge";

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

  function populateValidityGraphForDirection(selfId: string, selfConn: string, surrSqId: string, surrSqConn: string) {
    if (isValidConnection(selfConn, surrSqConn)) {
      validityGraph.addVertex(surrSqId);
      validityGraph.addEdge(selfId, surrSqId);
    }
  }
}
