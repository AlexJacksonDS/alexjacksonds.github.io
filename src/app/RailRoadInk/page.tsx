import RailRoadInk from "../../components/RailRoadInk/RailRoadInk";
import "./RailRoadInk.scss";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Railroad Ink",
  description: "Road and Rail drawing game",
  icons: "./rri-favicon.png"
};

export default function RailRoadInkPage() {
  return <RailRoadInk />;
}
