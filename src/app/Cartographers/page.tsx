import { Metadata } from "next";
import MultiCartographers from "@/components/Cartographers/MultiCartographers/MultiCartographers";

export const metadata: Metadata = {
  title: "Cartographers",
  icons: "./rri-favicon.png",
};

export default function CartographersPage() {
  return <MultiCartographers />;
}
