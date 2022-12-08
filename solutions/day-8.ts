import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-8.txt", "utf-8");
const data = fs.readFileSync("./data/day-8.txt", "utf-8");

const grid = data.split("\n").map((row) => row.split("").map((val) => +val));
const transposed = grid[0].map((_, colIndex) =>
  grid.map((row) => row[colIndex])
);

let visibleTrees = grid[0].length * 2 + (grid.length - 2) * 2;

const checkVisibility = (
  row: number,
  col: number,
  trees = grid,
  transposedTrees = transposed
): boolean => {
  const height = trees[row][col];

  const lToR = !trees[row].slice(0, col).find((tree) => tree >= height);
  if (lToR) return true;

  const rToL = !trees[row]
    .slice(col + 1)
    .reverse()
    .find((tree) => tree >= height);
  if (rToL) return true;

  const tToB = !transposedTrees[col]
    .slice(0, row)
    .find((tree) => tree >= height);
  if (tToB) return true;

  const bToT = !transposedTrees[col]
    .slice(row + 1)
    .reverse()
    .find((tree) => tree >= height);
  if (bToT) return true;

  return false;
};

for (let row = 1; row < grid.length - 1; row++) {
  for (let col = 1; col < grid[1].length - 1; col++) {
    // Check taller than others
    if (grid[row][col] > 0 && checkVisibility(row, col)) visibleTrees++;
  }
}

console.log("Part 1:", visibleTrees);
