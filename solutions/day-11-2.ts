import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-11.txt", "utf-8");
const data = fs.readFileSync("./data/day-11.txt", "utf-8");

class HeldItem {
  worryLevel: number;
  heldBy: number;

  constructor(worryLevel = 0, heldBy = 0) {
    this.worryLevel = worryLevel;
    this.heldBy = heldBy;
  }

  get getWorryLevel() {
    return this.worryLevel;
  }

  set updateWorry(newLevel: number) {
    this.worryLevel = newLevel;
  }

  set caughtBy(monkey: number) {
    this.heldBy = monkey;
  }
}

class Monkey {
  monkeyIndex: number;
  items: HeldItem[];
  inspectedCount: number;
  operation: (old: number) => number;
  throwTo: (worryLevel: number) => number;

  constructor(
    monkeyIndex = 0,
    items: HeldItem[] = [],
    operation = (x: number) => x,
    throwTo = (y: number) => 0
  ) {
    this.monkeyIndex = monkeyIndex;
    this.items = items;
    this.inspectedCount = 0;
    this.operation = operation;
    this.throwTo = throwTo;
  }

  get countInspected() {
    return this.inspectedCount;
  }

  inspectItem(itemIndex: number) {
    this.inspectedCount++;
    const item = this.items[itemIndex];

    const initialWorry = item.worryLevel;

    item.updateWorry = this.operation(initialWorry);
    return item;
  }

  throwItem(itemIndex: number) {
    const thrownItem = this.items[itemIndex];

    this.items.splice(itemIndex, 1);

    return this.throwTo(thrownItem.worryLevel);
  }

  catchItem(item: HeldItem) {
    item.caughtBy = this.monkeyIndex;
    return this.items.push(item);
  }
}

const getOperation = (instruction: string) => {
  const operation = instruction.split("=")[1].trim();
  const hasIncrementor = /\d+/.test(operation);

  let fn: (input: number) => number;

  switch (true) {
    case /\+/.test(operation):
      fn = (input) =>
        input + (hasIncrementor ? +operation.match(/\d+/) : input);
      break;
    default:
      fn = (input) =>
        input * (hasIncrementor ? +operation.match(/\d+/) : input);
      break;
  }

  return fn;
};

const getThrowTo = (instructions: string[]) => {
  const test = instructions[0].split(":")[1].trim();
  const ifTrue = instructions[1].split(":")[1].trim();
  const ifFalse = instructions[2].split(":")[1].trim();

  const fn = (input: number) => {
    const divisibleBy = +test.match(/\d+/);
    const trueThrow = +ifTrue.match(/\d+/);
    const falseThrow = +ifFalse.match(/\d+/);

    if (input % divisibleBy === 0) return trueThrow;
    return falseThrow;
  };

  return fn;
};

// Build objects
const monkeysData = data.split("\n\n");

const monkeys: Monkey[] = [];

// Keep worry level low by taking the LCM of all tests and modulo-ing worry level down to that
let LCM = 1;

monkeysData.forEach((monkey) => {
  const details = monkey.split("\n").map((line) => line.trim());

  const monkeyIndex = +details[0].match(/\d+/)[0];

  const startingItemsWorries = details[1].match(/\d+/g);
  const startingItems = startingItemsWorries.map(
    (item) => new HeldItem(+item, monkeyIndex)
  );

  LCM *= +details[3].match(/\d+/)[0];

  const operation = getOperation(details[2]);
  const throwTo = getThrowTo(details.slice(3));

  monkeys.push(new Monkey(monkeyIndex, startingItems, operation, throwTo));
});

const playRounds = (numRounds: number) => {
  for (let round = 0; round < numRounds; round++) {
    monkeys.forEach((monkey) => {
      while (monkey.items.length > 0) {
        const currItem = monkey.items[0];

        monkey.inspectItem(0);

        const thrownTo = monkey.throwItem(0);

        currItem.updateWorry = currItem.getWorryLevel % LCM;

        monkeys[thrownTo].catchItem(currItem);
      }
    });
  }
};

playRounds(10000);

const inspectedCounts = monkeys.map((monkey) => monkey.countInspected);

console.log(inspectedCounts);

const monkeyBusiness = inspectedCounts
  .sort((a, b) => b - a)
  .slice(0, 2)
  .reduce((acc, curr) => acc * curr);
console.log("Part 2:", monkeyBusiness);
