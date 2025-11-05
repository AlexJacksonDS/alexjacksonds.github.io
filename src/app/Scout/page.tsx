import Scout from "@/components/Scout/Scout/Scout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scout",
  icons: "./rri-favicon.png",
};

export default function ScoutPage() {
  return <Scout />;
}
