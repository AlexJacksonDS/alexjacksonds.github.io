import { Metadata } from "next";
import Transamerica from "@/components/Transamerica/Transamerica";

export const metadata: Metadata = {
  title: "TransAmerica",
  icons: "./rri-favicon.png",
};

export default function TransamericaPage() {
  return <Transamerica />;
}
