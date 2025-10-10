import { Metadata } from "next";
import Tetris from "@/components/Tetris/Tetris/Tetris";

export const metadata: Metadata = {
  title: "Tetris",
  icons: "./rri-favicon.png",
};

export default function TetrisPage() {
  return <Tetris />;
}
