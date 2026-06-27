export type SessionBlock = {
  start: string;
  end: string;
  type: "study" | "break" | "lunch";
  label: string;
  detail?: string;
};

export type DayPlan = {
  day: number;
  week: number;
  phase: number;
  phaseName: string;
  topic: string;
  topicSlug: string;
  goals: string[];
  sessions: SessionBlock[];
};

const DAILY_SESSIONS: Omit<SessionBlock, "label" | "detail">[] = [
  { start: "9:00 AM",  end: "11:30 AM", type: "study" },
  { start: "11:30 AM", end: "11:45 AM", type: "break" },
  { start: "11:45 AM", end: "2:15 PM",  type: "study" },
  { start: "2:15 PM",  end: "3:00 PM",  type: "lunch" },
  { start: "3:00 PM",  end: "5:30 PM",  type: "study" },
  { start: "5:30 PM",  end: "5:45 PM",  type: "break" },
  { start: "5:45 PM",  end: "8:15 PM",  type: "study" },
];

function makeSessions(s1: string, s2: string, s3: string, s4: string): SessionBlock[] {
  const labels = [s1, s2, s3, s4];
  let studyIdx = 0;
  return DAILY_SESSIONS.map((s) => {
    if (s.type === "study") return { ...s, label: labels[studyIdx++] };
    if (s.type === "break") return { ...s, label: "Short Break", detail: "Stand up, stretch, hydrate" };
    return { ...s, label: "Lunch Break", detail: "Rest fully — no screens" };
  });
}

// ── 30-Day Plan ────────────────────────────────────────────────────────────
// Phase 1: Arrays + Bit Manipulation   Days 1–3
// Phase 2: Hashing + String            Days 4–7
// Phase 3: Sorting + Linked List       Days 8–11
// Phase 4: Recursion + Stack + Queue   Days 12–15
// Phase 5: Trees + Traversal           Days 16–21
// Phase 6: Backtracking + Graph        Days 22–25
// Phase 7: Dynamic Programming         Days 26–30

const PLANS: Omit<DayPlan, "sessions">[] = [
  // ── Phase 1: Arrays + Bit Manipulation ───────────────────────────────────
  { day:1, week:1, phase:1, phaseName:"DSA — Arrays & Bit Manipulation", topic:"Arrays · Basics & Two Pointers", topicSlug:"arrays",
    goals:["Two Sum, Contains Duplicate, Best Time to Buy/Sell Stock, Product of Array Except Self","Two Pointers: Move Zeroes, Remove Duplicates, Sort Colors, Container With Most Water","Merge Intervals, Insert Interval, Non-overlapping Intervals"] },
  { day:2, week:1, phase:1, phaseName:"DSA — Arrays & Bit Manipulation", topic:"Arrays · Sliding Window & Prefix Sum", topicSlug:"arrays",
    goals:["Fixed window: Maximum Average Subarray, Max Consecutive Ones III","Variable window: Minimum Size Subarray Sum, Fruit Into Baskets, Minimum Ops to Reduce X","Prefix Sum: Running Sum, Subarray Sum Equals K, Contiguous Array","Spiral Matrix, Rotate Image, Set Matrix Zeroes"] },
  { day:3, week:1, phase:1, phaseName:"DSA — Arrays & Bit Manipulation", topic:"Arrays Hard + Bit Manipulation", topicSlug:"bit manipulation",
    goals:["Trapping Rain Water (all 3 approaches), Sliding Window Maximum, Jump Game I/II","Bit fundamentals: AND/OR/XOR/shifts, Number of 1 Bits, Counting Bits, Power of Two","Sum of Two Integers, Single Number I/II/III, Total Hamming Distance, Hamming Distance"] },

  // ── Phase 2: Hashing + String ────────────────────────────────────────────
  { day:4, week:1, phase:2, phaseName:"DSA — Hashing & Strings", topic:"Hashing", topicSlug:"hashing",
    goals:["HashMap vs HashSet use cases, frequency counting template","Valid Anagram, Ransom Note, Isomorphic Strings, Word Pattern, Happy Number","Group Anagrams, Top K Frequent Elements, 4Sum II, Contiguous Array, Sort Characters By Frequency"] },
  { day:5, week:2, phase:2, phaseName:"DSA — Hashing & Strings", topic:"Hashing Medium + String Intro", topicSlug:"string",
    goals:["Insert Delete GetRandom O(1), Repeated DNA Sequences, Pairs of Songs Divisible by 60","String basics: Valid Palindrome, Reverse String, Reverse Words, First Unique Character","Longest Common Prefix, String Compression, Decode String (stack)"] },
  { day:6, week:2, phase:2, phaseName:"DSA — Hashing & Strings", topic:"String · Sliding Window & Medium", topicSlug:"string",
    goals:["Longest Substring Without Repeating Characters, Permutation in String","Find All Anagrams in String, Longest Repeating Character Replacement","Longest Palindromic Substring, Palindromic Substrings, Partition Labels"] },
  { day:7, week:2, phase:2, phaseName:"DSA — Hashing & Strings", topic:"String Hard + Review", topicSlug:"string",
    goals:["Minimum Window Substring (hardest string problem — master this)","Word Break, Encode/Decode Strings, Regular Expression Matching","Review: HashMap/HashSet patterns cheat-sheet, string sliding window templates"] },

  // ── Phase 3: Sorting + Linked List ───────────────────────────────────────
  { day:8, week:2, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Sorting", topicSlug:"sorting",
    goals:["Implement Merge Sort and Quick Sort from scratch","Sort Colors, Largest Number, K Closest Points to Origin (quick select)","Car Fleet, Queue Reconstruction by Height, Minimum Number of Arrows to Burst Balloons"] },
  { day:9, week:2, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Linked List · Basics & Two Pointers", topicSlug:"linked list",
    goals:["Implement singly + doubly linked list; Reverse Linked List (iterative + recursive)","Merge Two Sorted Lists, Linked List Cycle, Middle of Linked List","Linked List Cycle II (Floyd's), Remove Nth From End, Palindrome Linked List, Reorder List"] },
  { day:10, week:2, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Linked List · Medium", topicSlug:"linked list",
    goals:["Add Two Numbers, Copy List with Random Pointer","Partition List, Remove Duplicates from Sorted List II","Reverse Linked List II, Swap Nodes in Pairs, Rotate List, Odd Even Linked List"] },
  { day:11, week:2, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Linked List · Hard + Review", topicSlug:"linked list",
    goals:["Merge K Sorted Lists (heap approach + divide & conquer)","Reverse Nodes in K-Group, LRU Cache (DLL + HashMap) — most common interview question","Review: all linked list pointer manipulation templates, re-implement LRU from memory"] },

  // ── Phase 4: Recursion + Stack + Queue ───────────────────────────────────
  { day:12, week:3, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Recursion + Divide & Conquer", topicSlug:"recursion",
    goals:["Recursion fundamentals: Fibonacci (memo), Climbing Stairs, Pow(x,n)","Merge Sort + Quick Sort recursively from scratch","Count of Range Sum (D&C), Different Ways to Add Parentheses, Flatten Nested List"] },
  { day:13, week:3, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Stack · Basics & Monotonic", topicSlug:"stack",
    goals:["Min Stack, Valid Parentheses, Evaluate Reverse Polish Notation","Daily Temperatures, Next Greater Element I/II, Online Stock Span","Sum of Subarray Minimums, Largest Rectangle in Histogram, Trapping Rain Water (stack)"] },
  { day:14, week:3, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Stack Hard + Queue & Heap", topicSlug:"queue",
    goals:["Basic Calculator I/II, Remove K Digits, 132 Pattern, Maximum Frequency Stack","Min-heap vs max-heap: Kth Largest in Stream, Last Stone Weight, K Closest Points","Top K Frequent Words, Task Scheduler, Reorganize String, Seat Reservation Manager"] },
  { day:15, week:3, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Queue · Hard + Review", topicSlug:"queue",
    goals:["Find Median from Data Stream (two heaps), IPO (greedy + heaps)","Minimum Cost to Connect Sticks, Single-Threaded CPU","Review: monotonic stack template, when to use heap vs stack vs queue"] },

  // ── Phase 5: Trees + Traversal ───────────────────────────────────────────
  { day:16, week:3, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Trees · Basics & Level Order", topicSlug:"trees",
    goals:["Implement BST: insert, search, delete","Inorder/Preorder/Postorder iterative + recursive; Max Depth, Min Depth, Invert, Same Tree","Level Order, Zigzag Level Order, Right Side View, Average of Levels, Count Complete Tree Nodes"] },
  { day:17, week:3, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Trees · BST & Path Problems", topicSlug:"trees",
    goals:["BST: Kth Smallest, LCA of BST, Validate BST, BST Iterator","Convert Sorted Array to BST, Serialize/Deserialize BST","Path Sum I/II/III, Sum Root to Leaf Numbers, Binary Tree Maximum Path Sum, House Robber III"] },
  { day:18, week:4, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Trees · Advanced + Trie", topicSlug:"trees",
    goals:["Serialize and Deserialize Binary Tree (BFS encoding)","Implement Trie: insert/search/startsWith in O(m)","Add and Search Word, Word Search II (Trie + backtracking), Count Good Nodes"] },
  { day:19, week:4, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Traversal · BFS on Graphs", topicSlug:"traversal",
    goals:["BFS template: queue + visited, level-by-level vs all at once","Flood Fill, Number of Islands, Rotting Oranges (multi-source BFS), 01 Matrix","Nearest Exit from Entrance, Minimum Genetic Mutation, Open the Lock"] },
  { day:20, week:4, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Traversal · DFS & Shortest Path", topicSlug:"traversal",
    goals:["DFS on grids: Max Area of Island, Surrounded Regions, Pacific Atlantic Water Flow","Word Search (DFS + backtracking on grid)","Shortest Bridge, Jump Game III, Clone Graph, Word Ladder"] },
  { day:21, week:4, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Trees + Traversal Review", topicSlug:"traversal",
    goals:["Re-attempt Binary Tree Maximum Path Sum and Word Ladder II from scratch","Implement iterative DFS (explicit stack) and iterative BFS","BFS vs DFS decision framework — when to use each"] },

  // ── Phase 6: Backtracking + Graph ────────────────────────────────────────
  { day:22, week:4, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Backtracking · All Patterns", topicSlug:"backtracking",
    goals:["Backtracking template: choose → explore → unchoose","Subsets/Subsets II, Combinations/Combination Sum, Permutations/Permutations II","Generate Parentheses, Palindrome Partitioning, Letter Combinations of Phone Number, Restore IP"] },
  { day:23, week:4, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Backtracking Hard + Graph Fundamentals", topicSlug:"graph",
    goals:["N-Queens, Sudoku Solver, Word Break II — hardest backtracking problems","Graph: adjacency list/matrix, Course Schedule I/II (topological sort)","Find Eventual Safe States, Keys and Rooms, Is Graph Bipartite"] },
  { day:24, week:4, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Graph · Union-Find & Shortest Paths", topicSlug:"graph",
    goals:["Union-Find with path compression + rank: Redundant Connection, Number of Connected Components","Accounts Merge, Graph Valid Tree","Dijkstra's: Network Delay Time, Cheapest Flights K Stops, Path With Minimum Effort"] },
  { day:25, week:4, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Graph · Advanced + Review", topicSlug:"graph",
    goals:["MST: Kruskal (sort + union-find), Prim's","Critical Connections in Network (Tarjan's bridges), Reconstruct Itinerary","Shortest Path Visiting All Nodes (BFS + bitmask), graph algorithm cheat-sheet review"] },

  // ── Phase 7: Dynamic Programming ─────────────────────────────────────────
  { day:26, week:5, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · 1D — Fibonacci & Sequences", topicSlug:"dynamic programming",
    goals:["Memoization vs tabulation patterns, @cache decorator","Climbing Stairs, House Robber I/II, Min Cost Climbing Stairs, Jump Game I/II","LIS (O(n log n)), Coin Change, Perfect Squares, Decode Ways, Word Break, Delete and Earn"] },
  { day:27, week:5, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · 2D + Knapsack", topicSlug:"dynamic programming",
    goals:["Unique Paths I/II, Minimum Path Sum, Triangle, Maximal Square","Dungeon Game (reverse DP), Minimum Falling Path Sum","0/1 Knapsack: Partition Equal Subset Sum, Target Sum, Last Stone Weight II, Coin Change II"] },
  { day:28, week:5, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · Interval & Subsequence", topicSlug:"dynamic programming",
    goals:["Interval DP: Burst Balloons, Palindrome Partitioning II, Stone Game","LCS, Edit Distance, Longest Palindromic Subsequence, Distinct Subsequences","Interleaving String, Scramble String (memoized recursion)"] },
  { day:29, week:5, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · State Machine + Hard", topicSlug:"dynamic programming",
    goals:["State machine: Best Time to Buy/Sell with Cooldown, Fee, k transactions","Paint House I/II, Maximum Profit in Job Scheduling (binary search + DP)","Number of Ways to Form Target String Given Dictionary, Tallest Billboard"] },
  { day:30, week:5, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · Full Review + Mock", topicSlug:"dynamic programming",
    goals:["Pick 5 DP problems from different categories — solve without notes","Timed mock: 2 medium DPs in 45 minutes each","Final DP cheat-sheet: templates for 1D / 2D / knapsack / interval / subsequence / state machine"] },
];

// ── Session labels (s1-s3 are DSA; s4 is LLD — set below) ─────────────────
const SESSION_LABELS: Record<string, [string, string, string, string]> = {
  "Arrays · Basics & Two Pointers":         ["Two Sum, Contains Duplicate, Best Time to Buy/Sell Stock","Product of Array Except Self, Two Pointers easy (Move Zeroes, Remove Duplicates)","Container With Most Water, 3Sum, Sort Colors, 4Sum","Merge Intervals, Insert Interval, Non-overlapping Intervals, Jump Game"],
  "Arrays · Sliding Window & Prefix Sum":   ["Fixed window: Max Average Subarray, Max Consecutive Ones III","Variable window: Min Size Subarray Sum, Fruit Into Baskets, Min Ops to Reduce X","Prefix Sum: Running Sum, Subarray Sum Equals K, Contiguous Array","Spiral Matrix, Rotate Image, Set Matrix Zeroes, Game of Life"],
  "Arrays Hard + Bit Manipulation":         ["Trapping Rain Water — all 3 approaches (two-ptr, stack, DP)","Sliding Window Maximum, Kth Largest Element, Search in 2D Matrix","Bit fundamentals + easy: Number of 1 Bits, Counting Bits, Power of Two, Reverse Bits","Bit medium: Sum of Two Integers, Single Number I/II/III, Total Hamming Distance"],
  "Hashing":                                ["HashMap/Set internals, frequency counting; Valid Anagram, Ransom Note","Isomorphic Strings, Word Pattern, Happy Number, Contains Duplicate II","Group Anagrams, Top K Frequent Elements, 4Sum II, Contiguous Array","Sort Characters By Frequency, Insert Delete GetRandom, Repeated DNA Sequences"],
  "Hashing Medium + String Intro":          ["Pairs of Songs, Brick Wall, Minimum Deletions for Unique Frequencies","String basics: Valid Palindrome, Reverse String, Reverse Words in String","First Unique Character, Length of Last Word, Detect Capital, String Compression","Decode String (stack + recursion), Encode/Decode Strings"],
  "String · Sliding Window & Medium":       ["Longest Substring Without Repeating Characters","Permutation in String, Find All Anagrams in String","Longest Repeating Character Replacement, Minimum Window Substring","Longest Palindromic Substring, Palindromic Substrings, Partition Labels"],
  "String Hard + Review":                   ["Minimum Window Substring deep dive — all edge cases","Word Break (DP intro), Regular Expression Matching, Wildcard Matching","Review: when to use HashMap vs array vs Set, string sliding window templates","Scramble String, Text Justification (hard)"],
  "Sorting":                                ["Merge Sort from scratch — code + trace","Quick Sort + QuickSelect — code + pivot strategies","Sort Colors, Largest Number, K Closest Points (quick select), H-Index","Car Fleet, Queue Reconstruction by Height, Min Arrows to Burst Balloons"],
  "Linked List · Basics & Two Pointers":    ["Build singly linked list; Reverse (iterative + recursive); Merge Two Sorted Lists","Linked List Cycle (Floyd's detect + find start), Middle of Linked List","Remove Nth from End, Palindrome Linked List, Intersection of Two Linked Lists","Reorder List, Rotate List, Odd Even Linked List — all fast/slow pointer patterns"],
  "Linked List · Medium":                   ["Add Two Numbers, Add Two Numbers II (reverse)","Copy List with Random Pointer (hashmap + two-pass)","Partition List, Remove Duplicates from Sorted List II","Reverse Linked List II, Swap Nodes in Pairs, Swapping Nodes in Linked List"],
  "Linked List · Hard + Review":            ["Merge K Sorted Lists — min-heap approach","Merge K Sorted Lists — divide & conquer approach","Reverse Nodes in K-Group — detailed pointer walkthrough","LRU Cache from scratch: DLL + HashMap — implement without notes"],
  "Recursion + Divide & Conquer":           ["Recursion basics: Fibonacci (memo + tab), Climbing Stairs, Pow(x,n)","Recursive LL + tree problems: Reverse Linked List, Merge Two Sorted Lists","Merge Sort + Quick Sort from scratch (recursive)","D&C: Count of Range Sum, Different Ways to Add Parentheses, Flatten Nested List"],
  "Stack · Basics & Monotonic":             ["Implement stack; Min Stack, Valid Parentheses, Evaluate Reverse Polish Notation","Daily Temperatures, Next Greater Element I/II, Online Stock Span","Monotonic stack: Sum of Subarray Minimums, Largest Rectangle in Histogram","Remove K Digits, Monotone Increasing Digits, Trapping Rain Water (stack)"],
  "Stack Hard + Queue & Heap":              ["Basic Calculator I/II, Asteroid Collision, 132 Pattern","Maximum Frequency Stack, Decode String","Min-heap / max-heap: Kth Largest in Stream, Last Stone Weight, K Closest Points","Top K Frequent Words, Task Scheduler, Reorganize String"],
  "Queue · Hard + Review":                  ["Find Median from Data Stream — two heaps trick","IPO (greedy + two heaps), Minimum Cost to Connect Sticks","Single-Threaded CPU, Minimum Number of Refueling Stops","Review: monotonic stack template, heap use cases, when to use deque vs heap"],
  "Trees · Basics & Level Order":           ["Build BST from scratch; inorder/preorder/postorder iterative + recursive","Max Depth, Min Depth, Diameter, Invert Binary Tree, Same Tree, Symmetric Tree","Level Order Traversal, Zigzag Level Order, Right Side View, Average of Levels","Count Complete Tree Nodes, Populating Next Right Pointers, Find Largest Value in Each Row"],
  "Trees · BST & Path Problems":            ["BST: Validate BST, Kth Smallest, LCA of BST, BST Iterator","Convert Sorted Array to BST, Serialize/Deserialize BST","Path Sum I/II (root-to-leaf), Path Sum III (prefix sum trick)","Sum Root to Leaf Numbers, Binary Tree Maximum Path Sum, House Robber III"],
  "Trees · Advanced + Trie":               ["Serialize and Deserialize Binary Tree (BFS string encoding)","Implement Trie: insert, search, startsWith — all O(m)","Add and Search Word (Trie + wildcard DFS), Count Good Nodes","Word Search II (Trie + backtracking — much faster than naive DFS)"],
  "Traversal · BFS on Graphs":             ["BFS template on grids: Flood Fill, Number of Islands","Rotting Oranges (multi-source BFS), 01 Matrix (multi-source BFS)","Nearest Exit from Entrance, Minimum Genetic Mutation","Open the Lock, Shortest Path in Binary Matrix"],
  "Traversal · DFS & Shortest Path":       ["DFS on grids: Max Area of Island, Surrounded Regions (boundary DFS)","Pacific Atlantic Water Flow (two BFS from each ocean), Word Search","Shortest Bridge (BFS after DFS to find island), Jump Game III","Clone Graph (BFS + hashmap), Bus Routes, Word Ladder"],
  "Trees + Traversal Review":              ["Re-attempt Binary Tree Maximum Path Sum from memory","Re-attempt Word Ladder II (hardest traversal — BFS levels + DFS rebuild)","Implement iterative DFS (explicit stack) and BFS from scratch","BFS vs DFS decision framework cheat-sheet"],
  "Backtracking · All Patterns":           ["Backtracking template; Subsets, Subsets II (skip duplicates)","Combinations, Combination Sum (unlimited), Combination Sum II","Permutations, Permutations II (skip duplicate perms)","Generate Parentheses, Palindrome Partitioning, Letter Combinations, Restore IP"],
  "Backtracking Hard + Graph Fundamentals":["N-Queens I/II — constraint satisfaction with tracking","Sudoku Solver, Word Break II (backtracking + memo)","Graph: adjacency list/matrix; BFS/DFS; topological sort (Kahn's + DFS)","Course Schedule I/II, Find Eventual Safe States, Keys and Rooms"],
  "Graph · Union-Find & Shortest Paths":   ["Union-Find with path compression + rank — implement from scratch","Redundant Connection, Number of Connected Components, Graph Valid Tree","Accounts Merge, Satisfiability of Equality Equations","Dijkstra's: Network Delay Time, Cheapest Flights K Stops, Path With Minimum Effort"],
  "Graph · Advanced + Review":             ["Kruskal's MST (sort edges + union-find), Prim's MST (priority queue)","Critical Connections in Network — Tarjan's bridge algorithm","Reconstruct Itinerary (Eulerian path), Alien Dictionary","Shortest Path Visiting All Nodes (BFS + bitmask DP), graph algorithm cheat-sheet"],
  "DP · 1D — Fibonacci & Sequences":       ["Memoization with @cache, tabulation patterns; Climbing Stairs, House Robber I/II","Min Cost Climbing Stairs, Jump Game I/II, Fibonacci, Tribonacci","LIS (O(n²) DP then O(n log n) binary search), Coin Change, Perfect Squares","Decode Ways, Word Break, Delete and Earn, Arithmetic Slices, Domino Tiling"],
  "DP · 2D + Knapsack":                    ["Unique Paths I/II (DP + combinatorics), Minimum Path Sum","Triangle (top-down + bottom-up), Maximal Square, Dungeon Game (reverse DP)","0/1 Knapsack template, Partition Equal Subset Sum (reframe as knapsack)","Target Sum (count +/-), Last Stone Weight II, Coin Change II (unbounded)"],
  "DP · Interval & Subsequence":           ["Interval DP template: for length l, for i, j=i+l-1","Burst Balloons — dp[i][j] = max coins for subarray","Palindrome Partitioning II (min cuts), Stone Game, Remove Boxes","LCS, Edit Distance, Longest Palindromic Subsequence, Distinct Subsequences, Interleaving String"],
  "DP · State Machine + Hard":             ["State machine DP: explicit states and transitions; Best Time to Buy/Sell + Cooldown","Best Time + Fee, at most k transactions; Paint House I/II","Maximum Profit in Job Scheduling (sort by end + binary search + DP)","Number of Ways to Form Target String Given Dictionary, Tallest Billboard"],
  "DP · Full Review + Mock":               ["Pick 5 DP problems from different categories — solve without notes","Review: identify DP type from problem description (5-question drill)","Timed mock: 2 medium DPs, 45 minutes each","Final cheat-sheet: templates for all 6 DP types"],
};

function getSessionLabels(topic: string): [string, string, string, string] {
  return SESSION_LABELS[topic] ?? [
    `${topic} — theory and easy problems`,
    `${topic} — medium problems`,
    `${topic} — medium/hard problems`,
    `${topic} — review and re-attempt`,
  ];
}

// ── LLD session (session 4) for every day ─────────────────────────────────
// Sessions 1-3 are DSA. Session 4 is an LLD topic running in parallel.
const LLD_BY_DAY: Record<number, string> = {
  1:  "LLD: OOP — Classes, objects, __init__, instance vs class vars",
  2:  "LLD: OOP — Inheritance, super(), MRO; Polymorphism + duck typing",
  3:  "LLD: OOP — Encapsulation (@property, __private); Abstraction (ABC)",
  4:  "LLD: OOP — Aggregation vs Composition vs Association; Interfaces + Protocols",
  5:  "LLD: OOP — Static/class/instance methods; magic methods __str__ __eq__ __hash__",
  6:  "LLD: Principles — SRP + OCP with Python examples",
  7:  "LLD: Principles — LSP + ISP + DIP (complete SOLID review)",
  8:  "LLD: Principles — DRY, KISS, YAGNI, Law of Demeter, Composition over Inheritance",
  9:  "LLD: UML — Class diagrams: relationships, multiplicity, visibility notation",
  10: "LLD: UML — Sequence diagrams + Use case diagrams + State/Activity diagrams",
  11: "LLD: Creational — Singleton (thread-safe) + Factory Method + Abstract Factory",
  12: "LLD: Creational — Builder (step-by-step construction) + Prototype (deep copy)",
  13: "LLD: Structural — Adapter (interface translation) + Facade (simplified interface)",
  14: "LLD: Structural — Decorator (dynamic behaviour) + Proxy (lazy load, access control)",
  15: "LLD: Structural — Composite (tree structures) + Bridge + Flyweight",
  16: "LLD: Behavioral — Observer (pub/sub) + Strategy (interchangeable algorithms)",
  17: "LLD: Behavioral — Command (undo/redo) + State (vending machine)",
  18: "LLD: Behavioral — Template Method + Iterator + Chain of Responsibility",
  19: "LLD: Behavioral — Mediator (chat room) + Memento (snapshots) + Visitor",
  20: "LLD: Interview Tips — approach, structure, how to communicate design under pressure",
  21: "LLD: Easy — Design Parking Lot: full class hierarchy + allocate/free logic",
  22: "LLD: Easy — Design LRU Cache: DLL + HashMap — full implementation",
  23: "LLD: Easy — Design Tic Tac Toe + Vending Machine (state machine approach)",
  24: "LLD: Easy — Design Snake and Ladder + Task Management System",
  25: "LLD: Medium — Design ATM: account, card, PIN flow, transaction",
  26: "LLD: Medium — Design Movie Ticket Booking: seats, reservations, pricing",
  27: "LLD: Medium — Design Library Management + Hotel Booking",
  28: "LLD: Medium — Design Ride Sharing (Uber-like): driver, rider, matching",
  29: "LLD: Hard — Design Chess: piece hierarchy, move validation, game loop",
  30: "LLD: Hard — Design Splitwise + Elevator System (state machine + scheduling)",
};

export const SCHEDULE: DayPlan[] = PLANS.map((p) => {
  const [s1, s2, s3] = getSessionLabels(p.topic);
  const lldS4 = LLD_BY_DAY[p.day] ?? `LLD: Review day ${p.day} concepts`;
  return { ...p, sessions: makeSessions(s1, s2, s3, lldS4) };
});

export const PHASES = [
  { phase: 1, name: "Arrays & Bit Manipulation", days: "1–3",   color: "#e67e22" },
  { phase: 2, name: "Hashing & Strings",         days: "4–7",   color: "#8e44ad" },
  { phase: 3, name: "Sorting & Linked Lists",    days: "8–11",  color: "#2980b9" },
  { phase: 4, name: "Recursion, Stack & Queue",  days: "12–15", color: "#27ae60" },
  { phase: 5, name: "Trees & Traversal",         days: "16–21", color: "#16a085" },
  { phase: 6, name: "Backtracking & Graph",      days: "22–25", color: "#c0392b" },
  { phase: 7, name: "Dynamic Programming",       days: "26–30", color: "#d35400" },
];
