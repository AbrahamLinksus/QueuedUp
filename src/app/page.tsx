import { connection } from "next/server";
import { getDashboardStats } from "@/lib/stats";
import { Heatmap } from "@/components/heatmap";
import { StatCard } from "@/components/stat-card";

function DifficultyBar({ breakdown }: { breakdown: Record<string, number> }) {
  const easy = breakdown.EASY ?? 0;
  const medium = breakdown.MEDIUM ?? 0;
  const hard = breakdown.HARD ?? 0;
  const total = easy + medium + hard;
  if (total === 0) return null;

  const easyPct = Math.round((easy / total) * 100);
  const medPct = Math.round((medium / total) * 100);
  const hardPct = 100 - easyPct - medPct;

  return (
    <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111]">
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
        Difficulty Breakdown · {total} problems
      </p>
      <div className="mb-3 flex h-5 overflow-hidden rounded-md border-[2.5px] border-foreground">
        {easyPct > 0 && (
          <div
            style={{ width: `${easyPct}%` }}
            className="flex items-center justify-center bg-foreground"
          >
            <span className="text-[10px] font-bold text-background">{easyPct}%</span>
          </div>
        )}
        {medPct > 0 && (
          <div
            style={{ width: `${medPct}%` }}
            className="flex items-center justify-center border-l-2 border-foreground bg-[#555]"
          >
            <span className="text-[10px] font-bold text-white">{medPct}%</span>
          </div>
        )}
        {hardPct > 0 && (
          <div
            style={{ width: `${hardPct}%` }}
            className="flex items-center justify-center border-l-2 border-foreground bg-[#E8E4DB]"
          >
            <span className="text-[10px] font-bold text-foreground">{hardPct}%</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <div className="h-[9px] w-[9px] shrink-0 rounded-full border-2 border-foreground" />
          <span className="text-xs text-foreground">Easy ({easy})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0 w-0 shrink-0 border-l-[5px] border-r-[5px] border-b-[9px] border-l-transparent border-r-transparent border-b-foreground" />
          <span className="text-xs text-foreground">Medium ({medium})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-[9px] w-[9px] shrink-0 border-2 border-foreground" />
          <span className="text-xs text-foreground">Hard ({hard})</span>
        </div>
      </div>
    </div>
  );
}

function Stickman() {
  return (
    <div className="flex items-end gap-3 px-1">
      <div className="shrink-0" style={{ animation: "bob 1.7s ease-in-out infinite" }}>
        <svg width="52" height="70" viewBox="0 0 60 80" fill="none">
          <circle cx="30" cy="12" r="9" stroke="#111" strokeWidth="2.5" fill="#F5F1E8" />
          <line x1="30" y1="21" x2="30" y2="52" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="30" x2="8" y2="12" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="30" x2="52" y2="12" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="52" x2="14" y2="72" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="52" x2="46" y2="72" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="relative mb-2.5 flex-1 rounded-[14px] border-[2.5px] border-foreground bg-surface px-4 py-2.5">
        <p className="font-display text-xl tracking-[1.5px] text-foreground">NICE STREAK!</p>
        <span className="absolute -left-[14px] top-1/2 -translate-y-1/2 border-b-[9px] border-r-[14px] border-t-[9px] border-b-transparent border-r-foreground border-t-transparent" />
        <span className="absolute -left-[10px] top-1/2 -translate-y-1/2 border-b-[7px] border-r-[10px] border-t-[7px] border-b-transparent border-r-surface border-t-transparent" />
      </div>
    </div>
  );
}

export default async function Home() {
  await connection();
  const stats = await getDashboardStats();
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-3.5">
      <div>
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">
          DASHBOARD
        </h1>
        <p className="mt-1.5 text-sm text-muted">{dateStr}</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <StatCard label="Problems Logged" value={stats.totalProblems} index={0} />
        <StatCard label="Current Streak" value={stats.currentStreak} suffix="days" index={1} />
        <StatCard label="Longest Streak" value={stats.longestStreak} suffix="days" index={2} />
        <StatCard label="Mastered" value={stats.statusBreakdown.MASTERED} index={3} />
      </div>

      <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111]">
        <p className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
          Activity · Last 15 Weeks
        </p>
        <Heatmap weeks={stats.heatmapWeeks} />
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="text-[10px] text-muted">Less</span>
          <div className="h-2.5 w-2.5 rounded-[2px] border-[1.5px] border-[#c8c3b8] bg-[#DDD9CC]" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-[#888]" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-[#111]" />
          <span className="text-[10px] text-muted">More</span>
          <div className="flex-1" />
          <div className="h-2.5 w-2.5 rounded-[2px] bg-danger" />
          <span className="text-[10px] text-muted">Today</span>
        </div>
      </div>

      <DifficultyBar breakdown={stats.difficultyBreakdown} />

      {stats.currentStreak > 0 && <Stickman />}
    </div>
  );
}
