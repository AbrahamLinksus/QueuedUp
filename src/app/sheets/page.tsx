import { connection } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";
import { MAIN_TOPICS } from "@/lib/topics";
import { TopicSection } from "./topic-section";

export default async function SheetsPage() {
  await connection();
  const userId = await getCurrentUserId();

  const [allProblems, userProblems] = await Promise.all([
    db.sheetProblem.findMany({ orderBy: { order: "asc" } }),
    db.problem.findMany({ where: { userId }, select: { url: true } }),
  ]);

  // Normalize for comparison: lowercase, strip query/hash, strip trailing slash
  const normalizeUrl = (url: string) =>
    url.toLowerCase().split(/[?#]/)[0].replace(/\/$/, "");

  const loggedUrls = new Set(userProblems.map((p) => normalizeUrl(p.url)));

  // Group by topic in canonical order
  const byTopic = new Map<string, typeof allProblems>();
  for (const topic of MAIN_TOPICS) byTopic.set(topic, []);
  for (const p of allProblems) {
    const bucket = byTopic.get(p.topic);
    if (bucket) bucket.push(p);
    // unknown topic → ignore (shouldn't happen)
  }

  const totalLogged = allProblems.filter((p) => loggedUrls.has(normalizeUrl(p.url))).length;

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div>
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">
          SHEET
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {allProblems.length} problems · {totalLogged} logged
        </p>
      </div>

      {/* Directory tree */}
      <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-3 shadow-[3px_3px_0_#111]">
        <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
          DSA Problem Bank
        </p>
        <div className="space-y-0.5">
          {MAIN_TOPICS.map((topic, i) => {
            const problems = byTopic.get(topic) ?? [];
            if (problems.length === 0) return null;
            return (
              <TopicSection
                key={topic}
                topic={topic}
                problems={problems}
                loggedUrls={loggedUrls}
                defaultOpen={i === 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
