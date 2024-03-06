import { Card, GameState } from "@/types/solitaire";
import { shuffle } from "./deck.service";
import { deck } from "@/types/deck";
import _ from "lodash";

const cardColumns = [
  "column-one",
  "column-two",
  "column-three",
  "column-four",
  "column-five",
  "column-six",
  "column-seven",
];

const cardPiles = ["pile-one", "pile-two", "pile-three", "pile-four"];
const pileOrder = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
const columnOrder = [...pileOrder].reverse();

export function dealSolitaire(): GameState {
  const shuffledDeck = shuffle(deck);

  const columnOne = [shuffledDeck.shift()];
  const columnTwo = [shuffledDeck.shift(), shuffledDeck.shift()];
  const columnThree = [shuffledDeck.shift(), shuffledDeck.shift(), shuffledDeck.shift()];
  const columnFour = [shuffledDeck.shift(), shuffledDeck.shift(), shuffledDeck.shift(), shuffledDeck.shift()];
  const columnFive = [
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
  ];
  const columnSix = [
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
  ];
  const columnSeven = [
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
    shuffledDeck.shift(),
  ];

  return {
    columnOne: flipAllExceptLast(columnOne as string[]),
    columnTwo: flipAllExceptLast(columnTwo as string[]),
    columnThree: flipAllExceptLast(columnThree as string[]),
    columnFour: flipAllExceptLast(columnFour as string[]),
    columnFive: flipAllExceptLast(columnFive as string[]),
    columnSix: flipAllExceptLast(columnSix as string[]),
    columnSeven: flipAllExceptLast(columnSeven as string[]),
    pileOne: [],
    pileTwo: [],
    pileThree: [],
    pileFour: [],
    deck: flipAll([...shuffledDeck]),
    turnedDeck: [],
  };
}

export function turnThreeDeckCards(gameState: GameState) {
  const newGameState: GameState = JSON.parse(JSON.stringify(gameState));

  if (gameState.deck.length === 0) {
    newGameState.deck = [...gameState.turnedDeck].reverse().map((c) => ({ id: c.id, isFaceUp: false }));
    newGameState.turnedDeck = [];
  } else {
    newGameState.turnedDeck = newGameState.turnedDeck
      .concat([newGameState.deck.pop() as Card, newGameState.deck.pop() as Card, newGameState.deck.pop() as Card])
      .map((c) => ({ id: c.id, isFaceUp: true }));

    console.log(newGameState.turnedDeck);
  }
  return newGameState;
}

export function makeMove(
  gameState: GameState,
  sourceZone: string,
  targetZone: string,
  cardIds: string[]
): GameState {
  const newGameState: GameState = JSON.parse(JSON.stringify(gameState));
  addCardsToTargetZone(gameState, targetZone, newGameState, cardIds);
  removeCardFromSourceList(gameState, sourceZone, newGameState, cardIds);

  return newGameState;
}

function addCardsToTargetZone(
  gameState: GameState,
  targetZone: string,
  newGameState: GameState,
  cardIds: string[]
) {
  const cards = cardIds.map((id) => ({ id, isFaceUp: true }));
  switch (targetZone) {
    case "column-one":
      newGameState.columnOne = gameState.columnOne.concat(cards);
      break;
    case "column-two":
      newGameState.columnTwo = gameState.columnTwo.concat(cards);
      break;
    case "column-three":
      newGameState.columnThree = gameState.columnThree.concat(cards);
      break;
    case "column-four":
      newGameState.columnFour = gameState.columnFour.concat(cards);
      break;
    case "column-five":
      newGameState.columnFive = gameState.columnFive.concat(cards);
      break;
    case "column-six":
      newGameState.columnSix = gameState.columnSix.concat(cards);
      break;
    case "column-seven":
      newGameState.columnSeven = gameState.columnSeven.concat(cards);
      break;
    case "pile-one":
      newGameState.pileOne = gameState.pileOne.concat(cards);
      break;
    case "pile-two":
      newGameState.pileTwo = gameState.pileTwo.concat(cards);
      break;
    case "pile-three":
      newGameState.pileThree = gameState.pileThree.concat(cards);
      break;
    case "pile-four":
      newGameState.pileFour = gameState.pileFour.concat(cards);
      break;
    default:
      return;
  }
}

function removeCardFromSourceList(
  gameState: GameState,
  sourceZone: string,
  newGameState: GameState,
  cardIds: string[]
) {
  switch (sourceZone) {
    case "column-one":
      newGameState.columnOne = gameState.columnOne
        .filter((c) => !cardIds.includes(c.id))
        .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
      break;
    case "column-two":
      newGameState.columnTwo = gameState.columnTwo
        .filter((c) => !cardIds.includes(c.id))
        .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
      break;
    case "column-three":
      newGameState.columnThree = gameState.columnThree
        .filter((c) => !cardIds.includes(c.id))
        .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
      break;
    case "column-four":
      newGameState.columnFour = gameState.columnFour
        .filter((c) => !cardIds.includes(c.id))
        .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
      break;
    case "column-five":
      newGameState.columnFive = gameState.columnFive
        .filter((c) => !cardIds.includes(c.id))
        .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
      break;
    case "column-six":
      newGameState.columnSix = gameState.columnSix
        .filter((c) => !cardIds.includes(c.id))
        .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
      break;
    case "column-seven":
      newGameState.columnSeven = gameState.columnSeven
        .filter((c) => !cardIds.includes(c.id))
        .map((c, i, arr) => ({ id: c.id, isFaceUp: i === arr.length - 1 }));
      break;
    case "turnedDeck":
      newGameState.turnedDeck = gameState.turnedDeck.filter((c) => !cardIds.includes(c.id));
      break;
    default:
      return;
  }
}

export function isMoveLegal(gameState: GameState, targetZone: string, cardIds: string[]) {
  if (cardPiles.includes(targetZone)) {
    if (cardIds.length !== 1) return false;

    if (isCardInvalidForPile(gameState, cardIds[0], targetZone)) return false;
  }

  if (cardColumns.includes(targetZone)) {
    if (isCardInvalidForColumn(gameState, cardIds[0], targetZone)) return false;
  }

  return true;
}

function isCardInvalidForPile(gameState: GameState, cardId: string, targetZone: string) {
  switch (targetZone) {
    case "pile-one":
      return !isSameSuitAndOneHigher(cardId, gameState.pileOne);
    case "pile-two":
      return !isSameSuitAndOneHigher(cardId, gameState.pileTwo);
    case "pile-three":
      return !isSameSuitAndOneHigher(cardId, gameState.pileThree);
    case "pile-four":
      return !isSameSuitAndOneHigher(cardId, gameState.pileFour);
    default:
      return true;
  }
}

function isCardInvalidForColumn(gameState: GameState, cardId: string, targetZone: string) {
  switch (targetZone) {
    case "column-one":
      return !isOppositeColourAndOneLower(cardId, gameState.columnOne);
    case "column-two":
      return !isOppositeColourAndOneLower(cardId, gameState.columnTwo);
    case "column-three":
      return !isOppositeColourAndOneLower(cardId, gameState.columnThree);
    case "column-four":
      return !isOppositeColourAndOneLower(cardId, gameState.columnFour);
    case "column-five":
      return !isOppositeColourAndOneLower(cardId, gameState.columnFive);
    case "column-six":
      return !isOppositeColourAndOneLower(cardId, gameState.columnSix);
    case "column-seven":
      return !isOppositeColourAndOneLower(cardId, gameState.columnSeven);
    default:
      return true;
  }
}

function isSameSuitAndOneHigher(cardId: string, pile: Card[]) {
  const lastInPile = _.last(pile);

  if (!lastInPile) return cardId.includes("A");

  const pileSuit = lastInPile.id.substring(1);
  const cardSuit = cardId.substring(1);

  if (pileSuit !== cardSuit) return false;

  const pileValue = lastInPile.id.substring(0, 1);
  const cardValue = cardId.substring(0, 1);

  if (pileOrder[pileOrder.indexOf(cardValue) - 1] !== pileValue) return false;

  return true;
}

function isOppositeColourAndOneLower(cardId: string, column: Card[]) {
  const lastInColumn = _.last(column);

  if (!lastInColumn) return cardId.includes("K");

  const columnSuit = lastInColumn.id.substring(1);
  const cardSuit = cardId.substring(1);

  if (!isOppositeColour(columnSuit, cardSuit)) return false;

  const columnValue = lastInColumn.id.substring(0, 1);
  const cardValue = cardId.substring(0, 1);

  if (columnOrder[columnOrder.indexOf(cardValue) - 1] !== columnValue) return false;

  return true;
}

function isOppositeColour(suitOne: string, suitTwo: string) {
  switch (suitOne) {
    case "C":
    case "S":
      return suitTwo === "D" || suitTwo === "H";
    case "D":
    case "H":
      return suitTwo === "C" || suitTwo === "S";
    default:
      return false;
  }
}

function flipAllExceptLast(cards: string[]): Card[] {
  return cards.map((card, index) => ({ id: card, isFaceUp: index === cards.length - 1 }));
}

function flipAll(cards: string[]): Card[] {
  return cards.map((card) => ({ id: card, isFaceUp: false }));
}
