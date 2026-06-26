"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MotionButton } from "@/components/motion-button";
import { completeReview } from "./actions";

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  if (difficulty === "EASY") {
    return (
      <div className="inline-flex items-center gap-1.5 self-start rounded-full border-2 border-foreground px-2.5 py-1">
        <div className="h-[7px] w-[7px] shrink-0 rounded-full border-2 border-foreground" />
        <span className="text-[9px] font-bold tracking-[0.5px]">EASY</span>
      </div>
    );
  }
  if (difficulty === "MEDIUM") {
    return (
      <div className="inline-flex items-center gap-1.5 self-start rounded-full border-2 border-foreground px-2.5 py-1">
        <div className="-mt-px h-0 w-0 shrink-0 border-b-[9px] border-l-[5px] border-r-[5px] border-b-foreground border-l-transparent border-r-transparent" />
        <span className="text-[9px] font-bold tracking-[0.5px]">MEDIUM</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 self-start rounded-full border-2 border-foreground px-2.5 py-1">
      <div className="h-[7px] w-[7px] shrink-0 border-2 border-foreground" />
      <span className="text-[9px] font-bold tracking-[0.5px]">HARD</span>
    </div>
  );
}

export function DueReviewRow({
  review,
  isOverdue,
  daysAgo,
  index,
}: {
  review: {
    id: string;
    dayOffset: number;
    problem: { id: string; title: string; difficulty: string };
  };
  isOverdue: boolean;
  daysAgo?: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, ease: "easeOut" }}
      className="overflow-hidden rounded-xl border-[2.5px] border-foreground bg-surface shadow-[3px_3px_0_#111]"
    >
      <div className="flex items-stretch">
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {isOverdue ? (
              <span className="shrink-0 rounded-[4px] bg-danger px-2 py-1 text-[9px] font-bold tracking-[0.8px] text-white">
                OVERDUE
              </span>
            ) : (
              <span className="shrink-0 rounded-[4px] border-2 border-foreground px-2 py-1 text-[9px] font-bold tracking-[0.8px]">
                DUE TODAY
              </span>
            )}
            {daysAgo !== undefined && daysAgo > 0 && (
              <span className="text-[11px] text-muted">
                {daysAgo} day{daysAgo !== 1 ? "s" : ""} ago
              </span>
            )}
          </div>
          <Link
            href={`/problems/${review.problem.id}`}
            className="text-base font-bold leading-tight text-foreground hover:underline"
          >
            {review.problem.title}
          </Link>
          <DifficultyBadge difficulty={review.problem.difficulty} />
          <div className="mt-1 space-y-2">
            <form action={completeReview.bind(null, review.id, "DONE")} className="space-y-2">
              <textarea
                name="notes"
                rows={2}
                placeholder="Any new insight or approach? (optional)"
                className="w-full resize-none rounded-lg border-2 border-[#ddd] bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-foreground focus:outline-none"
              />
              <MotionButton
                type="submit"
                className="w-full rounded-lg border-[2.5px] border-foreground bg-foreground py-2 text-xs font-bold tracking-[0.3px] text-background"
              >
                SOLVED
              </MotionButton>
            </form>
            <form action={completeReview.bind(null, review.id, "SKIPPED")}>
              <MotionButton
                type="submit"
                className="w-full rounded-lg border-[2.5px] border-foreground bg-background py-2 text-xs font-semibold text-foreground"
              >
                SKIP
              </MotionButton>
            </form>
          </div>
        </div>

        {isOverdue && (
          <div className="flex w-[76px] shrink-0 flex-col items-center justify-center gap-2 border-l-[2.5px] border-foreground bg-[#FEF0EF] p-3">
            <div className="relative rounded-[9px] border-[2.5px] border-foreground bg-danger px-2 py-1.5 text-center">
              <p className="font-display text-[15px] leading-tight tracking-[1px] text-white">
                HEY!
                <br />
                LOOK!
              </p>
              <span className="absolute -bottom-[12px] left-1/2 -translate-x-1/2 border-l-[7px] border-r-[7px] border-t-[12px] border-l-transparent border-r-transparent border-t-foreground" />
              <span className="absolute -bottom-[8.5px] left-1/2 -translate-x-1/2 border-l-[5.5px] border-r-[5.5px] border-t-[8.5px] border-l-transparent border-r-transparent border-t-danger" />
            </div>
            <svg width="48" height="64" viewBox="0 0 60 82" fill="none">
              <circle cx="30" cy="12" r="9" stroke="#E8342A" strokeWidth="2.5" fill="#FEF0EF" />
              <line x1="30" y1="21" x2="30" y2="52" stroke="#E8342A" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="30" y1="30" x2="2" y2="27" stroke="#E8342A" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="30" y1="30" x2="47" y2="46" stroke="#E8342A" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="30" y1="52" x2="17" y2="71" stroke="#E8342A" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="30" y1="52" x2="43" y2="71" stroke="#E8342A" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}
