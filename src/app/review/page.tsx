import Link from "next/link";
import { db } from "@/lib/db";
import { getDueFlashcards } from "@/lib/flashcards";
import { DueReviewRow } from "./due-review-row";
import { FlashcardItem } from "./flashcard-item";

export const dynamic = "force-dynamic";

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
        <h1 className="font-display text-xl font-bold text-foreground">Review</h1>
        <p className="text-sm text-muted">
          {dueReviews.length === 0
            ? "Nothing due right now."
            : `${dueReviews.length} review${dueReviews.length === 1 ? "" : "s"} due.`}
        </p>
      </div>

      <section className="space-y-2">
        {dueReviews.map((review, index) => (
          <DueReviewRow
            key={review.id}
            review={review}
            isOverdue={review.scheduledFor < startOfToday}
            index={index}
          />
        ))}
      </section>

      {dueFlashcards.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted">Flashcards</h2>
          <p className="text-xs text-muted">
            Mastered problems — a quick recall check, no need to re-solve.
          </p>
          <div className="space-y-2">
            {dueFlashcards.map((problem, index) => (
              <FlashcardItem
                key={problem.id}
                problem={problem}
                entry={problem.entries[0]}
                index={index}
              />
            ))}
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
