import { connection } from "next/server";
import Link from "next/link";
import { db } from "@/lib/db";
import { getDueFlashcards } from "@/lib/flashcards";
import { getCurrentUserId } from "@/lib/session";
import { DueReviewRow } from "./due-review-row";
import { FlashcardItem } from "./flashcard-item";
import { ReviewCalendar } from "./review-calendar";
import { PushSubscribeButton } from "@/components/push-subscribe";
import { StatCard } from "@/components/stat-card";

export default async function ReviewPage() {
  await connection();
  const userId = await getCurrentUserId();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setHours(23, 59, 59, 999);

  const sixMonthsOut = new Date(startOfToday.getFullYear(), startOfToday.getMonth() + 6, 0, 23, 59, 59, 999);

  const [dueReviews, upcomingReviews, dueFlashcards, monthReviews, completedToday, completedTotal] = await Promise.all([
    db.review.findMany({
      where: { status: "PENDING", scheduledFor: { lte: endOfToday }, problem: { userId } },
      include: { problem: true },
      orderBy: { scheduledFor: "asc" },
    }),
    db.review.findMany({
      where: { status: "PENDING", scheduledFor: { gt: endOfToday }, problem: { userId } },
      include: { problem: true },
      orderBy: { scheduledFor: "asc" },
      take: 10,
    }),
    getDueFlashcards(userId),
    db.review.findMany({
      where: { status: "PENDING", scheduledFor: { gte: startOfToday, lte: sixMonthsOut }, problem: { userId } },
      select: { scheduledFor: true, problem: { select: { id: true, title: true, difficulty: true } } },
    }),
    db.review.count({
      where: { status: "DONE", completedAt: { gte: startOfToday, lte: endOfToday }, problem: { userId } },
    }),
    db.review.count({
      where: { status: "DONE", problem: { userId } },
    }),
  ]);

  type CalendarProblem = { id: string; title: string; difficulty: string };
  const reviewsByDate: Record<string, CalendarProblem[]> = {};
  for (const r of monthReviews) {
    const d = r.scheduledFor;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!reviewsByDate[key]) reviewsByDate[key] = [];
    reviewsByDate[key].push(r.problem);
  }

  const todayStr = `${startOfToday.getFullYear()}-${String(startOfToday.getMonth() + 1).padStart(2, "0")}-${String(startOfToday.getDate()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-3.5 md:flex-row md:items-start md:gap-x-6">
      {/* ── Left column ── */}
      <div className="flex flex-col gap-3.5 md:w-[380px] md:shrink-0">
        {/* Header */}
        <div>
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
            <PushSubscribeButton />
          </div>
        </div>

        {/* Caught-up stats (only when nothing is due) */}
        {dueReviews.length === 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard label="Reviewed Today" value={completedToday} index={0} />
            <StatCard label="All Time" value={completedTotal} suffix="reviews" index={1} />
          </div>
        )}

        {/* Due reviews */}
        {dueReviews.length > 0 && (
          <section className="space-y-3">
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

        {/* Separator */}
        {dueReviews.length > 0 && (
          <div className="flex items-center gap-3 py-1">
            <div className="h-[1.5px] flex-1 bg-foreground opacity-10" />
            <span className="text-xs text-muted">
              all caught up after {dueReviews.length === 1 ? "this" : "these"} {dueReviews.length}
            </span>
            <div className="h-[1.5px] flex-1 bg-foreground opacity-10" />
          </div>
        )}
      </div>

      {/* ── Right column ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-3.5">
        {/* Upcoming */}
        {upcomingReviews.length > 0 && (
          <section className="space-y-3">
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

        {/* Flashcards */}
        {dueFlashcards.length > 0 && (
          <section className="space-y-3">
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

        {/* Calendar */}
        <ReviewCalendar reviewsByDate={reviewsByDate} todayStr={todayStr} />
      </div>
    </div>
  );
}
