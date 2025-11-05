export interface PlayerScore {
    name: string;
    score: number;
}

export interface ScoutCard {
    numberOne: number;
    numberTwo: number;
    isFlipped: boolean;
}

export interface ScoutGamePlayer {
    id: string;
    name: string;
    playerOrder: number;
    hand: ScoutCard[];
    hasSelectedOrientation: boolean;
    hasScoutAndShowed: boolean;
}

export interface OtherScoutGamePlayer {
    id: string;
    name: string;
    playerOrder: number;
    handCount: number;
    hasScoutedAndShowed: boolean;
    hasSelectedOrientation: boolean;
}

export interface GameState {
    player: ScoutGamePlayer;
    currentPlayer: string;
    currentLead: string;
    currentTable: ScoutCard[];
    isStartable: boolean;
    hasSelectionOccured: boolean;
    playerScores: PlayerScore[];
    otherPlayerDetails: OtherScoutGamePlayer[];
}