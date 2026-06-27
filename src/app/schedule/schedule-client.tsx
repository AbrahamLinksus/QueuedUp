"use client";

import { useState, useEffect } from "react";
import type { DayPlan } from "./data";

type Phase = { phase: number; name: string; days: string; color: string };

const MS_PER_DAY = 86_400_000;

function getTodayDay(startDate: string): number {
  const start = new Date(startDate + "T00:00:00").getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start) / MS_PER_DAY) + 1;
  return Math.max(1, Math.min(60, diff));
}

function SessionBlock({ block }: { block: DayPlan["sessions"][number] }) {
  if (block.type === "break" || block.type === "lunch") {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-foreground/5 px-3 py-2">
        <span className="text-[11px] text-muted">{block.start} – {block.end}</span>
        <span className="text-[12px] text-muted">{block.label}</span>
        {block.detail && <span className="text-[11px] text-muted/60">· {block.detail}</span>}
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-foreground px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-background/50">
        {block.start} – {block.end}
      </p>
      <p className="mt-0.5 text-[13px] leading-snug text-background">{block.label}</p>
    </div>
  );
}

function DayDetail({
  plan,
  isDone,
  onToggle,
}: {
  plan: DayPlan;
  isDone: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="ml-10 mt-1 mb-3 space-y-3">
      {plan.goals.length > 0 && (
        <div className="space-y-1">
          {plan.goals.map((g, i) => (
            <p key={i} className="text-[12px] leading-snug text-muted">· {g}</p>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        {plan.sessions.map((s, i) => (
          <SessionBlock key={i} block={s} />
        ))}
      </div>

      <button
        onClick={onToggle}
        className={`rounded-full border-[1.5px] px-4 py-1.5 text-[12px] font-medium transition-colors ${
          isDone
            ? "border-foreground/20 text-foreground/30 hover:border-foreground/40 hover:text-foreground/50"
            : "border-foreground text-foreground hover:bg-foreground/5"
        }`}
      >
        {isDone ? "✓ Marked as done" : "Mark as done"}
      </button>
    </div>
  );
}

function DayRow({
  plan,
  isToday,
  isDone,
  isSelected,
  onSelect,
  onToggle,
}: {
  plan: DayPlan;
  isToday: boolean;
  isDone: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        onClick={onSelect}
        className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
          isToday
            ? "bg-foreground/10"
            : isSelected
            ? "bg-foreground/5"
            : "hover:bg-foreground/5"
        }`}
      >
        <span
          className={`shrink-0 w-8 text-[11px] font-bold tabular-nums ${
            isToday ? "text-foreground" : "text-muted"
          }`}
        >
          D{plan.day}
        </span>

        <span
          className={`flex-1 min-w-0 truncate text-[13px] ${
            isToday
              ? "font-semibold text-foreground"
              : isDone
              ? "text-foreground/40"
              : "text-foreground/80"
          }`}
        >
          {plan.topic}
        </span>

        {isToday && (
          <span className="shrink-0 rounded-full bg-foreground px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-background">
            Today
          </span>
        )}

        {isDone && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-foreground/25">
            <polyline points="1.5,6 4.5,9.5 10.5,2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}

        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`shrink-0 text-muted transition-transform duration-150 ${isSelected ? "rotate-90" : ""}`}
        >
          <polyline points="3,2 7,5 3,8" />
        </svg>
      </button>

      {isSelected && (
        <DayDetail plan={plan} isDone={isDone} onToggle={onToggle} />
      )}
    </div>
  );
}

function PhaseSection({
  phase,
  plans,
  todayDay,
  doneDays,
  isOpen,
  onToggle,
  onToggleDone,
}: {
  phase: Phase;
  plans: DayPlan[];
  todayDay: number;
  doneDays: Set<number>;
  isOpen: boolean;
  onToggle: () => void;
  onToggleDone: (day: number) => void;
}) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const phaseDone = plans.filter((p) => doneDays.has(p.day)).length;
  const hasToday = plans.some((p) => p.day === todayDay);

  return (
    <div className="select-none">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-foreground/5 active:bg-foreground/10"
      >
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`shrink-0 text-muted transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
        >
          <polyline points="3,2 7,5 3,8" />
        </svg>

        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: phase.color }}
        />

        <span className="flex-1 font-display text-[13px] tracking-[0.8px] text-foreground">
          Phase {phase.phase} — {phase.name}
        </span>

        {hasToday && (
          <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-foreground/50">
            Now
          </span>
        )}

        <span className="shrink-0 text-[11px] text-muted tabular-nums">
          {phaseDone}/{plans.length}
        </span>
      </button>

      {isOpen && (
        <div className="ml-3 border-l-[1.5px] border-foreground/15 pl-3 space-y-0.5">
          {plans.map((plan) => (
            <DayRow
              key={plan.day}
              plan={plan}
              isToday={plan.day === todayDay}
              isDone={doneDays.has(plan.day)}
              isSelected={selectedDay === plan.day}
              onSelect={() => setSelectedDay(selectedDay === plan.day ? null : plan.day)}
              onToggle={() => onToggleDone(plan.day)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ScheduleClient({
  schedule,
  phases,
}: {
  schedule: DayPlan[];
  phases: Phase[];
}) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [doneDays, setDoneDays] = useState<Set<number>>(new Set());
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([1]));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sd = localStorage.getItem("schedule:startDate");
    setStartDate(sd);

    const done = new Set<number>();
    for (let d = 1; d <= 60; d++) {
      if (localStorage.getItem(`schedule:done:${d}`) === "1") done.add(d);
    }
    setDoneDays(done);

    if (sd) {
      const todayDay = getTodayDay(sd);
      const todayPlan = schedule.find((p) => p.day === todayDay);
      if (todayPlan) setOpenPhases(new Set([todayPlan.phase]));
    }

    setLoaded(true);
  }, [schedule]);

  function handleStart() {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("schedule:startDate", today);
    setStartDate(today);
    setOpenPhases(new Set([1]));
  }

  function togglePhase(p: number) {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }

  function toggleDone(day: number) {
    const isDone = doneDays.has(day);
    if (isDone) localStorage.removeItem(`schedule:done:${day}`);
    else localStorage.setItem(`schedule:done:${day}`, "1");
    setDoneDays((prev) => {
      const next = new Set(prev);
      if (isDone) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  function handleReset() {
    if (!confirm("Reset schedule? This will clear your start date but keep days marked as done.")) return;
    localStorage.removeItem("schedule:startDate");
    setStartDate(null);
  }

  if (!loaded) return null;

  if (!startDate) {
    return (
      <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-8 shadow-[3px_3px_0_#111] text-center space-y-5">
        <div className="space-y-2">
          <p className="font-display text-[24px] tracking-[1px] text-foreground">Ready to begin?</p>
          <p className="text-[13px] leading-relaxed text-muted">
            60 days · 10 hours/day · 4 sessions + breaks<br />
            DSA first (days 1–54), then LLD (days 55–60).<br />
            Click start to lock in today as Day 1.
          </p>
        </div>
        <button
          onClick={handleStart}
          className="rounded-full border-[2px] border-foreground bg-foreground px-7 py-2.5 text-[13px] font-bold text-background transition-opacity hover:opacity-80"
        >
          Start Schedule
        </button>
      </div>
    );
  }

  const todayDay = getTodayDay(startDate);
  const todayPlan = schedule.find((p) => p.day === todayDay);
  const totalDone = doneDays.size;
  const pct = Math.round((totalDone / 60) * 100);

  const plansByPhase: Record<number, DayPlan[]> = {};
  for (const p of schedule) {
    if (!plansByPhase[p.phase]) plansByPhase[p.phase] = [];
    plansByPhase[p.phase].push(p);
  }

  const startFormatted = new Date(startDate + "T00:00:00").toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="space-y-3">
      {/* Progress card */}
      {todayPlan && (
        <div className="rounded-xl border-[2.5px] border-foreground bg-surface px-4 py-4 shadow-[3px_3px_0_#111] space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-[20px] tracking-[0.5px] text-foreground">
                Day {todayDay} of 60
              </p>
              <p className="text-[12px] text-muted">{todayPlan.phaseName}</p>
              <p className="mt-1 text-[13px] font-medium text-foreground">{todayPlan.topic}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-[32px] leading-none text-foreground">{pct}%</p>
              <p className="text-[10px] text-muted">{totalDone} days done</p>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-foreground transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>

          <button
            onClick={() => toggleDone(todayDay)}
            className={`rounded-full border-[1.5px] px-4 py-1.5 text-[12px] font-medium transition-colors ${
              doneDays.has(todayDay)
                ? "border-foreground/20 text-foreground/30 hover:border-foreground/40"
                : "border-foreground text-foreground hover:bg-foreground/5"
            }`}
          >
            {doneDays.has(todayDay) ? "✓ Today done" : "Mark today as done"}
          </button>
        </div>
      )}

      {/* Phase list */}
      <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-3 shadow-[3px_3px_0_#111]">
        <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
          60-Day Plan
        </p>
        <div className="space-y-0.5">
          {phases.map((phase) => (
            <PhaseSection
              key={phase.phase}
              phase={phase}
              plans={plansByPhase[phase.phase] ?? []}
              todayDay={todayDay}
              doneDays={doneDays}
              isOpen={openPhases.has(phase.phase)}
              onToggle={() => togglePhase(phase.phase)}
              onToggleDone={toggleDone}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-muted">
        Started {startFormatted}
        {" · "}
        <button
          onClick={handleReset}
          className="underline transition-colors hover:text-foreground"
        >
          reset
        </button>
      </p>
    </div>
  );
}
