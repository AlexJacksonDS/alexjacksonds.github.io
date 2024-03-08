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

export const ItemTypes = {
  STACK: "stack",
};

export interface DropResult {
  dropZoneId: string;
}
