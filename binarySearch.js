// Define the Node class
class Node {
  constructor(value) {
    this.value = value || null; // Initialize the value of the node
    this.left = null; // Initialize the left child of the node
    this.right = null; // Initialize the right child of the node
  }
}

// Define the Tree class
class Tree {
  constructor(array) {
    this.root = this.buildTree(array); // Initialize the root of the tree by building the tree from the given array
  }

  levelPrinter(levels) {
    for (let i = 0; i < levels.length; i++) {
      console.log(`Level ${[i]}: ` + levels[i] + "\n");
    }
  }

  findMin(node) {
    if (!node) {
      return null;
    } else if (!node.left) {
      return node;
    } else {
      return this.findMin(node.left);
    }
  }

  // sort the given array and build the binary search tree from the sorted array
  buildTree(array) {
    // If the array is empty, return null
    if (array.length === 0) {
      return null;
    }
    // Sort the array
    array.sort((a, b) => a - b);
    // Find the middle index of the array
    let mid = Math.floor(array.length / 2);
    // Create a new node with the value of the middle element
    let node = new Node(array[mid]);
    // Build the left subtree from the left half of the array
    node.left = this.buildTree(array.slice(0, mid));
    // Build the right subtree from the right half of the array
    node.right = this.buildTree(array.slice(mid + 1));
    // Return the node
    return node;
  }

  //accepts a node and returns its height, height is defined as the number of edges in the longest path from the node to a leaf node
  height(node) {
    if (node === null) return -1;
    let leftHeight = this.height(node.left);
    let rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  //accepts a node and returns its depth, depth is defined as the number of edges in the path from the node to the root
  depth(node, root = this.root, depth = 0) {
    if (root === null || node === null) return;
    // if (node === root) return depth;
    if (node === root) return depth;
    if (node.value < root.value) {
      return this.depth(node, root.left, (depth += 1));
    } else {
      return this.depth(node, root.right, (depth += 1));
    }
  }

  //accepts a value and returns the node with the given value
  find(value) {
    //start at the root
    let currentNode = this.root;
    //while there is a current node
    while (currentNode) {
      //if the value is less than the current node's value, go left
      if (value < currentNode.value) {
        currentNode = currentNode.left;
        //if the value is greater than the current node's value, go right
      } else if (value > currentNode.value) {
        currentNode = currentNode.right;
        //otherwise, we found the node, return it
      } else {
        return currentNode;
      }
    }
    //if we get to the end and haven't found the node, return null
    return null;
  }

  //accepts a value and inserts a new node with that value at the correct location by traversing the tree and comparing each node's value to the given value
  insert(value) {
    //create a new node
    let newNode = new Node(value);
    //start at the root
    let currentNode = this.root;
    //while there is a current node
    while (currentNode) {
      //if the value is less than the current node's value, go left
      if (value < currentNode.value) {
        //if the current node doesn't have a left child, insert the new node there
        if (!currentNode.left) {
          currentNode.left = newNode;
          return this;
        }
        //otherwise, move to the left child and repeat
        currentNode = currentNode.left;
        //if the value is greater than the current node's value, go right
      } else if (value > currentNode.value) {
        //if the current node doesn't have a right child, insert the new node there
        if (!currentNode.right) {
          currentNode.right = newNode;
          return this;
        }
        //otherwise, move to the right child and repeat
        currentNode = currentNode.right;
        //if the value is equal to the current node's value, return undefined
      } else {
        return undefined;
      }
    }
  }

  //accepts a value and removes the node containing that value from the tree by traversing the tree and comparing each node's value to the given value
  //if the node exists, consider the three cases: the node to be removed has no children, the node to be removed has one child, the node to be removed has two children
  delete(value, node = this.root) {
    //if the node doesn't exist, return null
    if (!node) {
      console.log("Node does not exist!");
      return null;
    }
    //if the value is less than the current node's value, go left
    if (value < node.value) {
      node.left = this.delete(value, node.left);
      //if the value is greater than the current node's value, go right
    } else if (value > node.value) {
      node.right = this.delete(value, node.right);
      //otherwise, we found the node to be deleted
    } else {
      //if the node has no children, just remove it
      if (!node.left && !node.right) {
        return null;
        //if the node has one child, replace it with its child
      } else if (!node.left) {
        node = node.right;
      } else if (!node.right) {
        node = node.left;
        //if the node has two children, replace it with its successor
      } else {
        let successor = this.findMin(node.right);
        node.value = successor.value;
        node.right = this.delete(successor.value, node.right);
      }
    }
    return node;
  }

  //accepts an optional callback function and performs a level-order traversal of the tree, calling the callback function on each node
  //returns an array of arrays, each inner array represents a level of the tree
  levelOrder(callback = []) {
    //create a queue and add the root node to it
    let queue = [];
    queue.push(this.root);
    //create an array to store the levels
    let levels = [];
    //while the queue is not empty
    while (queue.length > 0) {
      //get the number of nodes in the current level
      let levelSize = queue.length;
      //create an array to store the nodes in the current level
      let currentLevel = [];
      //process all nodes in the current level
      for (let i = 0; i < levelSize; i++) {
        //remove the first node from the queue
        let currentNode = queue.shift();
        //add the node's value to the current level array
        currentLevel.push(currentNode.value);
        //if the node has a left child, add it to the queue
        if (currentNode.left) {
          queue.push(currentNode.left);
        }
        //if the node has a right child, add it to the queue
        if (currentNode.right) {
          queue.push(currentNode.right);
        }
      }
      //add the current level array to the levels array
      levels.push(currentLevel);
    }
    //if a callback function is provided, call it on each node value
    if (typeof callback === "function") {
      levels.forEach((level) => {
        level.forEach((value) => {
          callback(value);
        });
      });
    }
    //return the levels array
    return levels;
  }

  //accepts an optional callback function and performs a preorder traversal of the tree, calling the callback function on each node
  //returns a string of the tree in this format: "value -> value -> ... -> value"
  preorder(callback = []) {
    //create an array to store the nodes
    let nodes = [];
    //define a helper function that traverses the tree and adds the nodes to the array
    let traverse = (node) => {
      //add the node to the array
      nodes.push(node.value);
      //if the node has a left child, traverse the left subtree
      if (node.left) {
        traverse(node.left);
      }
      //if the node has a right child, traverse the right subtree
      if (node.right) {
        traverse(node.right);
      }
    };
    //call the helper function on the root node
    traverse(this.root);
    //if a callback function is provided, call it on each node value
    if (typeof callback === "function") {
      nodes.forEach((value) => {
        callback(value);
      });
    }
    //return the nodes array
    return nodes.join(" -> ");
  }

  //accepts an optional callback function and performs a postorder traversal of the tree, calling the callback function on each node
  //returns a string of the tree in this format: "value -> value -> ... -> value"
  postorder(callback = []) {
    //create an array to store the nodes
    let nodes = [];
    //define a helper function that traverses the tree and adds the nodes to the array
    let traverse = (node) => {
      //if the node has a left child, traverse the left subtree
      if (node.left) {
        traverse(node.left);
      }
      //if the node has a right child, traverse the right subtree
      if (node.right) {
        traverse(node.right);
      }
      //add the node to the array
      nodes.push(node.value);
    };
    //call the helper function on the root node
    traverse(this.root);
    //if a callback function is provided, call it on each node value
    if (typeof callback === "function") {
      nodes.forEach((value) => {
        callback(value);
      });
    }
    //return the nodes array
    return nodes.join(" -> ");
  }

  //accepts an optional callback function and performs an inorder traversal of the tree, calling the callback function on each node
  //returns a string of the tree in this format: "value -> value -> ... -> value"
  inorder(callback = []) {
    //create an array to store the nodes
    let nodes = [];
    //define a helper function that traverses the tree and adds the nodes to the array
    let traverse = (node) => {
      //if the node has a left child, traverse the left subtree
      if (node.left) {
        traverse(node.left);
      }
      //add the node to the array
      nodes.push(node.value);
      //if the node has a right child, traverse the right subtree
      if (node.right) {
        traverse(node.right);
      }
    };
    //call the helper function on the root node
    traverse(this.root);
    //if a callback function is provided, call it on each node value
    if (typeof callback === "function") {
      nodes.forEach((value) => {
        callback(value);
      });
    }
    //return the nodes array
    return nodes.join(" -> ");
  }

  //adds 50 random nodes with values greater than 100 to the tree
  unbalance() {
    console.log(
      "Unbalancing the tree...with 50 random nodes with values > 100 && <= 200"
    );
    for (let i = 0; i < 50; i++) {
      let value = Math.floor(Math.random() * 100) + 101;
      this.insert(value);
    }
  }

  //checks to see if the binary tree is balanced
  isBalanced() {
    //if the root is null, return true
    if (this.root === null) {
      return true;
    }
    //get the height of the left subtree
    let leftHeight = this.height(this.root.left);
    //get the height of the right subtree
    let rightHeight = this.height(this.root.right);
    //if the difference between the heights is greater than 1, return false
    if (Math.abs(leftHeight - rightHeight) > 1) {
      return false;
    }
    //otherwise, return true
    return true;
  }

  //rebalances the binary tree if unbalanced
  rebalance() {
    //if the tree is balanced, return
    if (this.isBalanced()) {
      console.log("Tree is already balanced!");
      return;
    }
    console.log("Tree is unbalanced...rebalancing...");
    //get the nodes in level order
    let nodes = this.levelOrder();
    //flatten the nodes array
    nodes = nodes.flat();
    //build a new tree from the nodes array
    this.root = this.buildTree(nodes);
  }
}

// prints the tree in a pretty format starting at the specified node
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

//create an array of numbers 1 - 100 in random order
function getArray() {
  let newArray = [];
  while (newArray.length < 100) {
    let newNum = Math.floor(Math.random() * 100) + 1;
    if (newArray.indexOf(newNum) == -1) {
      newArray.push(newNum);
    } else {
      continue;
    }
  }
  return newArray;
}

//test cases

//generate an array and create a tree with it
let newArray = getArray();
let testTree = new Tree(newArray);
console.log("Tree before unbalancing:");
prettyPrint(testTree.root);
console.log("Tree is balanced: " + testTree.isBalanced()); //true;

//unbalance the tree and show that it is unbalanced
testTree.unbalance();
console.log("\nTree after unbalancing:");
prettyPrint(testTree.root);
console.log("Tree is balanced: " + testTree.isBalanced()); //false;

//rebalance the tree and show that it is balanced
testTree.rebalance();
console.log("\nTree after rebalancing:");
prettyPrint(testTree.root);
console.log("Tree is balanced: " + testTree.isBalanced()); //true;

//test the node manipulation methods
console.log("\nFind Node containing value of 14\nNode Info:");
console.log(testTree.find(14)); // returns the node with the value of 14
console.log("\nDelete Node containing value of 14... done!");
console.log("\nFind Node containing value of 14\nNode Info: ");
testTree.delete(14);
console.log(testTree.find(14)); // null. deleted
console.log("\nNode not found!");

//test the tree info methods
console.log("\nRoot height: " + testTree.height(testTree.root)); // root height = 6
console.log(
  "Height of Node containg value of 9: " + testTree.height(testTree.find(9))
); // height = 4
console.log(
  "Depth of Node containing value of 17: " + testTree.depth(testTree.find(17))
); // depth = 6
console.log("\n");

//test different tree traversal methods
prettyPrint(testTree.root); //tree to verify traversal against;
console.log("Level Order traversal Method:");
for (let i = 0; i < testTree.levelOrder().length; i++) {
  console.log(`\xa0\xa0Level ${[i]}: ` + testTree.levelOrder()[i]);
}
console.log("\n");

prettyPrint(testTree.root); //tree to verify traversal against;
console.log("\nPreorder Traversal Method:");
console.log(testTree.preorder());
console.log("\n");

prettyPrint(testTree.root); //tree to verify traversal against;
console.log("\nInorder Traversal Method:");
console.log(testTree.inorder());
console.log("\n");

prettyPrint(testTree.root); //tree to verify traversal against;
console.log("\nPostorder Traversal Method:");
console.log(testTree.postorder());
