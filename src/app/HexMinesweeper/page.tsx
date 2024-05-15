import { Metadata } from "next";
import HexMinesweeper from "@/components/Minesweeper/HexMinesweeper/HexMinesweeper";

export const metadata: Metadata = {
  title: "Hex Minesweeper",
  icons: "./rri-favicon.png",
};

export default function HexMinesweeperPage() {
  return <HexMinesweeper />;
}
