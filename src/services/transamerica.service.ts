import { CityPlace, Colour, ConnectionState, HexConnections, Place } from "@/components/Transamerica/Hex/Hex";
import { ConnectionState as CS } from "@/components/Transamerica/Hex/Hex";
import { MutableRefObject } from "react";
import { getOffsets } from "@/helpers/hexHelper";

export class Tile {
  connections: HexConnections;

  constructor(
    random: boolean,
    ot?: CS,
    otr?: CS,
    obr?: CS,
    ob?: CS,
    obl?: CS,
    otl?: CS,
    itl?: CS,
    itr?: CS,
    ir?: CS,
    ibr?: CS,
    ibl?: CS,
    il?: CS,
    cityPlace?: CityPlace
  ) {
    this.connections = new HexConnections(random, ot, otr, obr, ob, obl, otl, itl, itr, ir, ibr, ibl, il, cityPlace);
  }
}

const width = 6;
const height = 13;

export function blankBoard() {
  const hexCoords = getHexCoords();

  const { rowOffset, colOffset } = getOffsets(hexCoords);

  const newBoard = [
    [
      new Tile(false, 3, 3, 2, 1, 2, 3, 3, 3, 1, 1, 1, 2, { city: "Se", place: Place.L, colour: Colour.Green }),
      new Tile(false, 3, 3, 2, 1, 1, 3, 3, 3, 1, 2, 2, 1),
      new Tile(false, 3, 3, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1),
      new Tile(false, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3),
      new Tile(false, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
      new Tile(false, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
    ],
    [
      new Tile(false, 3, 2, 1, 2, 3, 3, 3, 1, 2, 2, 1, 3, { city: "Pe", place: Place.C, colour: Colour.Green }),
      new Tile(false, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 2, { city: "He", place: Place.C, colour: Colour.Blue }),
      new Tile(false, 1, 1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, { city: "Bi", place: Place.R, colour: Colour.Blue }),
      new Tile(false, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, { city: "Du", place: Place.R, colour: Colour.Blue }),
      new Tile(false, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3),
      new Tile(false, 3, 3, 1, 1, 3, 3, 3, 3, 1, 1, 1, 3),
    ],
    [
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 2),
      new Tile(false, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 2),
      new Tile(false, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 2, { city: "Mi", place: Place.L, colour: Colour.Blue }),
      new Tile(false, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3),
      new Tile(false, 3, 3, 3, 3, 1, 1, 1, 3, 3, 3, 1, 1, { city: "Bo", place: Place.C, colour: Colour.Orange }),
    ],
    [
      new Tile(false, 2, 1, 1, 2, 3, 3, 1, 2, 2, 2, 1, 3, { city: "Me", place: Place.C, colour: Colour.Green }),
      new Tile(false, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 3, 3, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, { city: "Ch", place: Place.C, colour: Colour.Blue }),
      new Tile(false, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, { city: "Bu", place: Place.TL, colour: Colour.Blue }),
    ],
    [
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { city: "SLC", place: Place.R, colour: Colour.Yellow }),
      new Tile(false, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, { city: "Om", place: Place.C, colour: Colour.Yellow }),
      new Tile(false, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 2),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, { city: "NY", place: Place.L, colour: Colour.Orange }),
    ],
    [
      new Tile(false, 2, 1, 1, 1, 3, 3, 1, 2, 2, 2, 1, 3, { city: "Sa", place: Place.C, colour: Colour.Green }),
      new Tile(false, 1, 1, 2, 2, 1, 1, 1, 2, 1, 2, 1, 1),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { city: "De", place: Place.L, colour: Colour.Yellow }),
      new Tile(false, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 2, 2),
      new Tile(false, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1),
      new Tile(false, 2, 3, 3, 3, 2, 1, 2, 1, 3, 3, 1, 2, { city: "Wa", place: Place.C, colour: Colour.Orange }),
    ],
    [
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { city: "KC", place: Place.R, colour: Colour.Yellow }),
      new Tile(false, 2, 1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 1, { city: "SL", place: Place.C, colour: Colour.Yellow }),
      new Tile(false, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1, { city: "Ci", place: Place.TL, colour: Colour.Blue }),
      new Tile(false, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
    ],
    [
      new Tile(false, 1, 1, 1, 3, 3, 3, 1, 2, 2, 1, 3, 3, { city: "SF", place: Place.TL, colour: Colour.Green }),
      new Tile(false, 2, 1, 1, 2, 2, 1, 2, 1, 1, 1, 1, 2),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2),
      new Tile(false, 3, 3, 3, 1, 1, 1, 1, 3, 3, 1, 1, 1, { city: "Ri", place: Place.C, colour: Colour.Orange }),
    ],
    [
      new Tile(false, 1, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 2, { city: "LA", place: Place.BL, colour: Colour.Green }),
      new Tile(false, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { city: "SF", place: Place.C, colour: Colour.Yellow }),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { city: "OKC", place: Place.C, colour: Colour.Yellow }),
      new Tile(false, 1, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1),
      new Tile(false, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, { city: "Wi", place: Place.C, colour: Colour.Orange }),
      new Tile(false, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
    ],
    [
      new Tile(false, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
      new Tile(false, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, { city: "Ph", place: Place.C, colour: Colour.Red }),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1),
      new Tile(false, 1, 3, 3, 3, 3, 1, 1, 1, 3, 3, 1, 1),
    ],
    [
      new Tile(false, 2, 2, 3, 3, 3, 3, 1, 1, 2, 3, 3, 3, { city: "SD", place: Place.C, colour: Colour.Green }),
      new Tile(false, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { city: "Da", place: Place.R, colour: Colour.Red }),
      new Tile(false, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 2, { city: "Me", place: Place.TR, colour: Colour.Red }),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { city: "Ch", place: Place.R, colour: Colour.Orange }),
      new Tile(false, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
    ],
    [
      new Tile(false, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
      new Tile(false, 1, 1, 3, 3, 3, 3, 1, 1, 1, 3, 3, 3),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { city: "EP", place: Place.L, colour: Colour.Red }),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
      new Tile(false, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, { city: "At", place: Place.TR, colour: Colour.Red }),
      new Tile(false, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3),
    ],
    [
      new Tile(false, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
      new Tile(false, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
      new Tile(false, 1, 1, 3, 3, 3, 1, 1, 1, 1, 3, 3, 1, { city: "Ho", place: Place.R, colour: Colour.Red }),
      new Tile(false, 2, 1, 3, 3, 3, 1, 2, 1, 1, 3, 3, 2, { city: "NO", place: Place.C, colour: Colour.Red }),
      new Tile(false, 1, 3, 3, 3, 3, 1, 1, 1, 3, 3, 3, 1, { city: "Ja", place: Place.C, colour: Colour.Orange }),
      new Tile(false, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3),
    ],
  ];

  return {
    board: newBoard,
    rowOffset: rowOffset,
    colOffset: colOffset,
    hexCoords: hexCoords,
    height: height,
    width: width,
  };
}

function getHexCoords() {
  const hexCoords = [];
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      hexCoords.push([i, j]);
    }
  }
  return hexCoords;
}

const outers = ["ot", "otr", "obr", "ob", "obl", "otl"];
const inners = ["itl", "itr", "il", "ir", "ibl", "ibr"];
const adjHexTransforms = [
  [
    [-2, 0],
    [-1, 1],
    [1, 1],
    [2, 0],
    [1, 0],
    [-1, 0],
  ],
  [
    [-2, 0],
    [-1, 0],
    [1, 0],
    [2, 0],
    [1, -1],
    [-1, -1],
  ],
];

const innerToOuterConnections = new Map<string, string[]>([
  ["il", ["otl", "obl"]],
  ["itl", ["otl", "ot"]],
  ["ibl", ["obl", "ob"]],
  ["ir", ["otr", "obr"]],
  ["itr", ["ot", "otr"]],
  ["ibr", ["ob", "obr"]],
]);

const innerToPointAdjOuterConnectionsEven = new Map<string, { iTransform: number; jTransform: number; seg: string }[]>([
  [
    "il",
    [
      { iTransform: -1, jTransform: 0, seg: "ob" },
      { iTransform: -1, jTransform: 0, seg: "ibr" },
      { iTransform: 1, jTransform: 0, seg: "itr" },
      { iTransform: 1, jTransform: 0, seg: "ot" },
    ],
  ],
  [
    "itl",
    [
      { iTransform: -2, jTransform: 0, seg: "obl" },
      { iTransform: -2, jTransform: 0, seg: "ibl" },
      { iTransform: -1, jTransform: 0, seg: "ir" },
    ],
  ],
  [
    "ibl",
    [
      { iTransform: 2, jTransform: 0, seg: "otl" },
      { iTransform: 2, jTransform: 0, seg: "itl" },
      { iTransform: 1, jTransform: 0, seg: "ir" },
    ],
  ],
  [
    "ir",
    [
      { iTransform: -1, jTransform: 1, seg: "ob" },
      { iTransform: -1, jTransform: 1, seg: "ibl" },
      { iTransform: 1, jTransform: 1, seg: "itl" },
      { iTransform: 1, jTransform: 1, seg: "ot" },
    ],
  ],
  [
    "itr",
    [
      { iTransform: -2, jTransform: 0, seg: "obr" },
      { iTransform: -2, jTransform: 0, seg: "ibr" },
      { iTransform: -1, jTransform: 1, seg: "il" },
    ],
  ],
  [
    "ibr",
    [
      { iTransform: 2, jTransform: 0, seg: "otr" },
      { iTransform: 2, jTransform: 0, seg: "itr" },
      { iTransform: 1, jTransform: 1, seg: "il" },
    ],
  ],
]);

const innerToPointAdjOuterConnectionsOdd = new Map<string, { iTransform: number; jTransform: number; seg: string }[]>([
  [
    "il",
    [
      { iTransform: -1, jTransform: -1, seg: "ob" },
      { iTransform: -1, jTransform: -1, seg: "ibr" },
      { iTransform: 1, jTransform: -1, seg: "itr" },
    ],
  ],
  [
    "itl",
    [
      { iTransform: -2, jTransform: 0, seg: "obl" },
      { iTransform: -2, jTransform: 0, seg: "ibl" },
      { iTransform: -1, jTransform: -1, seg: "ir" },
    ],
  ],
  [
    "ibl",
    [
      { iTransform: 2, jTransform: 0, seg: "otl" },
      { iTransform: 2, jTransform: 0, seg: "itl" },
      { iTransform: 1, jTransform: -1, seg: "ir" },
    ],
  ],
  [
    "ir",
    [
      { iTransform: -1, jTransform: 0, seg: "ob" },
      { iTransform: -1, jTransform: 0, seg: "ibl" },
      { iTransform: 1, jTransform: 0, seg: "itl" },
    ],
  ],
  [
    "itr",
    [
      { iTransform: -2, jTransform: 0, seg: "obr" },
      { iTransform: -2, jTransform: 0, seg: "ibr" },
      { iTransform: -1, jTransform: 0, seg: "il" },
    ],
  ],
  [
    "ibr",
    [
      { iTransform: 2, jTransform: 0, seg: "otr" },
      { iTransform: 2, jTransform: 0, seg: "itr" },
      { iTransform: 1, jTransform: 0, seg: "il" },
    ],
  ],
]);

const outerSameHexConnections = new Map<string, string[]>([
  ["otl", ["ot", "obl", "il", "itl"]],
  ["ot", ["otl", "otr", "itl", "itr"]],
  ["otr", ["ot", "obr", "ir", "itr"]],
  ["obr", ["otr", "ob", "ir", "ibr"]],
  ["ob", ["obl", "obr", "ibr", "ibl"]],
  ["obl", ["ob", "otl", "ibl", "il"]],
]);

const outerToPointAdjInnerConnectionsEven = new Map<string, { iTransform: number; jTransform: number; seg: string }[]>([
  [
    "otl",
    [
      { iTransform: -2, jTransform: 0, seg: "ibl" },
      { iTransform: 1, jTransform: 0, seg: "itr" },
    ],
  ],
  [
    "ot",
    [
      { iTransform: -1, jTransform: 0, seg: "ir" },
      { iTransform: -1, jTransform: 1, seg: "il" },
    ],
  ],
  [
    "otr",
    [
      { iTransform: -2, jTransform: 0, seg: "ibr" },
      { iTransform: 1, jTransform: 1, seg: "itl" },
    ],
  ],
  [
    "obr",
    [
      { iTransform: 2, jTransform: 0, seg: "itr" },
      { iTransform: -1, jTransform: 1, seg: "ibl" },
    ],
  ],
  [
    "ob",
    [
      { iTransform: 1, jTransform: 0, seg: "ir" },
      { iTransform: 1, jTransform: 1, seg: "il" },
    ],
  ],
  [
    "obl",
    [
      { iTransform: -1, jTransform: 0, seg: "ibr" },
      { iTransform: 2, jTransform: 0, seg: "itl" },
    ],
  ],
]);

const outerToPointAdjInnerConnectionsOdd = new Map<string, { iTransform: number; jTransform: number; seg: string }[]>([
  [
    "otl",
    [
      { iTransform: -2, jTransform: 0, seg: "ibl" },
      { iTransform: 1, jTransform: -1, seg: "itr" },
    ],
  ],
  [
    "ot",
    [
      { iTransform: -1, jTransform: -1, seg: "ir" },
      { iTransform: -1, jTransform: 0, seg: "il" },
    ],
  ],
  [
    "otr",
    [
      { iTransform: -2, jTransform: 0, seg: "ibr" },
      { iTransform: 1, jTransform: 0, seg: "itl" },
    ],
  ],
  [
    "obr",
    [
      { iTransform: 2, jTransform: 0, seg: "itr" },
      { iTransform: -1, jTransform: 0, seg: "ibl" },
    ],
  ],
  [
    "ob",
    [
      { iTransform: 1, jTransform: -1, seg: "ir" },
      { iTransform: 1, jTransform: 0, seg: "il" },
    ],
  ],
  [
    "obl",
    [
      { iTransform: -1, jTransform: -1, seg: "ibr" },
      { iTransform: 2, jTransform: 0, seg: "itl" },
    ],
  ],
]);

export function isInvalidClick(i: number, j: number, seg: string, board: MutableRefObject<Tile[][]>) {
  const clickedConnectionState = board.current[i][j].connections.c.get(seg);

  if (
    clickedConnectionState === undefined ||
    clickedConnectionState === ConnectionState.Connected ||
    clickedConnectionState === ConnectionState.Invalid
  ) {
    return true;
  }
  return false;
}

export function isConnectedClick(i: number, j: number, seg: string, board: MutableRefObject<Tile[][]>) {
  const adjSegs: { i: number; j: number; seg: string }[] = [];

  if (seg.startsWith("i")) {
    adjSegs.push(
      ...inners
        .filter((s) => s !== seg)
        .map((s) => {
          return { i: i, j: j, seg: s };
        })
    );
    adjSegs.push(
      ...innerToOuterConnections.get(seg)!.map((s) => {
        return { i: i, j: j, seg: s };
      })
    );
    const innerToAdjOuter =
      i % 2 === 0 ? innerToPointAdjOuterConnectionsEven.get(seg) : innerToPointAdjOuterConnectionsOdd.get(seg);
    adjSegs.push(
      ...innerToAdjOuter!.map((x) => {
        return {
          i: i + x!.iTransform,
          j: j + x!.jTransform,
          seg: x!.seg,
        };
      })
    );
  } else {
    adjSegs.push(
      ...outerSameHexConnections.get(seg)!.map((s) => {
        return { i: i, j: j, seg: s };
      })
    );

    const indexOfSeg = outers.indexOf(seg);
    const coordTransform = adjHexTransforms[i % 2][indexOfSeg];
    const overlapSeg = outers[(indexOfSeg + 3) % 6];

    adjSegs.push(
      ...outerSameHexConnections.get(overlapSeg)!.map((s) => {
        return { i: i + coordTransform[0], j: j + coordTransform[1], seg: s };
      })
    );

    const outerToAdjInner =
      i % 2 === 0 ? outerToPointAdjInnerConnectionsEven.get(seg) : outerToPointAdjInnerConnectionsOdd.get(seg);
    adjSegs.push(
      ...outerToAdjInner!.map((x) => {
        return {
          i: i + x!.iTransform,
          j: j + x!.jTransform,
          seg: x!.seg,
        };
      })
    );
  }

  for (const adjSeg of adjSegs) {
    if (adjSeg.i > -1 && adjSeg.j > -1 && adjSeg.i < 13 && adjSeg.j < 6) {
      try {
        if (board.current[adjSeg.i][adjSeg.j].connections.c.get(adjSeg.seg) === ConnectionState.Connected) {
          return true;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return false;
}

export function connectSegment(i: number, j: number, seg: string, board: MutableRefObject<Tile[][]>) {
  board.current[i][j].connections.c.set(seg, ConnectionState.Connected);

  // Flip overlap if needed
  const indexOfSeg = outers.indexOf(seg);
  if (indexOfSeg > -1) {
    const coordTransform = adjHexTransforms[i % 2][indexOfSeg];
    if (
      i + coordTransform[0] > -1 &&
      j + coordTransform[1] > -1 &&
      i + coordTransform[0] < 13 &&
      j + coordTransform[1] < 6
    ) {
      board.current[i + coordTransform[0]][j + coordTransform[1]].connections.c.set(
        outers[(indexOfSeg + 3) % 6],
        ConnectionState.Connected
      );
    }
  }
}
