import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { FilterBar } from "./filter-bar";
import { ProblemsCardGrid } from "./problems-card-grid";

const DIFFICULTY_RANK = { EASY: 0, MEDIUM: 1, HARD: 2 } as const;

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const where: Prisma.ProblemWhereInput = {};
  if (params.difficulty) where.difficulty = params.difficulty as never;
  if (params.status) where.status = params.status as never;
  if (params.platform) where.platform = params.platform as never;
  if (params.tag) where.tags = { some: { id: params.tag } };

  const [problems, tags] = await Promise.all([
    db.problem.findMany({
      where,
      include: { tags: true, _count: { select: { entries: true } } },
      orderBy: params.sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" },
    }),
    db.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (params.sort === "difficulty") {
    problems.sort((a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty]);
  }

  const mastered = problems.filter((p) => p.status === "MASTERED").length;

  return (
    <div className="space-y-3.5">
      <div>
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">
          LOG
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {problems.length} problem{problems.length !== 1 ? "s" : ""} · {mastered} mastered
        </p>
      </div>

      <FilterBar tags={tags} />

      <ProblemsCardGrid problems={problems} />
    </div>
  );
}
