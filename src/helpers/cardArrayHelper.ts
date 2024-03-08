import { Card } from "@/types/draggableCards";
import _ from "lodash";

export function removeCardsFromColumn(list: Card[], cardIds: string[]): Card[] {
  return list
    .filter((c) => !cardIds.includes(c.id))
    .map((c, i, arr) => ({
      id: c.id,
      isFaceUp: c.isFaceUp ? c.isFaceUp : i === arr.length - 1,
      isDraggable: i === arr.length - 1,
    }));
}

export const pileOrder = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
export function isSameSuitAndOneHigher(cardId: string, pile: Card[]) {
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

export function isOppositeColour(suitOne: string, suitTwo: string) {
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
