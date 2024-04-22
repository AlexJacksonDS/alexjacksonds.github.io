import { Terrain } from "@/types/cartographers";
import { createContext } from "react";

interface CartographersContext {
  handlePalletClick: (terrain: Terrain) => void;
  handleTileClick: (i: number, j: number) => void;
}
export const CartographersContext = createContext<CartographersContext>({
  handlePalletClick: () => null,
  handleTileClick: () => null,
});
