import * as fs from "fs";

const data = fs.readFileSync("./test-data/day-15.txt", "utf-8");
// const data = fs.readFileSync("./data/day-15.txt", "utf-8");

const sensorData: { loc: number[]; beacon: number[] }[] = [];

data.split("\n").forEach((sensor) => {
  const coords = sensor.match(/(-)?\d+/g);

  sensorData.push({
    loc: [parseInt(coords[0]), parseInt(coords[1])],
    beacon: [parseInt(coords[2]), parseInt(coords[3])],
  });
});

const [minX, maxX] = sensorData.reduce(
  (acc, curr) => {
    const beacon = curr.beacon[0];
    const dist =
      Math.abs(curr.loc[0] - curr.beacon[0]) +
      Math.abs(curr.loc[1] - curr.beacon[1]);
    const sensorLeft = curr.loc[0] - dist;
    const sensorRight = curr.loc[0] + dist;
    const maxLeft = Math.min(beacon, sensorLeft);
    const maxRight = Math.max(beacon, sensorRight);

    if (maxLeft < acc[0]) acc.splice(0, 1, maxLeft);
    if (maxRight > acc[1]) acc.splice(1, 1, maxRight);

    return acc;
  },
  [0, 0]
);

const rowLength = maxX - minX + 1;
const xOffset = -minX;

const getEmpties = (rowIndex: number) => {
  let firstEmpty = rowLength,
    lastEmpty = 0;

  sensorData.forEach(({ loc, beacon }) => {
    const dist = Math.abs(loc[0] - beacon[0]) + Math.abs(loc[1] - beacon[1]);

    if (Math.abs(loc[1] - rowIndex) <= dist) {
      const rowDist = dist - Math.abs(rowIndex - loc[1]);

      const leftIndex = Math.max(loc[0] - rowDist + xOffset, 0);
      const rightIndex = Math.min(loc[0] + rowDist + xOffset, rowLength - 1);

      if (leftIndex < firstEmpty) firstEmpty = leftIndex;
      if (rightIndex > lastEmpty) lastEmpty = rightIndex;
    }
  });

  // This part doesn't account for possible distress beacon locaions!
  // TODO: Amend based on array of emptyVals
  let totalEmpty = lastEmpty - firstEmpty + 1;

  const checkedBeacons = [];

  sensorData.forEach(({ loc, beacon }) => {
    if (loc[1] === rowIndex && (loc[0] >= firstEmpty || loc[0] <= lastEmpty)) {
      totalEmpty--;
    }

    if (
      beacon[1] === rowIndex &&
      (beacon[0] >= firstEmpty || beacon[0] <= lastEmpty) &&
      !checkedBeacons.find(
        (checkedBeacon) =>
          checkedBeacon[0] === beacon[0] && checkedBeacon[1] === beacon[1]
      )
    ) {
      checkedBeacons.push(beacon);
      totalEmpty--;
    }
  });

  return { firstEmpty, lastEmpty, total: totalEmpty };
};

console.log("Part 1:", getEmpties(10).total);

// const checkAllRows = (rowIndex) => {
//   let y = 0;
//   let x = 0;

//   while (y <= rowIndex) {
//     const { invalidValsInRange } = getEmpties(y, rowIndex);

//     if (invalidValsInRange.length === rowIndex - 1) {
//       x = invalidValsInRange[0];
//       break;
//     }

//     y++;
//   }

//   return [x, y];
// };

// const [x, y] = checkAllRows(20);

// console.log("Part 2:", 4000000 * x + y);
