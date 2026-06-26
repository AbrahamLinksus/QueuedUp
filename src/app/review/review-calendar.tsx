"use client";

import { useState } from "react";
import Link from "next/link";

type CalendarProblem = { id: string; title: string; difficulty: string };

type CalendarProps = {
  reviewsByDate: Record<string, CalendarProblem[]>;
  todayStr: string;
};

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function DifficultyDot({ d }: { d: string }) {
  const color = d === "EASY" ? "bg-emerald-500" : d === "MEDIUM" ? "bg-amber-400" : "bg-red-500";
  return <span className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />;
}

export function ReviewCalendar({ reviewsByDate, todayStr }: CalendarProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const todayDate = new Date(`${todayStr}T00:00:00`);
  const viewDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const allCounts = Object.values(reviewsByDate).map((p) => p.length);
  const maxCount = Math.max(1, ...allCounts);

  const selectedProblems = selectedDate ? (reviewsByDate[selectedDate] ?? []) : [];
  const selectedLabel = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">{monthName}</p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setMonthOffset((o) => Math.max(0, o - 1)); setSelectedDate(null); }}
            disabled={monthOffset === 0}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-foreground/20 text-muted transition-colors hover:border-foreground hover:text-foreground disabled:opacity-30"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="8,2 4,6 8,10" />
            </svg>
          </button>
          <button
            onClick={() => { setMonthOffset((o) => Math.min(5, o + 1)); setSelectedDate(null); }}
            disabled={monthOffset === 5}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-foreground/20 text-muted transition-colors hover:border-foreground hover:text-foreground disabled:opacity-30"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="4,2 8,6 4,10" />
            </svg>
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-[9px] font-bold uppercase tracking-[0.5px] text-muted">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const count = reviewsByDate[key]?.length ?? 0;
          const isToday = key === todayStr;
          const isSelected = key === selectedDate;
          const intensity = count === 0 ? 0 : Math.ceil((count / maxCount) * 3);
          const clickable = count > 0;

          const cellClass = isSelected
            ? "bg-foreground text-background ring-[2px] ring-foreground ring-offset-1"
            : isToday && count > 0
            ? "bg-foreground text-background"
            : isToday
            ? "ring-[1.5px] ring-foreground text-foreground"
            : intensity === 3
            ? "bg-foreground/85 text-background"
            : intensity === 2
            ? "bg-foreground/45 text-foreground"
            : intensity === 1
            ? "bg-foreground/15 text-foreground"
            : "text-muted/60";

          return (
            <div key={i} className="flex items-center justify-center">
              <button
                onClick={() => clickable && setSelectedDate(isSelected ? null : key)}
                disabled={!clickable}
                className={`flex aspect-square w-[88%] flex-col items-center justify-center rounded-md transition-opacity ${cellClass} ${
                  clickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                }`}
              >
                <span className="text-[11px] font-medium leading-none">{day}</span>
                {count > 0 && (
                  <span className="mt-0.5 text-[8px] leading-none opacity-80">{count}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Day drill-down */}
      {selectedDate && selectedProblems.length > 0 && (
        <div className="mt-3 border-t border-foreground/10 pt-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-muted">
              {selectedLabel} · {selectedProblems.length} due
            </p>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-[10px] text-muted hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5">
            {selectedProblems.map((p) => (
              <Link
                key={p.id}
                href={`/problems/${p.id}`}
                className="flex items-center gap-2 rounded-lg border border-foreground/10 bg-background px-3 py-2 text-xs hover:border-foreground/30"
              >
                <DifficultyDot d={p.difficulty} />
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">{p.title}</span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-muted">
                  <polyline points="4,2 8,6 4,10" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
