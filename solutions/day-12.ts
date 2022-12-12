import * as fs from "fs";
import Graph from "node-dijkstra";

// const data = fs.readFileSync("./test-data/day-12.txt", "utf-8");
const data = fs.readFileSync("./data/day-12.txt", "utf-8");

const grid = data.split("\n").map((line) => line.trim().split(""));

const route = new Graph();

grid.forEach((row, rowIndex) => {
  row.forEach((point, pointIndex) => {
    const neighbours: { [node: string]: number } = {};

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (
          Math.abs(i) === Math.abs(j) ||
          rowIndex + i < 0 ||
          rowIndex + i >= grid.length ||
          pointIndex + j < 0 ||
          pointIndex + j >= row.length
        )
          continue;

        const start = point === "S" ? "a" : point;
        const end =
          grid[rowIndex + i][pointIndex + j] === "E"
            ? "z"
            : grid[rowIndex + i][pointIndex + j];

        const weight = end.charCodeAt(0) - start.charCodeAt(0);

        if (weight < 2) {
          neighbours[
            grid[rowIndex + i][pointIndex + j] === "S"
              ? "S"
              : grid[rowIndex + i][pointIndex + j] === "E"
              ? "E"
              : `${rowIndex + i},${pointIndex + j}`
          ] = 1;
        }
      }
    }

    const label =
      point === "S" ? "S" : point === "E" ? "E" : `${rowIndex},${pointIndex}`;

    route.addNode(label, neighbours);
  });
});

interface PathOut {
  path: string[];
  cost: number;
}

const minPath = route.path("S", "E", { cost: true }) as PathOut;

let minCost = minPath.cost;

console.log("Part 1:", minCost);

grid.forEach((row, rowIndex) => {
  row.forEach((point, pointIndex) => {
    if (point !== "a" && point !== "S") return;

    const path = route.path(
      point === "S" ? "S" : `${rowIndex},${pointIndex}`,
      "E",
      {
        cost: true,
      }
    ) as PathOut;

    if (path.path && path.cost < minCost) minCost = path.cost;
  });
});

console.log("Part 2:", minCost);
