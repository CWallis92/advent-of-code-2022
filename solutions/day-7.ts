import * as fs from "fs";

// const data = fs.readFileSync("./test-data/day-7.txt", "utf-8");
const data = fs.readFileSync("./data/day-7.txt", "utf-8");

// Trees!
class TreeNode {
  key: string;
  size: number;
  parent: TreeNode;
  children: TreeNode[];

  constructor(key: string, size = 0, parent: TreeNode = null) {
    this.key = key;
    this.size = size;
    this.parent = parent;
    this.children = [];
  }

  get isLeaf() {
    return this.children.length === 0;
  }

  get hasChildren() {
    return !this.isLeaf;
  }

  updateSize(size: number) {
    this.size = size;
  }
}

class Tree {
  root: TreeNode;

  constructor(key: string, size = 0) {
    this.root = new TreeNode(key, size);
  }

  *preOrderTraversal(node = this.root) {
    yield node;
    if (node.children.length) {
      for (const child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  *postOrderTraversal(node = this.root) {
    if (node.children.length) {
      for (const child of node.children) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

  insert(parentNodeKey: string, key: string, size = 0) {
    for (const node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        node.children.push(new TreeNode(key, size, node));
        return true;
      }
    }
    return false;
  }

  remove(key: string) {
    for (const node of this.preOrderTraversal()) {
      const filtered = node.children.filter((c: TreeNode) => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  }

  find(key: string) {
    for (const node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  }

  updateSizes() {
    for (const node of this.postOrderTraversal()) {
      let nodeTotal = 0;

      if (!node.isLeaf) {
        for (const child of node.children) {
          nodeTotal += child.size;
        }

        node.updateSize(nodeTotal);
      }
    }
  }

  getTotalOverLimit() {
    let total = 0;

    for (const node of this.preOrderTraversal()) {
      if (!node.isLeaf && node.size < 100000) total += node.size;
    }

    return total;
  }

  smallestDeletableSize(totalSpace = 70000000, unusedSpace = 30000000) {
    const spaceToDelete = unusedSpace - (totalSpace - this.root.size);

    return spaceToDelete;
  }

  getDeletables(totalSpace = 70000000, unusedSpace = 30000000) {
    const deletables = [];
    const smallestDeletableSize = this.smallestDeletableSize(
      totalSpace,
      unusedSpace
    );

    for (const node of this.preOrderTraversal()) {
      if (!node.isLeaf && node.size >= smallestDeletableSize) {
        deletables.push(node.size);
      }
    }

    return deletables;
  }
}

const commands = data.split("\n");

const computer = new Tree("/");

const runCommands = (input = commands, tree = computer): void => {
  let i = 0;
  let currentNode: TreeNode = tree.find("/");

  while (i < input.length) {
    if (input[i][0] === "$") {
      // Command
      const commands = input[i].slice(2).split(" ");

      if (commands[0] === "cd") {
        // Move current node
        switch (commands[1]) {
          case "/":
            currentNode = tree.find("/");
            break;
          case "..":
            currentNode = currentNode.parent;
            break;
          default:
            currentNode = tree.find(`${currentNode.key}-${commands[1]}`);
            break;
        }
      }
      // Do nothing for ls
    } else {
      // Directory or file
      // Add new children to current node
      const info = input[i].split(" ");

      const size = /\d+/.test(info[0]) ? parseInt(info[0]) : 0;

      tree.insert(currentNode.key, `${currentNode.key}-${info[1]}`, size);
    }

    i++;
  }

  tree.updateSizes();
};

runCommands();

console.log("Part 1:", computer.getTotalOverLimit());

console.log("Part 2:", Math.min(...computer.getDeletables()));
