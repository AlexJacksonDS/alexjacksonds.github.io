export interface GameState {
  isStarted: boolean;
  isStartable: boolean;
  isRedBroken: boolean;
  allDiscarded: boolean;
  allBet: boolean;
  isBasicBoard: boolean;
  currentPlayer: string;
  currentLead?: SelectedCard;
  myDetails: MyDetails;
  otherPlayerDetails: OtherPlayerDetails[];
  playedCards: PlayedCards;
}

interface PlayerDetails {
  player: Player;
  selectedCard: SelectedCard;
  trickCount: number;
  betTrickCount: number;
  hasRed: boolean;
  hasBlue: boolean;
  hasYellow: boolean;
  hasGreen: boolean;
  playerColour: number;
  playerOrder: number;
  score: number;
}

export type MyDetails = PlayerDetails & {
  currentHand: number[];
};

export type OtherPlayerDetails = PlayerDetails & {
  handCount: number;
};

interface Player {
  id: string;
  name: string;
}

interface SelectedCard {
  card: number;
  colour: number;
}

export interface PlayedCards {
  Red: ColourCards;
  Blue: ColourCards;
  Yellow: ColourCards;
  Green: ColourCards;
}

export interface ColourCards {
  1: PlayerColour;
  2: PlayerColour;
  3: PlayerColour;
  4: PlayerColour;
  5: PlayerColour;
  6?: PlayerColour;
  7?: PlayerColour;
  8?: PlayerColour;
  9?: PlayerColour;
}

export enum PlayerColour {
  Red = 1,
  LightBlue = 2,
  Yellow = 3,
  Teal = 4,
  Purple = 5,
  Unselected = 6,
}
