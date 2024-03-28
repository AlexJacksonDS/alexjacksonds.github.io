import { HabitatTypes, GameTile } from "@/types/cascadia";
import { CSSProperties, ReactNode } from "react";
import "./tile.scss";

export default function Tile({ tile, children }: { tile: GameTile; children: ReactNode }) {
   const defaultColouring = [
    tile.habitats[0],
    tile.habitats[0],
    tile.habitats[0],
    tile.habitats[1],
    tile.habitats[1],
    tile.habitats[1],
  ];

  const shift = tile.orientation;
  const colourings = defaultColouring.slice(shift, 6).concat(defaultColouring.slice(0, shift));

  const topStyle: CSSProperties = {
    background: `linear-gradient(90deg, ${getHabitatColour(colourings[5])} 50%, ${getHabitatColour(
      colourings[0]
    )} 50%)`,
  };
  const middleStyle: CSSProperties = {
    background: `linear-gradient(90deg, ${getHabitatColour(colourings[4])} 50%, ${getHabitatColour(
      colourings[1]
    )} 50%)`,
  };
  const bottomStyle: CSSProperties = {
    background: `linear-gradient(90deg, ${getHabitatColour(colourings[3])} 50%, ${getHabitatColour(
      colourings[2]
    )} 50%)`,
  };

  return (
    <div className="hexagon" style={middleStyle}>
      <div className="hexTop" style={topStyle} />
      <div className="hexBottom" style={bottomStyle} />
      <div className="animal-container">{children}</div>
    </div>
  );
}

function getHabitatColour(habitat: HabitatTypes): string {
  switch (habitat) {
    case HabitatTypes.FOREST:
      return "forestgreen";
    case HabitatTypes.MOUNTAIN:
      return "rgb(139, 71, 21)";
    case HabitatTypes.PRARIE:
      return "goldenrod";
    case HabitatTypes.WETLANDS:
      return "yellowgreen";
    case HabitatTypes.RIVER:
      return "deepskyblue";
  }
}
