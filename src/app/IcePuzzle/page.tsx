import { Metadata } from "next";
import IcePuzzle from "@/components/IcePuzzle/IcePuzzle/IcePuzzle";

export const metadata: Metadata = {
  title: "IcePuzzle",
  icons: "./rri-favicon.png",
};

export default function IcePuzzlePage() {
  return <IcePuzzle />;
}
