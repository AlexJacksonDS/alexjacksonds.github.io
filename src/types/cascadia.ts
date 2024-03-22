import _ from "lodash";

export interface DropResult {
  row: number;
  column: number;
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
  tiles: GameTile[];
  animals: AnimalTypes[];
}

export interface GamePlayedTile {
  row: number;
  column: number;
  tile: GameTile;
  animal?: AnimalTypes;
}

export enum Orientation {
  TOP = "top",
  TOPLEFT = "topleft",
  BOTTOMLEFT = "bottomleft",
  BOTTOM = "bottom",
  BOTTOMRIGHT = "bottomright",
  TOPRIGHT = "topright",
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

const HabitatAnimals = [
  {
    habitat: HabitatTypes.FOREST,
    mainAnimals: [AnimalTypes.BEAR, AnimalTypes.FOX],
    secondaryAnimals: [AnimalTypes.ELK],
  },
  {
    habitat: HabitatTypes.MOUNTAIN,
    mainAnimals: [AnimalTypes.ELK, AnimalTypes.HAWK],
    secondaryAnimals: [AnimalTypes.BEAR],
  },
  {
    habitat: HabitatTypes.PRARIE,
    mainAnimals: [AnimalTypes.SALMON, AnimalTypes.ELK],
    secondaryAnimals: [AnimalTypes.FOX],
  },
  {
    habitat: HabitatTypes.RIVER,
    mainAnimals: [AnimalTypes.BEAR, AnimalTypes.HAWK],
    secondaryAnimals: [AnimalTypes.SALMON],
  },
  {
    habitat: HabitatTypes.WETLANDS,
    mainAnimals: [AnimalTypes.SALMON, AnimalTypes.FOX],
    secondaryAnimals: [AnimalTypes.HAWK],
  },
];

export interface GameTile {
  animals: AnimalTypes[];
  habitats: HabitatTypes[];
  orientation: Orientation;
}

const keystoneTiles = HabitatAnimals.map((ha) => {
  const tiles: GameTile[] = [];
  ha.mainAnimals.map((a) => {
    tiles.push({ animals: [a], habitats: [ha.habitat, ha.habitat], orientation: Orientation.TOP });
    tiles.push({ animals: [a], habitats: [ha.habitat, ha.habitat], orientation: Orientation.TOP });
  });
  ha.secondaryAnimals.map((a) => {
    tiles.push({ animals: [a], habitats: [ha.habitat, ha.habitat], orientation: Orientation.TOP });
  });
  return tiles;
}).flat();

const regularTiles: GameTile[] = [
  {
    animals: [AnimalTypes.FOX, AnimalTypes.ELK, AnimalTypes.BEAR],
    habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.HAWK, AnimalTypes.ELK, AnimalTypes.BEAR],
    habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.FOX],
    habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.HAWK],
    habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.BEAR, AnimalTypes.FOX],
    habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.HAWK, AnimalTypes.BEAR],
    habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.ELK, AnimalTypes.FOX],
    habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.BEAR, AnimalTypes.FOX],
    habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.SALMON],
    habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.BEAR, AnimalTypes.ELK],
    habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.FOX],
    habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.SALMON],
    habitats: [HabitatTypes.FOREST, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.HAWK, AnimalTypes.ELK, AnimalTypes.FOX],
    habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.SALMON],
    habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.BEAR],
    habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.HAWK],
    habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.BEAR],
    habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.BEAR, AnimalTypes.SALMON],
    habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.ELK, AnimalTypes.HAWK],
    habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.BEAR, AnimalTypes.FOX],
    habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.BEAR, AnimalTypes.SALMON],
    habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.HAWK],
    habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.SALMON],
    habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.HAWK],
    habitats: [HabitatTypes.FOREST, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.ELK, AnimalTypes.BEAR],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.HAWK, AnimalTypes.BEAR],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.BEAR, AnimalTypes.SALMON],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.HAWK, AnimalTypes.ELK],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.HAWK, AnimalTypes.FOX],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.SALMON],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.BEAR, AnimalTypes.HAWK],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.BEAR],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.HAWK, AnimalTypes.BEAR],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.HAWK, AnimalTypes.ELK],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.HAWK],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.BEAR],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.BEAR, AnimalTypes.HAWK],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.ELK, AnimalTypes.BEAR],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.BEAR],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.HAWK],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.HAWK],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.ELK],
    habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.BEAR, AnimalTypes.FOX],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.BEAR, AnimalTypes.HAWK],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.HAWK],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.HAWK],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.SALMON],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.BEAR],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.RIVER],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.ELK, AnimalTypes.FOX],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.FOX, AnimalTypes.HAWK],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.HAWK],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.FOX],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.ELK, AnimalTypes.SALMON],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.HAWK],
    habitats: [HabitatTypes.PRARIE, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.BEAR, AnimalTypes.HAWK],
    habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.BEAR],
    habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.SALMON, AnimalTypes.HAWK],
    habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.HAWK],
    habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.HAWK, AnimalTypes.BEAR],
    habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
  {
    animals: [AnimalTypes.FOX, AnimalTypes.SALMON],
    habitats: [HabitatTypes.RIVER, HabitatTypes.WETLANDS],
    orientation: Orientation.TOP,
  },
];

export const allTiles = keystoneTiles.concat(regularTiles);

export const startTiles: GamePlayedTile[] = [
  {
    row: 0,
    column: 0,
    tile: {
      habitats: [HabitatTypes.WETLANDS, HabitatTypes.WETLANDS],
      animals: [AnimalTypes.HAWK],
      orientation: Orientation.TOP,
    },
  },
  {
    row: 1,
    column: 0,
    tile: {
      habitats: [HabitatTypes.FOREST, HabitatTypes.RIVER],
      animals: [AnimalTypes.HAWK, AnimalTypes.SALMON, AnimalTypes.ELK],
      orientation: Orientation.TOPRIGHT,
    },
  },
  {
    row: 1,
    column: 1,
    tile: {
      habitats: [HabitatTypes.MOUNTAIN, HabitatTypes.PRARIE],
      animals: [AnimalTypes.BEAR, AnimalTypes.FOX],
      orientation: Orientation.BOTTOMRIGHT,
    },
  },
];
