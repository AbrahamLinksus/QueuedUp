import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";

const OWNER_USERNAME = (process.env.OWNER_USERNAME ?? "jake").toLowerCase();

function calcStreak(completedDates: Date[]): number {
  if (completedDates.length === 0) return 0;

  // Unique dates (YYYY-MM-DD) sorted descending
  const days = Array.from(
    new Set(
      completedDates.map((d) => {
        const dt = new Date(d);
        return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
      })
    )
  ).sort((a, b) => (a < b ? 1 : -1));

  const todayStr = (() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  })();

  const yest = (() => {
    const n = new Date();
    n.setDate(n.getDate() - 1);
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  })();

  // Streak must start today or yesterday
  if (days[0] !== todayStr && days[0] !== yest) return 0;

  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1] + "T00:00:00");
    const curr = new Date(days[i] + "T00:00:00");
    const diff = (prev.getTime() - curr.getTime()) / 86_400_000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function relativeDate(date: Date | null): string {
  if (!date) return "never";
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}

export default async function AdminPage() {
  await connection();
  const userId = await getCurrentUserId();

  // Auth check
  const self = await db.user.findUnique({ where: { id: userId }, select: { username: true } });
  if (!self || self.username.toLowerCase() !== OWNER_USERNAME) redirect("/");

  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      problems: {
        include: {
          reviews: { where: { status: "DONE" }, select: { completedAt: true } },
        },
        select: {
          status: true,
          createdAt: true,
          reviews: true,
        },
      },
    },
  });

  const rows = users.map((u) => {
    const total = u.problems.length;
    const mastered = u.problems.filter((p) => p.status === "MASTERED").length;
    const active = total - mastered;

    // All completed review dates + problem creation dates for streak
    const activityDates: Date[] = [
      ...u.problems.flatMap((p) =>
        p.reviews.flatMap((r) => (r.completedAt ? [r.completedAt] : []))
      ),
      ...u.problems.map((p) => p.createdAt),
    ];

    const streak = calcStreak(activityDates);

    const totalReviewsDone = u.problems.flatMap((p) => p.reviews).length;

    const lastActive =
      activityDates.length > 0
        ? new Date(Math.max(...activityDates.map((d) => d.getTime())))
        : null;

    return { username: u.username, createdAt: u.createdAt, total, mastered, active, streak, totalReviewsDone, lastActive };
  });

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">
          ADMIN
        </h1>
        <p className="mt-1.5 text-sm text-muted">{rows.length} user{rows.length !== 1 ? "s" : ""} registered</p>
      </div>

      <div className="space-y-3">
        {rows.map((u) => (
          <div
            key={u.username}
            className="rounded-xl border-[2.5px] border-foreground bg-surface p-5 shadow-[3px_3px_0_#111]"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="font-display text-[22px] tracking-[1.5px] text-foreground">
                  @{u.username}
                </p>
                <p className="text-[11px] text-muted">
                  joined {u.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {" · "}last active {relativeDate(u.lastActive)}
                </p>
              </div>
              {u.streak > 0 && (
                <div className="flex items-center gap-1 rounded-full border-[2px] border-foreground px-3 py-1">
                  <span className="font-display text-[18px] leading-none text-foreground">{u.streak}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-muted">day streak</span>
                </div>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-foreground/15 bg-background px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Total Logged</p>
                <p className="mt-1 font-display text-[28px] leading-none text-foreground">{u.total}</p>
              </div>
              <div className="rounded-lg border border-foreground/15 bg-background px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Mastered</p>
                <p className="mt-1 font-display text-[28px] leading-none text-foreground">{u.mastered}</p>
              </div>
              <div className="rounded-lg border border-foreground/15 bg-background px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">In Review</p>
                <p className="mt-1 font-display text-[28px] leading-none text-foreground">{u.active}</p>
              </div>
              <div className="rounded-lg border border-foreground/15 bg-background px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Reviews Done</p>
                <p className="mt-1 font-display text-[28px] leading-none text-foreground">{u.totalReviewsDone}</p>
              </div>
            </div>

            {/* Mastery progress bar */}
            {u.total > 0 && (
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[10px] text-muted">
                  <span>Mastery progress</span>
                  <span>{Math.round((u.mastered / u.total) * 100)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-foreground transition-all"
                    style={{ width: `${(u.mastered / u.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
