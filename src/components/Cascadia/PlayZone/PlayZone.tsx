import { GamePlayedTile } from "@/types/cascadia";
import { PlayedTile } from "../PlayedTile/PlayedTile";
import _ from "lodash";
import "./PlayZone.scss";
import DroppableHex from "../DroppableHex/DroppableHex";

export default function PlayZone({
  playedTiles,
  currentTile,
}: {
  playedTiles: GamePlayedTile[];
  currentTile?: GamePlayedTile;
}) {
  const playedCoords: [number, number][] = playedTiles.map((pt) => [pt.row, pt.column]);
  const dropZoneCoords = getDropZones(playedCoords);

  const rowOffset = _.max(dropZoneCoords.filter((x) => x[0] < 0).map((x) => Math.abs(x[0]))) ?? 0;
  const colOffset = _.max(dropZoneCoords.filter((x) => x[1] < 0).map((x) => Math.abs(x[1]))) ?? 0;

  return (
    <div className="play-zone">
      <div className="hex-container">
        {playedTiles.map((t) => (
          <PlayedTile key={`${t.row},${t.column}`} playedTile={t} rowOffset={rowOffset} columnOffset={colOffset} />
        ))}
        {dropZoneCoords.map((x) => {
          const tile = currentTile?.row === x[0] && currentTile?.column === x[1] ? currentTile : undefined;
          return (
            <DroppableHex
              key={`${x[0]},${x[1]}`}
              row={x[0]}
              column={x[1]}
              tile={tile}
              rowOffset={rowOffset}
              columnOffset={colOffset}
              handleClick={() => null}
            />
          );
        })}
      </div>
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
