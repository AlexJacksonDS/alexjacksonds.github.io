import { Metadata } from "next";
import Minesweeper from "@/components/Minesweeper/Minesweeper/Minesweeper";

export const metadata: Metadata = {
  title: "Minesweeper",
  icons: "./rri-favicon.png",
};

export default function MinesweeperPage() {
  return <Minesweeper isHex={false} />;
}
