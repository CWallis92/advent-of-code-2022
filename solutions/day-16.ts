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
  (30 - startTime + 1) * valveGraph[end].rate;

// TODO: Use a checker for console.log to simulate the example and work out what's going wrong
// If currTime === 1 && startValve === 'AA'
// If currTime === 2 && startValve === 'DD' && prevTwoNodes = ['AA']
// ...

const logToConsole = (time, valve, prevTwoNodes, openValve, currPressure) => {
  return (
    (time === 1 && valve === "AA" && prevTwoNodes.length === 0 && !openValve) ||
    (time === 2 && valve === "DD" && prevTwoNodes.length === 1 && openValve) ||
    (time === 4 &&
      valve === "CC" &&
      prevTwoNodes[0] === "DD" &&
      prevTwoNodes[1] === "AA" &&
      !openValve) ||
    (time === 5 &&
      valve === "BB" &&
      prevTwoNodes[0] === "CC" &&
      prevTwoNodes[1] === "DD" &&
      openValve &&
      currPressure === 560) ||
    (time === 7 &&
      valve === "AA" &&
      prevTwoNodes[0] === "DD" &&
      prevTwoNodes[1] === "CC" &&
      !openValve)
    // THis bit isn't working
    // &&
    // currPressure === 885
  );
};

const fullJourneyPressure = (
  startValve = "AA",
  remainingValvesWithFlow = valvesWithFlow,
  currPressure = 0,
  currTime = 1,
  prevTwoNodes: string[] = [],
  openValve = false
) => {
  if (
    logToConsole(currTime, startValve, prevTwoNodes, openValve, currPressure)
  ) {
    console.log("Time:", currTime);
    console.log("Valve:", startValve);
    console.log("Pressure:", currPressure);
    console.log("Remaining:", remainingValvesWithFlow);
    console.log("Open valve:", openValve);
    console.log("Potential:", getPotential(startValve, currTime + 1), "\n");
  }

  // Stopping criteria: Time expired
  if (currTime >= 30) return currPressure;

  let newRemaining = [...remainingValvesWithFlow];

  if (openValve && newRemaining.indexOf(startValve) > -1) {
    // Reduce remaining valves to visit
    currTime++;
    currPressure += getPotential(startValve, currTime);

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
  });

  return Math.max(...validPressures, currPressure);
};

console.log("Total pressure:", fullJourneyPressure());
