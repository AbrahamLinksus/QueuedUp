import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";
import { getMainTopicsForTags } from "@/lib/topics";
import { DeleteUserButton } from "./delete-user-button";

const OWNER_USERNAME = (process.env.OWNER_USERNAME ?? "jake").toLowerCase();

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function calcCurrentStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const days = Array.from(new Set(dates.map(toDateStr))).sort((a, b) => (a < b ? 1 : -1));
  const today = toDateStr(new Date());
  const yest = toDateStr(new Date(Date.now() - 86_400_000));
  if (days[0] !== today && days[0] !== yest) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i - 1] + "T00:00:00").getTime() - new Date(days[i] + "T00:00:00").getTime()) / 86_400_000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function calcLongestStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const days = Array.from(new Set(dates.map(toDateStr))).sort();
  let longest = 1, current = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i] + "T00:00:00").getTime() - new Date(days[i - 1] + "T00:00:00").getTime()) / 86_400_000;
    if (diff === 1) { current++; if (current > longest) longest = current; }
    else current = 1;
  }
  return longest;
}

function relativeDate(date: Date | null): string {
  if (!date) return "never";
  const diff = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}

function StatTile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-lg border border-foreground/15 bg-background px-3 py-2.5">
      <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">{label}</p>
      <p className="mt-1 font-display text-[26px] leading-none text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-[9px] text-muted">{sub}</p>}
    </div>
  );
}

export default async function AdminPage() {
  await connection();
  const userId = await getCurrentUserId();

  const self = await db.user.findUnique({ where: { id: userId }, select: { username: true } });
  if (!self || self.username.toLowerCase() !== OWNER_USERNAME) redirect("/");

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86_400_000);

  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      username: true,
      createdAt: true,
      problems: {
        select: {
          status: true,
          difficulty: true,
          createdAt: true,
          tags: { select: { name: true } },
          reviews: {
            select: { status: true, completedAt: true, scheduledFor: true },
          },
        },
      },
    },
  });

  const rows = users.map((u) => {
    const total = u.problems.length;
    const mastered = u.problems.filter((p) => p.status === "MASTERED").length;
    const active = total - mastered;

    // Difficulty split
    const easy = u.problems.filter((p) => p.difficulty === "EASY").length;
    const medium = u.problems.filter((p) => p.difficulty === "MEDIUM").length;
    const hard = u.problems.filter((p) => p.difficulty === "HARD").length;

    // Reviews
    const allReviews = u.problems.flatMap((p) => p.reviews);
    const reviewsDone = allReviews.filter((r) => r.status === "DONE").length;
    const reviewsSkipped = allReviews.filter((r) => r.status === "SKIPPED").length;
    const skipRate = reviewsDone + reviewsSkipped > 0
      ? Math.round((reviewsSkipped / (reviewsDone + reviewsSkipped)) * 100)
      : 0;
    const overdue = allReviews.filter((r) => r.status === "PENDING" && r.scheduledFor < now).length;

    // Next review
    const pendingDates = allReviews
      .filter((r) => r.status === "PENDING" && r.scheduledFor >= now)
      .map((r) => r.scheduledFor);
    const nextReview = pendingDates.length > 0 ? new Date(Math.min(...pendingDates.map((d) => d.getTime()))) : null;

    // This week
    const thisWeek = u.problems.filter((p) => p.createdAt >= weekAgo).length;

    // Activity dates for streak (completed reviews + problem log dates)
    const activityDates: Date[] = [
      ...allReviews.flatMap((r) => (r.completedAt ? [r.completedAt] : [])),
      ...u.problems.map((p) => p.createdAt),
    ];
    const currentStreak = calcCurrentStreak(activityDates);
    const longestStreak = calcLongestStreak(activityDates);

    const lastActive = activityDates.length > 0
      ? new Date(Math.max(...activityDates.map((d) => d.getTime())))
      : null;

    // Top 3 topics
    const topicCounts: Record<string, number> = {};
    for (const p of u.problems) {
      const topics = getMainTopicsForTags(p.tags.map((t) => t.name));
      for (const t of topics) topicCounts[t] = (topicCounts[t] ?? 0) + 1;
    }
    const topTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    return {
      username: u.username, createdAt: u.createdAt, total, mastered, active,
      easy, medium, hard, reviewsDone, reviewsSkipped, skipRate, overdue,
      nextReview, thisWeek, currentStreak, longestStreak, lastActive, topTopics,
    };
  });

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">ADMIN</h1>
        <p className="mt-1.5 text-sm text-muted">{rows.length} user{rows.length !== 1 ? "s" : ""} registered</p>
      </div>

      <div className="space-y-4">
        {rows.map((u) => (
          <div key={u.username} className="rounded-xl border-[2.5px] border-foreground bg-surface p-5 shadow-[3px_3px_0_#111] space-y-4">

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-[22px] tracking-[1.5px] text-foreground">@{u.username}</p>
                <p className="text-[11px] text-muted">
                  joined {u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {" · "}last active {relativeDate(u.lastActive)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {u.currentStreak > 0 && (
                  <div className="flex items-center gap-1 rounded-full border-[2px] border-foreground px-3 py-1">
                    <span className="font-display text-[18px] leading-none text-foreground">{u.currentStreak}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-muted">day streak</span>
                  </div>
                )}
                {u.longestStreak > u.currentStreak && (
                  <p className="text-[10px] text-muted">best: {u.longestStreak} days</p>
                )}
                {u.username.toLowerCase() !== OWNER_USERNAME && (
                  <DeleteUserButton username={u.username} />
                )}
              </div>
            </div>

            {/* Primary stats */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatTile label="Total Logged" value={u.total} />
              <StatTile label="Mastered" value={u.mastered} />
              <StatTile label="In Review" value={u.active} />
              <StatTile label="Reviews Done" value={u.reviewsDone} />
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatTile label="This Week" value={u.thisWeek} sub="problems logged" />
              <StatTile
                label="Skip Rate"
                value={`${u.skipRate}%`}
                sub={`${u.reviewsSkipped} skipped`}
              />
              <StatTile
                label="Overdue"
                value={u.overdue}
                sub={u.overdue > 0 ? "need attention" : "all clear"}
              />
              <StatTile
                label="Next Review"
                value={u.nextReview
                  ? u.nextReview.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "—"}
                sub={u.nextReview ? relativeDate(u.nextReview) : "none pending"}
              />
            </div>

            {/* Mastery progress */}
            {u.total > 0 && (
              <div>
                <div className="mb-1 flex justify-between text-[10px] text-muted">
                  <span>Mastery progress</span>
                  <span>{Math.round((u.mastered / u.total) * 100)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                  <div className="h-full rounded-full bg-foreground" style={{ width: `${(u.mastered / u.total) * 100}%` }} />
                </div>
              </div>
            )}

            {/* Difficulty split */}
            {u.total > 0 && (
              <div>
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Difficulty split</p>
                <div className="flex h-2.5 overflow-hidden rounded-full">
                  {u.easy > 0 && (
                    <div className="bg-emerald-500" style={{ width: `${(u.easy / u.total) * 100}%` }} title={`Easy: ${u.easy}`} />
                  )}
                  {u.medium > 0 && (
                    <div className="bg-amber-400" style={{ width: `${(u.medium / u.total) * 100}%` }} title={`Medium: ${u.medium}`} />
                  )}
                  {u.hard > 0 && (
                    <div className="bg-red-500" style={{ width: `${(u.hard / u.total) * 100}%` }} title={`Hard: ${u.hard}`} />
                  )}
                </div>
                <div className="mt-1 flex gap-3 text-[9px] text-muted">
                  <span><span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1" />{u.easy} Easy</span>
                  <span><span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 mr-1" />{u.medium} Medium</span>
                  <span><span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mr-1" />{u.hard} Hard</span>
                </div>
              </div>
            )}

            {/* Top topics */}
            {u.topTopics.length > 0 && (
              <div>
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Top topics</p>
                <div className="flex flex-wrap gap-1.5">
                  {u.topTopics.map(({ name, count }) => (
                    <span key={name} className="rounded-full border border-foreground/20 bg-background px-2.5 py-1 text-[10px] font-medium capitalize text-foreground">
                      {name} <span className="text-muted">·{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
