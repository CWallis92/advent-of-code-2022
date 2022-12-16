import * as fs from "fs";

const data = fs.readFileSync("./test-data/day-16.txt", "utf-8");
// const data = fs.readFileSync("./data/day-16.txt", "utf-8");

const valveData = data.split("\n");
const valvesWithFlow = valveData
  .filter((valve) => {
    const rate = valve.match(/\d+/)[0];

    return parseInt(rate) > 0;
  })
  .map((valve) => valve.split(" ")[1]);

const valveGraph: { [name: string]: { rate: number; neighbours: string[] } } =
  {};

valveData.forEach((valve) => {
  const valveName = valve.split(" ")[1];

  const leadsTo = valve
    .split(/to valve/)[1]
    .replace(/s/, "")
    .replace(/ /g, "")
    .split(",");

  const rate = parseInt(valve.match(/\d+/)[0]);

  const neighbours: string[] = [];

  leadsTo.forEach((endValve) => {
    neighbours.push(endValve);
  });

  valveGraph[valveName] = { neighbours, rate };
});

// Potential = pressure release * minutes active
const getPotential = (end: string, startTime = 0) =>
  (30 - startTime) * valveGraph[end].rate;

// TODO: Use a checker for console.log to simulate the example and work out what's going wrong
// If currTime === 1 && startValve === 'AA'
// If currTime === 2 && startValve === 'DD' && prevTwoNodes = ['AA']
// ...

const fullJourneyPressure = (
  startValve = "AA",
  remainingValvesWithFlow = valvesWithFlow,
  currPressure = 0,
  currTime = 1,
  prevTwoNodes: string[] = [],
  openValve = false
) => {
  // Stopping criteria: Time expired
  if (currTime >= 30) return currPressure;

  let newRemaining = [...remainingValvesWithFlow];

  if (openValve && newRemaining.indexOf(startValve) > -1) {
    // Reduce remaining valves to visit
    currPressure += getPotential(startValve, currTime);
    currTime++;

    newRemaining = remainingValvesWithFlow.filter(
      (valve) => valve !== startValve
    );
  }

  // Stopping criteria: All valves activated
  if (newRemaining.length === 0) return currPressure;

  const nextValves = valveGraph[startValve].neighbours;

  const validPressures: number[] = [];

  // Efficiency: prevent back and forth
  const newPrevs = [...prevTwoNodes];
  if (newPrevs.length === 2) newPrevs.pop();
  newPrevs.unshift(startValve);

  nextValves.forEach((valve) => {
    // Efficiency: prevent back and forth
    if (
      newPrevs.length === 2 &&
      valve === newPrevs[1] &&
      startValve === newPrevs[0]
    )
      return currPressure;

    if (newRemaining.indexOf(valve) > -1) {
      // Try not opening
      validPressures.push(
        fullJourneyPressure(
          valve,
          newRemaining,
          currPressure,
          currTime + 1,
          newPrevs,
          false
        )
      );

      // Try opening
      validPressures.push(
        fullJourneyPressure(
          valve,
          newRemaining,
          currPressure,
          currTime + 1,
          newPrevs,
          true
        )
      );
    }
  });

  return Math.max(...validPressures, currPressure);
};

console.log("Total pressure:", fullJourneyPressure());
