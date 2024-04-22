import { Metadata } from "next";
import Cartographers from "@/components/Cartographers/Cartographers/Cartographers";

export const metadata: Metadata = {
  title: "Cartographers",
  icons: "./rri-favicon.png",
};

export function generateStaticParams() {
  const slugs = ["special", "basic"];

  return slugs.map((slug) => ({
    slug,
  }));
}

export default function CartographersPage({ params }: { params: { slug: string } }) {
  const isSpecial = params.slug.toLowerCase() === "special";

  return <Cartographers isSpecialBoard={isSpecial} />;
}
