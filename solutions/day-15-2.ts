import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-15.txt", "utf-8");
const data = fs.readFileSync("./data/day-15.txt", "utf-8");

const sensorData: { loc: number[]; beacon: number[]; dist: number }[] = [];

data.split("\n").forEach((sensor) => {
  const coords = sensor.match(/(-)?\d+/g);

  const [sx, sy, bx, by] = coords.map((val) => parseInt(val));

  sensorData.push({
    loc: [sx, sy],
    beacon: [bx, by],
    dist: Math.abs(sx - bx) + Math.abs(sy - by),
  });
});

interface Empties {
  start: number;
  end: number;
}

const getExclusions = (
  empties: Empties[],
  gridMin?: number,
  gridMax?: number
): number[] => {
  const exclusions: number[] = [];

  const emptiesMin = empties.reduce((acc, curr) => {
    if (curr.start < acc) acc = curr.start;
    return acc;
  }, Infinity);
  const emptiesMax = empties.reduce((acc, curr) => {
    if (curr.end > acc) acc = curr.end;
    return acc;
  }, -Infinity);

  // Add from start
  if (gridMin && emptiesMin > gridMin)
    exclusions.push(
      ...Array.from(
        new Array(Math.abs(emptiesMin - gridMin)),
        (_, index) => gridMin + index
      )
    );

  // Add gaps
  const gaps: number[][] = [];
  empties.forEach(({ start, end }) => {
    if (gaps.length === 0) {
      gaps.push([start, end]);
      return;
    }

    if (gaps.find((gap) => start >= gap[0] && end <= gap[1])) {
      // Fully contained: do nothing
      return;
    }

    // Deal with fully containing: There could be multiple
    let gapIndex = 0,
      hasFullyContained = false;

    while (gapIndex < gaps.length) {
      if (start <= gaps[gapIndex][0] && end >= gaps[gapIndex][1]) {
        // New fully contains old: replace
        gaps.splice(gapIndex, 1);
        hasFullyContained = true;
      } else gapIndex++;
    }

    if (hasFullyContained) {
      gaps.push([start, end]);
      return;
    }

    const gapLeft = gaps.findIndex(
      (gap) => start <= gap[0] && end <= gap[1] && end >= gap[0]
    );
    if (gapLeft > -1) {
      gaps.splice(gapLeft, 1, [start, gaps[gapLeft][1]]);
      return;
    }

    const gapRight = gaps.findIndex(
      (gap) => start >= gap[0] && end >= gap[1] && start <= gap[1]
    );
    if (gapRight > -1) {
      gaps.splice(gapRight, 1, [gaps[gapRight][0], end]);
      return;
    }

    // No overlap: Push new block
    gaps.push([start, end]);
  });

  const sortedGaps = gaps.sort((a, b) => a[0] - b[0]);

  // Add gaps
  if (sortedGaps.length > 1) {
    for (let i = 0; i < sortedGaps.length - 1; i++) {
      const gapSize = sortedGaps[i + 1][0] - sortedGaps[i][1];

      if (gapSize > 1) {
        exclusions.push(
          ...Array.from(
            new Array(gapSize - 1),
            (_, index) => index + sortedGaps[i][1] + 1
          )
        );
      }
    }
  }

  // Add to end
  if (gridMax && emptiesMax < gridMax)
    exclusions.push(
      ...Array.from(
        new Array(Math.abs(gridMax - emptiesMax)),
        (_, index) => emptiesMax + index + 1
      )
    );

  return [...new Set(exclusions)];
};

const checkRow = (
  rowIndex: number,
  gridMin = -Infinity,
  gridMax = Infinity
) => {
  const empties: Empties[] = [];

  sensorData.forEach(({ loc, dist }) => {
    const distToRow = Math.abs(loc[1] - rowIndex);

    if (distToRow <= dist) {
      // Sensor will add empty values
      if (
        loc[0] - dist + distToRow > gridMax ||
        loc[0] + dist - distToRow < gridMin
      )
        return;

      const rowStart = Math.max(loc[0] - dist + distToRow, gridMin);
      const rowEnd = Math.min(loc[0] + dist - distToRow, gridMax);

      empties.push({ start: rowStart, end: rowEnd });
    }
  });

  const gaps = getExclusions(
    empties,
    gridMin > -Infinity ? gridMin : undefined,
    gridMax < Infinity ? gridMax : undefined
  );

  return gaps;
};

const checkAllRows = (gridMin: number, gridMax: number) => {
  let y = gridMin;

  while (y <= gridMax) {
    const gaps = checkRow(y, gridMin, gridMax);

    if (gaps.length === 1) return [gaps[0], y];

    y++;
  }

  return [null, null];
};

const [x, y] = checkAllRows(0, 4000000);

console.log("Part 2:", x === null ? "Failed" : 4000000 * x + y);
