import { CSSProperties, MouseEvent } from "react";
import "./Hex.scss";
import { randEnumValue } from "@/helpers/enumHelper";

export class HexConnections {
//   ot: ConnectionState;
//   otl: ConnectionState;
//   otr: ConnectionState;
//   ob: ConnectionState;
//   obl: ConnectionState;
//   obr: ConnectionState;
//   il: ConnectionState;
//   itl: ConnectionState;
//   itr: ConnectionState;
//   ir: ConnectionState;
//   ibr: ConnectionState;
//   ibl: ConnectionState;
  cityPlace?: CityPlace;
  c: Map<string, ConnectionState>;

  constructor(
    random: boolean,
    ot?: ConnectionState,
    otr?: ConnectionState,
    obr?: ConnectionState,
    ob?: ConnectionState,
    obl?: ConnectionState,
    otl?: ConnectionState,
    itl?: ConnectionState,
    itr?: ConnectionState,
    ir?: ConnectionState,
    ibr?: ConnectionState,
    ibl?: ConnectionState,
    il?: ConnectionState,
    cityplace?: CityPlace
  ) {
    if (!random && ot && otl && otr && ob && obl && obr && il && itl && itr && ir && ibr && ibl) {
    //   this.ot = ot;
    //   this.otl = otl;
    //   this.otr = otr;
    //   this.ob = ob;
    //   this.obl = obl;
    //   this.obr = obr;
    //   this.il = il;
    //   this.itl = itl;
    //   this.itr = itr;
    //   this.ir = ir;
    //   this.ibr = ibr;
    //   this.ibl = ibl;
      this.c = new Map<string, ConnectionState>([
        ["ot", ot],
        ["otl", otl],
        ["otr", otr],
        ["ob", ob],
        ["obl", obl],
        ["obr", obr],
        ["il", il],
        ["itl", itl],
        ["itr", itr],
        ["ir", ir],
        ["ibr", ibr],
        ["ibl", ibl],
      ]);
    } else {
    //   this.ot = randEnumValue(ConnectionState);
    //   this.otl = randEnumValue(ConnectionState);
    //   this.otr = randEnumValue(ConnectionState);
    //   this.ob = randEnumValue(ConnectionState);
    //   this.obl = randEnumValue(ConnectionState);
    //   this.obr = randEnumValue(ConnectionState);
    //   this.il = randEnumValue(ConnectionState);
    //   this.itl = randEnumValue(ConnectionState);
    //   this.itr = randEnumValue(ConnectionState);
    //   this.ir = randEnumValue(ConnectionState);
    //   this.ibr = randEnumValue(ConnectionState);
    //   this.ibl = randEnumValue(ConnectionState);
      this.c = new Map<string, ConnectionState>([]);
    }
    this.cityPlace = cityplace;
  }
}

export interface CityPlace {
  city: string;
  place: Place;
  colour: Colour;
}

export enum Colour {
  Green = "green",
  Blue = "blue",
  Red = "red",
  Yellow = "yellow",
  Orange = "orange",
}

export enum Place {
  TL = "tl",
  TR = "tr",
  L = "l",
  R = "r",
  BL = "bl",
  BR = "br",
  C = "c",
}

export enum ConnectionState {
  Connected,
  Unconnected,
  UnconnectedTwo,
  Invalid,
}

export default function Hex({
  connections,
  row,
  column,
  rowOffset,
  columnOffset,
  radius = 100,
  onClick,
}: {
  connections: HexConnections;
  row: number;
  column: number;
  rowOffset: number;
  columnOffset: number;
  edgeWidth?: number;
  radius?: number;
  onClick: (e: MouseEvent, i: number, j: number, seg: string) => void;
}) {
  const displayColumn = column + columnOffset + (row % 2 == 0 ? 0.5 : 0);
  const innerRadius = (Math.sqrt(3) * radius) / 2;

  const hexStyle: CSSProperties = {
    top: `${radius * (row + rowOffset) - ((row + rowOffset) * (radius * (2 - Math.sqrt(3)))) / 2}px`,
    left: `${radius * 3 * displayColumn}px`,
    width: `${radius * 3}px`,
    height: `${radius * 2}px`,
    position: "absolute",
  };

  const clipHexStyle: CSSProperties = {
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
  };

  function getColourClass(connectionState: ConnectionState | undefined) {
    switch (connectionState) {
      case ConnectionState.Connected:
        return "connected";
      case ConnectionState.Unconnected:
        return "unconnected";
      case ConnectionState.UnconnectedTwo:
        return "unconnectedTwo";
      case ConnectionState.Invalid:
      default:
        return "invalid";
    }
  }

  return (
    <div className="hex" style={hexStyle}>
      <div className="clipHex" style={clipHexStyle}>
        <div
          className={"clipLine sideLength mid " + getColourClass(connections.c.get("il"))}
          onClick={(e) => onClick(e, row, column, "il")}
        ></div>
        <div
          className={"clipLine sideLength l1 " + getColourClass(connections.c.get("ot"))}
          style={{ top: `${radius - innerRadius - 1}px` }}
          onClick={(e) => onClick(e, row, column, "ot")}
        ></div>
        <div
          className={"clipLine sideLength l1 " + getColourClass(connections.c.get("ob"))}
          style={{ bottom: `${radius - innerRadius - 1}px` }}
          onClick={(e) => onClick(e, row, column, "ob")}
        ></div>
        <div
          className={"clipLine sideLength l2 mid " + getColourClass(connections.c.get("ir"))}
          onClick={(e) => onClick(e, row, column, "ir")}
        ></div>
        <div
          className={"clipLine narrow backDiag l1 " + getColourClass(connections.c.get("itl"))}
          style={{ height: `${innerRadius + 1}px`, top: `${radius - innerRadius - 1}px` }}
          onClick={(e) => onClick(e, row, column, "itl")}
        ></div>
        <div
          className={"clipLine narrow diag " + getColourClass(connections.c.get("otl"))}
          style={{ height: `${innerRadius + 2}px`, top: `${radius - innerRadius - 1}px` }}
          onClick={(e) => onClick(e, row, column, "otl")}
        ></div>
        <div
          className={"clipLine narrow backDiag l3 " + getColourClass(connections.c.get("otr"))}
          style={{ height: `${innerRadius + 2}px`, top: `${radius - innerRadius - 1}px` }}
          onClick={(e) => onClick(e, row, column, "otr")}
        ></div>
        <div
          className={"clipLine narrow diag l2 " + getColourClass(connections.c.get("itr"))}
          style={{ height: `${innerRadius + 1}px`, top: `${radius - innerRadius - 1}px` }}
          onClick={(e) => onClick(e, row, column, "itr")}
        ></div>
        <div
          className={"clipLine narrow diag bottom l1 " + getColourClass(connections.c.get("ibl"))}
          style={{ height: `${innerRadius + 1}px` }}
          onClick={(e) => onClick(e, row, column, "ibl")}
        ></div>
        <div
          className={"clipLine narrow backDiag bottom l2 " + getColourClass(connections.c.get("ibr"))}
          style={{ height: `${innerRadius + 1}px` }}
          onClick={(e) => onClick(e, row, column, "ibr")}
        ></div>
        <div
          className={"clipLine narrow bottom backDiag " + getColourClass(connections.c.get("obl"))}
          style={{ height: `${innerRadius + 1}px` }}
          onClick={(e) => onClick(e, row, column, "obl")}
        ></div>
        <div
          className={"clipLine narrow diag bottom l3 " + getColourClass(connections.c.get("obr"))}
          style={{ height: `${innerRadius + 1}px` }}
          onClick={(e) => onClick(e, row, column, "obr")}
        ></div>
        {connections.cityPlace ? (
          <div className={"cityCircle " + connections.cityPlace.colour + " " + connections.cityPlace.place}>
            {connections.cityPlace.city}
          </div>
        ) : null}
      </div>
    </div>
  );
}
