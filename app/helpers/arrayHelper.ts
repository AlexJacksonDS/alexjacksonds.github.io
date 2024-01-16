export function isArrayInArray(array: any[], item: any) {
  return array.some(function (element) {
    return JSON.stringify(element) === JSON.stringify(item);
  });
}
