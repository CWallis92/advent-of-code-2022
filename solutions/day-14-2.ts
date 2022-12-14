import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-14.txt", "utf-8");
const data = fs.readFileSync("./data/day-14.txt", "utf-8");

const paths = data
  .split("\n")
  .map((path) =>
    path.split(" -> ").map((line) => line.split(",").map((coord) => +coord))
  );

// Build initial map
const flat = paths.flat();
const cols = flat.map((coord) => coord[0]);
const minCol = Math.min(...cols);
const maxCol = Math.max(...cols);
const rows = flat.map((coord) => coord[1]);

const map = Array.from(new Array(Math.max(...rows) + 1), (_) =>
  Array.from(new Array(maxCol - minCol + 1), (_) => ".")
);

// Set where the sand pours in from
let sandCol = 500 - Math.min(...cols);

// Add rock walls
paths.forEach((path) => {
  let start = path[0];
  let end = path[1];
  let currPath = 1;

  while (currPath <= path.length) {
    if (start[0] === end[0]) {
      // Vertical
      for (
        let row = Math.min(start[1], end[1]);
        row <= Math.max(start[1], end[1]);
        row++
      ) {
        map[row].splice(start[0] - minCol, 1, "#");
      }
    } else {
      // Horizontal
      map[start[1]].splice(
        Math.min(start[0], end[0]) - minCol,
        Math.abs(end[0] - start[0]) + 1,
        ...Array.from(new Array(Math.abs(end[0] - start[0]) + 1), (_) => "#")
      );
    }

    currPath++;

    if (currPath < path.length) {
      start = end;
      end = path[currPath];
    }
  }
});

// Add floor
map.push(...[Array.from(map[0], (_) => "."), Array.from(map[0], (_) => "#")]);

let totalSandDropped = 0;

const dropSand = (currCol: number, currRow: number): [number, number] => {
  let col = currCol;

  if (col === 0) {
    map.forEach((row, rowIndex) => {
      if (rowIndex === map.length - 1) {
        row.push("#");
        return;
      }
      row.unshift(".");
    });

    col++;
    sandCol++;
  }

  if (col === map[0].length - 1) {
    map.forEach((row, rowIndex) => {
      if (rowIndex === map.length - 1) {
        row.push("#");
        return;
      }
      row.push(".");
    });

    col--;
  }

  const bottom =
    map.slice(currRow).findIndex((row) => row[col] !== ".") + currRow;

  if (
    map[bottom][col - 1] &&
    map[bottom][col - 1] !== "." &&
    map[bottom][col + 1] &&
    map[bottom][col + 1] !== "."
  )
    return [col, bottom - 1];

  // Stopping criteria
  if (
    col - 1 < 0 ||
    col + 1 >= map[0].length ||
    (col === sandCol && bottom === 0)
  )
    return [-1, -1];

  if (map[bottom][col - 1] === ".") return dropSand(col - 1, bottom);
  if (map[bottom][col + 1] === ".") return dropSand(col + 1, bottom);

  // Should never be reached
  return [col, bottom - 1];
};

// Keep dropping sand until can't be dropped
while (true) {
  const [dropCol, dropRow] = dropSand(sandCol, 0);

  if (dropCol === -1 && dropRow === -1) break;

  totalSandDropped++;
  map[dropRow].splice(dropCol, 1, "o");
}

console.log("Part 2:", totalSandDropped);
