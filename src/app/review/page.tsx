import { connection } from "next/server";
import Link from "next/link";
import { db } from "@/lib/db";
import { getDueFlashcards } from "@/lib/flashcards";
import { DueReviewRow } from "./due-review-row";
import { FlashcardItem } from "./flashcard-item";

export default async function ReviewPage() {
  await connection();
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
    /*
      Two-column grid on desktop.
      Mobile (grid-cols-1 gap-3.5): items stack in DOM order →
        header, due reviews, separator, flashcards, upcoming.
      Desktop (md:grid-cols-[380px_1fr]): explicit col/row placement →
        left=[header (r1), due reviews (r2), separator (r3)],
        right=[upcoming (r1), flashcards (r2)].
      md:col-start-* and md:row-start-* are no-ops on mobile (single col,
      auto-placement follows DOM order).
    */
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[380px_1fr] md:items-start md:gap-x-6 md:gap-y-4">
      {/* Header — left col, row 1 on desktop */}
      <div className="md:col-start-1 md:row-start-1">
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">
          REVIEW
        </h1>
        <div className="mt-1.5 flex items-center gap-2">
          {dueReviews.length > 0 ? (
            <>
              <div className="h-2 w-2 shrink-0 rounded-full bg-danger" />
              <p className="text-sm font-medium text-foreground">
                {dueReviews.length} review{dueReviews.length !== 1 ? "s" : ""} due
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">Nothing due right now.</p>
          )}
        </div>
      </div>

      {/* Due reviews — left col, row 2 on desktop */}
      {dueReviews.length > 0 && (
        <section className="space-y-3 md:col-start-1 md:row-start-2">
          {dueReviews.map((review, index) => {
            const isOverdue = review.scheduledFor < startOfToday;
            const daysAgo = isOverdue
              ? Math.round(
                  (startOfToday.getTime() - review.scheduledFor.getTime()) / 86_400_000
                )
              : undefined;
            return (
              <DueReviewRow
                key={review.id}
                review={review}
                isOverdue={isOverdue}
                daysAgo={daysAgo}
                index={index}
              />
            );
          })}
        </section>
      )}

      {/* Separator — left col, row 3 on desktop */}
      {dueReviews.length > 0 && (
        <div className="flex items-center gap-3 py-1 md:col-start-1 md:row-start-3">
          <div className="h-[1.5px] flex-1 bg-foreground opacity-10" />
          <span className="text-xs text-muted">
            all caught up after {dueReviews.length === 1 ? "this" : "these"} {dueReviews.length}
          </span>
          <div className="h-[1.5px] flex-1 bg-foreground opacity-10" />
        </div>
      )}

      {/* Flashcards — right col row 2 on desktop; appears before upcoming in DOM
          so mobile order is preserved (flashcards first, upcoming last). */}
      {dueFlashcards.length > 0 && (
        <section className="space-y-3 md:col-start-2 md:row-start-2">
          <div>
            <h2 className="font-display text-[22px] tracking-[1.5px] text-foreground">
              FLASHCARDS
            </h2>
            <p className="text-xs text-muted">
              Mastered problems — a quick recall check, no need to re-solve.
            </p>
          </div>
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

      {/* Upcoming — right col row 1 on desktop; last in DOM so it appears last
          on mobile, but promoted to row 1 of the right col on desktop. */}
      {upcomingReviews.length > 0 && (
        <section className="space-y-3 md:col-start-2 md:row-start-1">
          <h2 className="font-display text-[22px] tracking-[1.5px] text-foreground">UPCOMING</h2>
          <div className="overflow-hidden rounded-xl border-[2.5px] border-foreground bg-surface shadow-[3px_3px_0_#111]">
            {upcomingReviews.map((review, i) => (
              <div
                key={review.id}
                className={`flex items-center gap-3 px-4 py-3 text-sm ${
                  i < upcomingReviews.length - 1 ? "border-b border-[#eee]" : ""
                }`}
              >
                <Link
                  href={`/problems/${review.problem.id}`}
                  className="min-w-0 flex-1 truncate font-medium text-foreground hover:underline"
                >
                  {review.problem.title}
                </Link>
                <span className="shrink-0 text-muted">+{review.dayOffset}d</span>
                <span className="shrink-0 text-muted">
                  {review.scheduledFor.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
