import { CityPlace, Colour, HexConnections, Place } from "@/components/Transamerica/Hex/Hex";
import _ from "lodash";
import { ConnectionState as CS } from "@/components/Transamerica/Hex/Hex";

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
    [new Tile(false, 3,3,2,1,2,3,3,3,1,1,1,2, {city:"Se", place: Place.L,colour: Colour.Green}), new Tile(false, 3,3,2,1,1,3,3,3,1,2,2,1), new Tile(false, 3,3,1,1,1,3,3,3,1,1,1,1), new Tile(false, 3,3,3,1,1,3,3,3,3,3,3,3), new Tile(false, 3,3,3,3,3,3,3,3,3,3,3,3), new Tile(false, 3,3,3,3,3,3,3,3,3,3,3,3)],
    [new Tile(false, 3,2,1,2,3,3,3,1,2,2,1,3,{city:"Pe", place: Place.C,colour: Colour.Green}), new Tile(false, 1,1,2,2,1,2,1,1,2,1,2,2,{city:"He", place: Place.C,colour: Colour.Blue}), new Tile(false, 1,1,2,1,1,2,2,2,2,1,1,1,{city:"Bi", place: Place.R,colour: Colour.Blue}), new Tile(false, 1,1,2,1,1,1,1,1,2,1,1,1,{city:"Du", place: Place.R,colour: Colour.Blue}), new Tile(false, 3,3,3,3,1,3,3,3,3,3,3,3), new Tile(false, 3,3,1,1,3,3,3,3,1,1,1,3)],
    [new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 1,1,1,2,1,2,1,1,1,1,2,2), new Tile(false, 1,1,1,2,1,2,1,1,1,1,2,2), new Tile(false, 1,1,1,2,1,2,1,1,1,1,2,2,{city:"Mi", place: Place.L,colour: Colour.Blue}), new Tile(false, 3,3,1,1,3,3,3,3,3,3,3,3), new Tile(false, 3,3,3,3,1,1,1,3,3,3,1,1,{city:"Bo", place: Place.C,colour: Colour.Orange})],
    [new Tile(false, 2,1,1,2,3,3,1,2,2,2,1,3,{city:"Me", place: Place.C,colour: Colour.Green}), new Tile(false, 2,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 3,3,1,1,1,1,1,3,1,1,1,1,{city:"Ch", place: Place.C,colour: Colour.Blue}), new Tile(false, 1,1,1,2,1,1,1,1,1,1,1,1,{city:"Bu", place: Place.TL,colour: Colour.Blue})],
    [new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1,{city:"SLC", place: Place.R,colour: Colour.Yellow}), new Tile(false, 2,1,1,2,1,1,1,1,1,1,1,1), new Tile(false, 2,1,2,1,1,1,1,2,2,1,1,1,{city:"Om", place: Place.C,colour: Colour.Yellow}), new Tile(false, 2,1,1,2,1,1,2,1,1,1,2,2), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 3,3,3,3,3,1,3,3,3,3,3,3,{city:"NY", place: Place.L,colour: Colour.Orange})],
    [new Tile(false, 2,1,1,1,3,3,1,2,2,2,1,3,{city:"Sa", place: Place.C,colour: Colour.Green}), new Tile(false, 1,1,2,2,1,1,1,2,1,2,1,1), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1,{city:"De", place: Place.L,colour: Colour.Yellow}), new Tile(false, 1,1,2,1,1,2,1,1,1,2,2,2), new Tile(false, 1,1,1,2,1,1,1,1,1,2,1,1), new Tile(false, 2,3,3,3,2,1,2,1,3,3,1,2,{city:"Wa", place: Place.C,colour: Colour.Orange})],
    [new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 2,1,1,2,1,2,1,2,2,2,1,1), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1,{city:"KC", place: Place.R,colour: Colour.Yellow}), new Tile(false, 2,1,2,1,1,2,2,2,2,1,1,1,{city:"SL", place: Place.C,colour: Colour.Yellow}), new Tile(false, 1,2,1,2,1,2,2,1,2,2,1,1,{city:"Ci", place: Place.TL,colour: Colour.Blue}), new Tile(false, 3,3,3,3,3,3,3,3,3,3,3,3)],
    [new Tile(false, 1,1,1,3,3,3,1,2,2,1,3,3,{city:"SF", place: Place.TL,colour: Colour.Green}), new Tile(false, 2,1,1,2,2,1,2,1,1,1,1,2), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 2,1,1,1,2,2,2,1,1,1,1,2), new Tile(false, 3,3,3,1,1,1,1,3,3,1,1,1,{city:"Ri", place: Place.C,colour: Colour.Orange})],
    [new Tile(false, 1,2,2,2,1,1,1,1,2,1,1,2,{city:"LA", place: Place.BL,colour: Colour.Green}), new Tile(false, 2,1,1,1,1,1,1,1,1,1,1,1,{city:"SF", place: Place.C,colour: Colour.Yellow}), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1,{city:"OKC", place: Place.C,colour: Colour.Yellow}), new Tile(false, 1,2,1,2,1,1,1,1,2,2,1,1), new Tile(false, 2,1,1,1,2,1,2,1,1,1,1,2,{city:"Wi", place: Place.C,colour: Colour.Orange}), new Tile(false, 3,3,3,3,3,3,3,3,3,3,3,3)],
    [new Tile(false, 3,3,3,3,3,3,3,3,3,3,3,3), new Tile(false, 2,1,2,1,2,2,1,2,2,1,1,2,{city:"Ph", place: Place.C,colour: Colour.Red}), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 1,2,1,1,1,1,1,1,2,1,1,1), new Tile(false, 1,3,3,3,3,1,1,1,3,3,1,1)],
    [new Tile(false, 2,2,3,3,3,3,1,1,2,3,3,3,{city:"SD", place: Place.C,colour: Colour.Green}), new Tile(false, 1,1,1,1,1,2,2,1,1,1,1,1), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1,{city:"Da", place: Place.R,colour: Colour.Red}), new Tile(false, 2,1,1,2,1,1,2,1,1,1,2,2,{city:"Me", place: Place.TR,colour: Colour.Red}), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1,{city:"Ch", place: Place.R,colour: Colour.Orange}), new Tile(false, 3,3,3,3,3,3,3,3,3,3,3,3)],
    [new Tile(false, 3,3,3,3,3,3,3,3,3,3,3,3), new Tile(false, 1,1,3,3,3,3,1,1,1,3,3,3), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1,{city:"EP", place: Place.L,colour: Colour.Red}), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1), new Tile(false, 1,1,1,1,1,1,1,1,1,1,1,1,{city:"At", place: Place.TR,colour: Colour.Red}), new Tile(false, 3,3,3,3,3,1,3,3,3,3,3,3)],
    [new Tile(false, 3,3,3,3,3,3,3,3,3,3,3,3), new Tile(false, 3,3,3,3,3,3,3,3,3,3,3,3), new Tile(false, 1,1,3,3,3,1,1,1,1,3,3,1,{city:"Ho", place: Place.R,colour: Colour.Red}), new Tile(false, 2,1,3,3,3,1,2,1,1,3,3,2,{city:"NO", place: Place.C,colour: Colour.Red}), new Tile(false, 1,3,3,3,3,1,1,1,3,3,3,1,{city:"Ja", place: Place.C,colour: Colour.Orange}), new Tile(false, 3,3,3,3,3,3,3,3,3,3,3,3)],
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

function getOffsets(hexCoords: number[][]) {
  const rowOffset = _.max(hexCoords.filter((x) => x[0] < 0).map((x) => Math.abs(x[0]))) ?? 0;
  const colOffset = _.max(hexCoords.filter((x) => x[1] < 0).map((x) => Math.abs(x[1]))) ?? 0;
  return { rowOffset, colOffset };
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
