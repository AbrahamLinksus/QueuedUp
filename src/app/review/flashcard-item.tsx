"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MotionButton } from "@/components/motion-button";
import { Markdown } from "@/components/markdown";
import { CodeBlock } from "@/components/code-block";
import { reviewFlashcard } from "./actions";

const DIFFICULTY_STYLE: Record<string, string> = {
  EASY: "text-success",
  MEDIUM: "text-warning",
  HARD: "text-danger",
};

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
            className="rounded-lg border border-border bg-surface p-3"
          >
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="flex w-full cursor-pointer items-center justify-between text-sm"
            >
              <span className="flex items-center gap-3">
                <span className="text-foreground">{problem.title}</span>
                <span className={DIFFICULTY_STYLE[problem.difficulty]}>{problem.difficulty}</span>
              </span>
              <span className="text-accent">Tap to reveal</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-2 rounded-lg border border-accent/40 bg-surface p-3"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-3">
                <span className="text-foreground">{problem.title}</span>
                <span className={DIFFICULTY_STYLE[problem.difficulty]}>{problem.difficulty}</span>
              </span>
              <button type="button" onClick={() => setRevealed(false)} className="text-xs text-muted">
                Flip back
              </button>
            </div>
            {entry?.notes && <Markdown>{entry.notes}</Markdown>}
            {entry?.codeSnippet && <CodeBlock code={entry.codeSnippet} language={entry.codeLanguage} />}
            <div className="flex gap-2 pt-1">
              <form action={reviewFlashcard.bind(null, problem.id, true)}>
                <MotionButton
                  type="submit"
                  className="rounded-md bg-success/15 px-3 py-1.5 text-sm text-success hover:bg-success/25"
                >
                  Remembered
                </MotionButton>
              </form>
              <form action={reviewFlashcard.bind(null, problem.id, false)}>
                <MotionButton
                  type="submit"
                  className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:bg-white/5"
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
