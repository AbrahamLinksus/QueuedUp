"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { scheduleReviews } from "@/lib/reviews";
import type { Difficulty, Platform } from "@/generated/prisma/client";

async function resolveTagIds(formData: FormData) {
  const tagIds = formData.getAll("tagIds").map(String).filter(Boolean);
  const customTagNames = String(formData.get("customTags") ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const customTags = await Promise.all(
    customTagNames.map((name) =>
      db.tag.upsert({ where: { name }, update: {}, create: { name, isPreset: false } })
    )
  );

  return [...tagIds, ...customTags.map((tag) => tag.id)];
}

function readProblemFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    platform: String(formData.get("platform") ?? "OTHER") as Platform,
    difficulty: String(formData.get("difficulty") ?? "MEDIUM") as Difficulty,
  };
}

function readEntryFields(formData: FormData) {
  const timeTakenRaw = String(formData.get("timeTakenMinutes") ?? "").trim();
  const attemptsRaw = String(formData.get("attemptsCount") ?? "").trim();

  return {
    notes: String(formData.get("notes") ?? "").trim(),
    codeSnippet: String(formData.get("codeSnippet") ?? "").trim(),
    codeLanguage: String(formData.get("codeLanguage") ?? "plaintext").trim() || "plaintext",
    timeComplexity: String(formData.get("timeComplexity") ?? "").trim() || null,
    spaceComplexity: String(formData.get("spaceComplexity") ?? "").trim() || null,
    timeTakenMinutes: timeTakenRaw ? Number(timeTakenRaw) : null,
    attemptsCount: attemptsRaw ? Number(attemptsRaw) : 1,
  };
}

export async function createProblem(formData: FormData) {
  const tagIds = await resolveTagIds(formData);

  const problem = await db.problem.create({
    data: {
      ...readProblemFields(formData),
      tags: { connect: tagIds.map((id) => ({ id })) },
      entries: { create: readEntryFields(formData) },
    },
  });

  await scheduleReviews(problem.id, problem.createdAt);

  revalidatePath("/problems");
  redirect(`/problems/${problem.id}`);
}

export async function updateProblem(problemId: string, formData: FormData) {
  const tagIds = await resolveTagIds(formData);

  const latestEntry = await db.entry.findFirst({
    where: { problemId },
    orderBy: { createdAt: "desc" },
  });

  await db.problem.update({
    where: { id: problemId },
    data: {
      ...readProblemFields(formData),
      tags: { set: tagIds.map((id) => ({ id })) },
      entries: latestEntry
        ? { update: { where: { id: latestEntry.id }, data: readEntryFields(formData) } }
        : { create: readEntryFields(formData) },
    },
  });

  revalidatePath("/problems");
  revalidatePath(`/problems/${problemId}`);
  redirect(`/problems/${problemId}`);
}

export async function deleteProblem(problemId: string) {
  await db.problem.delete({ where: { id: problemId } });

  revalidatePath("/problems");
  redirect("/problems");
}

const LEETCODE_QUESTION_QUERY = `
  query questionTitle($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      difficulty
    }
  }
`;

type LeetCodeFetchResult = { error: string } | { title: string; difficulty: Difficulty };

export async function fetchLeetCodeProblem(url: string): Promise<LeetCodeFetchResult> {
  const match = url.match(/leetcode\.com\/problems\/([^/?#]+)/i);
  if (!match) {
    return { error: "That doesn't look like a leetcode.com/problems/... URL." };
  }

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: LEETCODE_QUESTION_QUERY,
        variables: { titleSlug: match[1] },
      }),
    });

    if (!res.ok) return { error: "LeetCode request failed." };

    const json = await res.json();
    const question = json?.data?.question as { title?: string; difficulty?: string } | null;

    if (!question?.title || !question.difficulty) {
      return { error: "Couldn't find that problem on LeetCode." };
    }

    return {
      title: question.title,
      difficulty: question.difficulty.toUpperCase() as Difficulty,
    };
  } catch {
    return { error: "Couldn't reach LeetCode." };
  }
}
