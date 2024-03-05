import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

export function shuffle(deck: string[]): string[] {
  return _.orderBy(deck, () => uuidv4());
}
