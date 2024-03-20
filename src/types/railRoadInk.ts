export interface GameState {
  playedTiles: Map<string, Tile>;
  board: BoardTile[][];
  dice: BoardTile[];
  specials: BoardTile[];
}

export interface BoardTile {
  id: string;
  isLockedIn: boolean;
  tile?: Tile;
  round?: number;
}

export interface DropResult {
  id: string;
}

export interface SurroundingSquare {
  direction: string;
  id: string;
  tile?: Tile;
}

export interface Tile {
  tileType: TileType;
  orientation: string;
  inverted: boolean;
}

export const Orientations = {
  UP: "up",
  LEFT: "left",
  DOWN: "down",
  RIGHT: "right",
};

export const Types = {
  TILE: "tile",
};

export const Pools = {
  DICE: "dice",
  SPECIALS: "specials"
}

export const bridge = "bridge";

export interface TileType {
  id: string;
  defaultConnections: string[];
  isJunction: boolean;
}

export interface TileTypes {
  [key: string]: TileType;
}

export const DefaultTileTypes: TileTypes = {
  SCONN: { id: "sconn", defaultConnections: ["t", "u", "r", "u"], isJunction: true },
  RCONN: { id: "rconn", defaultConnections: ["t", "r", "u", "u"], isJunction: true },
  BRIDGE: { id: bridge, defaultConnections: ["t", "r", "t", "r"], isJunction: false },
  SRAIL: { id: "srail", defaultConnections: ["t", "u", "t", "u"], isJunction: false },
  RRAIL: { id: "rrail", defaultConnections: ["t", "t", "u", "u"], isJunction: false },
  TRAIL: { id: "trail", defaultConnections: ["t", "t", "t", "u"], isJunction: false },
  SROAD: { id: "sroad", defaultConnections: ["r", "u", "r", "u"], isJunction: false },
  RROAD: { id: "rroad", defaultConnections: ["r", "r", "u", "u"], isJunction: false },
  TROAD: { id: "troad", defaultConnections: ["r", "r", "r", "u"], isJunction: false },
  XROAD: { id: "xroad", defaultConnections: ["r", "r", "r", "r"], isJunction: false },
  XRAIL: { id: "xrail", defaultConnections: ["t", "t", "t", "t"], isJunction: false },
  XRRRT: { id: "xrrrt", defaultConnections: ["r", "r", "r", "t"], isJunction: true },
  XTTTR: { id: "xtttr", defaultConnections: ["t", "t", "t", "r"], isJunction: true },
  XTRTR: { id: "xtrtr", defaultConnections: ["t", "r", "t", "r"], isJunction: true },
  XTTRR: { id: "xttrr", defaultConnections: ["t", "t", "r", "r"], isJunction: true },
};

export const dualTypeDice = [
  DefaultTileTypes.SCONN,
  DefaultTileTypes.SCONN,
  DefaultTileTypes.RCONN,
  DefaultTileTypes.RCONN,
  DefaultTileTypes.BRIDGE,
  DefaultTileTypes.BRIDGE,
];

export const singleTypeDice = [
  DefaultTileTypes.SRAIL,
  DefaultTileTypes.RRAIL,
  DefaultTileTypes.TRAIL,
  DefaultTileTypes.SROAD,
  DefaultTileTypes.RROAD,
  DefaultTileTypes.TROAD,
];

export const specials = [
  DefaultTileTypes.XROAD,
  DefaultTileTypes.XRAIL,
  DefaultTileTypes.XRRRT,
  DefaultTileTypes.XTTTR,
  DefaultTileTypes.XTRTR,
  DefaultTileTypes.XTTRR,
];

export const dice = [dualTypeDice, singleTypeDice, singleTypeDice, singleTypeDice];
