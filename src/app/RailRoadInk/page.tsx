"use client";

import DroppableBoardSquare from "@/components/RailRoadInk/DroppableBoardSquare/DroppableBoardSquare";
import { DropResult, Orientiations, Tile, dualTypeDice, singleTypeDice, specials } from "@/types/railRoadInk";
import { Button, Col, Container, Row } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./RailRoadInk.scss";
import DroppableTilePool from "@/components/RailRoadInk/DroppableTilePool/DroppableTilePool";
import _ from "lodash";
import { useState, useEffect } from "react";
import { shiftConnections } from "@/helpers/railRoadInk";
import { Graph, depthFirstTraversal } from "@/helpers/graph";

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
  const [roadGraph, setRoadGraph] = useState(new Graph());
  const [railGraph, setRailGraph] = useState(new Graph());

  const boardArray = [...Array(7)].map(() => [...Array(7)].map(() => null));

  useEffect(() => {
    if (!isInit) {
      starterSquares.map((x) => {
        graph.addVertex(x);
      });
      setGraph(graph);

      specials.map((dice, i) => {
        specialsMap.set(`specials,${i}`, {
          tileType: dice,
          orientation: Orientiations.UP,
          inverted: false,
        });
      });

      setSpecialsMap(new Map<string, Tile>(specialsMap));

      const rolledDice = [
        dualTypeDice[Math.floor(Math.random() * 6)],
        singleTypeDice[Math.floor(Math.random() * 6)],
        singleTypeDice[Math.floor(Math.random() * 6)],
        singleTypeDice[Math.floor(Math.random() * 6)],
      ];

      rolledDice.map((dice, i) => {
        diceMap.set(`dice,${i}`, {
          tileType: dice,
          orientation: Orientiations.UP,
          inverted: false,
        });
      });

      setDiceMap(new Map<string, Tile>(diceMap));
      setIsInit(true);
    }
  });

  function calculateScore() {
    const uniqTest = _.uniqBy(
      starterSquares.map((x) => _.sortBy(depthFirstTraversal(graph, x).filter((str) => starterSquares.includes(str)))),
      function (item) {
        return JSON.stringify(item);
      }
    );
    const connectedSets = uniqTest.map((y) => getPoints(y.length));
    setConnectionScore(_.sum(connectedSets));

    const allIds = boardArray
      .map((_, i) => {
        return boardArray[i].map((_, j) => {
          return `${i},${j}`;
        });
      })
      .flat();

    const uniqueRailSections = _.uniqBy(
      allIds.map((x) =>
        _.sortBy(depthFirstTraversal(railGraph, x).filter((str) => !str.includes("-") && !str.includes("7")))
      ),
      function (item) {
        return JSON.stringify(item);
      }
    );
    const railLengths = uniqueRailSections.map((y) => y.length);
    setRailScore(_.max(railLengths) ?? 0);

    const uniqueRoadSections = _.uniqBy(
      allIds.map((x) =>
        _.sortBy(depthFirstTraversal(roadGraph, x).filter((str) => !str.includes("-") && !str.includes("7")))
      ),
      function (item) {
        return JSON.stringify(item);
      }
    );
    const roadLengths = uniqueRoadSections.map((y) => y.length);
    setRoadScore(_.max(roadLengths) ?? 0);

    const centerScore = ["2,2", "2,3", "2,4", "3,2", "3,3", "3,4", "4,2", "4,3", "4,4"]
      .map((squareId) => lockedPieceMap.get(squareId))
      .filter((x) => x !== undefined).length;

    setCentreScore(centerScore);
  }

  function getPoints(connectedCount: number) {
    return connectedCount === 12 ? 45 : (connectedCount - 1) * 4;
  }

  const totalScore = connectionScore + roadScore + railScore + centreScore - mistakeScore;

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
      setPlayedPieceMap(new Map(playedPieceMap));
    }
  }

  function getNextOrientation(orientation: string) {
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

  const handleStackMove = (dropResult: DropResult, item: { id: string; tile: Tile }) => {
    const ids = [0, 1, 2, 3, 4, 5];
    if (dropResult.id === "dice") {
      if (item.id.includes("specials") || item.id.includes("dice")) return;
      if (specials.includes(item.tile.tileType)) return;

      playedPieceMap.delete(item.id);
      const existingIds = [...diceMap.keys()].map((key) => parseInt(_.last(key)!));
      const availableIds = ids.filter((x) => !existingIds.includes(x));
      const lowestId = Math.min(...availableIds);
      setDiceMap(new Map(diceMap.set(`dice,${lowestId}`, item.tile)));
      setPlayedPieceMap(new Map(playedPieceMap));
    } else if (dropResult.id === "specials") {
      if (item.id.includes("dice") || item.id.includes("specials")) return;
      if (!specials.includes(item.tile.tileType)) return;

      playedPieceMap.delete(item.id);
      const existingIds = [...specialsMap.keys()].map((key) => parseInt(_.last(key)!));
      const availableIds = ids.filter((x) => !existingIds.includes(x));
      const lowestId = Math.min(...availableIds);
      setSpecialsMap(new Map(specialsMap.set(`specials,${lowestId}`, item.tile)));
      setPlayedPieceMap(new Map(playedPieceMap));
    } else {
      if (!item.id.includes("dice") || !item.id.includes("specials")) {
        playedPieceMap.delete(item.id);
      }

      if (item.id.includes("dice")) {
        diceMap.delete(item.id);
      } else if (item.id.includes("specials")) {
        specialsMap.delete(item.id);
      }

      setPlayedPieceMap(new Map(playedPieceMap.set(dropResult.id, item.tile)));
      setDiceMap(new Map(diceMap));
      setSpecialsMap(new Map(specialsMap));
    }
  };

  function isTileValid(squareId: string, tile: Tile | undefined) {
    if (!tile) return true;

    const surroundingSquares = getSurroundingSquares(squareId);

    if (surroundingSquares.every((t) => t.tile === undefined)) return false;
    const myConnections = shiftConnections(tile);

    const invalidConnections: boolean[] = [];
    const validConnections: boolean[] = [];
    for (const surroundingSquare of surroundingSquares) {
      if (surroundingSquare.tile) {
        const surrSqConns = shiftConnections(surroundingSquare.tile);
        switch (surroundingSquare.direction) {
          case "down":
            invalidConnections.push(isRoadToRailConnection(myConnections[2], surrSqConns[0]));
            validConnections.push(isValidConnection(myConnections[2], surrSqConns[0]));
            break;
          case "right":
            invalidConnections.push(isRoadToRailConnection(myConnections[1], surrSqConns[3]));
            validConnections.push(isValidConnection(myConnections[1], surrSqConns[3]));
            break;
          case "up":
            invalidConnections.push(isRoadToRailConnection(myConnections[0], surrSqConns[2]));
            validConnections.push(isValidConnection(myConnections[0], surrSqConns[2]));
            break;
          case "left":
            invalidConnections.push(isRoadToRailConnection(myConnections[3], surrSqConns[1]));
            validConnections.push(isValidConnection(myConnections[3], surrSqConns[1]));
            break;
          default:
        }
      }
    }

    if (invalidConnections.some((x) => x)) return false;

    if (validConnections.every((x) => !x)) return false;

    return true;
  }

  function isRoadToRailConnection(c1: string, c2: string) {
    return (c1 === "r" && c2 === "t") || (c2 === "r" && c1 === "t");
  }

  function isValidConnection(c1: string, c2: string) {
    return (c1 === "r" && c2 === "r") || (c2 === "t" && c1 === "t");
  }

  function getSurroundingSquares(squareId: string): { direction: string; id: string; tile?: Tile }[] {
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
      const surroundingSquares = getSurroundingSquares(id);
      const myConnections = shiftConnections(tile);

      for (const surroundingSquare of surroundingSquares) {
        if (surroundingSquare.tile) {
          const surrSqConns = shiftConnections(surroundingSquare.tile);
          switch (surroundingSquare.direction) {
            case "down":
              if (isValidConnection(myConnections[2], surrSqConns[0])) {
                if (surroundingSquare.tile.tileType.id === "bridge") {
                  graph.addVertex(`${surroundingSquare.id}r`);
                  roadGraph.addVertex(`${surroundingSquare.id}r`);
                  graph.addVertex(`${surroundingSquare.id}t`);
                  railGraph.addVertex(`${surroundingSquare.id}t`);

                  if (tile.tileType.id === "bridge") {
                    graph.addEdge(`${id}${myConnections[2]}`, `${surroundingSquare.id}${myConnections[2]}`);
                    if (myConnections[2] === "t") {
                      railGraph.addEdge(`${id}${myConnections[2]}`, `${surroundingSquare.id}${myConnections[2]}`);
                    } else {
                      roadGraph.addEdge(`${id}${myConnections[2]}`, `${surroundingSquare.id}${myConnections[2]}`);
                    }
                  } else {
                    graph.addEdge(id, `${surroundingSquare.id}${myConnections[2]}`);
                    if (myConnections[2] === "t") {
                      railGraph.addEdge(id, `${surroundingSquare.id}${myConnections[2]}`);
                    } else {
                      roadGraph.addEdge(id, `${surroundingSquare.id}${myConnections[2]}`);
                    }
                  }
                } else {
                  graph.addVertex(surroundingSquare.id);
                  if (myConnections[2] === "t") {
                    railGraph.addVertex(surroundingSquare.id);
                  } else {
                    roadGraph.addVertex(surroundingSquare.id);
                  }

                  if (tile.tileType.id === "bridge") {
                    graph.addEdge(`${id}${myConnections[2]}`, surroundingSquare.id);
                    if (myConnections[2] === "t") {
                      railGraph.addEdge(`${id}${myConnections[2]}`, surroundingSquare.id);
                    } else {
                      roadGraph.addEdge(`${id}${myConnections[2]}`, surroundingSquare.id);
                    }
                  } else {
                    graph.addEdge(id, surroundingSquare.id);
                    if (myConnections[2] === "t") {
                      railGraph.addEdge(id, surroundingSquare.id);
                    } else {
                      roadGraph.addEdge(id, surroundingSquare.id);
                    }
                  }
                }
              }
              break;
            case "right":
              if (isValidConnection(myConnections[1], surrSqConns[3])) {
                if (surroundingSquare.tile.tileType.id === "bridge") {
                  graph.addVertex(`${surroundingSquare.id}r`);
                  roadGraph.addVertex(`${surroundingSquare.id}r`);
                  graph.addVertex(`${surroundingSquare.id}t`);
                  railGraph.addVertex(`${surroundingSquare.id}t`);

                  if (tile.tileType.id === "bridge") {
                    graph.addEdge(`${id}${myConnections[1]}`, `${surroundingSquare.id}${myConnections[1]}`);
                    if (myConnections[1] === "t") {
                      railGraph.addEdge(`${id}${myConnections[1]}`, `${surroundingSquare.id}${myConnections[1]}`);
                    } else {
                      roadGraph.addEdge(`${id}${myConnections[1]}`, `${surroundingSquare.id}${myConnections[1]}`);
                    }
                  } else {
                    graph.addEdge(id, `${surroundingSquare.id}${myConnections[1]}`);
                    if (myConnections[1] === "t") {
                      railGraph.addEdge(id, `${surroundingSquare.id}${myConnections[1]}`);
                    } else {
                      roadGraph.addEdge(id, `${surroundingSquare.id}${myConnections[1]}`);
                    }
                  }
                } else {
                  graph.addVertex(surroundingSquare.id);
                  if (myConnections[1] === "t") {
                    railGraph.addVertex(surroundingSquare.id);
                  } else {
                    roadGraph.addVertex(surroundingSquare.id);
                  }

                  if (tile.tileType.id === "bridge") {
                    graph.addEdge(`${id}${myConnections[1]}`, surroundingSquare.id);
                    if (myConnections[1] === "t") {
                      railGraph.addEdge(`${id}${myConnections[1]}`, surroundingSquare.id);
                    } else {
                      roadGraph.addEdge(`${id}${myConnections[1]}`, surroundingSquare.id);
                    }
                  } else {
                    graph.addEdge(id, surroundingSquare.id);
                    if (myConnections[1] === "t") {
                      railGraph.addEdge(id, surroundingSquare.id);
                    } else {
                      roadGraph.addEdge(id, surroundingSquare.id);
                    }
                  }
                }
              }
              break;
            case "up":
              if (isValidConnection(myConnections[0], surrSqConns[2])) {
                if (surroundingSquare.tile.tileType.id === "bridge") {
                  graph.addVertex(`${surroundingSquare.id}r`);
                  roadGraph.addVertex(`${surroundingSquare.id}r`);
                  graph.addVertex(`${surroundingSquare.id}t`);
                  railGraph.addVertex(`${surroundingSquare.id}t`);

                  if (tile.tileType.id === "bridge") {
                    graph.addEdge(`${id}${myConnections[0]}`, `${surroundingSquare.id}${myConnections[0]}`);
                    if (myConnections[0] === "t") {
                      railGraph.addEdge(`${id}${myConnections[0]}`, `${surroundingSquare.id}${myConnections[0]}`);
                    } else {
                      roadGraph.addEdge(`${id}${myConnections[0]}`, `${surroundingSquare.id}${myConnections[0]}`);
                    }
                  } else {
                    graph.addEdge(id, `${surroundingSquare.id}${myConnections[0]}`);
                    if (myConnections[0] === "t") {
                      railGraph.addEdge(id, `${surroundingSquare.id}${myConnections[0]}`);
                    } else {
                      roadGraph.addEdge(id, `${surroundingSquare.id}${myConnections[0]}`);
                    }
                  }
                } else {
                  graph.addVertex(surroundingSquare.id);
                  if (myConnections[0] === "t") {
                    railGraph.addVertex(surroundingSquare.id);
                  } else {
                    roadGraph.addVertex(surroundingSquare.id);
                  }

                  if (tile.tileType.id === "bridge") {
                    graph.addEdge(`${id}${myConnections[0]}`, surroundingSquare.id);
                    if (myConnections[0] === "t") {
                      railGraph.addEdge(`${id}${myConnections[0]}`, surroundingSquare.id);
                    } else {
                      roadGraph.addEdge(`${id}${myConnections[0]}`, surroundingSquare.id);
                    }
                  } else {
                    graph.addEdge(id, surroundingSquare.id);
                    if (myConnections[0] === "t") {
                      railGraph.addEdge(id, surroundingSquare.id);
                    } else {
                      roadGraph.addEdge(id, surroundingSquare.id);
                    }
                  }
                }
              }
              break;
            case "left":
              if (isValidConnection(myConnections[3], surrSqConns[1])) {
                if (surroundingSquare.tile.tileType.id === "bridge") {
                  graph.addVertex(`${surroundingSquare.id}r`);
                  roadGraph.addVertex(`${surroundingSquare.id}r`);
                  graph.addVertex(`${surroundingSquare.id}t`);
                  railGraph.addVertex(`${surroundingSquare.id}t`);

                  if (tile.tileType.id === "bridge") {
                    graph.addEdge(`${id}${myConnections[3]}`, `${surroundingSquare.id}${myConnections[3]}`);
                    if (myConnections[3] === "t") {
                      railGraph.addEdge(`${id}${myConnections[3]}`, `${surroundingSquare.id}${myConnections[3]}`);
                    } else {
                      roadGraph.addEdge(`${id}${myConnections[3]}`, `${surroundingSquare.id}${myConnections[3]}`);
                    }
                  } else {
                    graph.addEdge(id, `${surroundingSquare.id}${myConnections[3]}`);
                    if (myConnections[3] === "t") {
                      railGraph.addEdge(id, `${surroundingSquare.id}${myConnections[3]}`);
                    } else {
                      roadGraph.addEdge(id, `${surroundingSquare.id}${myConnections[3]}`);
                    }
                  }
                } else {
                  graph.addVertex(surroundingSquare.id);
                  if (myConnections[3] === "t") {
                    railGraph.addVertex(surroundingSquare.id);
                  } else {
                    roadGraph.addVertex(surroundingSquare.id);
                  }

                  if (tile.tileType.id === "bridge") {
                    graph.addEdge(`${id}${myConnections[3]}`, surroundingSquare.id);
                    if (myConnections[3] === "t") {
                      railGraph.addEdge(`${id}${myConnections[3]}`, surroundingSquare.id);
                    } else {
                      roadGraph.addEdge(`${id}${myConnections[3]}`, surroundingSquare.id);
                    }
                  } else {
                    graph.addEdge(id, surroundingSquare.id);
                    if (myConnections[3] === "t") {
                      railGraph.addEdge(id, surroundingSquare.id);
                    } else {
                      roadGraph.addEdge(id, surroundingSquare.id);
                    }
                  }
                }
              }
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
      const rolledDice = [
        dualTypeDice[Math.floor(Math.random() * 6)],
        singleTypeDice[Math.floor(Math.random() * 6)],
        singleTypeDice[Math.floor(Math.random() * 6)],
        singleTypeDice[Math.floor(Math.random() * 6)],
      ];

      rolledDice.map((dice, i) => {
        diceMap.set(`dice,${i}`, {
          tileType: dice,
          orientation: Orientiations.UP,
          inverted: false,
        });
      });

      setDiceMap(new Map<string, Tile>(diceMap));
    } else {
      setGameComplete(true);
    }

    calculateScore();
    setLockedPieceMap(new Map(lockedPieceMap));
    setPlayedPieceMap(new Map<string, Tile>());
    setRound(nextRound);
  }

  const allDiceUsed = [...diceMap.keys()].length === 0;
  let allPlayedTilesValid = true;
  for (const [squareId, tile] of playedPieceMap) {
    allPlayedTilesValid = allPlayedTilesValid && isTileValid(squareId, tile);
  }
  const noMoreThanFivePlayed = [...playedPieceMap.keys()].length <= 5;
  const saveEnabled = !gameComplete && allDiceUsed && allPlayedTilesValid && noMoreThanFivePlayed;

  return (
    <main>
      <Container>
        <DndProvider backend={HTML5Backend}>
          <Row>
            <Col xs={2}>
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
            <Col xs={8}>
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
                      isValid = isTileValid(id, tile);
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
            <Col xs={2}>
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
          <Row className="pt-5">
            <Button disabled={!saveEnabled} onClick={saveRound}>
              Save Round
            </Button>
            {!allDiceUsed ? <p>Not all dice used</p> : ""}
            {!allPlayedTilesValid ? <p>Not all tiles are in valid locations</p> : ""}
            {!noMoreThanFivePlayed ? <p>To many specials used this round</p> : ""}
            {gameComplete ? <p>Game complete</p> : ""}
            Score {totalScore}
            Connection Score {connectionScore}
            Road Score {roadScore}
            Rail Score {railScore}
            Centre Score {centreScore}
          </Row>
          <Row>{JSON.stringify(graph)}</Row>
        </DndProvider>
      </Container>
    </main>
  );
}
