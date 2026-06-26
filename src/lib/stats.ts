import { cacheTag, cacheLife } from "next/cache";
import { db } from "@/lib/db";

const HEATMAP_DAYS = 84;

function dateKey(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export type HeatmapDay = { date: string | null; count: number };

function buildHeatmapWeeks(countsByDate: Map<string, number>, today: Date) {
  const start = startOfDay(today);
  start.setDate(start.getDate() - (HEATMAP_DAYS - 1));

  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - start.getDay());

  const weeks: HeatmapDay[][] = [];
  const cursor = new Date(gridStart);

  while (cursor <= today) {
    const week: HeatmapDay[] = [];
    for (let i = 0; i < 7; i++) {
      if (cursor < start || cursor > today) {
        week.push({ date: null, count: 0 });
      } else {
        const key = dateKey(cursor);
        week.push({ date: key, count: countsByDate.get(key) ?? 0 });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

function computeStreaks(activeDates: Set<string>, today: Date) {
  const start = startOfDay(today);

  let currentStreak = 0;
  const cursor = new Date(start);
  if (!activeDates.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (activeDates.has(dateKey(cursor))) {
    currentStreak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const sortedDates = [...activeDates].sort();
  let longestStreak = 0;
  let runLength = 0;
  let prevDate: Date | null = null;

  for (const key of sortedDates) {
    const d = new Date(`${key}T00:00:00.000Z`);
    if (prevDate) {
      const dayGap = Math.round((d.getTime() - prevDate.getTime()) / 86_400_000);
      runLength = dayGap === 1 ? runLength + 1 : 1;
    } else {
      runLength = 1;
    }
    longestStreak = Math.max(longestStreak, runLength);
    prevDate = d;
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}

export async function getDashboardStats(userId: string) {
  "use cache";
  cacheTag(`stats:${userId}`);
  cacheLife("hours");

  const today = startOfDay(new Date());
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);
  const sevenDaysOut = new Date(endOfToday);
  sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);

  const [allProblems, tags, entryDates, pendingReviews] = await Promise.all([
    db.problem.findMany({ where: { userId }, select: { difficulty: true, status: true } }),
    db.tag.findMany({
      include: { _count: { select: { problems: { where: { userId } } } } },
      orderBy: { name: "asc" },
    }),
    db.entry.findMany({
      where: { problem: { userId } },
      select: { createdAt: true },
    }),
    db.review.findMany({
      where: { status: "PENDING", problem: { userId } },
      select: { scheduledFor: true },
    }),
  ]);

  const difficultyBreakdown = { EASY: 0, MEDIUM: 0, HARD: 0 } as Record<string, number>;
  const statusBreakdown = { ACTIVE_REVIEW: 0, MASTERED: 0 } as Record<string, number>;
  for (const p of allProblems) {
    difficultyBreakdown[p.difficulty] = (difficultyBreakdown[p.difficulty] ?? 0) + 1;
    statusBreakdown[p.status] = (statusBreakdown[p.status] ?? 0) + 1;
  }

  const tagCoverage = tags
    .map((tag) => ({ name: tag.name, count: tag._count.problems }))
    .filter((tag) => tag.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const countsByDate = new Map<string, number>();
  for (const entry of entryDates) {
    const key = dateKey(entry.createdAt);
    countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1);
  }
  const activeDates = new Set(countsByDate.keys());

  const heatmapWeeks = buildHeatmapWeeks(countsByDate, today);
  const { currentStreak, longestStreak } = computeStreaks(activeDates, today);

  let overdue = 0;
  let dueToday = 0;
  let upcoming = 0;
  for (const review of pendingReviews) {
    if (review.scheduledFor < today) overdue++;
    else if (review.scheduledFor <= endOfToday) dueToday++;
    else if (review.scheduledFor <= sevenDaysOut) upcoming++;
  }

  return {
    totalProblems: Object.values(difficultyBreakdown).reduce((a, b) => a + b, 0),
    difficultyBreakdown,
    statusBreakdown,
    tagCoverage,
    heatmapWeeks,
    currentStreak,
    longestStreak,
    reviewHealth: { overdue, dueToday, upcoming },
  };
}
