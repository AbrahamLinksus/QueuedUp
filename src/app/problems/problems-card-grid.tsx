"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CodeIllustration } from "@/components/illustrations/code-illustration";

const DIFFICULTY_STYLE: Record<string, string> = {
  EASY: "text-success",
  MEDIUM: "text-warning",
  HARD: "text-danger",
};

const DIFFICULTY_BAR: Record<string, string> = {
  EASY: "bg-success",
  MEDIUM: "bg-warning",
  HARD: "bg-danger",
};

type Problem = {
  id: string;
  title: string;
  difficulty: string;
  status: string;
  createdAt: Date;
  tags: { name: string }[];
};

export function ProblemsCardGrid({ problems }: { problems: Problem[] }) {
  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface py-16">
        <CodeIllustration className="h-16 w-16 text-muted" />
        <p className="text-muted">No problems match these filters yet.</p>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {problems.map((problem, index) => (
        <motion.div
          key={problem.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.25, ease: "easeOut" }}
          whileHover={{ y: -4 }}
          className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-surface"
        >
          <div className={`h-1.5 w-full ${DIFFICULTY_BAR[problem.difficulty]}`} />
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-medium ${DIFFICULTY_STYLE[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="text-muted">
                {problem.status === "MASTERED" ? "Mastered" : "Active review"}
              </span>
            </div>

            <Link
              href={`/problems/${problem.id}`}
              className="font-display block text-base font-bold text-foreground hover:text-primary"
            >
              {problem.title}
            </Link>

            {problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {problem.tags.map((tag) => (
                  <span
                    key={tag.name}
                    className="rounded-full border border-border px-2 py-0.5 text-xs text-muted"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-muted">{problem.createdAt.toLocaleDateString()}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
