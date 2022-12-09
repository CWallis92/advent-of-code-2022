import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-9.txt", "utf-8");
const data = fs.readFileSync("./data/day-9.txt", "utf-8");

const instructions = data.split("\n");

const shouldMoveTail = (tail: number[], head: number[]): boolean => {
  return Math.abs(head[0] - tail[0]) > 1 || Math.abs(head[1] - tail[1]) > 1;
};

const moveHead = (start: number[], dir: string): number[] => {
  switch (dir) {
    case "R":
      return [start[0], start[1] + 1];
    case "D":
      return [start[0] - 1, start[1]];
    case "L":
      return [start[0], start[1] - 1];
    default:
      return [start[0] + 1, start[1]];
  }
};

const moveTail = (head: number[], tail: number[]): number[] => {
  const vert = head[0] !== tail[0] ? (head[0] > tail[0] ? 1 : -1) : 0;
  const hor = head[1] !== tail[1] ? (head[1] > tail[1] ? 1 : -1) : 0;

  return [tail[0] + vert, tail[1] + hor];
};

let headCoord = [0, 0];
let tailCoord = [0, 0];
const visitedCoords = [[0, 0]];

instructions.forEach((instruction) => {
  const dir = instruction[0];
  const dist = +instruction.match(/\d+/)[0];

  for (let i = 0; i < dist; i++) {
    headCoord = moveHead(headCoord, dir);

    if (shouldMoveTail(tailCoord, headCoord)) {
      tailCoord = moveTail(headCoord, tailCoord);

      if (
        !visitedCoords.find(
          (coord) => coord[0] === tailCoord[0] && coord[1] === tailCoord[1]
        )
      ) {
        visitedCoords.push(tailCoord);
      }
    }
  }
});

console.log("Part 1:", visitedCoords.length);

const knots = Array.from(new Array(10), (_) => [0, 0]);
const visitedCoords2 = [[0, 0]];

instructions.forEach((instruction) => {
  const dir = instruction[0];
  const dist = +instruction.match(/\d+/)[0];

  for (let i = 0; i < dist; i++) {
    for (let knotIndex = knots.length - 1; knotIndex > 0; knotIndex--) {
      if (knotIndex === knots.length - 1)
        knots.splice(knotIndex, 1, moveHead(knots[knotIndex], dir));

      if (shouldMoveTail(knots[knotIndex - 1], knots[knotIndex])) {
        knots.splice(
          knotIndex - 1,
          1,
          moveTail(knots[knotIndex], knots[knotIndex - 1])
        );

        if (
          knotIndex === 1 &&
          !visitedCoords2.find(
            (coord) => coord[0] === knots[0][0] && coord[1] === knots[0][1]
          )
        ) {
          visitedCoords2.push(knots[0]);
        }
      }
    }
  }
});

console.log("Part 2:", visitedCoords2.length);
