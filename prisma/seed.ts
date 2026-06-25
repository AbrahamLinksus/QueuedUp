import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const PRESET_TAGS = [
  "Array",
  "String",
  "Hash Table",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Queue",
  "Linked List",
  "Binary Search",
  "Tree",
  "Binary Tree",
  "Binary Search Tree",
  "Graph",
  "BFS",
  "DFS",
  "Heap",
  "Trie",
  "Backtracking",
  "Dynamic Programming",
  "Greedy",
  "Sorting",
  "Bit Manipulation",
  "Math",
  "Recursion",
  "Union Find",
  "Topological Sort",
  "Matrix",
  "Interval",
  "Monotonic Stack",
  "Prefix Sum",
];

async function main() {
  for (const name of PRESET_TAGS) {
    await db.tag.upsert({
      where: { name },
      update: { isPreset: true },
      create: { name, isPreset: true },
    });
  }
  console.log(`Seeded ${PRESET_TAGS.length} preset tags.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
