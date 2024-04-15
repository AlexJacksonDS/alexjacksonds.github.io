import Othello from "@/components/Othello/Othello/Othello";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Othello",
  icons: "./rri-favicon.png",
};

export default function OthelloPage() {
  return <Othello />;
}
