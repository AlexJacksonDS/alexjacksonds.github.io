import { GamePlayedTile } from "@/types/cascadia";
import { CSSProperties } from "react";
import Tile from "../Tile/Tile";
import AnimalToken from "../AnimalToken/AnimalToken";
import DroppableTokenZone from "../DroppableTokenZone/DroppableTokenZone";

export function PlayedTile({
  playedTile,
  rowOffset,
  columnOffset,
  edgeWidth = 5,
  radius = 50,
}: {
  playedTile: GamePlayedTile;
  rowOffset: number;
  columnOffset: number;
  edgeWidth?: number;
  radius?: number;
}) {
  const edgeLength = (radius * 2) / Math.sqrt(3);
  const fullHexHeight = edgeLength * 2 + edgeWidth * 2;
  const fullHexWidth = edgeLength * Math.sqrt(3) + edgeWidth * 2;
  const displayColumn = playedTile.column + columnOffset + (playedTile.row % 2 == 0 ? 0.5 : 0);

  const style: CSSProperties = {
    top: `${fullHexHeight * 0.75 * (playedTile.row + rowOffset)}px`,
    left: `${fullHexWidth * displayColumn}px`,
    width: `${fullHexWidth}px`,
    height: `${fullHexHeight}px`,
    position: "absolute",
  };
  return (
    <div className="hex" style={style}>
      <Tile tile={playedTile.tile}>
        {playedTile.animal ? (
          <AnimalToken animal={playedTile.animal} possibleAnimals={[]} />
        ) : (
          <DroppableTokenZone
            row={playedTile.row}
            column={playedTile.column}
            possibleAnimals={playedTile.tile.animals}
          />
        )}
      </Tile>
    </div>
  );
}
