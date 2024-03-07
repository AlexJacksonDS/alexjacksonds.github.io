export interface GameState {
  columns: Map<string, Card[]>;
  piles: Map<string, Card[]>;
  deck: Card[];
  turnedDeck: Card[];
}

export interface Card {
  id: string;
  isFaceUp: boolean;
  isDraggable: boolean;
}

export interface DraggableCard {
  id: string;
  index: number;
  isFaceUp: boolean;
}

export interface DraggableCardStack {
  id: string;
  index: number;
}

export const ItemTypes = {
  STACK: "stack",
};

export interface DropResult {
  dropZoneId: string;
}
