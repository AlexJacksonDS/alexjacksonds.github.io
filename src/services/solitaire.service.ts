import { GameState } from "@/types/solitaire";
import { dealIntoColumns, shuffle } from "./deck.service";
import { deck } from "@/types/deck";
import _ from "lodash";
import { Card } from "@/types/draggableCards";
import { isOppositeColour, isSameSuitAndOneHigher, pileOrder, removeCardsFromColumn } from "@/helpers/cardArrayHelper";

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
const columnOrder = [...pileOrder].reverse();

export function dealSolitaire(): GameState {
  const shuffledDeck = shuffle(deck);
  const columnLengths = [1, 2, 3, 4, 5, 6, 7];

  const columns = dealIntoColumns(columnLengths, shuffledDeck);

  const columnMap = new Map<string, Card[]>();
  cardColumns.map((k, i) => {
    columnMap.set(k, flipAllExceptLast(columns[i] as string[]));
  });

  const pileMap = new Map<string, Card[]>();
  cardPiles.map((k) => {
    pileMap.set(k, []);
  });

  return {
    columns: columnMap,
    piles: pileMap,
    deck: flipAll([...shuffledDeck]),
    turnedDeck: [],
  };
}

export function turnThreeDeckCards(gameState: GameState) {
  const newGameState: GameState = _.cloneDeep(gameState);

  if (gameState.deck.length === 0) {
    newGameState.deck = [...gameState.turnedDeck]
      .reverse()
      .map((c) => ({ id: c.id, isFaceUp: false, isDraggable: false }));
    newGameState.turnedDeck = [];
  } else {
    newGameState.turnedDeck = newGameState.turnedDeck
      .concat([newGameState.deck.pop() as Card, newGameState.deck.pop() as Card, newGameState.deck.pop() as Card])
      .filter((c) => c !== undefined)
      .map((c, i, arr) => ({ id: c.id, isFaceUp: true, isDraggable: i === arr.length - 1 }));
  }
  return newGameState;
}

export function makeMove(gameState: GameState, sourceZone: string, targetZone: string, cardIds: string[]): GameState {
  const newGameState: GameState = _.cloneDeep(gameState);
  addCardsToTargetZone(gameState, targetZone, newGameState, cardIds);
  removeCardFromSourceList(gameState, sourceZone, newGameState, cardIds);

  return newGameState;
}

function addCardsToTargetZone(gameState: GameState, targetZone: string, newGameState: GameState, cardIds: string[]) {
  const cards = cardIds.map((id) => ({ id, isFaceUp: true, isDraggable: !cardPiles.includes(targetZone) }));
  if (cardColumns.includes(targetZone)) {
    newGameState.columns.set(targetZone, gameState.columns.get(targetZone)!.concat(cards));
  }
  if (cardPiles.includes(targetZone)) {
    newGameState.piles.set(targetZone, gameState.piles.get(targetZone)!.concat(cards));
  }
}

function removeCardFromSourceList(
  gameState: GameState,
  sourceZone: string,
  newGameState: GameState,
  cardIds: string[]
) {
  if (cardColumns.includes(sourceZone)) {
    newGameState.columns.set(sourceZone, removeCardsFromColumn(gameState.columns.get(sourceZone)!, cardIds));
  }
  if (sourceZone === "turnedDeck") {
    newGameState.turnedDeck = gameState.turnedDeck.filter((c) => !cardIds.includes(c.id));
  }
}

export function isMoveLegal(gameState: GameState, targetZone: string, sourceZone: string, cardIds: string[]) {
  if (cardPiles.includes(sourceZone)) return false;

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
  return !isSameSuitAndOneHigher(cardId, gameState.piles.get(targetZone)!);
}

function isCardInvalidForColumn(gameState: GameState, cardId: string, targetZone: string) {
  return !isOppositeColourAndOneLower(cardId, gameState.columns.get(targetZone)!);
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

function flipAllExceptLast(cards: string[]): Card[] {
  return cards.map((card, index) => ({
    id: card,
    isFaceUp: index === cards.length - 1,
    isDraggable: index === cards.length - 1,
  }));
}

function flipAll(cards: string[]): Card[] {
  return cards.map((card) => ({ id: card, isFaceUp: false, isDraggable: false }));
}
