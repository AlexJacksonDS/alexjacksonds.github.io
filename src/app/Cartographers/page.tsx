import { Metadata } from "next";
import Cartographers from "@/components/Cartographers/Cartographers/Cartographers";

export const metadata: Metadata = {
  title: "Cartographers",
  icons: "./rri-favicon.png",
};

export default function CartographersPage() {
  return <Cartographers />;
}
