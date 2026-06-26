"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { FINAL_REVIEW_DAY_OFFSET } from "@/lib/reviews";

export async function completeReview(reviewId: string, outcome: "DONE" | "SKIPPED") {
  const review = await db.review.update({
    where: { id: reviewId },
    data: { status: outcome, completedAt: new Date() },
  });

  if (review.dayOffset === FINAL_REVIEW_DAY_OFFSET) {
    await db.problem.update({
      where: { id: review.problemId },
      data: { status: "MASTERED" },
    });

    // Any earlier checkpoints that were never acted on no longer matter once mastered.
    await db.review.updateMany({
      where: { problemId: review.problemId, status: "PENDING" },
      data: { status: "SKIPPED", completedAt: new Date() },
    });
  }

  revalidatePath("/review");
  revalidatePath("/");
  revalidatePath(`/problems/${review.problemId}`);
  revalidateTag("stats", "max");
}

export async function reviewFlashcard(problemId: string, recalledOk: boolean) {
  await db.flashcardReview.create({
    data: { problemId, recalledOk },
  });

  revalidatePath("/review");
}
