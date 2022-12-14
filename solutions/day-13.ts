import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-13.txt", "utf-8");
const data = fs.readFileSync("./data/day-13.txt", "utf-8");

const pairs = data.split("\n\n").map((pair) => {
  const arrays = pair.split("\n");
  const left = JSON.parse(arrays[0].trim());
  const right = JSON.parse(arrays[1].trim());

  return { left, right };
});

// Type for arbitrarily nested array
interface NestedArray<T> extends Array<T | NestedArray<T>> {}

const comparePackets = (
  left: NestedArray<number> | number,
  right: NestedArray<number> | number
): number => {
  // Base case
  if (typeof left === "number" && typeof right === "number") {
    if (left === right) return 0;

    return right < left ? -1 : 1;
  }

  // Nest the non-array value to continue comparison
  if (typeof left === "number") return comparePackets([left], right);
  if (typeof right === "number") return comparePackets(left, [right]);

  let checkIndex = 0;

  while (checkIndex < Math.max(left.length, right.length)) {
    // Check if one is shorter than the other, but only at the point where one array ends
    if (left[checkIndex] === undefined) return 1;
    if (right[checkIndex] === undefined) return -1;

    const comparison = comparePackets(left[checkIndex], right[checkIndex]);

    // Order has been determined in recursive steps
    if (comparison !== 0) return comparison;

    checkIndex++;
  }

  // There should always be an order so this should never be reached
  return 0;
};

let orderedPairs = 0;

pairs.forEach((pair, pairIndex) => {
  const isOrdered = comparePackets(pair.left, pair.right) === 1;

  if (isOrdered) orderedPairs += pairIndex + 1;
});

console.log("Part 1:", orderedPairs);

const allPackets = data.split("\n").reduce((acc, curr) => {
  if (curr !== "") acc.push(JSON.parse(curr));
  return acc;
}, []);

const divider1 = [[2]];
const divider2 = [[6]];

allPackets.push(divider1, divider2);

const sorted = allPackets.sort((a, b) => comparePackets(b, a));

const div1Loc = sorted.findIndex((packet) => packet === divider1) + 1;
const div2Loc = sorted.findIndex((packet) => packet === divider2) + 1;

console.log("Part 2:", div1Loc * div2Loc);
