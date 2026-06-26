"use client";

import Link from "next/link";
import { motion } from "motion/react";

type Problem = {
  id: string;
  title: string;
  difficulty: string;
  status: string;
  createdAt: Date;
  tags: { name: string }[];
  _count: { entries: number };
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  if (difficulty === "EASY") {
    return (
      <div className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-foreground px-2 py-0.5">
        <div className="h-[6px] w-[6px] shrink-0 rounded-full border-[1.5px] border-foreground" />
        <span className="text-[9px] font-bold">EASY</span>
      </div>
    );
  }
  if (difficulty === "MEDIUM") {
    return (
      <div className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-foreground px-2 py-0.5">
        <div className="h-0 w-0 shrink-0 border-b-[7px] border-l-[4px] border-r-[4px] border-b-foreground border-l-transparent border-r-transparent" />
        <span className="text-[9px] font-bold">MED</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-foreground px-2 py-0.5">
      <div className="h-[6px] w-[6px] shrink-0 border-[1.5px] border-foreground" />
      <span className="text-[9px] font-bold">HARD</span>
    </div>
  );
}

function relativeDate(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function ProblemsCardGrid({ problems }: { problems: Problem[] }) {
  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border-[2.5px] border-foreground bg-surface py-16 shadow-[3px_3px_0_#111]">
        <p className="text-sm text-muted">No problems match these filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border-[2.5px] border-foreground bg-surface shadow-[3px_3px_0_#111]">
      {problems.map((problem, index) => (
        <motion.div
          key={problem.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.2, ease: "easeOut" }}
          className={`flex flex-col gap-1.5 p-4 ${
            index < problems.length - 1 ? "border-b-[1.5px] border-[#eee]" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/problems/${problem.id}`}
              className="text-[15px] font-bold text-foreground hover:underline"
            >
              {problem.title}
            </Link>
            <div className="flex shrink-0 items-center gap-1.5">
              {problem._count.entries > 0 && (
                <span className="rounded-full bg-foreground px-2 py-1 text-[9px] font-bold text-background">
                  ×{problem._count.entries}
                </span>
              )}
              {problem.status === "MASTERED" ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#111" strokeWidth="1.5" />
                  <polyline
                    points="4.5,8 7,10.5 11.5,5.5"
                    stroke="#111"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#bbb" strokeWidth="1.5" />
                </svg>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={problem.difficulty} />
            {problem.tags.length > 0 && (
              <span className="text-xs text-muted">
                {problem.tags.map((t) => t.name).join(" · ")}
              </span>
            )}
            <span className="ml-auto text-[10px] text-[#aaa]">{relativeDate(problem.createdAt)}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
