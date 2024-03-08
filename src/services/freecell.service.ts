import { GameState } from "@/types/freecell";
import { dealIntoColumns, shuffle } from "./deck.service";
import { deck } from "@/types/deck";
import _ from "lodash";
import { Card } from "@/types/draggableCards";
import { isSameSuitAndOneHigher, pileOrder, removeCardsFromColumn } from "@/helpers/cardArrayHelper";
import { isOppositeColour } from "@/helpers/cardArrayHelper";

const cardColumns = [
  "column-one",
  "column-two",
  "column-three",
  "column-four",
  "column-five",
  "column-six",
  "column-seven",
  "column-eight",
];

const cardPiles = ["pile-one", "pile-two", "pile-three", "pile-four"];
const cardSlots = ["slot-one", "slot-two", "slot-three", "slot-four"];
const columnOrder = [...pileOrder].reverse();

export function dealFreecell(): GameState {
  const shuffledDeck = shuffle(deck);
  const columnLengths = [7, 7, 7, 7, 6, 6, 6, 6];

  const columns = dealIntoColumns(columnLengths, shuffledDeck);

  const columnMap = new Map<string, Card[]>();
  cardColumns.map((k, i) => {
    columnMap.set(
      k,
      (columns[i] as string[]).map((cardId) => ({ id: cardId, isFaceUp: true, isDraggable: false }))
    );
  });

  const pileMap = new Map<string, Card[]>();
  cardPiles.map((k) => {
    pileMap.set(k, []);
  });

  const slotMap = new Map<string, Card[]>();
  cardSlots.map((k) => {
    slotMap.set(k, []);
  });
  const newGameState = {
    columns: columnMap,
    piles: pileMap,
    slots: slotMap,
  };
  setIsDraggableState(newGameState);
  return newGameState;
}

export function makeMove(gameState: GameState, sourceZone: string, targetZone: string, cardIds: string[]): GameState {
  const newGameState: GameState = _.cloneDeep(gameState);
  addCardsToTargetZone(gameState, targetZone, newGameState, cardIds);
  removeCardFromSourceList(gameState, sourceZone, newGameState, cardIds);
  setIsDraggableState(newGameState);
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
  if (cardSlots.includes(targetZone)) {
    newGameState.slots.set(targetZone, cards);
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
  if (cardSlots.includes(sourceZone)) {
    newGameState.slots.set(sourceZone, []);
  }
}

export function isMoveLegal(gameState: GameState, targetZone: string, sourceZone: string, cardIds: string[]) {
  if (cardPiles.includes(sourceZone)) return false;

  if (cardSlots.includes(targetZone) && cardIds.length !== 1) return false;

  if (cardPiles.includes(targetZone)) {
    if (cardIds.length !== 1) return false;

    if (isCardInvalidForPile(gameState, cardIds[0], targetZone)) return false;
  }

  if (cardColumns.includes(targetZone)) {
    if (isCardInvalidForColumn(gameState, cardIds, targetZone)) return false;
  }

  return true;
}

function isCardInvalidForPile(gameState: GameState, cardId: string, targetZone: string) {
  return !isSameSuitAndOneHigher(cardId, gameState.piles.get(targetZone)!);
}

function isCardInvalidForColumn(gameState: GameState, cardIds: string[], targetZone: string) {
  return !isOppositeColourAndOneLowerDragTarget(cardIds, gameState, targetZone);
}

function isOppositeColourAndOneLowerDragTarget(cardIds: string[], gameState: GameState, targetZone: string) {
  const column = gameState.columns.get(targetZone)!;
  const lastInColumn = _.last(column);

  if (!lastInColumn) return isStackDraggableToEmptyColumn(gameState, cardIds);

  const columnSuit = lastInColumn.id.substring(1);
  const cardSuit = cardIds[0].substring(1);

  if (!isOppositeColour(columnSuit, cardSuit)) return false;

  const columnValue = lastInColumn.id.substring(0, 1);
  const cardValue = cardIds[0].substring(0, 1);

  if (columnOrder[columnOrder.indexOf(cardValue) - 1] !== columnValue) return false;

  return true;
}

function isOppositeColourAndOneLower(cardId: string, column: Card[]) {
  const lastInColumn = _.last(column);

  if (!lastInColumn) return true;

  const columnSuit = lastInColumn.id.substring(1);
  const cardSuit = cardId.substring(1);

  if (!isOppositeColour(columnSuit, cardSuit)) return false;

  const columnValue = lastInColumn.id.substring(0, 1);
  const cardValue = cardId.substring(0, 1);

  if (columnOrder[columnOrder.indexOf(cardValue) - 1] !== columnValue) return false;

  return true;
}

function isStackDraggable(gameState: GameState, stack: Card[]) {
  const emptySlotCount = emptyStackCount(gameState.slots);
  const emptyColumnCount = emptyStackCount(gameState.columns);

  const maxCards = Math.pow(2, emptyColumnCount) * (emptySlotCount + 1);

  return stack.length <= maxCards;
}

function isStackDraggableToEmptyColumn(gameState: GameState, stack: string[]) {
  const emptySlotCount = emptyStackCount(gameState.slots);
  const emptyColumnCount = emptyStackCount(gameState.columns);

  const maxCards = Math.pow(2, emptyColumnCount) * (emptySlotCount + 1);

  return stack.length <= maxCards / 2;
}

function emptyStackCount(stackMap: Map<string, Card[]>) {
  return [...stackMap.values()].filter((stack) => stack.length === 0).length;
}

function allCardsBelowAreInOrder(card: Card, cards: Card[]) {
  let currentCard = card;
  for (const card of cards) {
    if (!isOppositeColourAndOneLower(card.id, [currentCard])) {
      return false;
    }
    currentCard = card;
  }
  return true;
}

function setIsDraggableState(gameState: GameState) {
  cardSlots.map((slot) => {
    gameState.slots.set(
      slot,
      gameState.slots.get(slot)!.map((card) => ({ id: card.id, isFaceUp: true, isDraggable: true }))
    );
  });

  cardPiles.map((pile) => {
    gameState.piles.set(
      pile,
      gameState.piles.get(pile)!.map((card) => ({ id: card.id, isFaceUp: true, isDraggable: false }))
    );
  });

  cardColumns.map((column) => {
    gameState.columns.set(
      column,
      gameState.columns.get(column)!.map((card, i, arr) => ({
        id: card.id,
        isFaceUp: true,
        isDraggable: allCardsBelowAreInOrder(card, arr.slice(i + 1)) && isStackDraggable(gameState, arr.slice(i)),
      }))
    );
  });
}
