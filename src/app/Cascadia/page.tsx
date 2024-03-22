import { Metadata } from "next";
import Cascadia from "@/components/Cascadia/Cascadia/Cascadia";

export const metadata: Metadata = {
  title: "Cascadia",
  icons: "./rri-favicon.png",
};

export default function CascadiaPage() {
  return <Cascadia />;
}
