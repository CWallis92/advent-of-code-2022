import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-1.txt", "utf-8");
const data = fs.readFileSync("./data/day-1.txt", "utf-8");

const elfData: number[][] = [];

const parsedData = data.split("\n\n");

parsedData.forEach((item) => {
  elfData.push(item.split("\n").map((item) => parseInt(item)));
});

const totals = elfData.map((item) => item.reduce((acc, curr) => acc + curr));

console.log(totals);

const topThree = totals.sort((a, b) => b - a);

console.log(
  "Part 2:",
  topThree.slice(0, 3).reduce((acc, curr) => acc + curr)
);
