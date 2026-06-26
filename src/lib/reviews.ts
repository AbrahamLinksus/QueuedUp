import { db } from "@/lib/db";

// Gaps between reviews: 2, 3, 4, 5, 6, 7 days (capped at 7).
// Cumulative days from creation: 2, 5, 9, 14, 20, 27.
// Completing the 27-day review earns MASTERED.
export const REVIEW_DAY_OFFSETS = [2, 5, 9, 14, 20, 27] as const;
export const FINAL_REVIEW_DAY_OFFSET = REVIEW_DAY_OFFSETS[REVIEW_DAY_OFFSETS.length - 1];

export async function scheduleReviews(problemId: string, solvedAt: Date) {
  const base = new Date(solvedAt);
  base.setHours(0, 0, 0, 0);

  await db.review.createMany({
    data: REVIEW_DAY_OFFSETS.map((dayOffset) => {
      const scheduledFor = new Date(base);
      scheduledFor.setDate(scheduledFor.getDate() + dayOffset);
      return { problemId, dayOffset, scheduledFor };
    }),
  });
}
