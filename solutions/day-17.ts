import * as fs from "fs";

const data = fs.readFileSync("./test-data/day-17.txt", "utf-8");
// const data = fs.readFileSync("./data/day-17.txt", "utf-8");

// We only need to track the current bottom point of each 7 columns. No need to build the full thing!

/* 
The tall, vertical chamber is exactly seven units wide. Each rock appears so that its left edge is two units away from the left wall and its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one).
*/

const chamberBottoms = [0, 0, 0, 0, 0, 0, 0];

let jetIndex = 0,
  rockIndex = 0;

while (rockIndex < 2022) {
  const currRock = {};

  // Apply to correct columns
  while (currRock.bottom > chamberBottoms[2]) {
    // Do the jet move
    jetIndex++;

    // Do the down move
    currRock.bottom--;
  }

  rockIndex++;
}

console.log("Part 1:", Math.max(...chamberBottoms));
