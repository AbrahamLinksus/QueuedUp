"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { MotionButton } from "@/components/motion-button";
import { completeReview } from "./actions";

const DIFFICULTY_STYLE: Record<string, string> = {
  EASY: "text-success",
  MEDIUM: "text-warning",
  HARD: "text-danger",
};

export function DueReviewRow({
  review,
  isOverdue,
  index,
}: {
  review: {
    id: string;
    dayOffset: number;
    problem: { id: string; title: string; difficulty: string };
  };
  isOverdue: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-3"
    >
      <div className="flex items-center gap-3 text-sm">
        <span className={isOverdue ? "text-danger" : "text-warning"}>
          {isOverdue ? "Overdue" : "Due today"}
        </span>
        <Link href={`/problems/${review.problem.id}`} className="text-foreground hover:text-accent">
          {review.problem.title}
        </Link>
        <span className={DIFFICULTY_STYLE[review.problem.difficulty]}>
          {review.problem.difficulty}
        </span>
        <span className="text-muted">Day +{review.dayOffset}</span>
      </div>
      <div className="flex gap-2">
        <form action={completeReview.bind(null, review.id, "DONE")}>
          <MotionButton
            type="submit"
            className="rounded-md bg-success/15 px-3 py-1.5 text-sm text-success hover:bg-success/25"
          >
            Solved
          </MotionButton>
        </form>
        <form action={completeReview.bind(null, review.id, "SKIPPED")}>
          <MotionButton
            type="submit"
            className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:bg-white/5"
          >
            Skip
          </MotionButton>
        </form>
      </div>
    </motion.div>
  );
}
