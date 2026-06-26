import { connection } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";

function toDateStr(d: Date) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function calcStreak(dates: Date[]): number {
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

export default async function LeaderboardPage() {
  await connection();
  const currentUserId = await getCurrentUserId();

  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      problems: {
        select: {
          status: true,
          createdAt: true,
          reviews: {
            select: { status: true, completedAt: true },
          },
        },
      },
    },
  });

  const rows = users
    .map((u) => {
      const mastered = u.problems.filter((p) => p.status === "MASTERED").length;
      const active = u.problems.filter((p) => p.status === "ACTIVE_REVIEW").length;
      const total = u.problems.length;

      const activityDates: Date[] = [
        ...u.problems.flatMap((p) =>
          p.reviews.flatMap((r) => (r.completedAt ? [r.completedAt] : []))
        ),
        ...u.problems.map((p) => p.createdAt),
      ];
      const streak = calcStreak(activityDates);
      const score = mastered * 10 + active * 2 + streak;

      return { id: u.id, username: u.username, mastered, active, total, streak, score };
    })
    .sort((a, b) => b.score - a.score || b.mastered - a.mastered);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  const podiumOrder = top3.length === 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  const podiumHeight = ["h-16", "h-24", "h-12"];
  const podiumRankIdx = [1, 0, 2];

  return (
    <div className="space-y-8 pb-24">
      <div>
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">
          LEADERBOARD
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Score = mastered × 10 + in-review × 2 + streak days
        </p>
      </div>

      {/* Podium — top 3 */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-3">
          {(top3.length === 3 ? podiumOrder : top3).map((u, i) => {
            const rankIdx = top3.length === 3 ? podiumRankIdx[i] : i;
            const rank = rankIdx + 1;
            const isYou = u.id === currentUserId;
            const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";
            const colHeight = top3.length === 3 ? podiumHeight[i] : "h-16";

            return (
              <div key={u.id} className="flex flex-col items-center gap-2 flex-1 max-w-[120px]">
                <div className="text-center">
                  <p className={`font-display text-[13px] tracking-[1px] truncate max-w-[100px] ${isYou ? "underline decoration-2" : ""}`}>
                    @{u.username}
                  </p>
                  <p className="font-display text-[22px] leading-none text-foreground">{u.score}</p>
                  <p className="text-[9px] text-muted">{u.mastered} mastered</p>
                </div>
                <div
                  className={`w-full rounded-t-lg border-[2.5px] border-foreground ${colHeight} flex items-center justify-center ${
                    rank === 1 ? "bg-foreground text-background" : "bg-surface"
                  } shadow-[3px_3px_0_#111]`}
                >
                  <span className="text-xl">{medal}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rest of the table */}
      {rest.length > 0 && (
        <div className="overflow-hidden rounded-xl border-[2.5px] border-foreground bg-surface shadow-[3px_3px_0_#111]">
          {rest.map((u, i) => {
            const rank = i + 4;
            const isYou = u.id === currentUserId;
            return (
              <div
                key={u.id}
                className={`flex items-center gap-4 px-4 py-3 text-sm ${
                  i < rest.length - 1 ? "border-b border-foreground/10" : ""
                } ${isYou ? "bg-foreground/5" : ""}`}
              >
                <span className="w-6 shrink-0 text-center font-display text-[15px] text-muted">
                  {rank}
                </span>
                <span className={`flex-1 font-medium text-foreground ${isYou ? "underline decoration-2" : ""}`}>
                  @{u.username}
                </span>
                <span className="shrink-0 font-display text-[18px] text-foreground">{u.score}</span>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-[11px] text-foreground">{u.mastered} mastered</p>
                  <p className="text-[10px] text-muted">{u.streak}d streak</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Your stats callout if you're in top 3 */}
      {top3.some((u) => u.id === currentUserId) && (
        <p className="text-center text-[11px] text-muted">
          You are underlined above
        </p>
      )}
    </div>
  );
}
