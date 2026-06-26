import Link from "next/link";
import { getDashboardStats } from "@/lib/stats";
import { Heatmap } from "@/components/heatmap";
import { StatCard } from "@/components/stat-card";
import { DifficultyChart } from "@/components/charts/difficulty-chart";
import { TagCoverageChart } from "@/components/charts/tag-coverage-chart";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Dashboard</h1>
        <Link href="/review" className="text-sm text-accent hover:underline">
          Go to review →
        </Link>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Problems logged" value={stats.totalProblems} index={0} />
        <StatCard label="Current streak" value={stats.currentStreak} tone="text-success" index={1} />
        <StatCard label="Longest streak" value={stats.longestStreak} index={2} />
        <StatCard
          label="Mastered"
          value={stats.statusBreakdown.MASTERED}
          tone="text-accent"
          index={3}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted">Activity</h2>
        <div className="rounded-lg border border-border bg-surface p-4">
          <Heatmap weeks={stats.heatmapWeeks} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-2 text-sm font-medium text-muted">Difficulty breakdown</h2>
          <DifficultyChart breakdown={stats.difficultyBreakdown} />
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-2 text-sm font-medium text-muted">Review health</h2>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Overdue" value={stats.reviewHealth.overdue} tone="text-danger" />
            <StatCard
              label="Due today"
              value={stats.reviewHealth.dueToday}
              tone="text-warning"
              index={1}
            />
            <StatCard label="Upcoming (7d)" value={stats.reviewHealth.upcoming} index={2} />
          </div>
          <p className="mt-3 text-xs text-muted">
            {stats.statusBreakdown.ACTIVE_REVIEW} problem
            {stats.statusBreakdown.ACTIVE_REVIEW === 1 ? "" : "s"} still in active review.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-2 text-sm font-medium text-muted">Topic coverage</h2>
        {stats.tagCoverage.length === 0 ? (
          <p className="text-sm text-muted">Log a problem with tags to see coverage here.</p>
        ) : (
          <TagCoverageChart data={stats.tagCoverage} />
        )}
      </section>
    </div>
  );
}
