import { GamePlayedTile, TurnTile, TurnToken, PlayedToken } from "@/types/cascadia";
import Tile from "../Tile/Tile";
import _ from "lodash";
import "./PlayZone.scss";
import DroppableHex from "../DroppableHex/DroppableHex";
import DraggableTile from "../DraggableTile/DraggableTile";
import DraggableToken from "../DraggableToken/DraggableToken";
import DroppableTokenZone from "../DroppableTokenZone/DroppableTokenZone";
import { OffsetHex } from "../OffsetHex/OffsetHex";
import AnimalToken from "../AnimalToken/AnimalToken";

export default function PlayZone({
  playedTiles,
  playedTokens,
  turnTile,
  turnToken,
}: {
  playedTiles: GamePlayedTile[];
  playedTokens: PlayedToken[];
  turnTile?: TurnTile;
  turnToken?: TurnToken;
}) {
  const lockedInTileCoords: [number, number][] = playedTiles.map((pt) => [pt.row, pt.column]);
  const dropZoneCoords = getDropZones(lockedInTileCoords);

  const rowOffset = _.max(dropZoneCoords.filter((x) => x[0] < 0).map((x) => Math.abs(x[0]))) ?? 0;
  const colOffset = _.max(dropZoneCoords.filter((x) => x[1] < 0).map((x) => Math.abs(x[1]))) ?? 0;

  const isTurnTokenOnTurnTile =
    turnTile && turnToken && turnTile.row == turnToken.row && turnTile.column == turnToken.column;

  const turnTileContent = turnTile ? (
    <DraggableTile
      id={`${turnTile.tileIndex}`}
      tile={{ row: turnTile.row, column: turnTile.column, tile: turnTile.tile }}
      isDraggable={true}
    >
      <DroppableTokenZone row={turnTile.row} column={turnTile.column} possibleAnimals={turnTile.tile.validAnimals}>
        {isTurnTokenOnTurnTile ? (
          <DraggableToken id={`${turnToken.tokenIndex}`} animal={turnToken.animal} isDraggable={true} />
        ) : null}
      </DroppableTokenZone>
    </DraggableTile>
  ) : null;

  return (
    <div className="play-zone">
      <div className="hex-container">
        {lockedInTileCoords.map((x) => {
          const tile = playedTiles.find((t) => t.row === x[0] && t.column === x[1]);
          const token = playedTokens.find((t) => t.row === x[0] && t.column === x[1]);
          const isTurnTokenTile = turnToken && turnToken.row === x[0] && turnToken.column === x[1];

          if (!tile) return;

          return (
            <OffsetHex key={`pz${x[0]}-${x[1]}`} row={x[0]} column={x[1]} rowOffset={rowOffset} columnOffset={colOffset}>
              <Tile tile={tile.tile}>
                {token ? (
                  <AnimalToken animal={token.animal} possibleAnimals={[]} />
                ) : (
                  <DroppableTokenZone row={x[0]} column={x[1]} possibleAnimals={tile.tile.validAnimals}>
                    {isTurnTokenTile ? (
                      <DraggableToken id={`${turnToken.tokenIndex}`} animal={turnToken.animal} isDraggable={true} />
                    ) : null}
                  </DroppableTokenZone>
                )}
              </Tile>
            </OffsetHex>
          );
        })}
        {dropZoneCoords.map((x) => {
          const tile = turnTile?.row === x[0] && turnTile?.column === x[1] ? turnTile : undefined;
          return (
            <OffsetHex row={x[0]} column={x[1]} rowOffset={rowOffset} columnOffset={colOffset}>
              <DroppableHex key={`${x[0]},${x[1]}`} row={x[0]} column={x[1]} tile={tile} handleClick={() => null}>
                {tile ? turnTileContent : <Placeholder />}
              </DroppableHex>
            </OffsetHex>
          );
        })}
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="hexagon unfilled">
      <div className="hexTop unfilled" />
      <div className="hexBottom unfilled" />
    </div>
  );
}

function getDropZones(playedCoords: [number, number][]): [number, number][] {
  const adjTransforms = [
    [
      [0, 1],
      [-1, 1],
      [-1, 0],
      [0, -1],
      [1, 0],
      [1, 1],
    ],
    // odd rows
    [
      [0, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
    ],
  ];
  const allCoords: [number, number][] = [];
  for (const playedCoord of playedCoords) {
    const relevantTransforms = adjTransforms[Math.abs(playedCoord[0]) % 2];
    relevantTransforms.map((x) => {
      allCoords.push([playedCoord[0] + x[0], playedCoord[1] + x[1]]);
    });
  }
  const unplayedCoords = allCoords.filter(
    (x) => !playedCoords.map((x) => JSON.stringify(x)).includes(JSON.stringify(x))
  );
  const uniqueCoords = _.uniqBy(unplayedCoords, function (item) {
    return JSON.stringify(item);
  });
  return uniqueCoords;
}
