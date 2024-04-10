import { Metadata } from "next";
import Cascadia from "@/components/Cascadia/Cascadia/Cascadia";
import OtherPlayZone from "@/components/Cascadia/OtherPlayZone/OtherPlayZone";
import { AnimalTypes, GamePlayedTile, HabitatTypes, Orientation, PlayedToken } from "@/types/cascadia";

export const metadata: Metadata = {
  title: "Cascadia",
  icons: "./rri-favicon.png",
};

export default function CascadiaPage() {
  const coords = [
    [0, -1],
        [0, 1],
        [0, 0],
        [0, 2],
        [0, 3],
        [-1, 2],
        [-2, 1],
        [1, 3],
  ];

  const tiles: GamePlayedTile[] = coords.map((c) => ({
    row: c[0],
    column: c[1],
    tile: {
      validAnimals: [AnimalTypes.FOX, AnimalTypes.ELK, AnimalTypes.BEAR],
      habitats: [HabitatTypes.FOREST, HabitatTypes.MOUNTAIN],
      orientation: Orientation.TOP,
    },
  }));

  const tokens: PlayedToken[] = coords.map((c) => ({
    row: c[0],
    column: c[1],
    animalToken: AnimalTypes.ELK,
  }));

  return <OtherPlayZone isTurn={false} name={"name"} tokens={2} playedTiles={tiles} playedTokens={tokens} />;
}
