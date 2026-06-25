import Link from "next/link";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { FilterBar } from "./filter-bar";

const DIFFICULTY_RANK = { EASY: 0, MEDIUM: 1, HARD: 2 } as const;

const DIFFICULTY_STYLE: Record<string, string> = {
  EASY: "text-success",
  MEDIUM: "text-warning",
  HARD: "text-danger",
};

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
        <h1 className="text-xl font-semibold text-foreground">Problems</h1>
        <span className="text-sm text-muted">{problems.length} logged</span>
      </div>

      <FilterBar tags={tags} />

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Difficulty</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Tags</th>
              <th className="px-4 py-2 font-medium">Logged</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id} className="border-t border-border hover:bg-white/5">
                <td className="px-4 py-2">
                  <Link href={`/problems/${problem.id}`} className="text-foreground hover:text-accent">
                    {problem.title}
                  </Link>
                </td>
                <td className={`px-4 py-2 ${DIFFICULTY_STYLE[problem.difficulty]}`}>
                  {problem.difficulty}
                </td>
                <td className="px-4 py-2 text-muted">
                  {problem.status === "MASTERED" ? "Mastered" : "Active review"}
                </td>
                <td className="px-4 py-2 text-muted">
                  {problem.tags.map((tag) => tag.name).join(", ") || "—"}
                </td>
                <td className="px-4 py-2 text-muted">
                  {problem.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {problems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No problems match these filters yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
