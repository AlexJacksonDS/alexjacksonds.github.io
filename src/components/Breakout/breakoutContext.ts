import { Game, getFreshBoard } from "@/types/breakout";
import { createContext } from "react";

export const BreakoutContext = createContext<Game>({
  board: getFreshBoard(),
  ballPos: [0, 0],
  batPos: 50,
  lives: 3,
  isLost: false,
  batWidth: 10,
  ballVector: [0,0],
  bricks: []
});
