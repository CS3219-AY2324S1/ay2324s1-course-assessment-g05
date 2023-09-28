// Used in api path, value should be in small caps
export enum SERVICE {
  USER = "users",
  QUESTION = "questions",
  AUTH = "auth",
}

export enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// Port moved to .env.development
// export enum ServiceLocalPorts {
//   USER = "5000",
//   QUESTION = "5100",
// }

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum COMPLEXITY {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum LANGUAGE {
  PYTHON = "PYTHON",
  JAVA = "JAVA",
  CPP = "C++",
  JAVASCRIPT = "JAVASCRIPT",
}

export enum TOPIC {
  ARRAY = "ARRAY",
  STRING = "STRING",
  HASHTABLE = "HASH TABLE",
  MATH = "MATH",
  DP = "DYNAMIC PROGRAMMING",
  SORTING = "SORTING",
  GREEDY = "GREEDY",
  DFS = "DEPTH-FIRST SEARCH",
  BINARYSEARCH = "BINARY SEARCH",
  DATABASE = "DATABASE",
  BFS = "BREADTH-FIRST SEARCH",
  TREE = "TREE",
  MATRIX = "MATRIX",
  TWOPOINTERS = "TWO POINTERS",
  BINARYTREE = "BINARY TREE",
  BITMANIPULATION = "BIT MANIPULATION",
  HEAP = "HEAP (PRIORITY QUEUE)",
  STACK = "STACK",
  PREFIX_SUM = "PREFIX SUM",
  GRAPH = "GRAPH",
  BACKTRACKING = "BACKTRACKING",
  SLIDINGWINDOW = "SLIDING WINDOW",
  UNIONFIND = "UNION FIND",
  LINKEDLIST = "LINKED LIST",
  TRIE = "TRIE",
  RECURSION = "RECURSION",
  DIVIDECONQUER = "DIVIDE AND CONQUER",
  QUEUE = "QUEUE",
  MEMOIZATION = "MEMOIZATION",
  TOPOSORT = "TOPOLOGICAL SORT",
  QUICKSELECT = "QUICKSELECT",
  BRAINTEASER = "BRAIN TEASER",
}

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}
