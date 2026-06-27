import { db } from "@/lib/db";
import type { MainTopic } from "@/lib/topics";

// How many logged problems in a prerequisite topic before dependents unlock
const UNLOCK_THRESHOLD = 5;
const RECOMMEND_COUNT = 5;

// Prerequisite DAG: topic → required topics
export const PREREQS: Record<MainTopic, MainTopic[]> = {
  arrays: [],
  "bit manipulation": ["arrays"],
  hashing: ["arrays"],
  string: ["arrays"],
  sorting: ["arrays"],
  "linked list": ["arrays"],
  recursion: ["arrays"],
  stack: ["linked list"],
  queue: ["linked list"],
  trees: ["queue", "recursion"],
  traversal: ["trees"],
  backtracking: ["trees", "recursion"],
  graph: ["traversal"],
  "dynamic programming": ["backtracking", "recursion"],
};

// Canonical display order that reflects the DAG depth
export const TOPIC_ORDER: MainTopic[] = [
  "arrays",
  "bit manipulation",
  "hashing",
  "string",
  "sorting",
  "linked list",
  "recursion",
  "stack",
  "queue",
  "trees",
  "traversal",
  "backtracking",
  "graph",
  "dynamic programming",
];

export type TopicStat = {
  name: MainTopic;
  total: number;
  logged: number;
  pct: number;
  unlocked: boolean;
  isTop: boolean;
};

export type Recommendation = {
  topic: MainTopic;
  id: string;
  title: string;
  url: string;
  difficulty: string;
  logUrl: string;
};

export async function getRecommendations(userId: string) {
  const [sheetProblems, userProblems] = await Promise.all([
    db.sheetProblem.findMany({ orderBy: { order: "asc" } }),
    db.problem.findMany({ where: { userId }, select: { url: true } }),
  ]);

  const normalizeUrl = (url: string) =>
    url.toLowerCase().split(/[?#]/)[0].replace(/\/$/, "");

  const loggedUrls = new Set(userProblems.map((p) => normalizeUrl(p.url)));

  // Group sheet problems by topic
  const byTopic = new Map<MainTopic, typeof sheetProblems>();
  for (const t of TOPIC_ORDER) byTopic.set(t, []);
  for (const p of sheetProblems) {
    const bucket = byTopic.get(p.topic as MainTopic);
    if (bucket) bucket.push(p);
  }

  // Coverage per topic
  const coverage = new Map<MainTopic, { logged: number; total: number; pct: number }>();
  for (const t of TOPIC_ORDER) {
    const problems = byTopic.get(t) ?? [];
    const logged = problems.filter((p) => loggedUrls.has(normalizeUrl(p.url))).length;
    coverage.set(t, { logged, total: problems.length, pct: problems.length ? logged / problems.length : 0 });
  }

  // Locked / unlocked
  const unlocked = new Map<MainTopic, boolean>();
  for (const t of TOPIC_ORDER) {
    const prereqs = PREREQS[t];
    unlocked.set(
      t,
      prereqs.length === 0 || prereqs.every((p) => (coverage.get(p)?.logged ?? 0) >= UNLOCK_THRESHOLD)
    );
  }

  // Readiness score (only for unlocked topics)
  // score = avgPrereqCoverage × 0.6 + (1 − ownCoverage) × 0.4
  // Higher = stronger prereqs AND more room left to grow → most actionable next topic.
  const scores = new Map<MainTopic, number>();
  for (const t of TOPIC_ORDER) {
    if (!unlocked.get(t)) continue;
    const ownPct = coverage.get(t)!.pct;
    const prereqs = PREREQS[t];
    const avgPrereqPct =
      prereqs.length === 0
        ? 1
        : prereqs.reduce((s, p) => s + (coverage.get(p)?.pct ?? 0), 0) / prereqs.length;
    scores.set(t, avgPrereqPct * 0.6 + (1 - ownPct) * 0.4);
  }

  const rankedTopics = [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  const topTwo = new Set(rankedTopics.slice(0, 2));

  // Surface unlogged problems from the top-ranked topics in DAG order
  const recommendations: Recommendation[] = [];
  for (const topic of rankedTopics) {
    if (recommendations.length >= RECOMMEND_COUNT) break;
    const unlogged = (byTopic.get(topic) ?? []).filter(
      (p) => !loggedUrls.has(normalizeUrl(p.url))
    );
    for (const p of unlogged) {
      if (recommendations.length >= RECOMMEND_COUNT) break;
      const params = new URLSearchParams({ title: p.title, url: p.url, difficulty: p.difficulty, topic });
      recommendations.push({
        topic,
        id: p.id,
        title: p.title,
        url: p.url,
        difficulty: p.difficulty,
        logUrl: `/problems/new?${params}`,
      });
    }
  }

  const topics: TopicStat[] = TOPIC_ORDER.map((t) => ({
    name: t,
    unlocked: unlocked.get(t) ?? false,
    isTop: topTwo.has(t),
    ...coverage.get(t)!,
  }));

  return { topics, recommendations, topTopic: rankedTopics[0] ?? null };
}
