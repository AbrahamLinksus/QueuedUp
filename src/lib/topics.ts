export const MAIN_TOPICS = [
  "arrays",
  "hashing",
  "stack",
  "queue",
  "trees",
  "recursion",
  "dynamic programming",
  "graph",
  "traversal",
  "backtracking",
  "sorting",
  "string",
  "linked list",
] as const;

export type MainTopic = (typeof MAIN_TOPICS)[number];

const MAIN_TOPIC_SET = new Set<string>(MAIN_TOPICS);

// Maps any tag name (lowercase, trimmed) → main topic.
// Direct name matches take priority over this table — checked first.
const TAG_TO_TOPIC: Record<string, MainTopic> = {
  // ── arrays ──────────────────────────────────────────────────────────────
  array: "arrays",
  "two pointers": "arrays",
  "two pointer": "arrays",
  "binary search": "arrays",
  "sliding window": "arrays",
  "prefix sum": "arrays",
  "prefix sums": "arrays",
  "suffix sum": "arrays",
  matrix: "arrays",
  "2d array": "arrays",
  interval: "arrays",
  intervals: "arrays",
  "merge intervals": "arrays",
  "bit manipulation": "arrays",
  "bit masking": "arrays",
  bitmask: "arrays",
  bitwise: "arrays",
  kadane: "arrays",
  "dutch national flag": "arrays",
  monotone: "arrays",
  "next permutation": "arrays",

  // ── hashing ─────────────────────────────────────────────────────────────
  hash: "hashing",
  "hash map": "hashing",
  hashmap: "hashing",
  "hash set": "hashing",
  hashset: "hashing",
  dictionary: "hashing",
  "frequency count": "hashing",
  "frequency map": "hashing",
  "count map": "hashing",
  "anagram detection": "hashing",
  "group anagrams": "hashing",

  // ── stack ───────────────────────────────────────────────────────────────
  "monotonic stack": "stack",
  "expression evaluation": "stack",
  "balanced parentheses": "stack",
  parentheses: "stack",
  brackets: "stack",
  "min stack": "stack",
  "valid parentheses": "stack",

  // ── queue ───────────────────────────────────────────────────────────────
  deque: "queue",
  "priority queue": "queue",
  heap: "queue",
  "min heap": "queue",
  "max heap": "queue",
  "monotonic queue": "queue",
  "sliding window maximum": "queue",
  "circular queue": "queue",

  // ── trees ────────────────────────────────────────────────────────────────
  tree: "trees",
  "binary tree": "trees",
  bst: "trees",
  "binary search tree": "trees",
  "segment tree": "trees",
  trie: "trees",
  "prefix tree": "trees",
  "avl tree": "trees",
  "red-black tree": "trees",
  "n-ary tree": "trees",
  "balanced bst": "trees",
  "diameter of tree": "trees",
  "lowest common ancestor": "trees",
  lca: "trees",
  "path sum": "trees",

  // ── recursion ────────────────────────────────────────────────────────────
  recursive: "recursion",
  "divide and conquer": "recursion",
  "master theorem": "recursion",
  "fibonacci": "recursion",
  memoization: "recursion",

  // ── dynamic programming ──────────────────────────────────────────────────
  dp: "dynamic programming",
  "dynamic programing": "dynamic programming",
  tabulation: "dynamic programming",
  knapsack: "dynamic programming",
  "0/1 knapsack": "dynamic programming",
  "longest common subsequence": "dynamic programming",
  lcs: "dynamic programming",
  "longest increasing subsequence": "dynamic programming",
  lis: "dynamic programming",
  "edit distance": "dynamic programming",
  "coin change": "dynamic programming",
  "matrix chain": "dynamic programming",
  "rod cutting": "dynamic programming",
  "partition dp": "dynamic programming",
  "state machine dp": "dynamic programming",
  "interval dp": "dynamic programming",
  "palindrome dp": "dynamic programming",

  // ── graph ────────────────────────────────────────────────────────────────
  graphs: "graph",
  "directed graph": "graph",
  "undirected graph": "graph",
  "weighted graph": "graph",
  dag: "graph",
  "topological sort": "graph",
  "topological sorting": "graph",
  "shortest path": "graph",
  dijkstra: "graph",
  "bellman ford": "graph",
  "floyd warshall": "graph",
  "union find": "graph",
  "disjoint set": "graph",
  "disjoint set union": "graph",
  dsu: "graph",
  "minimum spanning tree": "graph",
  mst: "graph",
  kruskal: "graph",
  prim: "graph",
  "cycle detection": "graph",
  "strongly connected": "graph",
  "tarjan": "graph",
  "kosaraju": "graph",

  // ── traversal ────────────────────────────────────────────────────────────
  dfs: "traversal",
  bfs: "traversal",
  "depth first search": "traversal",
  "breadth first search": "traversal",
  "depth-first search": "traversal",
  "breadth-first search": "traversal",
  inorder: "traversal",
  preorder: "traversal",
  postorder: "traversal",
  "level order": "traversal",
  "level-order": "traversal",
  "zigzag traversal": "traversal",
  "tree traversal": "traversal",
  "graph traversal": "traversal",
  "flood fill": "traversal",
  "island problem": "traversal",

  // ── backtracking ─────────────────────────────────────────────────────────
  backtrack: "backtracking",
  permutation: "backtracking",
  permutations: "backtracking",
  combination: "backtracking",
  combinations: "backtracking",
  subset: "backtracking",
  subsets: "backtracking",
  "power set": "backtracking",
  "n-queens": "backtracking",
  "n queens": "backtracking",
  sudoku: "backtracking",
  pruning: "backtracking",
  "constraint satisfaction": "backtracking",
  "generate parentheses": "backtracking",

  // ── sorting ──────────────────────────────────────────────────────────────
  sort: "sorting",
  "merge sort": "sorting",
  "quick sort": "sorting",
  quicksort: "sorting",
  "heap sort": "sorting",
  "counting sort": "sorting",
  "radix sort": "sorting",
  "bucket sort": "sorting",
  "bubble sort": "sorting",
  "insertion sort": "sorting",
  "selection sort": "sorting",
  comparator: "sorting",
  "custom sort": "sorting",
  "k-th element": "sorting",
  "kth largest": "sorting",
  "kth smallest": "sorting",

  // ── string ───────────────────────────────────────────────────────────────
  strings: "string",
  substring: "string",
  palindrome: "string",
  anagram: "string",
  "pattern matching": "string",
  kmp: "string",
  "knuth morris pratt": "string",
  "rabin karp": "string",
  regex: "string",
  character: "string",
  ascii: "string",
  unicode: "string",
  "string manipulation": "string",
  "z algorithm": "string",
  "z-algorithm": "string",
  "rolling hash": "string",
  "string hashing": "string",
  "longest palindromic substring": "string",

  // ── linked list ──────────────────────────────────────────────────────────
  "linked list": "linked list",
  linkedlist: "linked list",
  "singly linked list": "linked list",
  "doubly linked list": "linked list",
  "circular linked list": "linked list",
  "fast slow pointer": "linked list",
  "fast and slow pointer": "linked list",
  "floyd cycle": "linked list",
  "cycle detection linked list": "linked list",
  "reverse linked list": "linked list",
  "merge linked lists": "linked list",
  "lru cache": "linked list",
};

/**
 * Maps a set of raw tag names to the main topics they belong to.
 * Each problem contributes at most 1 to each main topic regardless of
 * how many of its tags map to the same topic.
 */
export function getMainTopicsForTags(tagNames: string[]): Set<MainTopic> {
  const result = new Set<MainTopic>();
  for (const name of tagNames) {
    const lower = name.toLowerCase().trim();
    if (MAIN_TOPIC_SET.has(lower)) {
      result.add(lower as MainTopic);
    } else {
      const mapped = TAG_TO_TOPIC[lower];
      if (mapped) result.add(mapped);
    }
  }
  return result;
}
