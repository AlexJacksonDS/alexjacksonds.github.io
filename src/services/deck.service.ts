import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

export function shuffle(deck: string[]): string[] {
  return _.orderBy(deck, () => uuidv4());
}

export function dealIntoColumns(columnLengths: number[], deck: string[]): (string | undefined)[][] {
  return columnLengths.map((x) => Array.from({ length: x }, () => deck.shift()));
}
