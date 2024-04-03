import _ from "lodash";

export interface DropResult {
  row: number;
  column: number;
}

export interface ClientGameState {
  gameId: string;
  isStarted: boolean;
  isStartable: boolean;
  hasBeenFreeFlushedThisTurn: boolean;
  offerTiles: GameTile[];
  offerTokens: AnimalTypes[];
  currentPlayer: string;
  myDetails: CascadiaPlayerState;
  otherPlayers: CascadiaPlayerState[];
}

interface CascadiaPlayerState {
  player: Player;
  score: number;
  tokens: number;
  playedTiles: GamePlayedTile[];
  playedTokens: PlayedToken[];
  playerOrder: number;
}

export interface PlayedToken {
  row: number;
  column: number;
  animalToken: AnimalTypes;
}

interface Player {
  id: string;
  name: string;
}

export interface GameState {
  currentPlayerId: string;
  offerRow: OfferRow;
  player: PlayerDetails;
  otherPlayers: PlayerDetails[];
}

export interface PlayerDetails {
  id: string;
  name: string;
  playedTiles: GamePlayedTile[];
  tokens: number;
}

export interface OfferRow {
  tiles: (GameTile | undefined)[];
  animals: (AnimalTypes | undefined)[];
}

export interface GamePlayedTile {
  row: number;
  column: number;
  tile: GameTile;
}

export enum Orientation {
  TOP,
  TOPLEFT,
  BOTTOMLEFT,
  BOTTOM,
  BOTTOMRIGHT,
  TOPRIGHT,
}

export enum AnimalTypes {
  BEAR = "bear",
  ELK = "elk",
  FOX = "fox",
  HAWK = "hawk",
  SALMON = "salmon",
}

export enum HabitatTypes {
  FOREST = "forest",
  MOUNTAIN = "mountain",
  PRARIE = "prarie",
  RIVER = "river",
  WETLANDS = "wetlands",
}

export interface Turn {
  turnTile: TurnTile;
  turnToken: TurnToken;
}

export interface TurnTile {
  row: number;
  column: number;
  tileIndex: number;
  tile: GameTile;
}

export interface TurnToken {
  row: number;
  column: number;
  tokenIndex: number;
  animal: AnimalTypes;
}

// const HabitatAnimals = [
//   {
//     habitat: HabitatTypes.FOREST,
//     mainAnimals: [AnimalTypes.BEAR, AnimalTypes.FOX],
//     secondaryAnimals: [AnimalTypes.ELK],
//   },
//   {
//     habitat: HabitatTypes.MOUNTAIN,
//     mainAnimals: [AnimalTypes.ELK, AnimalTypes.HAWK],
//     secondaryAnimals: [AnimalTypes.BEAR],
//   },
//   {
//     habitat: HabitatTypes.PRARIE,
//     mainAnimals: [AnimalTypes.SALMON, AnimalTypes.ELK],
//     secondaryAnimals: [AnimalTypes.FOX],
//   },
//   {
//     habitat: HabitatTypes.RIVER,
//     mainAnimals: [AnimalTypes.BEAR, AnimalTypes.HAWK],
//     secondaryAnimals: [AnimalTypes.SALMON],
//   },
//   {
//     habitat: HabitatTypes.WETLANDS,
//     mainAnimals: [AnimalTypes.SALMON, AnimalTypes.FOX],
//     secondaryAnimals: [AnimalTypes.HAWK],
//   },
// ];

export interface GameTile {
  validAnimals: AnimalTypes[];
  habitats: HabitatTypes[];
  orientation: Orientation;
}

// const keystoneTiles = HabitatAnimals.map((ha) => {
//   const tiles: GameTile[] = [];
//   ha.mainAnimals.map((a) => {
//     tiles.push({ validAnimals: [a], habitats: [ha.habitat, ha.habitat], orientation: Orientation.TOP });
//     tiles.push({ validAnimals: [a], habitats: [ha.habitat, ha.habitat], orientation: Orientation.TOP });
//   });
//   ha.secondaryAnimals.map((a) => {
//     tiles.push({ validAnimals: [a], habitats: [ha.habitat, ha.habitat], orientation: Orientation.TOP });
//   });
//   return tiles;
// }).flat();

// const regularTiles: GameTile[] = [
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.ELK, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.HAWK, AnimalTypes.ELK, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.FOX],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.BEAR, AnimalTypes.FOX],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.HAWK, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.ELK, AnimalTypes.FOX],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.BEAR, AnimalTypes.FOX],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.BEAR, AnimalTypes.ELK],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.FOX],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.HAWK, AnimalTypes.ELK, AnimalTypes.FOX],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.BEAR, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.ELK, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.BEAR, AnimalTypes.FOX],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.BEAR, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.ELK, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.HAWK, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.BEAR, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.HAWK, AnimalTypes.ELK],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.HAWK, AnimalTypes.FOX],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.BEAR, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.HAWK, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.HAWK, AnimalTypes.ELK],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.BEAR, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.ELK, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.ELK],
//     habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.BEAR, AnimalTypes.FOX],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.BEAR, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.ELK, AnimalTypes.FOX],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.FOX, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.FOX],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.ELK, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.BEAR, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.SALMON, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.HAWK],
//     habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.HAWK, AnimalTypes.BEAR],
//     habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
//   {
//     validAnimals: [AnimalTypes.FOX, AnimalTypes.SALMON],
//     habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
//     orientation: Orientation.TOP,
//   },
// ];

// export const allTiles = keystoneTiles.concat(regularTiles);

// export const startTiles: GamePlayedTile[] = [
//   {
//     row: 0,
//     column: 0,
//     tile: {
//       habitats: [HabitatTypes.WETLANDS, HabitatTypes.WETLANDS],
//       validAnimals: [AnimalTypes.HAWK],
//       orientation: Orientation.TOP,
//     },
//   },
//   {
//     row: 1,
//     column: 0,
//     tile: {
//       habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
//       validAnimals: [AnimalTypes.HAWK, AnimalTypes.SALMON, AnimalTypes.ELK],
//       orientation: Orientation.TOPRIGHT,
//     },
//   },
//   {
//     row: 1,
//     column: 1,
//     tile: {
//       habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
//       validAnimals: [AnimalTypes.BEAR, AnimalTypes.FOX],
//       orientation: Orientation.BOTTOMRIGHT,
//     },
//   },
// ];
