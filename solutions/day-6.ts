import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-6.txt", "utf-8");
const data = fs.readFileSync("./data/day-6.txt", "utf-8");

let index = 0;
while (new Set(data.slice(index, index + 4)).size < 4) index++;
console.log("Part 1:", index + 4);

let index2 = 0;
while (new Set(data.slice(index2, index2 + 14)).size < 14) index2++;
console.log("Part 2:", index2 + 14);
