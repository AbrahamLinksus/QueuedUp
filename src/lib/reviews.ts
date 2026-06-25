import { db } from "@/lib/db";

export const REVIEW_DAY_OFFSETS = [2, 3, 4, 7] as const;
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
