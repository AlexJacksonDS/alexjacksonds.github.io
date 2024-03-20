"use client";

import DroppableBoardSquare from "@/components/RailRoadInk/DroppableBoardSquare/DroppableBoardSquare";
import { DropResult, Orientations, Pools, Tile, specials } from "@/types/railRoadInk";
import { Button, Col, Container, Row } from "react-bootstrap";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import DroppableTilePool from "@/components/RailRoadInk/DroppableTilePool/DroppableTilePool";
import _ from "lodash";
import { useState, useEffect } from "react";
import { Graph } from "@/helpers/graph";
import {
  boardArray,
  getCentreScore,
  getConnectionScore,
  getLongestPathScore,
  getMistakeScore,
  getNextOrientation,
  isTileValid,
  rollTileDice,
  starterSquares,
  updateMapsAndGraphs,
  updateValidityGraph,
} from "@/services/railRoadInk.service";
import { isMobile } from "react-device-detect";
import { RriScoreboard } from "./RriScoreboard/RriScoreboard";

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
          orientation: Orientations.UP,
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

  const allDiceUsed = [...diceMap.keys()].length === 0;
  let allPlayedTilesValid = true;
  for (const [squareId, tile] of playedPieceMap) {
    allPlayedTilesValid =
      allPlayedTilesValid && isTileValid(squareId, tile, playedPieceMap, lockedPieceMap, validityGraph);
  }
  const noMoreThanFivePlayed = [...playedPieceMap.keys()].length <= 5;
  const saveEnabled = !gameComplete && allDiceUsed && allPlayedTilesValid && noMoreThanFivePlayed;

  function handleTileClick(id: string, isLeftClick: boolean) {
    if (id.includes(Pools.DICE) || id.includes(Pools.SPECIALS)) return;

    const tile = playedPieceMap.get(id);

    if (tile) {
      if (isLeftClick) {
        tile.orientation = getNextOrientation(tile.orientation);
      } else {
        tile.inverted = !tile.inverted;
      }

      playedPieceMap.set(id, tile);
      updateValidityGraph(id, tile, validityGraph, playedPieceMap, lockedPieceMap);
      setValidityGraph(validityGraph);
      setPlayedPieceMap(new Map(playedPieceMap));
    }
  }

  const handleStackMove = (dropResult: DropResult, item: { id: string; tile: Tile }) => {
    const ids = [0, 1, 2, 3, 4, 5];
    if (dropResult.id === Pools.DICE) {
      if (item.id.includes(Pools.SPECIALS) || item.id.includes(Pools.DICE)) return;
      if (specials.includes(item.tile.tileType)) return;

      playedPieceMap.delete(item.id);
      validityGraph.removeVertex(item.id);
      const existingIds = [...diceMap.keys()].map((key) => parseInt(_.last(key)!));
      const availableIds = ids.filter((x) => !existingIds.includes(x));
      const lowestId = Math.min(...availableIds);
      setDiceMap(new Map(diceMap.set(`dice,${lowestId}`, item.tile)));
      setPlayedPieceMap(new Map(playedPieceMap));
    } else if (dropResult.id === Pools.SPECIALS) {
      if (item.id.includes(Pools.DICE) || item.id.includes(Pools.SPECIALS)) return;
      if (!specials.includes(item.tile.tileType)) return;

      playedPieceMap.delete(item.id);
      validityGraph.removeVertex(item.id);
      const existingIds = [...specialsMap.keys()].map((key) => parseInt(_.last(key)!));
      const availableIds = ids.filter((x) => !existingIds.includes(x));
      const lowestId = Math.min(...availableIds);
      setSpecialsMap(new Map(specialsMap.set(`specials,${lowestId}`, item.tile)));
      setPlayedPieceMap(new Map(playedPieceMap));
    } else {
      if (!item.id.includes(Pools.DICE) || !item.id.includes(Pools.SPECIALS)) {
        playedPieceMap.delete(item.id);
        validityGraph.removeVertex(item.id);
      }

      if (item.id.includes(Pools.DICE)) {
        diceMap.delete(item.id);
      } else if (item.id.includes(Pools.SPECIALS)) {
        specialsMap.delete(item.id);
      }

      updateValidityGraph(dropResult.id, item.tile, validityGraph, playedPieceMap, lockedPieceMap);
      setValidityGraph(validityGraph);
      setPlayedPieceMap(new Map(playedPieceMap.set(dropResult.id, item.tile)));
      setDiceMap(new Map(diceMap));
      setSpecialsMap(new Map(specialsMap));
    }
  };

  const saveRound = () => {
    updateMapsAndGraphs(playedPieceMap, lockedPieceMap, graph, roadGraph, railGraph);

    const nextRound = round + 1;
    if (nextRound < 8) {
      setDiceMap(new Map<string, Tile>(rollTileDice()));
    } else {
      setGameComplete(true);
    }
    setRound(nextRound);

    setConnectionScore(getConnectionScore(graph));
    setRailScore(getLongestPathScore(railGraph, lockedPieceMap));
    setRoadScore(getLongestPathScore(roadGraph, lockedPieceMap));
    setCentreScore(getCentreScore(lockedPieceMap));
    setMistakeScore(getMistakeScore(lockedPieceMap));

    setGraph(graph);
    setRailGraph(railGraph);
    setRoadGraph(roadGraph);

    setLockedPieceMap(new Map(lockedPieceMap));
    setPlayedPieceMap(new Map<string, Tile>());
  };

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
            <Col lg={12} xl={2}>
              <Container className="specials-container">
                <p>Specials</p>
                <DroppableTilePool
                  id={Pools.SPECIALS}
                  tiles={specialsMap}
                  handleStackMove={handleStackMove}
                  handleClick={handleTileClick}
                />
              </Container>
            </Col>
            <Col lg={12} xl={8} className="board-column">
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
            <Col lg={12} xl={2}>
              <Container className="dice-container">
                <p>Dice</p>
                <DroppableTilePool
                  id={Pools.DICE}
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
              <RriScoreboard
                connectionScore={connectionScore}
                roadScore={roadScore}
                railScore={railScore}
                centreScore={centreScore}
                mistakeScore={mistakeScore}
              />
            </Col>
          </Row>
        </DndProvider>
      </Container>
    </main>
  );
}


