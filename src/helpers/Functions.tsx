export const interleave = (arr: any[], item: any) => [
  item,
  ...arr.flatMap((value: any, index: any, array: any) => [value, item]),
];
