import { Terrain, Tile } from "@/types/cartographers";
import "./Tile.scss";

export default function Tile({ tile, small }: { tile: Tile; small?: boolean }) {
  const terrainKey = Object.keys(Terrain)[Object.values(Terrain).indexOf(tile.terrain)].toLowerCase();

  function getPrimarySymbol() {
    if (tile.isRuin && tile.terrain !== Terrain.Monster) return "\uD83C\uDFDB";

    return getTerrainSymbol();
  }

  function getSecondarySymbol() {
    if (tile.terrain === Terrain.Mountain) {
      return "\uD83D\uDFE1";
    }

    if (tile.isRuin && tile.terrain === Terrain.Monster) return "\uD83C\uDFDB";

    if (tile.isRuin) {
      return getTerrainSymbol();
    }
  }

  function getTerrainSymbol() {
    switch (tile.terrain) {
      case Terrain.Field:
        return "\uD83C\uDF3E";
      case Terrain.Forest:
        return "\uD83C\uDF32";
      case Terrain.Water:
        return "\uD83D\uDCA7";
      case Terrain.Town:
        return "\uD83C\uDFE0";
      case Terrain.Mountain:
      case Terrain.ClaimedMountain:
        return "\uD83C\uDFD4";
      case Terrain.Monster:
        return "\uD83D\uDE08";
      default:
        return "";
    }
  }

  return (
    <div className={"tile " + terrainKey + (small ? " small" : "")}>
      {getPrimarySymbol()}
      <div className="secondary-symbol">{getSecondarySymbol()}</div>
    </div>
  );
}
