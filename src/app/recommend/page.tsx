import { connection } from "next/server";
import Link from "next/link";
import { getCurrentUserId } from "@/lib/session";
import { getRecommendations, PREREQS } from "@/lib/recommend";
import type { TopicStat } from "@/lib/recommend";
import type { MainTopic } from "@/lib/topics";

const DIFF_COLOR: Record<string, string> = {
  EASY: "#16a34a",
  MEDIUM: "#b45309",
  HARD: "#dc2626",
};

const DIFF_LABEL: Record<string, string> = {
  EASY: "E",
  MEDIUM: "M",
  HARD: "H",
};

function LockIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" className="shrink-0">
      <rect x="1" y="5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="shrink-0">
      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="3,5.5 5,7.5 8,3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TopicRow({ topic }: { topic: TopicStat }) {
  const pct = Math.round(topic.pct * 100);
  const complete = topic.logged === topic.total && topic.total > 0;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
        !topic.unlocked
          ? "opacity-40"
          : topic.isTop
          ? "bg-foreground/5 ring-1 ring-foreground/15"
          : ""
      }`}
    >
      {/* State icon */}
      <span className={complete ? "text-foreground" : topic.unlocked ? "text-foreground/40" : "text-foreground/30"}>
        {complete ? <CheckIcon /> : <LockIcon />}
      </span>

      {/* Topic name */}
      <span className={`flex-1 text-[13px] capitalize ${topic.unlocked ? "text-foreground font-medium" : "text-muted"}`}>
        {topic.name}
        {topic.isTop && !complete && (
          <span className="ml-2 rounded-full bg-foreground px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-background">
            next
          </span>
        )}
      </span>

      {/* Count */}
      <span className="shrink-0 text-[11px] text-muted tabular-nums">
        {topic.logged}/{topic.total}
      </span>

      {/* Bar */}
      <div className="w-16 shrink-0 overflow-hidden rounded-full bg-foreground/10 h-1.5">
        {topic.logged > 0 && (
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: complete ? "#111" : topic.isTop ? "#111" : "#888",
            }}
          />
        )}
      </div>
    </div>
  );
}

function PrereqNote({ topic }: { topic: MainTopic }) {
  const prereqs = PREREQS[topic];
  if (prereqs.length === 0) return null;
  return (
    <p className="text-xs text-muted">
      Requires{" "}
      {prereqs.map((p, i) => (
        <span key={p}>
          <span className="capitalize font-medium text-foreground">{p}</span>
          {i < prereqs.length - 1 ? " + " : ""}
        </span>
      ))}
    </p>
  );
}

export default async function RecommendPage() {
  await connection();
  const userId = await getCurrentUserId();
  const { topics, recommendations, topTopic } = await getRecommendations(userId);

  const totalLogged = topics.reduce((s, t) => s + t.logged, 0);
  const totalSheet = topics.reduce((s, t) => s + t.total, 0);

  return (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[380px_1fr] md:items-start md:gap-x-6 md:gap-y-4">
      {/* Header */}
      <div className="md:col-start-1 md:row-start-1">
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">
          FIND
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {totalLogged} of {totalSheet} problems logged
        </p>
      </div>

      {/* Topic coverage map */}
      <div className="md:col-start-1 md:row-start-2">
        <div className="rounded-xl border-[2.5px] border-foreground bg-surface shadow-[3px_3px_0_#111]">
          <p className="border-b border-foreground/10 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
            Topic Map
          </p>
          <div className="p-2 space-y-0.5">
            {topics.map((t) => (
              <TopicRow key={t.name} topic={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="md:col-start-2 md:row-start-1 md:row-span-2">
        {recommendations.length === 0 ? (
          <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-8 shadow-[3px_3px_0_#111] text-center">
            <p className="font-display text-2xl tracking-widest text-foreground">ALL DONE</p>
            <p className="mt-2 text-sm text-muted">You've logged every problem in the sheet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Top topic header */}
            {topTopic && (
              <div>
                <h2 className="font-display text-[22px] tracking-[1.5px] text-foreground">
                  NEXT UP
                </h2>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-sm font-medium capitalize text-foreground">{topTopic}</span>
                  <PrereqNote topic={topTopic} />
                </div>
              </div>
            )}

            {/* Problem cards */}
            <div className="overflow-hidden rounded-xl border-[2.5px] border-foreground bg-surface shadow-[3px_3px_0_#111]">
              {recommendations.map((rec, i) => {
                const color = DIFF_COLOR[rec.difficulty] ?? "#666";
                const showTopicBadge = i === 0 || rec.topic !== recommendations[i - 1].topic;
                return (
                  <div
                    key={rec.id}
                    className={`group flex items-center gap-3 px-4 py-3 ${
                      i < recommendations.length - 1 ? "border-b border-[#eee]" : ""
                    }`}
                  >
                    {/* Difficulty */}
                    <span className="shrink-0 text-[10px] font-bold w-3" style={{ color }}>
                      {DIFF_LABEL[rec.difficulty] ?? "?"}
                    </span>

                    {/* Title + topic change indicator */}
                    <div className="min-w-0 flex-1">
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-[14px] font-medium text-foreground hover:underline"
                      >
                        {rec.title}
                      </a>
                      {showTopicBadge && rec.topic !== topTopic && (
                        <span className="text-[10px] capitalize text-muted">{rec.topic}</span>
                      )}
                    </div>

                    {/* Log button */}
                    <Link
                      href={rec.logUrl}
                      className="shrink-0 rounded-full border border-foreground/20 px-2.5 py-1 text-[10px] font-semibold text-muted opacity-0 transition-all group-hover:opacity-100 hover:border-foreground hover:text-foreground"
                    >
                      + Log
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Unlock progress hint */}
            {(() => {
              const lockedTopics = topics.filter((t) => !t.unlocked);
              if (lockedTopics.length === 0) return null;
              const nextUnlock = lockedTopics.find((t) =>
                PREREQS[t.name].every((p) => {
                  const cov = topics.find((x) => x.name === p);
                  return (cov?.logged ?? 0) >= 3;
                })
              );
              if (!nextUnlock) return null;
              const blocking = PREREQS[nextUnlock.name].map((p) => {
                const cov = topics.find((x) => x.name === p)!;
                return { name: p, logged: cov.logged, needed: 5 };
              });
              return (
                <div className="rounded-xl border-[2.5px] border-foreground/20 bg-surface p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted mb-2">
                    Unlocks soon
                  </p>
                  <p className="text-[13px] font-medium capitalize text-foreground mb-2">
                    {nextUnlock.name}
                  </p>
                  <div className="space-y-1.5">
                    {blocking.map((b) => (
                      <div key={b.name} className="flex items-center gap-2">
                        <span className="w-24 shrink-0 text-[11px] capitalize text-muted">{b.name}</span>
                        <div className="flex-1 overflow-hidden rounded-full bg-foreground/10 h-1.5">
                          <div
                            className="h-full rounded-full bg-foreground/40"
                            style={{ width: `${Math.min((b.logged / b.needed) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-[11px] text-muted tabular-nums">
                          {b.logged}/{b.needed}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
