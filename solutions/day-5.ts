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

  printStack() {
    let out = "";
    this.items.forEach((item) => {
      out += item;
    });

    return out;
  }
}

const initialConfig = data.split("\n\n")[0];
const instructions = data.split("\n\n")[1].split("\n");

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
const stacks = transposed.map((stack) => {
  return new Stack(
    stack.indexOf("0") > -1 ? stack.slice(0, stack.indexOf("0")) : stack
  );
});

instructions.forEach((instruction) => {
  const vals = instruction.match(/\d+/g).map((val) => +val);

  // for (let i = 0; i < vals[0]; i++) {
  //   const popped = stacks[vals[1] - 1].pop();

  //   if (popped) {
  //     stacks[vals[2] - 1].push(popped);
  //   }
  // }

  // Part 2
  const multiPopped = stacks[vals[1] - 1].popMulti(vals[0]);

  if (multiPopped) {
    stacks[vals[2] - 1].push(...multiPopped);
  }
});

let tops = "";

stacks.forEach((stack) => {
  tops += stack.peek();
});

console.log("Solution:", tops);
