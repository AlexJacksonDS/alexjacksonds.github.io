export enum Terrain {
  Empty,
  Forest,
  Field,
  Water,
  Town,
  Monster,
  Mountain,
  Wasteland,
}

export interface Tile {
  terrain: Terrain;
  isRuin: boolean;
}

type BoardRow = [Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile, Tile];

export type Board = [
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow,
  BoardRow
];

function emptyRow(): BoardRow {
  return [
    { terrain: Terrain.Empty, isRuin: false },
    { terrain: Terrain.Empty, isRuin: false },
    { terrain: Terrain.Empty, isRuin: false },
    { terrain: Terrain.Empty, isRuin: false },
    { terrain: Terrain.Empty, isRuin: false },
    { terrain: Terrain.Empty, isRuin: false },
    { terrain: Terrain.Empty, isRuin: false },
    { terrain: Terrain.Empty, isRuin: false },
    { terrain: Terrain.Empty, isRuin: false },
    { terrain: Terrain.Empty, isRuin: false },
    { terrain: Terrain.Empty, isRuin: false },
  ];
}

const secondRow: BoardRow = emptyRow();
secondRow[3] = { terrain: Terrain.Mountain, isRuin: false };
secondRow[5] = { terrain: Terrain.Empty, isRuin: true };

const thirdRow: BoardRow = emptyRow();
thirdRow[1] = { terrain: Terrain.Empty, isRuin: true };
thirdRow[9] = { terrain: Terrain.Empty, isRuin: true };
thirdRow[8] = { terrain: Terrain.Mountain, isRuin: false };

const sixthRow: BoardRow = emptyRow();
sixthRow[5] = { terrain: Terrain.Mountain, isRuin: false };

const ninthRow: BoardRow = emptyRow();
ninthRow[1] = { terrain: Terrain.Empty, isRuin: true };
ninthRow[9] = { terrain: Terrain.Empty, isRuin: true };
ninthRow[2] = { terrain: Terrain.Mountain, isRuin: false };

const tenthRow: BoardRow = emptyRow();
tenthRow[7] = { terrain: Terrain.Mountain, isRuin: false };
tenthRow[5] = { terrain: Terrain.Empty, isRuin: true };

export const defaultBoard: Board = [
  emptyRow(),
  secondRow,
  thirdRow,
  emptyRow(),
  emptyRow(),
  sixthRow,
  emptyRow(),
  emptyRow(),
  ninthRow,
  tenthRow,
  emptyRow(),
];

const secondRowSpecial = emptyRow();
secondRowSpecial[8] = { terrain: Terrain.Mountain, isRuin: false };
secondRowSpecial[6] = { terrain: Terrain.Empty, isRuin: true };

const thirdRowSpecial = emptyRow();
thirdRowSpecial[2] = { terrain: Terrain.Empty, isRuin: true };
thirdRowSpecial[3] = { terrain: Terrain.Mountain, isRuin: false };

const fourthRowSpecial = emptyRow();
fourthRowSpecial[5] = { terrain: Terrain.Wasteland, isRuin: false };

const fifthRowSpecial = emptyRow();
fifthRowSpecial[4] = { terrain: Terrain.Wasteland, isRuin: false };
fifthRowSpecial[5] = { terrain: Terrain.Wasteland, isRuin: false };
fifthRowSpecial[6] = { terrain: Terrain.Empty, isRuin: true };

const sixthRowSpecial = emptyRow();
sixthRowSpecial[4] = { terrain: Terrain.Wasteland, isRuin: false };
sixthRowSpecial[5] = { terrain: Terrain.Wasteland, isRuin: false };
sixthRowSpecial[6] = { terrain: Terrain.Wasteland, isRuin: false };

const seventhRowSpecial = emptyRow();
seventhRowSpecial[1] = { terrain: Terrain.Empty, isRuin: true };
seventhRowSpecial[5] = { terrain: Terrain.Wasteland, isRuin: false };

const eighthRowSpecial = emptyRow();
eighthRowSpecial[5] = { terrain: Terrain.Mountain, isRuin: false };
eighthRowSpecial[8] = { terrain: Terrain.Empty, isRuin: true };

const ninthRowSpecial = emptyRow();
ninthRowSpecial[9] = { terrain: Terrain.Mountain, isRuin: false };

const tenthRowSpecial = emptyRow();
tenthRowSpecial[2] = { terrain: Terrain.Mountain, isRuin: false };
tenthRowSpecial[3] = { terrain: Terrain.Empty, isRuin: true };

export const specialBoard: Board = [
    emptyRow(),
    secondRowSpecial,
    thirdRowSpecial,
    fourthRowSpecial,
    fifthRowSpecial,
    sixthRowSpecial,
    seventhRowSpecial,
    eighthRowSpecial,
    ninthRowSpecial,
    tenthRowSpecial,
    emptyRow()
]
