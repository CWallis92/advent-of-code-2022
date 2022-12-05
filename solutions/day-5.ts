import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-5.txt", "utf-8");
const data = fs.readFileSync("./data/day-5.txt", "utf-8");

class Stack {
  items: string[];

  // Array is used to implement stack
  constructor(items: string[]) {
    this.items = items;
  }

  push(...element: string[]) {
    // push element into the items
    this.items.push(...element);
  }

  pop() {
    // return top most element in the stack
    // and removes it from the stack
    // Underflow if stack is empty
    if (this.items.length == 0) return;
    return this.items.pop();
  }

  popMulti(num: number): string[] | undefined {
    if (this.items.length == 0) return;
    return this.items.splice(-1 * num);
  }

  peek() {
    // return the top most element from the stack
    // but doesn't delete it.
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    // return true if stack is empty
    return this.items.length == 0;
  }
}

const initialConfig = data.split("\n\n")[0];
const instructions = data.split("\n\n")[1].split("\n");

// Reverse to build stack properly
const fullRows = initialConfig.split("\n").reverse();

const rows = fullRows.slice(1).map((row) => {
  return row
    .replace(/^( ){4}/g, "[0] ")
    .replace(/( ){4}/g, " [0]")
    .replace(/[[\]]/g, "")
    .split(/\s/);
});

// Switch columns and rows
const transposed = rows[0].map((_, colIndex) =>
  rows.map((row) => row[colIndex])
);

// Remove trailing zeroes
const stacks1 = transposed.map((stack) => {
  const newStack = [...stack];

  return new Stack(
    newStack.indexOf("0") > -1
      ? newStack.slice(0, newStack.indexOf("0"))
      : newStack
  );
});

const stacks2 = transposed.map((stack) => {
  const newStack = [...stack];

  return new Stack(
    newStack.indexOf("0") > -1
      ? newStack.slice(0, newStack.indexOf("0"))
      : newStack
  );
});

instructions.forEach((instruction) => {
  const vals = instruction.match(/\d+/g).map((val) => +val);

  for (let i = 0; i < vals[0]; i++) {
    const popped = stacks1[vals[1] - 1].pop();

    if (popped) {
      stacks1[vals[2] - 1].push(popped);
    }
  }

  // Part 2
  const multiPopped = stacks2[vals[1] - 1].popMulti(vals[0]);

  if (multiPopped) {
    stacks2[vals[2] - 1].push(...multiPopped);
  }
});

let tops1 = "";

stacks1.forEach((stack) => {
  tops1 += stack.peek();
});

console.log("Part 1:", tops1);

let tops2 = "";

stacks2.forEach((stack) => {
  tops2 += stack.peek();
});

console.log("Part 2:", tops2);
