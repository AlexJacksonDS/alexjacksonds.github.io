"use client";

import DroppableBoardSquare from "@/components/RailRoadInk/DroppableBoardSquare/DroppableBoardSquare";
import {
  BoardTile,
  DefaultTileTypes,
  DropResult,
  GameState,
  Orientiations,
  dualTypeDice,
  singleTypeDice,
} from "@/types/railRoadInk";
import { Col, Container, Row } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./RailRoadInk.scss";
import DroppableTilePool from "@/components/RailRoadInk/DroppableTilePool/DroppableTilePool";
import { useReferredState } from "@/helpers/referredStateHelper";
import _ from "lodash";
import { useState, useEffect } from "react";
import { moveTile } from "./RailRoadInk";

export default function RailRoadInk() {
  const [gameState, gameStateRef, setGameState] = useReferredState<GameState | undefined>(undefined);
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (!isInit) {
      setGameState({
        board: [...Array(7)].map((e, i) => [...Array(7)].map((e, j) => ({ id: `${i},${j}`, isLockedIn: false }))),
        dice: [
          dualTypeDice[Math.floor(Math.random() * 6)],
          singleTypeDice[Math.floor(Math.random() * 6)],
          singleTypeDice[Math.floor(Math.random() * 6)],
          singleTypeDice[Math.floor(Math.random() * 6)],
        ].map((t, i) => ({
          id: "dice" + i,
          tile: {
            tileType: t,
            orientation: Orientiations.UP,
            inverted: false,
          },
          isLockedIn: false,
        })),
        specials: specials,
      });
      setIsInit(true);
    }
  });

  function handleTileClick(id: string) {
    alert(id);
  }

  const handleStackMove = (dropResult: DropResult, stackId: string) => {
    if (!gameState) return;
    const newGameState = moveTile(gameState, dropResult, stackId);
    setGameState(newGameState);
  };
  // function handleStackMove(dropResult: DropResult, stackId: string) {}
  return (
    <main>
      <Container>
        {gameState ? (
          <GameBoard gameState={gameState} handleStackMove={handleStackMove} handleClick={handleTileClick} />
        ) : null}
      </Container>
    </main>
  );
}

export const specials: BoardTile[] = [
  {
    id: "special" + DefaultTileTypes.XRAIL.id,
    tile: {
      tileType: DefaultTileTypes.XRAIL,
      orientation: Orientiations.UP,
      inverted: false,
    },
    isLockedIn: false,
  },
  {
    id: "special" + DefaultTileTypes.XROAD.id,
    tile: {
      tileType: DefaultTileTypes.XROAD,
      orientation: Orientiations.UP,
      inverted: false,
    },
    isLockedIn: false,
  },
  {
    id: "special" + DefaultTileTypes.XRRRT.id,
    tile: {
      tileType: DefaultTileTypes.XRRRT,
      orientation: Orientiations.UP,
      inverted: false,
    },
    isLockedIn: false,
  },
  {
    id: "special" + DefaultTileTypes.XTTTR.id,
    tile: {
      tileType: DefaultTileTypes.XTTTR,
      orientation: Orientiations.UP,
      inverted: false,
    },
    isLockedIn: false,
  },
  {
    id: "special" + DefaultTileTypes.XTRTR.id,
    tile: {
      tileType: DefaultTileTypes.XTRTR,
      orientation: Orientiations.UP,
      inverted: false,
    },
    isLockedIn: false,
  },
  {
    id: "special" + DefaultTileTypes.XTTRR.id,
    tile: {
      tileType: DefaultTileTypes.XTTRR,
      orientation: Orientiations.UP,
      inverted: false,
    },
    isLockedIn: false,
  },
];

export function GameBoard({
  gameState,
  handleStackMove,
  handleClick,
}: {
  gameState: GameState;
  handleStackMove: (dropResult: DropResult, stackId: string) => void;
  handleClick: (id: string) => void;
}) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Row>
        <Col xs={2}></Col>
        <Col xs={8}>
          <Container className="board-container">
            {gameState.board.map((e, i) => {
              return gameState.board[i].map((e, j) => {
                return (
                  <DroppableBoardSquare
                    key={e.id}
                    boardTile={e}
                    handleStackMove={handleStackMove}
                    handleClick={handleClick}
                  />
                );
              });
            })}
          </Container>
        </Col>
        <Col xs={2}>
          <Container className="dice-container">
            <DroppableTilePool
              id="dice"
              boardTiles={gameState.dice}
              handleStackMove={handleStackMove}
              handleClick={handleClick}
            />
          </Container>
        </Col>
      </Row>
      <Row>
        <Col></Col>
        <Col xs={8}>
          <Container className="specials-container">
            <DroppableTilePool
              id="specials"
              boardTiles={gameState.specials}
              handleStackMove={handleStackMove}
              handleClick={handleClick}
            />
          </Container>
        </Col>
        <Col></Col>
      </Row>
    </DndProvider>
  );
}
