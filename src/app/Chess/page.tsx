import Chess from "@/components/Chess/Chess/Chess";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chess",
  icons: "./rri-favicon.png",
};

export default function ChessPage() {
  return <Chess />;
}
