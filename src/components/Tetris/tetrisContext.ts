import { Game, getFreshBoard } from "@/types/tetris";
import { createContext } from "react";

export const TetrisContext = createContext<Game>({
  isLost: false,
  board: getFreshBoard(),
  activeBlock: undefined,
});
