enum Topic {
  ARRAY = "ARRAY",
  BACKTRACKING = "BACKTRACKING",
  BFS = "BREADTH-FIRST SEARCH",
  BINARYSEARCH = "BINARY SEARCH",
  DFS = "DEPTH-FIRST SEARCH",
  DIVIDECONQUER = "DIVIDE AND CONQUER",
  DP = "DYNAMIC PROGRAMMING",
  LINKEDLIST = "LINKED LIST",
  GREEDY = "GREEDY",
  HASHTABLE = "HASH TABLE",
  MATRIX = "MATRIX",
  MEMOIZATION = "MEMOIZATION",
  RECURSION = "RECURSION",
  STACK = "STACK",
  STRING = "STRING",
  SORTING = "SORTING",
  TOPOSORT = "TOPOLOGICAL SORT",
  TREE = "TREE",
  TRIE = "TRIE",
  TWOPOINTERS = "TWO POINTERS",
  QUEUE = "QUEUE",
  QUICKSELECT = "QUICKSELECT",
  UNIONFIND = "UNION FIND",
}

export const convertStringToTopic = (topic: string): Topic => {
  Object.values(Topic).forEach((value) => {
    if (value === topic) {
      return value;
    }
  });
  throw new Error(`Topic ${topic} not found.`);
};

export default Topic;
