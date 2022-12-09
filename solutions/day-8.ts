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

const getScore = (
  row: number,
  col: number,
  trees = grid,
  transposedTrees = transposed
): number => {
  const height = trees[row][col];

  const lTrees = trees[row].slice(0, col).reverse();
  const lIndex = lTrees.findIndex((tree) => tree >= height);
  const lScore = lIndex === -1 ? lTrees.length : lIndex + 1;

  const rTrees = trees[row].slice(col + 1);
  const rIndex = rTrees.findIndex((tree) => tree >= height);
  const rScore = rIndex === -1 ? rTrees.length : rIndex + 1;

  const uTrees = transposedTrees[col].slice(0, row).reverse();
  const uIndex = uTrees.findIndex((tree) => tree >= height);
  const uScore = uIndex === -1 ? uTrees.length : uIndex + 1;

  const dTrees = transposedTrees[col].slice(row + 1);
  const dIndex = dTrees.findIndex((tree) => tree >= height);
  const dScore = dIndex === -1 ? dTrees.length : dIndex + 1;

  return lScore * rScore * uScore * dScore;
};

let maxScore = 0;

for (let row = 1; row < grid.length - 1; row++) {
  for (let col = 1; col < grid[1].length - 1; col++) {
    // Check taller than others
    const treeScore = getScore(row, col);

    if (treeScore > maxScore) maxScore = treeScore;
  }
}

console.log("Part 2:", maxScore);
