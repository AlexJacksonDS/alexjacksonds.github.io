import { Metadata } from "next";
import CatInTheBox from "@/components/CatInTheBox/CatInTheBox/CatInTheBox";

export const metadata: Metadata = {
  title: "CatInTheBox",
  icons: "./rri-favicon.png",
};

export default function CatInTheBoxPage() {
  return <CatInTheBox />;
}
