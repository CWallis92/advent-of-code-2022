import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-2.txt", "utf-8");
const data = fs.readFileSync("./data/day-2.txt", "utf-8");

const dataArr = data.split("\n").map((item) => item.split(/\s/));

const part1 = dataArr.reduce((acc, curr) => {
  acc += curr[1].charCodeAt(0) - 87;

  switch (true) {
    case (curr[0] === "A" && curr[1] === "Y") ||
      (curr[0] === "B" && curr[1] === "Z") ||
      (curr[0] === "C" && curr[1] === "X"):
      return acc + 6;
    case (curr[0] === "A" && curr[1] === "X") ||
      (curr[0] === "B" && curr[1] === "Y") ||
      (curr[0] === "C" && curr[1] === "Z"):
      return acc + 3;
    default:
      return acc;
  }
}, 0);

console.log("Part 1:", part1);

const getVal = (input: string, win = true) => {
  switch (input) {
    case "A":
      return win ? 2 : 3;
    case "B":
      return win ? 3 : 1;
    default:
      return win ? 1 : 2;
  }
};

const part2 = dataArr.reduce((acc, curr) => {
  switch (curr[1]) {
    case "X":
      // Lose
      return acc + getVal(curr[0], false);
    case "Y":
      // Draw
      return acc + 3 + (curr[0].charCodeAt(0) - 64);
    default:
      return acc + 6 + getVal(curr[0]);
  }
}, 0);

console.log("Part 2:", part2);
