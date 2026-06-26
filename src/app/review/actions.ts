"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import { FINAL_REVIEW_DAY_OFFSET } from "@/lib/reviews";

export async function completeReview(reviewId: string, outcome: "DONE" | "SKIPPED", formData: FormData) {
  const notes = String(formData.get("notes") ?? "").trim();

  const review = await db.review.update({
    where: { id: reviewId },
    data: { status: outcome, completedAt: new Date() },
  });

  if (outcome === "DONE" && notes) {
    await db.entry.create({
      data: { problemId: review.problemId, notes },
    });
  }

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
