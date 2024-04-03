import { GamePlayedTile, PlayedToken } from "@/types/cascadia";
import Tile from "../Tile/Tile";
import _ from "lodash";
import "./OtherPlayZone.scss";
import { OffsetHex } from "../OffsetHex/OffsetHex";
import AnimalToken from "../AnimalToken/AnimalToken";

export default function OtherPlayZone({
  isTurn,
  name,
  tokens,
  playedTiles,
  playedTokens,
}: {
  isTurn: boolean;
  name: string;
  tokens: number;
  playedTiles: GamePlayedTile[];
  playedTokens: PlayedToken[];
}) {
  const lockedInTileCoords: [number, number][] = playedTiles.map((pt) => [pt.row, pt.column]);

  const noOfRows =
    Math.max(...lockedInTileCoords.map((x) => x[0])) - Math.min(...lockedInTileCoords.map((x) => x[0])) + 1;
  const noOfCols =
    Math.max(...lockedInTileCoords.map((x) => x[1])) - Math.min(...lockedInTileCoords.map((x) => x[1]));

  const height = (noOfRows + 1) * 1.5 * 60;
  const width = 20 + (noOfCols + 1.5) * 110;

  const rowOffset = _.max(lockedInTileCoords.filter((x) => x[0] < 0).map((x) => Math.abs(x[0]))) ?? 0;
  const colOffset = _.max(lockedInTileCoords.filter((x) => x[1] < 0).map((x) => Math.abs(x[1]))) ?? 0;

  return (
    <div className={"other-play-zone" + (isTurn ? " current-player" : "")}>
      <p>{name}</p>
      <p>
        {"\uD83C\uDF32"} : {tokens}
      </p>
      <div className="hex-container" style={{ height: `${height}px`, width: `${width}px` }}>
        {lockedInTileCoords.map((x) => {
          const tile = playedTiles.find((t) => t.row === x[0] && t.column === x[1]);
          const token = playedTokens.find((t) => t.row === x[0] && t.column === x[1]);

          if (!tile) return;

          return (
            <OffsetHex
              key={`pz${x[0]}-${x[1]}`}
              row={x[0]}
              column={x[1]}
              rowOffset={rowOffset}
              columnOffset={colOffset}
            >
              <Tile tile={tile.tile}>
                {token ? (
                  <AnimalToken animal={token.animalToken} possibleAnimals={[]} />
                ) : (
                  <AnimalToken possibleAnimals={tile.tile.validAnimals} />
                )}
              </Tile>
            </OffsetHex>
          );
        })}
      </div>
    </div>
  );
}
