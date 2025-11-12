export class Tile {
  isRevealed: boolean;
  hasFlag: boolean;
  hasQ: boolean;
  value: number;

  constructor() {
    this.isRevealed = false;
    this.hasFlag = false;
    this.hasQ = false;
    this.value = 0;
  }
}
