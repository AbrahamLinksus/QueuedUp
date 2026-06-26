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
      include: { tags: true },
      orderBy: params.sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" },
    }),
    db.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (params.sort === "difficulty") {
    problems.sort((a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty]);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Problems</h1>
        <span className="text-sm text-muted">{problems.length} logged</span>
      </div>

      <FilterBar tags={tags} />

      <ProblemsCardGrid problems={problems} />
    </div>
  );
}
