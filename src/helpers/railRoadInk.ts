import { Orientiations, Tile } from "@/types/railRoadInk";

export function shiftConnections(tile: Tile) {
    const connections = [...tile.tileType.defaultConnections];
    let shift: number;
    switch (tile.orientation) {
      case Orientiations.UP:
        shift = 0;
        break;
      case Orientiations.RIGHT:
        shift = 3;
        break;
      case Orientiations.DOWN:
        shift = 2;
        break;
      case Orientiations.LEFT:
        shift = 1;
        break;
      default:
        shift = 0;
    }
    const rotatedConnections = connections.slice(shift, 4).concat(connections.slice(0, shift));
    if (tile.inverted) {
      const temp = rotatedConnections[1];
      rotatedConnections[1] = rotatedConnections[3];
      rotatedConnections[3] = temp;
    }
    return rotatedConnections;
  }