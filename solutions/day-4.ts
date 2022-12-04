import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-4.txt", "utf-8");
const data = fs.readFileSync("./data/day-4.txt", "utf-8");

const assignmentPairs: number[][][] = data.split("\n").map((pair) =>
  pair.split(",").map((group) => {
    const startEnd = group.split("-");
    const out: number[] = [];

    for (let i = +startEnd[0]; i <= +startEnd[1]; i++) {
      out.push(i);
    }

    return out;
  })
);

const fullyContained = assignmentPairs.filter((pair) => {
  return (
    (pair[0][0] >= pair[1][0] &&
      pair[0][pair[0].length - 1] <= pair[1][pair[1].length - 1]) ||
    (pair[1][0] >= pair[0][0] &&
      pair[1][pair[1].length - 1] <= pair[0][pair[0].length - 1])
  );
});

console.log("Part 1:", fullyContained.length);

const overlap = assignmentPairs.filter((pair) => {
  return (
    (pair[0][0] <= pair[1][0] && pair[0][pair[0].length - 1] >= pair[1][0]) ||
    (pair[1][0] <= pair[0][0] && pair[1][pair[1].length - 1] >= pair[0][0])
  );
});

console.log("Part 2:", overlap.length);
