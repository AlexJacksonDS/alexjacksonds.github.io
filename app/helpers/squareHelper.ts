const alphaArray = ["a", "b", "c", "d", "e", "f", "g", "h"];
const numArray = [8, 7, 6, 5, 4, 3, 2, 1];

export function getSquareCode(row: number, col: number) {
  return alphaArray[col] + numArray[row];
}

export function getRowColFromSquareCode(code: string) {
  const split = code.split("");
  return [numArray.indexOf(parseInt(split[1])), alphaArray.indexOf(split[0])];
}

export function getSquareColour(row: number, col: number) {
  return (row + col) % 2 == 0 ? 'light' : 'dark';
}