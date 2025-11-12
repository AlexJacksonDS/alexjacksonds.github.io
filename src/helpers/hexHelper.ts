import _ from "lodash";

export function getOffsets(hexCoords: number[][]) {
  const rowOffset = _.max(hexCoords.filter((x) => x[0] < 0).map((x) => Math.abs(x[0]))) ?? 0;
  const colOffset = _.max(hexCoords.filter((x) => x[1] < 0).map((x) => Math.abs(x[1]))) ?? 0;
  return { rowOffset, colOffset };
}
