"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MotionButton } from "@/components/motion-button";
import { Markdown } from "@/components/markdown";
import { CodeBlock } from "@/components/code-block";
import { reviewFlashcard } from "./actions";

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const labels: Record<string, string> = { EASY: "EASY", MEDIUM: "MED", HARD: "HARD" };
  return (
    <span className="rounded-full border border-foreground/30 px-2 py-0.5 text-[9px] font-bold text-muted">
      {labels[difficulty] ?? difficulty}
    </span>
  );
}

export function FlashcardItem({
  problem,
  entry,
  index,
}: {
  problem: { id: string; title: string; difficulty: string };
  entry?: { notes: string; codeSnippet: string; codeLanguage: string } | null;
  index: number;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25, ease: "easeOut" }}
      style={{ perspective: 1200 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!revealed ? (
          <motion.div
            key="front"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111]"
          >
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="flex w-full cursor-pointer items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="font-medium text-foreground">{problem.title}</span>
                <DifficultyBadge difficulty={problem.difficulty} />
              </span>
              <span className="text-xs font-semibold text-muted underline">Tap to reveal</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-3 rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111]"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="font-medium text-foreground">{problem.title}</span>
                <DifficultyBadge difficulty={problem.difficulty} />
              </span>
              <button
                type="button"
                onClick={() => setRevealed(false)}
                className="text-xs text-muted underline"
              >
                Flip back
              </button>
            </div>
            {entry?.notes && <Markdown>{entry.notes}</Markdown>}
            {entry?.codeSnippet && (
              <CodeBlock code={entry.codeSnippet} language={entry.codeLanguage} />
            )}
            <div className="flex gap-2 pt-1">
              <form action={reviewFlashcard.bind(null, problem.id, true)}>
                <MotionButton
                  type="submit"
                  className="rounded-lg border-[2.5px] border-foreground bg-foreground px-4 py-2 text-xs font-bold text-background"
                >
                  Remembered
                </MotionButton>
              </form>
              <form action={reviewFlashcard.bind(null, problem.id, false)}>
                <MotionButton
                  type="submit"
                  className="rounded-lg border-[2.5px] border-foreground bg-background px-4 py-2 text-xs font-semibold text-foreground"
                >
                  Forgot
                </MotionButton>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
