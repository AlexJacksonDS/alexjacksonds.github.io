import { Metadata } from "next";
import Breakout from "@/components/Breakout/Breakout";

export const metadata: Metadata = {
  title: "Breakout",
  icons: "./rri-favicon.png",
};

export default function BreakoutPage() {
  return <Breakout />;
}
