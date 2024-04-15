import Draughts from "@/components/Draughts/Draughts/Draughts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draughts",
  icons: "./rri-favicon.png",
};

export default function DraughtsPage() {
  return <Draughts />;
}
