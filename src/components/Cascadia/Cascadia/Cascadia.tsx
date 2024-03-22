"use client";

import { AnimalTypes, DropResult, GamePlayedTile, OfferRow, Orientation, allTiles, startTiles } from "@/types/cascadia";
import PlayZone from "../PlayZone/PlayZone";
import OfferRowDisplay from "../OfferRow/OfferRow";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormGroup, Row } from "react-bootstrap";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { DndProvider } from "react-dnd-multi-backend";
import _ from "lodash";
import "./Cascadia.scss";
import { DragHandlerContext } from "../context";

export default function Cascadia() {
  const [currentTile, setCurrentTile] = useState<GamePlayedTile | undefined>(undefined);
  const [isInit, setIsInit] = useState(false);
  const [offerRow, setOfferRow] = useState<OfferRow>({ tiles: [], animals: [] });
  const [playedTiles, setPlayedTiles] = useState(startTiles);

  useEffect(() => {
    if (!isInit) {
      setOfferRow({
        tiles: _.sampleSize(allTiles, 4),
        animals: _.sampleSize(AnimalTypes, 4),
      });
      setIsInit(true);
    }
  });

  const handleDragTile = (dropResult: DropResult, item: { id: string; tile: GamePlayedTile }) => {
    const playedTile: GamePlayedTile = {
      row: dropResult.row,
      column: dropResult.column,
      tile: item.tile.tile,
      animal: item.tile.animal,
    };
    setCurrentTile(playedTile);
  };

  const handleDragToken = (dropResult: DropResult, item: { id: string; animal: AnimalTypes }) => {
    const dropzoneTile = playedTiles.find((pt) => pt.row === dropResult.row && pt.column === dropResult.column);

    if (dropzoneTile) {
      const index = playedTiles.indexOf(dropzoneTile);
      const newArray = [...playedTiles];
      dropzoneTile.animal = item.animal;
      newArray[index] = dropzoneTile;
      setPlayedTiles(newArray);
    } else if (currentTile && currentTile.row === dropResult.row && currentTile.column === dropResult.column) {
      const newItem = { ...currentTile };
      newItem.animal = item.animal;
      setCurrentTile(newItem);
    }
  };

  const handleTileClick = (row: number, column: number, tile?: GamePlayedTile) => {
    if (!tile) return;

    const playedTile: GamePlayedTile = {
      row: row,
      column: column,
      tile: { ...tile.tile, orientation: getNextOrientation(tile.tile.orientation) },
      animal: tile.animal,
    };
    setCurrentTile(playedTile);
  };

  function saveRound() {
    if (currentTile) {
      const newArray = [...playedTiles];
      newArray.push(currentTile);
      setPlayedTiles(newArray);
      setCurrentTile(undefined);
      setOfferRow({
        tiles: _.sampleSize(allTiles, 4),
        animals: _.sampleSize(AnimalTypes, 4),
      });
    }
  }

  return (
    <Container className="cascadia">
      <DndProvider options={HTML5toTouch}>
        <DragHandlerContext.Provider value={{ handleDragTile, handleDragToken, handleTileClick }}>
          <Row>
            <Col xl={4}>
              <OfferRowDisplay offerRow={offerRow} />
            </Col>
          </Row>
          <Row>
            <FormGroup>
              <Button className="save-button mx-auto" onClick={saveRound}>
                Save Round
              </Button>
            </FormGroup>
          </Row>
          <Row>
            <Col>
              <PlayZone playedTiles={playedTiles} currentTile={currentTile} />
            </Col>
          </Row>
        </DragHandlerContext.Provider>
      </DndProvider>
    </Container>
  );
}

function getNextOrientation(orientation: Orientation) {
  switch (orientation) {
    case Orientation.TOP:
      return Orientation.TOPRIGHT;
    case Orientation.TOPRIGHT:
      return Orientation.BOTTOMRIGHT;
    case Orientation.BOTTOMRIGHT:
      return Orientation.BOTTOM;
    case Orientation.BOTTOM:
      return Orientation.BOTTOMLEFT;
    case Orientation.BOTTOMLEFT:
      return Orientation.TOPLEFT;
    case Orientation.TOPLEFT:
      return Orientation.TOP;
  }
}
