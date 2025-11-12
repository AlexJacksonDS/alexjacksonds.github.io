"use client";

import { Tile } from "@/types/railRoadInk";
import "./TrackPiece.scss";
import { shiftConnections } from "@/helpers/railRoadInk";

export default function TrackPiece({ tile }: { tile: Tile }) {
  const isRailOnly = !tile.tileType.isJunction && !tile.tileType.defaultConnections.includes("r");
  const connections = shiftConnections(tile);

  function getConnection(key: string, i: number) {
    const locations = ["top", "right", "bottom", "left"];
    switch (key) {
      case "t":
        return <RailSection key={key + i} location={locations[i]} />;
      case "r":
        return <RoadSection key={key + i} location={locations[i]} />;
      default:
        return null;
    }
  }

  return (
    <div className="tile">
      {!isRailOnly ? <Connection isJunction={tile.tileType.isJunction} /> : null}
      {connections.map((key, i) => getConnection(key, i))}
    </div>
  );
}

export function RailSection({ location, short }: { location: string; short?: boolean }) {
  function getClassName(location: string) {
    return `rail ${location === "top" || location === "bottom" ? "vert" : "horiz"} ${location} ${short ? "short" : ""}`;
  }
  return (
    <div className={getClassName(location)}>
      <div className="rail cross-rail one"></div>
      <div className="rail cross-rail two"></div>
      <div className="rail cross-rail three"></div>
      <div className="rail cross-rail four"></div>
    </div>
  );
}

export function RoadSection({ location, short }: { location: string; short?: boolean }) {
  function getClassName(location: string) {
    return `road ${location === "top" || location === "bottom" ? "vert" : "horiz"} ${location} ${short ? "short" : ""}`;
  }
  return (
    <div className={getClassName(location)}>
      <div className="road road-dash one"></div>
      <div className="road road-dash two"></div>
      <div className="road road-dash three"></div>
    </div>
  );
}

function Connection({ isJunction }: { isJunction: boolean }) {
  return <div className={`connection${isJunction ? "" : " road-connection"}`}></div>;
}
