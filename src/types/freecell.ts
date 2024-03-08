import { Card } from "./draggableCards";

export interface GameState {
  columns: Map<string, Card[]>;
  piles: Map<string, Card[]>;
  slots: Map<string, Card[]>;
}

