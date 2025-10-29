export interface PlayerScore {
  name: string;
  score: number;
}

export interface Player {
  id: string;
  name: string;
  playerOrder: number;
  hand: Tile[];
}

export interface OtherPlayer {
  id: string;
  name: string;
  playerOrder: number;
  tileCount: number;
}

export interface Tile {
  letter: string;
  actualLetter: string;
  points: number;
}

export interface Square {
  tile?: Tile;
  spaceType: SpaceType;
  isBonusUsed: false;
}

export enum SpaceType
{
    Normal,
    DoubleLetter,
    TripleLetter,
    DoubleWord,
    TripleWord
}
