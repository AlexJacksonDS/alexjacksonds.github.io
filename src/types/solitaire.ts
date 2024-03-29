import { Card } from "./draggableCards";

export interface GameState {
  columns: Map<string, Card[]>;
  piles: Map<string, Card[]>;
  deck: Card[];
  turnedDeck: Card[];
}
