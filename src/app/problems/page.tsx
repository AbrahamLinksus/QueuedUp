import { cacheTag, cacheLife } from "next/cache";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { getCurrentUserId } from "@/lib/session";
import { FilterBar } from "./filter-bar";
import { ProblemsCardGrid } from "./problems-card-grid";

async function getCachedTags() {
  "use cache";
  cacheTag("tags");
  cacheLife("hours");
  return db.tag.findMany({ orderBy: { name: "asc" } });
}

const DIFFICULTY_RANK = { EASY: 0, MEDIUM: 1, HARD: 2 } as const;

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const [params, userId] = await Promise.all([searchParams, getCurrentUserId()]);

  const where: Prisma.ProblemWhereInput = { userId };
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
    getCachedTags(),
  ]);

  if (params.sort === "difficulty") {
    problems.sort((a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty]);
  }

  const mastered = problems.filter((p) => p.status === "MASTERED").length;

  return (
    <div className="space-y-3.5">
      {/* Header — always full width above both columns */}
      <div>
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">
          LOG
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {problems.length} problem{problems.length !== 1 ? "s" : ""} · {mastered} mastered
        </p>
      </div>

      {/*
        Two-column grid on desktop:
          left sidebar (~300px) = filter controls in a neo-brutalist card
          right content = scrollable problem list
        Mobile (grid-cols-1 gap-3.5): FilterBar then ProblemsCardGrid — same as before.
        The md: sidebar card classes only activate at ≥768px so mobile has no card wrapper.
      */}
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[300px_1fr] md:items-start md:gap-6">
        {/* Filter sidebar */}
        <div className="md:rounded-xl md:border-[2.5px] md:border-foreground md:bg-surface md:p-4 md:shadow-[3px_3px_0_#111]">
          <p className="mb-3 hidden text-[9px] font-bold uppercase tracking-[0.9px] text-muted md:block">
            Filters
          </p>
          <FilterBar tags={tags} />
        </div>

        {/* Problems list */}
        <ProblemsCardGrid problems={problems} />
      </div>
    </div>
  );
}
