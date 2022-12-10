import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-10.txt", "utf-8");
const data = fs.readFileSync("./data/day-10.txt", "utf-8");

const instructions = data.trim().split("\n");

let instructionIndex = 0,
  cycle = 1,
  x = 1,
  currOpRuns = 0,
  signalStrength = 0;

// Build screen
const screenRow = Array.from(new Array(40), (_) => ".");
const screen = Array.from(new Array(6), (_, index) => {
  if (index === 0) {
    const firstRow = [...screenRow];
    firstRow.splice(0, 3, ...["#", "#", "#"]);
    return firstRow;
  }

  return [...screenRow];
});

while (instructionIndex < instructions.length) {
  const currScreenRow = Math.floor((cycle - 1) / 40);
  const currInstruction = instructions[instructionIndex];
  currOpRuns++;

  if ((cycle - 20) % 40 === 0) signalStrength += cycle * x;

  const currPixel = (cycle - 1) % 40;
  if (Math.abs(currPixel - x) < 2) {
    screen[currScreenRow].splice(currPixel, 1, "#");
  }

  if (currInstruction === "noop") {
    currOpRuns = 0;
    instructionIndex++;
  }

  if (currInstruction.indexOf("addx") > -1 && currOpRuns === 2) {
    x += parseInt(currInstruction.match(/(-)?\d+/)[0]);
    currOpRuns = 0;
    instructionIndex++;
  }

  cycle++;
}

console.log("Part 1:", signalStrength);

console.log("Part 2:");
console.log(screen.map((row) => row.join("")).join("\n"));
