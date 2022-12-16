import * as fs from "fs";
import { Graph, strComparator } from "../utils/graph";

const data = fs.readFileSync("./test-data/day-16.txt", "utf-8");
// const data = fs.readFileSync("./data/day-16.txt", "utf-8");

const valveData = data.split("\n");

const valves = valveData.map((valve) => valve.split(" ")[1]);
const valvesWithFlow = valveData
  .filter((valve) => {
    const rate = valve.match(/\d+/)[0];

    return parseInt(rate) > 0;
  })
  .map((valve) => valve.split(" ")[1]);
const totalValvesWithFlow = valvesWithFlow.length;

console.log("Valves with flow:", valvesWithFlow);

const valveGraph = new Graph(strComparator);

valveData.forEach((valve) => {
  const valveName = valve.split(" ")[1];
  const leadsTo = valve
    .split(/to valve/)[1]
    .replace(/s/, "")
    .replace(/ /g, "")
    .split(",");

  leadsTo.forEach((endValve) => {
    valveGraph.addEdge(valveName, endValve);
  });
});

console.log(valveGraph);

console.log(
  "Valve graph:",
  valveGraph.breadthFirstSearch(valveGraph.nodes.get("AA"))
);

const minutesToTurnOn = valvesWithFlow.length;

// Part 1:
// Use BFS to determine the distance between meaningful valves (AA, and all valves with non-zero flow rate)
// DFS on this new graph, to find the path with max value, where the path's lenght is <= 30
// https://adrianmejia.com/data-structures-for-beginners-graphs-time-complexity-tutorial/#:~:text=A%20graph%20is%20a%20data,edges%20connected%20to%20a%20vertex.

// const minPath = route.path("S", "E", { cost: true }) as PathOut;
