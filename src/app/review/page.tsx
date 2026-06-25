import Link from "next/link";
import { db } from "@/lib/db";
import { getDueFlashcards } from "@/lib/flashcards";
import { Markdown } from "@/components/markdown";
import { CodeBlock } from "@/components/code-block";
import { completeReview, reviewFlashcard } from "./actions";

export const dynamic = "force-dynamic";

const DIFFICULTY_STYLE: Record<string, string> = {
  EASY: "text-success",
  MEDIUM: "text-warning",
  HARD: "text-danger",
};

export default async function ReviewPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setHours(23, 59, 59, 999);

  const [dueReviews, upcomingReviews, dueFlashcards] = await Promise.all([
    db.review.findMany({
      where: { status: "PENDING", scheduledFor: { lte: endOfToday } },
      include: { problem: true },
      orderBy: { scheduledFor: "asc" },
    }),
    db.review.findMany({
      where: { status: "PENDING", scheduledFor: { gt: endOfToday } },
      include: { problem: true },
      orderBy: { scheduledFor: "asc" },
      take: 10,
    }),
    getDueFlashcards(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Review</h1>
        <p className="text-sm text-muted">
          {dueReviews.length === 0
            ? "Nothing due right now."
            : `${dueReviews.length} review${dueReviews.length === 1 ? "" : "s"} due.`}
        </p>
      </div>

      <section className="space-y-2">
        {dueReviews.map((review) => {
          const isOverdue = review.scheduledFor < startOfToday;
          return (
            <div
              key={review.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-3"
            >
              <div className="flex items-center gap-3 text-sm">
                <span className={isOverdue ? "text-danger" : "text-warning"}>
                  {isOverdue ? "Overdue" : "Due today"}
                </span>
                <Link
                  href={`/problems/${review.problem.id}`}
                  className="text-foreground hover:text-accent"
                >
                  {review.problem.title}
                </Link>
                <span className={DIFFICULTY_STYLE[review.problem.difficulty]}>
                  {review.problem.difficulty}
                </span>
                <span className="text-muted">Day +{review.dayOffset}</span>
              </div>
              <div className="flex gap-2">
                <form action={completeReview.bind(null, review.id, "DONE")}>
                  <button
                    type="submit"
                    className="rounded-md bg-success/15 px-3 py-1.5 text-sm text-success hover:bg-success/25"
                  >
                    Solved
                  </button>
                </form>
                <form action={completeReview.bind(null, review.id, "SKIPPED")}>
                  <button
                    type="submit"
                    className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:bg-white/5"
                  >
                    Skip
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </section>

      {dueFlashcards.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted">Flashcards</h2>
          <p className="text-xs text-muted">
            Mastered problems — a quick recall check, no need to re-solve.
          </p>
          <div className="space-y-2">
            {dueFlashcards.map((problem) => {
              const entry = problem.entries[0];
              return (
                <details key={problem.id} className="rounded-lg border border-border bg-surface p-3">
                  <summary className="flex cursor-pointer items-center justify-between text-sm">
                    <span className="flex items-center gap-3">
                      <span className="text-foreground">{problem.title}</span>
                      <span className={DIFFICULTY_STYLE[problem.difficulty]}>
                        {problem.difficulty}
                      </span>
                    </span>
                    <span className="text-muted">Tap to reveal</span>
                  </summary>
                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    {entry?.notes && <Markdown>{entry.notes}</Markdown>}
                    {entry?.codeSnippet && (
                      <CodeBlock code={entry.codeSnippet} language={entry.codeLanguage} />
                    )}
                    <div className="flex gap-2 pt-1">
                      <form action={reviewFlashcard.bind(null, problem.id, true)}>
                        <button
                          type="submit"
                          className="rounded-md bg-success/15 px-3 py-1.5 text-sm text-success hover:bg-success/25"
                        >
                          Remembered
                        </button>
                      </form>
                      <form action={reviewFlashcard.bind(null, problem.id, false)}>
                        <button
                          type="submit"
                          className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:bg-white/5"
                        >
                          Forgot
                        </button>
                      </form>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      )}

      {upcomingReviews.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted">Upcoming</h2>
          <ul className="space-y-1 text-sm">
            {upcomingReviews.map((review) => (
              <li
                key={review.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-muted"
              >
                <Link href={`/problems/${review.problem.id}`} className="hover:text-accent">
                  {review.problem.title}
                </Link>
                <span>Day +{review.dayOffset}</span>
                <span>{review.scheduledFor.toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
