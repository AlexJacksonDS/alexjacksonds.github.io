export interface PlayerScore {
  name: string;
  score: number;
}

export interface Player {
    id: string;
    name: string;
    selectedCard: string;
    playerOrder: number;
    hand: string[];
  }

export interface OtherPlayer {
  id: string;
  name: string;
  selectedCard: string;
  playerOrder: number;
  handCount: number;
}
