import * as fs from "fs";

const data = fs.readFileSync("./test-data/day-17.txt", "utf-8");
// const data = fs.readFileSync("./data/day-17.txt", "utf-8");

// We only need to track the current bottom point of each 7 columns. No need to build the full thing!

/* 
The tall, vertical chamber is exactly seven units wide. Each rock appears so that its left edge is two units away from the left wall and its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one).
*/

abstract class Rock {
  leftCol: number;
  bottomRow: number;

  constructor(leftCol: number, bottomRow: number) {
    this.leftCol = leftCol;
    this.bottomRow = bottomRow;
  }

  shiftDown() {
    this.bottomRow--;
  }

  shiftLeft() {
    this.leftCol--;
  }

  shiftRight() {
    this.leftCol++;
  }

  get finalPos() {
    return {
      [this.leftCol]: { bottom: this.bottomRow, top: this.bottomRow },
      [this.leftCol + 1]: { bottom: this.bottomRow, top: this.bottomRow },
      [this.leftCol + 2]: { bottom: this.bottomRow, top: this.bottomRow },
      [this.leftCol + 3]: { bottom: this.bottomRow, top: this.bottomRow },
    };
  }

  canShiftLeft(chamberCols: number[][]) {
    if (this.leftCol === 0) return false;

    const nextCol = this.leftCol - 1;

    return !chamberCols[nextCol][this.bottomRow];
  }

  canShiftRight(chamberCols: number[][]) {
    if (this.leftCol === 3) return false;

    const nextCol = this.leftCol + 1;

    return !chamberCols[nextCol][this.bottomRow];
  }

  canShiftDown(chamberCols: number[][]) {
    const blockingCols = chamberCols.slice(this.leftCol, 5);
    return blockingCols.every((col) => col.length < this.bottomRow);
  }
}

class WideBoi extends Rock {
  shape: number[];

  constructor(leftCol: number, bottomRow: number) {
    super(leftCol, bottomRow);
    this.shape = [0, 0, 0, 0];
  }
}

class Cross extends Rock {
  shape: number[][];

  constructor(leftCol: number, bottomRow: number) {
    super(leftCol, bottomRow);
    this.shape = [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  }
}

class L extends Rock {
  shape: number[][];

  constructor(leftCol: number, bottomRow: number) {
    super(leftCol, bottomRow);
    this.shape = [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ];
  }
}

class LongBoi extends Rock {
  shape: number[];

  constructor(leftCol: number, bottomRow: number) {
    super(leftCol, bottomRow);
    this.shape = this.shape = [0, 0, 0, 0];
  }

  get finalPos() {
    return {
      [this.leftCol]: { bottom: this.bottomRow, top: this.bottomRow + 3 },
    };
  }

  canShiftLeft(chamberCols: number[][]) {
    if (this.leftCol === 0) return false;

    const nextCol = this.leftCol - 1;

    return chamberCols[nextCol]
      .slice(this.bottomRow, this.bottomRow + 4)
      .every((row) => !row);
  }

  canShiftRight(chamberCols: number[][]) {
    if (this.leftCol === 6) return false;

    const nextCol = this.leftCol + 1;

    return chamberCols[nextCol]
      .slice(this.bottomRow, this.bottomRow + 4)
      .every((row) => !row);
  }

  canShiftDown(chamberCols: number[][]) {
    const blockingCols = chamberCols[this.leftCol];
    return blockingCols.length < this.bottomRow;
  }
}

class Square extends Rock {
  shape: number[][];

  constructor(leftCol: number, bottomRow: number) {
    super(leftCol, bottomRow);
    this.shape = [
      [1, 1],
      [1, 1],
    ];
  }

  get finalPos() {
    return {
      [this.leftCol]: { bottom: this.bottomRow, top: this.bottomRow + 1 },
      [this.leftCol + 1]: { bottom: this.bottomRow, top: this.bottomRow + 1 },
    };
  }

  canShiftLeft(chamberCols: number[][]) {
    if (this.leftCol === 0) return false;

    const nextCol = this.leftCol - 1;

    return chamberCols[nextCol]
      .slice(this.bottomRow, this.bottomRow + 2)
      .every((row) => !row);
  }

  canShiftRight(chamberCols: number[][]) {
    if (this.leftCol === 5) return false;

    const nextCol = this.leftCol + 2;

    return chamberCols[nextCol]
      .slice(this.bottomRow, this.bottomRow + 2)
      .every((row) => !row);
  }

  canShiftDown(chamberCols: number[][]) {
    const blockingCol = chamberCols.slice(this.leftCol, this.leftCol + 2);
    return blockingCol.every((col) => col.length < this.bottomRow);
  }
}

const makeRock = (rockIndex: number, bottomIndex: number): Rock => {
  const modRock = rockIndex % 5;

  switch (modRock) {
    // case 0:
    //   return new WideBoi(2, bottomIndex);
    // case 1:
    //   return new Cross(2, bottomIndex);
    // case 2:
    //   return new L(2, bottomIndex);
    // case 3:
    //   return new LongBoi(2, bottomIndex);
    default:
      return new Square(2, bottomIndex);
  }
};

const addToStack = (
  config: { [col: string]: { bottom: number; top: number } },
  chamberStacks: number[][]
) => {
  console.log("COnfig:", config, chamberStacks);

  for (const col in config) {
    const currHeight = chamberStacks[+col].length;

    // TODO: Fix this bit
    // // Zeros at the top need to be left alone
    // const emptySpacesAtTop = currHeight.indexOf(1)
    // const spacesToFill = config[+col].bottom - currHeight;

    // const empties = Array.from(
    //   new Array(spacesToFill),
    //   (_) => 0
    // );
    // const rocks = Array.from(
    //   new Array(config[+col].top - config[col].bottom + 1),
    //   (_) => 1
    // );

    // chamberStacks[+col].unshift(...rocks, ...empties);
  }
};

const chamberStacks: number[][] = [[], [], [], [], [], [], []];

const jetMoves = data.length - 1;

let jetIndex = 0,
  rockIndex = 0;

while (rockIndex < 2022) {
  const bottomIndex = Math.max(...chamberStacks.map((stack) => stack.length));
  const currRock = makeRock(rockIndex, bottomIndex + 3);

  // Apply to correct columns
  while (true) {
    const jetMove = jetIndex % jetMoves;

    // Do the jet move
    switch (data[jetMove]) {
      case "<":
        if (currRock.canShiftLeft(chamberStacks)) {
          currRock.shiftLeft();
        }
        break;
      default:
        if (currRock.canShiftRight(chamberStacks)) currRock.shiftRight();
        break;
    }

    jetIndex++;

    // Do the down move
    if (currRock.canShiftDown(chamberStacks)) currRock.shiftDown();
    else {
      addToStack(currRock.finalPos, chamberStacks);
      break;
    }
  }

  rockIndex++;
}

console.log(chamberStacks);

console.log("Part 1:", Math.max(...chamberStacks.map((stack) => stack.length)));
