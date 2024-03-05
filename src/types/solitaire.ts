export interface GameState {
  columnOne: Card[];
  columnTwo: Card[];
  columnThree: Card[];
  columnFour: Card[];
  columnFive: Card[];
  columnSix: Card[];
  columnSeven: Card[];
  pileOne: Card[];
  pileTwo: Card[];
  pileThree: Card[];
  pileFour: Card[];
  deck: Card[];
  turnedDeck: Card[];
}

export interface Card {
  id: string;
  isFaceUp: boolean;
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
  CARD: "card",
  STACK: "stack",
};
export interface DropResult {
  dropZoneId: string;
}
