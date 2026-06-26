import { db } from "@/lib/db";

export const FLASHCARD_INTERVAL_DAYS = 14;
const DUE_FLASHCARD_LIMIT = 5;

export async function getDueFlashcards(userId: string) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - FLASHCARD_INTERVAL_DAYS);

  const masteredProblems = await db.problem.findMany({
    where: { status: "MASTERED", userId },
    include: {
      entries: { orderBy: { createdAt: "desc" }, take: 1 },
      flashcardReviews: { orderBy: { reviewedAt: "desc" }, take: 1 },
    },
  });

  return masteredProblems
    .filter((problem) => {
      const lastReview = problem.flashcardReviews[0];
      return !lastReview || lastReview.reviewedAt <= cutoff;
    })
    .sort((a, b) => {
      const aLast = a.flashcardReviews[0]?.reviewedAt ?? new Date(0);
      const bLast = b.flashcardReviews[0]?.reviewedAt ?? new Date(0);
      return aLast.getTime() - bLast.getTime();
    })
    .slice(0, DUE_FLASHCARD_LIMIT);
}
