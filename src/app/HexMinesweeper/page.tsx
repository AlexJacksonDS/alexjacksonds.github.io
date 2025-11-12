import { Metadata } from "next";
import Minesweeper from "@/components/Minesweeper/Minesweeper/Minesweeper";

export const metadata: Metadata = {
  title: "Hex Minesweeper",
  icons: "./rri-favicon.png",
};

export default function HexMinesweeperPage() {
  return <Minesweeper isHex={true}/>;
}
