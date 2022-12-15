import * as fs from "fs";

const data = fs.readFileSync("./test-data/day-15.txt", "utf-8");
// const data = fs.readFileSync("./data/day-15.txt", "utf-8");

// This solution produces a pretty grid for the test data
// But puzzle data is too large
// Causes JS Heap error!
const sensorData: { loc: number[]; beacon: number[] }[] = [];

data.split("\n").forEach((sensor) => {
  const coords = sensor.match(/(-)?\d+/g);

  sensorData.push({
    loc: [parseInt(coords[0]), parseInt(coords[1])],
    beacon: [parseInt(coords[2]), parseInt(coords[3])],
  });
});

const xCoords = sensorData
  .map((sensor) => [sensor.loc[0], sensor.beacon[0]])
  .flat();
const yCoords = sensorData
  .map((sensor) => [sensor.loc[1], sensor.beacon[1]])
  .flat();

const minX = Math.min(...xCoords);
const maxX = Math.max(...xCoords);
const minY = Math.min(...yCoords);
const maxY = Math.max(...yCoords);

const grid = Array.from(new Array(maxY - minY + 1), (_) =>
  Array.from(new Array(maxX - minX + 1), (_) => ".")
);

// Add sensors and beacons
const xOffset = -minX;
const yOffset = -minY;

// Add empties first
sensorData.forEach(({ loc, beacon }) => {
  let dist = Math.abs(loc[0] - beacon[0]) + Math.abs(loc[1] - beacon[1]);

  let i = 0;

  while (dist >= 0) {
    const left = Math.max(loc[0] + xOffset - dist, 0);
    const right = Math.min(
      loc[0] + xOffset + dist,
      grid[loc[1] + yOffset].length - 1
    );

    if (loc[1] + yOffset + i < grid.length) {
      grid[loc[1] + yOffset + i].splice(
        left,
        right - left + 1,
        ...Array.from(new Array(right - left + 1), (_) => "#")
      );
    }

    if (loc[1] + yOffset - i >= 0) {
      grid[loc[1] + yOffset - i].splice(
        left,
        right - left + 1,
        ...Array.from(new Array(right - left + 1), (_) => "#")
      );
    }

    i++;
    dist--;
  }
});

// Now add sensors and beacons
sensorData.forEach(({ loc, beacon }) => {
  grid[loc[1] + yOffset].splice(loc[0] + xOffset, 1, "S");
  grid[beacon[1] + yOffset].splice(beacon[0] + xOffset, 1, "B");
});

console.log(grid.map((row) => row.join("")).join("\n"));

console.log(
  "Part 1:",
  grid[10 + yOffset].join(""),
  grid[10 + yOffset].filter((coord) => coord === "#").length
);
