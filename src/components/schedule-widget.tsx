"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SCHEDULE, PHASES } from "@/app/schedule/data";

export function ScheduleWidget() {
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [doneDays, setDoneDays] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const sd = localStorage.getItem("schedule:startDate");
    if (!sd) return;
    const cd = parseInt(localStorage.getItem("schedule:currentDay") ?? "1", 10);
    setStarted(true);
    setCurrentDay(isNaN(cd) ? 1 : Math.max(1, Math.min(60, cd)));
    let done = 0;
    for (let d = 1; d <= 60; d++) {
      if (localStorage.getItem(`schedule:done:${d}`) === "1") done++;
    }
    setDoneDays(done);
  }, []);

  if (!started || currentDay === null) {
    return (
      <Link
        href="/schedule"
        className="flex items-center justify-between rounded-xl border-[2.5px] border-foreground bg-surface px-4 py-3 shadow-[3px_3px_0_#111] hover:opacity-80 transition-opacity"
      >
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Schedule</p>
          <p className="mt-0.5 font-display text-[15px] tracking-[0.5px] text-foreground">Not started</p>
        </div>
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-muted">
          <polyline points="2,2 6,6 2,10" />
        </svg>
      </Link>
    );
  }

  const plan = SCHEDULE.find((p) => p.day === currentDay);
  const phase = plan ? PHASES.find((ph) => ph.phase === plan.phase) : null;
  const pct = Math.round((doneDays / 60) * 100);

  return (
    <Link
      href="/schedule"
      className="block rounded-xl border-[2.5px] border-foreground bg-surface px-4 py-3 shadow-[3px_3px_0_#111] hover:opacity-80 transition-opacity"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Schedule</p>
          <p className="mt-0.5 font-display text-[15px] tracking-[0.5px] text-foreground">
            Day {currentDay} of 60
          </p>
          {plan && (
            <p className="text-[11px] text-muted truncate max-w-[180px]">{plan.topic}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {phase && (
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: phase.color }} />
          )}
          <span className="font-display text-[22px] leading-none text-foreground">{pct}%</span>
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-foreground"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
