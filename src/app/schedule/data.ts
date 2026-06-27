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

// ── Phase definitions ──────────────────────────────────────────────────────
// Phase 1: Arrays + Bit Manipulation   Days 1–7
// Phase 2: Hashing + String            Days 8–14
// Phase 3: Sorting + Linked List       Days 15–21
// Phase 4: Recursion + Stack + Queue   Days 22–28
// Phase 5: Trees + Traversal           Days 29–37
// Phase 6: Backtracking + Graph        Days 38–47
// Phase 7: Dynamic Programming         Days 48–57
// Phase 8: LLD                         Days 58–60

const PLANS: Omit<DayPlan, "sessions">[] = [
  // ── Phase 1: Arrays ──────────────────────────────────────────────────────
  { day:1, week:1, phase:1, phaseName:"DSA — Arrays & Bit Manipulation", topic:"Arrays", topicSlug:"arrays",
    goals:["Understand array traversal and in-place operations","Solve 8–10 easy array problems","Study Two Pointers pattern theory"] },
  { day:2, week:1, phase:1, phaseName:"DSA — Arrays & Bit Manipulation", topic:"Arrays · Two Pointers", topicSlug:"arrays",
    goals:["Solve Two Pointers easy/medium problems (Move Zeroes, Remove Duplicates, Sort Colors)","Learn 3Sum and Container With Most Water approach","Understand when to use two-pointer over brute force"] },
  { day:3, week:1, phase:1, phaseName:"DSA — Arrays & Bit Manipulation", topic:"Arrays · Sliding Window", topicSlug:"arrays",
    goals:["Study sliding window technique (fixed + variable size)","Solve Minimum Size Subarray Sum, Fruit Into Baskets, Max Consecutive Ones III","Understand the expand/shrink window template"] },
  { day:4, week:1, phase:1, phaseName:"DSA — Arrays & Bit Manipulation", topic:"Arrays · Prefix Sum & Binary Search", topicSlug:"arrays",
    goals:["Learn prefix sum pattern, solve Subarray Sum Equals K","Binary search on arrays — Search in Rotated, Find Min in Rotated","Merge Intervals and Insert Interval"] },
  { day:5, week:1, phase:1, phaseName:"DSA — Arrays & Bit Manipulation", topic:"Arrays · Medium/Hard", topicSlug:"arrays",
    goals:["Tackle medium array problems: Spiral Matrix, Rotate Image, Game of Life","Attempt 1 hard: Trapping Rain Water","Review all patterns covered so far"] },
  { day:6, week:1, phase:1, phaseName:"DSA — Arrays & Bit Manipulation", topic:"Bit Manipulation", topicSlug:"bit manipulation",
    goals:["Study bit manipulation fundamentals: AND, OR, XOR, shifts","Solve easy bit problems: Number of 1 Bits, Counting Bits, Power of Two, Reverse Bits","Understand XOR tricks (Single Number, Find the Difference)"] },
  { day:7, week:1, phase:1, phaseName:"DSA — Arrays & Bit Manipulation", topic:"Bit Manipulation + Arrays Review", topicSlug:"bit manipulation",
    goals:["Complete medium bit problems: Sum of Two Integers, Single Number II/III","Review day 1–6 problems — re-attempt any you struggled with","Solidify Two Pointers + Sliding Window templates in notes"] },

  // ── Phase 2: Hashing + String ────────────────────────────────────────────
  { day:8, week:2, phase:2, phaseName:"DSA — Hashing & Strings", topic:"Hashing", topicSlug:"hashing",
    goals:["Learn HashMap/HashSet use cases and collision basics","Solve easy hashing: Valid Anagram, Ransom Note, Isomorphic Strings, Happy Number","Understand frequency counting pattern"] },
  { day:9, week:2, phase:2, phaseName:"DSA — Hashing & Strings", topic:"Hashing · Medium", topicSlug:"hashing",
    goals:["Group Anagrams, Top K Frequent Elements, 4Sum II","Contiguous Array, Subarray Sums Divisible by K","Repeated DNA Sequences, Sort Characters By Frequency"] },
  { day:10, week:2, phase:2, phaseName:"DSA — Hashing & Strings", topic:"Hashing + String Intro", topicSlug:"string",
    goals:["Finish hashing problems — Insert Delete GetRandom, Pairs of Songs","Start strings: Valid Palindrome, Reverse String, First Unique Character","Understand ASCII tricks and character frequency maps"] },
  { day:11, week:2, phase:2, phaseName:"DSA — Hashing & Strings", topic:"String · Sliding Window", topicSlug:"string",
    goals:["String sliding window problems: Longest Substring Without Repeating Characters","Permutation in String, Find All Anagrams, Longest Repeating Character Replacement","Practice the shrink-when-valid / shrink-when-invalid window patterns"] },
  { day:12, week:2, phase:2, phaseName:"DSA — Hashing & Strings", topic:"String · Medium", topicSlug:"string",
    goals:["Decode String, Encode/Decode Strings, Minimum Remove to Make Valid Parentheses","Integer to Roman, Roman to Integer, String Compression","Longest Palindromic Substring (expand from center)"] },
  { day:13, week:2, phase:2, phaseName:"DSA — Hashing & Strings", topic:"String · Medium/Hard", topicSlug:"string",
    goals:["Palindromic Substrings, Partition Labels, Word Break","Minimum Window Substring (hard sliding window)","Regular Expression Matching and Wildcard Matching (intro to DP on strings)"] },
  { day:14, week:2, phase:2, phaseName:"DSA — Hashing & Strings", topic:"Hashing + String Review", topicSlug:"string",
    goals:["Re-attempt any struggled problems from week 2","Minimum Window Substring deep dive + Scramble String","Write cheat-sheet: when to use HashMap vs array vs Set"] },

  // ── Phase 3: Sorting + Linked List ───────────────────────────────────────
  { day:15, week:3, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Sorting", topicSlug:"sorting",
    goals:["Understand Merge Sort and Quick Sort implementations","Sort Colors (Dutch Flag), Largest Number, Custom Sort String","K Closest Points to Origin, Sort List (merge sort on LL)"] },
  { day:16, week:3, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Sorting · Medium/Hard", topicSlug:"sorting",
    goals:["Car Fleet, Queue Reconstruction by Height, Wiggle Sort II","Minimum Number of Arrows to Burst Balloons (greedy + sort)","Count of Range Sum, Maximum Gap (hard)"] },
  { day:17, week:3, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Linked List · Basics", topicSlug:"linked list",
    goals:["Implement singly + doubly linked list from scratch","Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle","Middle of Linked List, Remove Nth Node, Palindrome Linked List"] },
  { day:18, week:3, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Linked List · Two Pointers", topicSlug:"linked list",
    goals:["Floyd's cycle detection: Linked List Cycle II","Fast/slow pointer: Find intersection, detect cycle","Reorder List, Rotate List, Odd Even Linked List"] },
  { day:19, week:3, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Linked List · Medium", topicSlug:"linked list",
    goals:["Add Two Numbers, Copy List with Random Pointer","Remove Duplicates from Sorted List II, Partition List","Reverse Linked List II, Swap Nodes in Pairs"] },
  { day:20, week:3, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Linked List · Hard", topicSlug:"linked list",
    goals:["Merge K Sorted Lists (heap approach)","Reverse Nodes in K-Group","LRU Cache (DLL + HashMap) — most common interview question"] },
  { day:21, week:3, phase:3, phaseName:"DSA — Sorting & Linked Lists", topic:"Sorting + Linked List Review", topicSlug:"linked list",
    goals:["Review all linked list patterns: reversal, two-pointers, merge","Re-attempt LRU Cache and Merge K Sorted Lists from memory","Write linked list problem templates in notes"] },

  // ── Phase 4: Recursion + Stack + Queue ───────────────────────────────────
  { day:22, week:4, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Recursion", topicSlug:"recursion",
    goals:["Understand call stack, base cases, recursive thinking","Fibonacci, Climbing Stairs, Power(x,n), Merge Sort recursively","Flatten Nested List, Different Ways to Add Parentheses"] },
  { day:23, week:4, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Recursion · Divide & Conquer", topicSlug:"recursion",
    goals:["Merge Sort, Quick Sort implementations from scratch","Count of Range Sum (D&C), Largest Rectangle in Histogram (D&C)","K-th Symbol in Grammar, Beautiful Array"] },
  { day:24, week:4, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Stack · Basics", topicSlug:"stack",
    goals:["Implement stack with min-stack functionality","Valid Parentheses, Evaluate Reverse Polish Notation","Daily Temperatures, Next Greater Element I/II"] },
  { day:25, week:4, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Stack · Monotonic Stack", topicSlug:"stack",
    goals:["Monotonic stack pattern: decreasing vs increasing","Sum of Subarray Minimums, Largest Rectangle in Histogram","Trapping Rain Water (stack approach), Online Stock Span"] },
  { day:26, week:4, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Stack · Medium/Hard", topicSlug:"stack",
    goals:["Basic Calculator I/II, Decode String","Remove K Digits, 132 Pattern, Asteroid Collision","Maximum Frequency Stack (hard — excellent interview problem)"] },
  { day:27, week:4, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Queue · Heap/Priority Queue", topicSlug:"queue",
    goals:["Understand heap properties, heapify, Python heapq","Kth Largest in Stream, Last Stone Weight, K Closest Points","Top K Frequent Words, Task Scheduler"] },
  { day:28, week:4, phase:4, phaseName:"DSA — Recursion, Stack & Queue", topic:"Queue · Medium/Hard", topicSlug:"queue",
    goals:["Find Median from Data Stream (two heaps)","IPO (greedy + heap), Minimum Cost to Connect Sticks","Furthest Building You Can Reach, Minimum Number of Refueling Stops"] },

  // ── Phase 5: Trees + Traversal ───────────────────────────────────────────
  { day:29, week:5, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Trees · Basics & Traversals", topicSlug:"trees",
    goals:["Implement BTree from scratch: insert, search, delete","Inorder/Preorder/Postorder traversal (iterative + recursive)","Max Depth, Min Depth, Diameter, Invert Binary Tree, Same Tree"] },
  { day:30, week:5, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Trees · BFS / Level Order", topicSlug:"trees",
    goals:["Level Order Traversal, Zigzag Level Order, Right Side View","Find Largest Value in Each Row, Average of Levels","Binary Tree Level Order Traversal II, Count Complete Tree Nodes"] },
  { day:31, week:5, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Trees · BST", topicSlug:"trees",
    goals:["BST: search, insert, delete, validate","Kth Smallest in BST, Lowest Common Ancestor of BST","Convert Sorted Array to BST, Serialize/Deserialize BST"] },
  { day:32, week:5, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Trees · Path Problems", topicSlug:"trees",
    goals:["Path Sum I/II/III, Sum Root to Leaf Numbers","Binary Tree Maximum Path Sum (hard — very common)","House Robber III, Count Good Nodes"] },
  { day:33, week:5, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Trees · Advanced + Trie", topicSlug:"trees",
    goals:["Serialize and Deserialize Binary Tree","Implement Trie — insert/search/startsWith","Add and Search Word, Word Search II (Trie + backtracking)"] },
  { day:34, week:5, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Traversal · BFS on Graphs", topicSlug:"traversal",
    goals:["BFS on grids: Flood Fill, Number of Islands, Rotting Oranges","01 Matrix, Nearest Exit from Entrance in Maze","Open the Lock, Minimum Genetic Mutation"] },
  { day:35, week:5, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Traversal · DFS + Multi-source BFS", topicSlug:"traversal",
    goals:["DFS on grids: Max Area of Island, Surrounded Regions, Pacific Atlantic","Word Search (DFS + backtracking)","Shortest Path with Obstacles Elimination (BFS + state)"] },
  { day:36, week:5, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Traversal · BFS Shortest Path", topicSlug:"traversal",
    goals:["Shortest Bridge, Jump Game III, Bus Routes","Clone Graph, Time Needed to Inform All Employees","Snakes and Ladders, Word Ladder"] },
  { day:37, week:5, phase:5, phaseName:"DSA — Trees & Traversal", topic:"Trees + Traversal Review", topicSlug:"traversal",
    goals:["Re-attempt Binary Tree Maximum Path Sum and Word Ladder II","Review BFS vs DFS decision framework","Implement both iterative DFS (stack) and BFS (queue) templates"] },

  // ── Phase 6: Backtracking + Graph ────────────────────────────────────────
  { day:38, week:6, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Backtracking · Subsets & Permutations", topicSlug:"backtracking",
    goals:["Understand backtracking template: choose, explore, unchoose","Subsets, Subsets II (with duplicates), Combinations, Combination Sum","Permutations, Permutations II"] },
  { day:39, week:6, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Backtracking · Classic Problems", topicSlug:"backtracking",
    goals:["Generate Parentheses, Letter Combinations of a Phone Number","Palindrome Partitioning, Restore IP Addresses","Combination Sum II, Letter Case Permutation"] },
  { day:40, week:6, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Backtracking · Hard", topicSlug:"backtracking",
    goals:["N-Queens I/II — classic constraint satisfaction","Sudoku Solver, Word Break II","Word Search (backtracking on grid)"] },
  { day:41, week:6, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Graph · Fundamentals", topicSlug:"graph",
    goals:["Graph representations: adjacency list vs matrix","Course Schedule I/II (topological sort via Kahn's + DFS)","Find if Path Exists, Number of Provinces, Find Center of Star"] },
  { day:42, week:6, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Graph · Union-Find", topicSlug:"graph",
    goals:["Implement Union-Find with path compression + rank","Redundant Connection, Number of Connected Components","Accounts Merge, Satisfiability of Equality Equations"] },
  { day:43, week:6, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Graph · Shortest Paths", topicSlug:"graph",
    goals:["Dijkstra's algorithm — Network Delay Time, Cheapest Flights K Stops","Path With Minimum Effort, Swim in Rising Water","Is Graph Bipartite, Possible Bipartition"] },
  { day:44, week:6, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Graph · Advanced", topicSlug:"graph",
    goals:["Minimum Spanning Tree: Kruskal + Prim's","Critical Connections in Network (Tarjan's bridges)","Alien Dictionary, Sort Items by Groups (advanced topo sort)"] },
  { day:45, week:6, phase:6, phaseName:"DSA — Backtracking & Graph", topic:"Graph · Hard + Review", topicSlug:"graph",
    goals:["Shortest Path Visiting All Nodes (BFS on bitmask states)","Word Ladder II, Similar String Groups","Review all graph algorithms: topo sort, Union-Find, Dijkstra"] },

  // ── Phase 7: Dynamic Programming ─────────────────────────────────────────
  { day:46, week:7, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · 1D — Fibonacci Family", topicSlug:"dynamic programming",
    goals:["Understand memoization vs tabulation","Climbing Stairs, House Robber, House Robber II","Min Cost Climbing Stairs, Jump Game, Jump Game II"] },
  { day:47, week:7, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · 1D — Sequences", topicSlug:"dynamic programming",
    goals:["Longest Increasing Subsequence (patience sort O(n log n))","Coin Change, Perfect Squares, Decode Ways","Word Break, Delete and Earn, Arithmetic Slices"] },
  { day:48, week:7, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · 2D — Grid Paths", topicSlug:"dynamic programming",
    goals:["Unique Paths I/II, Minimum Path Sum, Triangle","Maximal Square, Minimum Falling Path Sum","Dungeon Game (reverse DP), Cherry Pickup (3D DP)"] },
  { day:49, week:7, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · Knapsack Variants", topicSlug:"dynamic programming",
    goals:["0/1 Knapsack template, Partition Equal Subset Sum","Target Sum, Last Stone Weight II","Coin Change II (unbounded knapsack), Number of Dice Rolls With Target Sum"] },
  { day:50, week:7, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · Interval DP", topicSlug:"dynamic programming",
    goals:["Burst Balloons (interval DP classic)","Palindrome Partitioning II, Remove Boxes","Strange Printer, Stone Game series"] },
  { day:51, week:7, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · Subsequence DP", topicSlug:"dynamic programming",
    goals:["Longest Common Subsequence, Edit Distance","Longest Palindromic Subsequence, Distinct Subsequences","Interleaving String, Scramble String"] },
  { day:52, week:7, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · State Machine", topicSlug:"dynamic programming",
    goals:["Best Time to Buy and Sell Stock with Cooldown","Best Time with Transaction Fee, Stock with at most k transactions","Paint House, Paint House II"] },
  { day:53, week:7, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · Hard Problems", topicSlug:"dynamic programming",
    goals:["Maximum Profit in Job Scheduling (binary search + DP)","Number of Ways to Form Target String Given Dictionary","Maximum Score from Performing Multiplication Operations"] },
  { day:54, week:7, phase:7, phaseName:"DSA — Dynamic Programming", topic:"DP · Review + Mock", topicSlug:"dynamic programming",
    goals:["Re-attempt 5 DP problems from memory without hints","Identify DP type for each: 1D/2D/interval/knapsack/subsequence/state machine","Timed mock: 2 medium DPs in 45 minutes each"] },

  // ── Phase 8: LLD ─────────────────────────────────────────────────────────
  { day:55, week:8, phase:8, phaseName:"LLD", topic:"OOP Fundamentals", topicSlug:"lld-oop",
    goals:["Review all OOP concepts: inheritance, polymorphism, encapsulation, abstraction","Aggregation vs composition vs association — draw diagrams","Code 2–3 OOP examples from scratch in Python"] },
  { day:56, week:8, phase:8, phaseName:"LLD", topic:"Design Principles + UML", topicSlug:"lld-principles",
    goals:["SOLID principles — one example per principle","DRY, KISS, YAGNI, Law of Demeter","Draw class diagram and sequence diagram for a simple system"] },
  { day:57, week:8, phase:8, phaseName:"LLD", topic:"Creational + Structural Patterns", topicSlug:"lld-patterns",
    goals:["Code Singleton, Factory, Builder, Prototype in Python","Code Adapter, Facade, Decorator, Proxy in Python","Understand when to apply each — interview cheat sheet"] },
  { day:58, week:8, phase:8, phaseName:"LLD", topic:"Behavioral Patterns", topicSlug:"lld-patterns",
    goals:["Code Observer, Strategy, Command, State, Template Method in Python","Iterator, Mediator, Memento, Chain of Responsibility","Pick 3 most interview-relevant patterns and implement end-to-end"] },
  { day:59, week:8, phase:8, phaseName:"LLD", topic:"LLD Interview Questions — Easy/Medium", topicSlug:"lld-questions",
    goals:["Design Parking Lot — full implementation","Design LRU Cache — full implementation (DLL + HashMap)","Design Tic Tac Toe, Snake and Ladder — class skeleton + key methods"] },
  { day:60, week:8, phase:8, phaseName:"LLD", topic:"LLD Interview Questions — Hard", topicSlug:"lld-questions",
    goals:["Design Chess — full class hierarchy, move validation, game loop","Design Splitwise — expense splitting, balance calculation, settlement","Design Elevator System — state machine, controller, scheduling algorithm"] },
];

const SESSION_LABELS: Record<string, [string, string, string, string]> = {
  "Arrays": ["Theory + Easy Problems (Two Sum, Contains Duplicate, Best Time to Buy/Sell)", "Two Pointers — easy/medium set", "Sliding Window + Prefix Sum problems", "Review + re-attempt 2 hardest problems"],
  "Arrays · Two Pointers": ["Two Pointers theory + easy (Move Zeroes, Remove Duplicates)", "3Sum, Container With Most Water", "Sort Colors, 4Sum, Two Sum II", "Review all two-pointer problems — timed re-attempt"],
  "Arrays · Sliding Window": ["Fixed window: Maximum Average Subarray, Max Consecutive Ones","Variable window: Minimum Size Subarray Sum, Max Consecutive Ones III","Fruit Into Baskets, Min Operations to Reduce X","Review window templates — write in notes"],
  "Arrays · Prefix Sum & Binary Search": ["Prefix Sum: Running Sum, Subarray Sum Equals K","Binary Search: classic + rotated sorted array variants","Merge Intervals, Insert Interval","Non-overlapping Intervals, Jump Game I/II"],
  "Arrays · Medium/Hard": ["Spiral Matrix, Rotate Image, Set Matrix Zeroes","Game of Life, Search a 2D Matrix, Find First & Last Position","Kth Largest Element, Sliding Window Maximum","Trapping Rain Water deep dive — all 3 approaches"],
  "Bit Manipulation": ["Theory: AND/OR/XOR/shifts — practice each mentally","Number of 1 Bits, Reverse Bits, Counting Bits","Power of Two, Hamming Distance, Set Mismatch, Find the Difference","Single Number I/II/III — XOR magic patterns"],
  "Bit Manipulation + Arrays Review": ["Single Number II (bit counting), Sum of Two Integers (add without +)","Bitwise AND of Numbers Range, Total Hamming Distance","Review arrays: attempt Median of Two Sorted Arrays","Review all two-pointer + sliding window + bit patterns"],
  "Hashing": ["HashMap internals, frequency counting template","Valid Anagram, Ransom Note, Word Pattern, Isomorphic Strings","Contains Duplicate II, Intersection of Arrays, Happy Number","Review patterns — what HashMap gives you over brute force"],
  "Hashing · Medium": ["Group Anagrams, Top K Frequent Elements","4Sum II, Contiguous Array, Sort Characters By Frequency","Insert Delete GetRandom O(1), Repeated DNA Sequences","Pairs of Songs Divisible by 60, Frequency of Most Frequent Element"],
  "Hashing + String Intro": ["Finish hashing: Brick Wall, Minimum Deletions for Unique Frequencies","String basics: Valid Palindrome, Reverse String, Length of Last Word","First Unique Character, Detect Capital, Reverse Words in String","Review all hashing patterns + frequency map template"],
  "String · Sliding Window": ["Longest Substring Without Repeating Characters (shrink on repeat)","Permutation in String (fixed window of size len(s1))","Find All Anagrams in String, Longest Repeating Character Replacement","Minimum Window Substring — hardest sliding window string problem"],
  "String · Medium": ["Decode String (stack + recursion), Encode/Decode Strings","Integer to Roman, Roman to Integer, Multiply Strings","Longest Palindromic Substring (expand from center)","Palindromic Substrings, String Compression, Compare Version Numbers"],
  "String · Medium/Hard": ["Partition Labels (greedy), Word Break (DP intro)","Minimum Remove to Make Valid Parentheses, Simplify Path","Regular Expression Matching, Wildcard Matching","Minimum Window Substring re-attempt + Text Justification (hard)"],
  "Hashing + String Review": ["Re-attempt minimum window substring from scratch","Review: when to use HashMap, array count, or Set","Scramble String deep-dive (DP/backtracking)","Write string pattern cheatsheet: anagram/palindrome/window templates"],
  "Sorting": ["Merge Sort from scratch — code and trace through","Quick Sort from scratch — code and choose pivot strategies","Sort Colors, Largest Number, Custom Sort String","H-Index, Sort List (linked list merge sort)"],
  "Sorting · Medium/Hard": ["K Closest Points (quick select), Queue Reconstruction by Height","Car Fleet, Minimum Number of Arrows to Burst Balloons","Wiggle Sort II, Pancake Sorting, Count of Range Sum (hard)","Maximum Gap (radix sort), Minimum Cost to Hire K Workers"],
  "Linked List · Basics": ["Build singly linked list from scratch: Node, insert, delete, print","Reverse Linked List (iterative + recursive), Merge Two Sorted Lists","Linked List Cycle detection, Middle of Linked List","Remove Nth from End, Palindrome Linked List"],
  "Linked List · Two Pointers": ["Floyd's cycle detection — Linked List Cycle II (find start)","Intersection of Two Linked Lists — length equalization trick","Odd Even Linked List, Rotate List, Reorder List","Re-attempt all fast/slow pointer problems timed"],
  "Linked List · Medium": ["Add Two Numbers, Add Two Numbers II","Copy List with Random Pointer (hashmap + two-pass)","Remove Duplicates from Sorted List II, Partition List","Reverse Linked List II, Swap Nodes in Pairs, Swapping Nodes"],
  "Linked List · Hard": ["Merge K Sorted Lists — heap approach + divide & conquer","Reverse Nodes in K-Group — tricky pointer manipulation","LRU Cache full implementation — DLL + HashMap","LFU Cache (very hard — optional extension)"],
  "Sorting + Linked List Review": ["Re-implement LRU Cache from scratch without looking","Merge K Sorted Lists without help","Review all linked list pointer manipulation patterns","Write linked list reversal template + two-pointer template"],
  "Recursion": ["Recursion fundamentals, call stack visualization","Fibonacci (memo), Climbing Stairs, Pow(x,n)","Merge Two Sorted Lists recursively, Reverse Linked List recursively","Flatten Nested List Iterator, K-th Symbol in Grammar"],
  "Recursion · Divide & Conquer": ["Merge Sort and Quick Sort recursive implementations","Count of Range Sum (divide and conquer)","Different Ways to Add Parentheses","Largest Rectangle in Histogram (D&C approach)"],
  "Stack · Basics": ["Implement stack with array + linked list","Min Stack, Valid Parentheses, Evaluate Reverse Polish Notation","Daily Temperatures — classic monotonic stack intro","Next Greater Element I — using stack + hashmap"],
  "Stack · Monotonic Stack": ["Monotonic stack pattern — decreasing and increasing variants","Sum of Subarray Minimums, Largest Rectangle in Histogram","Online Stock Span, 132 Pattern","Remove K Digits, Monotone Increasing Digits"],
  "Stack · Medium/Hard": ["Basic Calculator I and II — operator stack pattern","Decode String (stack), Asteroid Collision","Maximum Frequency Stack — bucket-based frequency counting","Number of Visible People in a Queue (hard)"],
  "Queue · Heap/Priority Queue": ["Min-heap vs max-heap — Python heapq module","Kth Largest in Stream, Last Stone Weight, K Closest Points to Origin","Top K Frequent Words, Task Scheduler","Reorganize String, Seat Reservation Manager"],
  "Queue · Medium/Hard": ["Find Median from Data Stream — two heaps trick","IPO (greedy + two heaps), Minimum Cost to Connect Sticks","Process Tasks Using Servers, Single-Threaded CPU","Minimum Number of Refueling Stops (hard DP/heap)"],
  "Trees · Basics & Traversals": ["Build BST from scratch: Node, insert, search, delete","Inorder/Preorder/Postorder iterative (explicit stack) + recursive","Max Depth, Min Depth, Diameter of Binary Tree","Invert Binary Tree, Same Tree, Symmetric Tree, Subtree of Another Tree"],
  "Trees · BFS / Level Order": ["Level Order Traversal (queue), Zigzag Level Order","Binary Tree Right Side View, Average of Levels","Find Largest Value in Each Row, Binary Tree Level Order II","Count Complete Tree Nodes, Populating Next Right Pointers"],
  "Trees · BST": ["BST validation — in-order must be sorted","Kth Smallest in BST, Lowest Common Ancestor of BST","Binary Search Tree Iterator (Morris traversal / stack)","Convert Sorted Array to BST, Serialize/Deserialize BST"],
  "Trees · Path Problems": ["Path Sum I (root-to-leaf), Path Sum II (all such paths)","Path Sum III (any subpath — prefix sum trick)","Sum Root to Leaf Numbers, Binary Tree Maximum Path Sum","House Robber III, Count Good Nodes in Binary Tree"],
  "Trees · Advanced + Trie": ["Serialize and Deserialize Binary Tree (DFS string encoding)","Implement Trie: insert O(m), search O(m), startsWith O(m)","Add and Search Word (Trie + wildcard)","Word Search II (Trie pruning — much faster than naive)"],
  "Traversal · BFS on Graphs": ["BFS template: queue + visited set, level-by-level","Flood Fill, Number of Islands (BFS approach)","Rotting Oranges (multi-source BFS), 01 Matrix","Nearest Exit from Entrance in Maze, Minimum Genetic Mutation"],
  "Traversal · DFS + Multi-source BFS": ["DFS template: recursive + iterative with stack","Max Area of Island, Surrounded Regions (boundary DFS)","Pacific Atlantic Water Flow (two BFS from each ocean)","Word Search (DFS grid backtracking)"],
  "Traversal · BFS Shortest Path": ["BFS for unweighted shortest path — when to use","Shortest Bridge (two-island BFS), Jump Game III","Clone Graph (BFS + hashmap cloning)","Bus Routes (BFS on routes, not stops), Word Ladder"],
  "Trees + Traversal Review": ["Re-attempt Binary Tree Max Path Sum and Word Ladder II","Implement BFS and DFS iteratively from memory","When to use BFS vs DFS — decision cheatsheet","Attempt Word Ladder II (hardest traversal problem)"],
  "Backtracking · Subsets & Permutations": ["Backtracking template: choose → recurse → unchoose","Subsets (power set), Subsets II (skip duplicates with sort)","Combinations, Combination Sum (unlimited reuse)","Permutations, Permutations II (skip duplicate perms)"],
  "Backtracking · Classic Problems": ["Generate Parentheses — valid at every step","Letter Combinations of Phone Number","Palindrome Partitioning — backtrack + DP check","Restore IP Addresses, Combination Sum II"],
  "Backtracking · Hard": ["N-Queens — constraint satisfaction with column/diagonal tracking","N-Queens II (count solutions)","Sudoku Solver — hardest backtracking with 9×9 constraints","Word Break II — backtracking + memoization"],
  "Graph · Fundamentals": ["Adjacency list vs matrix — implement both","BFS/DFS on graph: topological sort via DFS (Kahn's)","Course Schedule I (cycle detection), Course Schedule II (ordering)","Find Eventual Safe States, Keys and Rooms"],
  "Graph · Union-Find": ["Union-Find with path compression + union by rank","Redundant Connection, Number of Connected Components","Accounts Merge — union by email","Graph Valid Tree (union-find cycle check)"],
  "Graph · Shortest Paths": ["Dijkstra's with priority queue — Network Delay Time","Cheapest Flights Within K Stops (modified Dijkstra/Bellman-Ford)","Path With Minimum Effort, Number of Enclaves","Is Graph Bipartite, Possible Bipartition (BFS 2-coloring)"],
  "Graph · Advanced": ["Kruskal's MST (sort edges + union-find), Prim's MST","Critical Connections in Network — Tarjan's bridge algorithm","Reconstruct Itinerary — Eulerian path (DFS post-order)","Sequence Reconstruction, Parallel Courses"],
  "Graph · Hard + Review": ["Shortest Path Visiting All Nodes (BFS + bitmask DP)","Word Ladder II (BFS levels + DFS path rebuild)","Similar String Groups (union-find with string comparison)","Graph algorithm cheatsheet: when to use each algorithm"],
  "DP · 1D — Fibonacci Family": ["Memoization: top-down with @cache decorator","Tabulation: bottom-up array building","Climbing Stairs, House Robber, House Robber II","Min Cost Climbing Stairs, Jump Game (greedy DP), Tribonacci"],
  "DP · 1D — Sequences": ["LIS — O(n²) DP then O(n log n) binary search approach","Coin Change (min coins), Perfect Squares (BFS vs DP)","Decode Ways (counting paths), Word Break","Delete and Earn, Arithmetic Slices, Domino and Tromino Tiling"],
  "DP · 2D — Grid Paths": ["Unique Paths (combinatorics shortcut + DP)","Unique Paths II with obstacles, Minimum Path Sum","Triangle (top-down + bottom-up), Maximal Square","Minimum Falling Path Sum, Out of Boundary Paths"],
  "DP · Knapsack Variants": ["0/1 Knapsack — item in/out decision per row","Partition Equal Subset Sum (reframe as knapsack)","Target Sum (count +/- assignments), Last Stone Weight II","Coin Change II (unbounded knapsack — order matters)"],
  "DP · Interval DP": ["Interval DP template: for length, for i, j = i+length-1","Burst Balloons — dp[i][j] = max coins for subarray i..j","Palindrome Partitioning II — min cuts","Remove Boxes (3D DP), Stone Game (interval DP)"],
  "DP · Subsequence DP": ["LCS — O(mn) 2D DP table","Edit Distance — alignment DP classic","Longest Palindromic Subsequence, Distinct Subsequences","Interleaving String, Scramble String (memo recursion)"],
  "DP · State Machine": ["State machine DP: define states and transitions explicitly","Stock series: Cooldown, Fee, at most k transactions","Paint House: dp[i][color] = min cost through house i with that color","Paint House II (k colors — O(nk) optimized)"],
  "DP · Hard Problems": ["Maximum Profit in Job Scheduling: sort by end + binary search + DP","Number of Ways to Form Target String Given Dictionary","Minimum Number of Removals to Make Mountain Array","Tallest Billboard (hard knapsack variant)"],
  "DP · Review + Mock": ["Pick 5 DP problems from different types — solve without notes","Timed: 2 medium DPs in 45 min each","Identify: given a problem, what DP type is it? (5-question drill)","Final DP cheatsheet: templates for all 6 DP types"],
  "OOP Fundamentals": ["Classes, objects, __init__, instance vs class variables","Inheritance chains, super(), method resolution order (MRO)","Polymorphism (overriding + duck typing) + Encapsulation (__)","Aggregation vs Composition vs Association — draw diagrams for each"],
  "Design Principles + UML": ["SOLID: one focused example per principle in Python","DRY, KISS, YAGNI, Law of Demeter with code examples","Draw class diagram: User-Order-Product with all relationship types","Sequence diagram: login flow + state diagram: order lifecycle"],
  "Creational + Structural Patterns": ["Singleton (thread-safe), Factory Method, Abstract Factory","Builder pattern (step-by-step construction), Prototype (deep copy)","Adapter, Facade, Decorator (coffee example)","Proxy (lazy loading), Composite (file tree), Bridge, Flyweight"],
  "Behavioral Patterns": ["Observer (event system), Strategy (interchangeable algorithms)","Command (undo/redo), State machine (vending machine)","Template Method, Iterator, Chain of Responsibility","Mediator (chat room), Memento (snapshots), Visitor"],
  "LLD Interview Questions — Easy/Medium": ["Design Parking Lot: full class hierarchy + allocate/free logic","Design LRU Cache: DLL + HashMap — implement completely","Design Tic Tac Toe: board, turn management, winner detection","Design Snake and Ladder + Task Management System skeleton"],
  "LLD Interview Questions — Hard": ["Design Chess: Piece hierarchy, move validation, game loop","Design Splitwise: expense model, split types, balance computation","Design Elevator System: state machine + controller + scheduling","Review all LLD systems — practice explaining design choices aloud"],
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
// Sessions 1-3 are DSA. Session 4 rotates through LLD curriculum daily.
const LLD_BY_DAY: Record<number, string> = {
  1:  "LLD: OOP — Classes, objects, __init__, instance vs class vars",
  2:  "LLD: OOP — Inheritance chains, super(), method resolution order",
  3:  "LLD: OOP — Polymorphism: method overriding + duck typing",
  4:  "LLD: OOP — Encapsulation: private attrs, @property decorator",
  5:  "LLD: OOP — Abstraction: ABC module, abstract methods",
  6:  "LLD: OOP — Aggregation vs Composition vs Association",
  7:  "LLD: OOP — Interfaces via ABC + Protocols (structural subtyping)",
  8:  "LLD: OOP — Static, instance, class methods — when to use each",
  9:  "LLD: OOP — Magic methods: __str__, __repr__, __eq__, __hash__",
  10: "LLD: Principles — Single Responsibility Principle (SRP)",
  11: "LLD: Principles — Open/Closed Principle (OCP)",
  12: "LLD: Principles — Liskov Substitution Principle (LSP)",
  13: "LLD: Principles — Interface Segregation Principle (ISP)",
  14: "LLD: Principles — Dependency Inversion Principle (DIP)",
  15: "LLD: Principles — DRY: eliminate duplication with helpers/base classes",
  16: "LLD: Principles — KISS & YAGNI: simplicity over cleverness",
  17: "LLD: Principles — Law of Demeter: only talk to immediate friends",
  18: "LLD: Principles — Composition over Inheritance in practice",
  19: "LLD: Principles — SOLID review: critique a real code example",
  20: "LLD: UML — Class diagrams: classes, attributes, methods, visibility",
  21: "LLD: UML — Class relationships: association, aggregation, composition",
  22: "LLD: UML — Sequence diagrams: lifelines, messages, activation boxes",
  23: "LLD: UML — Use case diagrams: actors, include, extend",
  24: "LLD: UML — Activity + State diagrams: control flow, state machines",
  25: "LLD: Creational — Singleton: thread-safe Python implementation",
  26: "LLD: Creational — Factory Method + Abstract Factory",
  27: "LLD: Creational — Builder: step-by-step object construction",
  28: "LLD: Creational — Prototype: deep copy, cloning pattern",
  29: "LLD: Creational — Review: when to use each creational pattern",
  30: "LLD: Structural — Adapter: interface translation between incompatible classes",
  31: "LLD: Structural — Facade: unified interface to a complex subsystem",
  32: "LLD: Structural — Decorator: wrap objects to add behaviour dynamically",
  33: "LLD: Structural — Proxy: lazy loading, access control, logging",
  34: "LLD: Structural — Composite: tree structures (file system, UI trees)",
  35: "LLD: Structural — Bridge: decouple abstraction from implementation",
  36: "LLD: Structural — Flyweight: shared objects to save memory + review",
  37: "LLD: Behavioral — Observer: pub/sub, event system implementation",
  38: "LLD: Behavioral — Strategy: interchangeable algorithms at runtime",
  39: "LLD: Behavioral — Command: encapsulate actions, support undo/redo",
  40: "LLD: Behavioral — State: vending machine state machine",
  41: "LLD: Behavioral — Template Method: define skeleton, subclasses fill steps",
  42: "LLD: Behavioral — Iterator: uniform collection traversal",
  43: "LLD: Behavioral — Mediator: centralise communication between objects",
  44: "LLD: Behavioral — Memento: snapshot + restore object state",
  45: "LLD: Behavioral — Chain of Responsibility: pass request along handler chain",
  46: "LLD: Behavioral — Visitor + Behavioral patterns review",
  47: "LLD: Interview Tips — approach, structure, how to communicate design",
  48: "LLD: Easy — Design Parking Lot: full class hierarchy + allocate/free logic",
  49: "LLD: Easy — Design LRU Cache: DLL + HashMap full implementation",
  50: "LLD: Easy — Design Tic Tac Toe: board, turns, winner detection",
  51: "LLD: Easy — Design Snake and Ladder: board, dice, movement logic",
  52: "LLD: Easy — Design Vending Machine: state machine + inventory",
  53: "LLD: Medium — Design ATM: account, card, transaction, PIN flow",
  54: "LLD: Medium — Design Movie Ticket Booking: seats, reservations, pricing",
  55: "LLD: Medium — Design Library Management: books, members, fines",
  56: "LLD: Medium — Design Hotel Booking: rooms, availability, billing",
  57: "LLD: Medium — Design Online Shopping Cart: items, checkout, orders",
  58: "LLD: Medium — Design Ride Sharing (Uber-like): driver, rider, matching",
  59: "LLD: Medium — Design Social Media Feed: posts, likes, follows, ranking",
  60: "LLD: Hard — Design Chess: pieces, move validation, game loop",
};

export const SCHEDULE: DayPlan[] = PLANS.map((p) => {
  const [s1, s2, s3] = getSessionLabels(p.topic);
  const lldS4 = LLD_BY_DAY[p.day] ?? `LLD: Review day ${p.day} concepts`;
  return { ...p, sessions: makeSessions(s1, s2, s3, lldS4) };
});

export const PHASES = [
  { phase: 1, name: "Arrays & Bit Manipulation", days: "1–7",   color: "#e67e22" },
  { phase: 2, name: "Hashing & Strings",         days: "8–14",  color: "#8e44ad" },
  { phase: 3, name: "Sorting & Linked Lists",    days: "15–21", color: "#2980b9" },
  { phase: 4, name: "Recursion, Stack & Queue",  days: "22–28", color: "#27ae60" },
  { phase: 5, name: "Trees & Traversal",         days: "29–37", color: "#16a085" },
  { phase: 6, name: "Backtracking & Graph",      days: "38–45", color: "#c0392b" },
  { phase: 7, name: "Dynamic Programming",       days: "46–54", color: "#d35400" },
  { phase: 8, name: "LLD",                       days: "55–60", color: "#2c3e50" },
];
