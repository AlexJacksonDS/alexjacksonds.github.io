import { Terrain, Tile } from "@/types/cartographers";
import "./Tile.scss";

export default function Tile({ tile }: { tile: Tile }) {
  const terrainKey = Object.keys(Terrain)[Object.values(Terrain).indexOf(tile.terrain)].toLowerCase();

  function getTileSymbol() {
    if (tile.isRuin && tile.terrain !== Terrain.Monster) return "\uD83C\uDFDB";

    switch (tile.terrain) {
      case Terrain.Mountain:
        return "\uD83C\uDFD4";
      case Terrain.Monster:
        return "\uD83D\uDE08";
      default:
        return "";
    }
  }

  return <div className={"tile " + terrainKey}>{getTileSymbol()}</div>;
}
