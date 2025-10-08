import Wordle from "@/components/Wordle/Wordle/Wordle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordle",
  icons: "./rri-favicon.png",
};

export default function WordlePage() {
  return <Wordle />;
}
