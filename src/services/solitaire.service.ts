import { Card, GameState } from "@/types/solitaire";
import { shuffle } from "./deck.service";
import { deck } from "@/types/deck";

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
    columnOne:  flipAllExceptLast(columnOne as string[]),
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

function flipAllExceptLast(cards: string[]): Card[] {
  return cards.map((card, index) => ({ id: card, isFaceUp: index === cards.length - 1 }));
}

function flipAll(cards: string[]): Card[] {
  return cards.map((card) => ({ id: card, isFaceUp: false }));
}
