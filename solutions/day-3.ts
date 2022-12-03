import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-3.txt", "utf-8");
const data = fs.readFileSync("./data/day-3.txt", "utf-8");

const rucksacks = data.split("\n");

const rucksackCompartments = rucksacks.map((item) => {
  const compartment1 = item.slice(0, item.length / 2);
  const compartment2 = item.slice(item.length / 2);

  return { compartment1, compartment2 };
});

const getShared = ({
  compartment1,
  compartment2,
}: {
  compartment1: string;
  compartment2: string;
}) => {
  const joinUniques = [...new Set(compartment1), ...new Set(compartment2)];

  // There is always exactly 1 shared item - get the first element
  return joinUniques.filter(
    (item, index, arr) => arr.indexOf(item) !== index
  )[0];
};

const getValue = (item: string) => {
  const charCode = item.charCodeAt(0);

  return charCode > 90 ? charCode - 96 : charCode - 38;
};

const part1 = rucksackCompartments.reduce((acc, curr) => {
  const sharedItem = getShared(curr);

  const sharedValue = getValue(sharedItem);

  return acc + sharedValue;
}, 0);

console.log("Part 1:", part1);

const groups: string[][] = [];

for (let i = 0; i < rucksacks.length; i += 3) {
  groups.push(rucksacks.slice(i, i + 3));
}

const part2 = groups.reduce((acc, curr) => {
  const set = [...new Set(curr[0]), ...new Set(curr[1]), ...new Set(curr[2])];

  const sharedItem = set.find(
    (item) => set.filter((i) => i === item).length === 3
  );

  const sharedValue = getValue(sharedItem);

  return acc + sharedValue;
}, 0);

console.log("Part 2:", part2);
