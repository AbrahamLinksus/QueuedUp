"use client";

import { useState, useEffect } from "react";
import type { DayPlan } from "./data";

type Phase = { phase: number; name: string; days: string; color: string };

function SessionBlock({ block }: { block: DayPlan["sessions"][number] }) {
  if (block.type === "break" || block.type === "lunch") {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-foreground/5 px-3 py-2">
        <span className="shrink-0 text-[11px] text-muted">{block.start} – {block.end}</span>
        <span className="text-[12px] text-muted">{block.label}</span>
        {block.detail && <span className="text-[11px] text-muted/60">· {block.detail}</span>}
      </div>
    );
  }

  const isLLD = block.label.startsWith("LLD:");
  return (
    <div className={`rounded-lg px-3 py-2.5 ${isLLD ? "bg-foreground/15" : "bg-foreground"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wide ${isLLD ? "text-foreground/40" : "text-background/50"}`}>
        {block.start} – {block.end}{isLLD ? " · LLD" : ""}
      </p>
      <p className={`mt-0.5 text-[13px] leading-snug ${isLLD ? "text-foreground" : "text-background"}`}>
        {isLLD ? block.label.replace(/^LLD:\s*/, "") : block.label}
      </p>
    </div>
  );
}

function DayDetail({
  plan,
  isDone,
  isCurrentDay,
  onMarkDone,
  onUnmarkDone,
}: {
  plan: DayPlan;
  isDone: boolean;
  isCurrentDay: boolean;
  onMarkDone: () => void;
  onUnmarkDone: () => void;
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

      {isCurrentDay && !isDone && (
        <button
          onClick={onMarkDone}
          className="rounded-full border-[1.5px] border-foreground px-4 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          Mark as done → advance to Day {Math.min(plan.day + 1, 30)}
        </button>
      )}
      {isDone && (
        <button
          onClick={onUnmarkDone}
          className="rounded-full border-[1.5px] border-foreground/20 px-4 py-1.5 text-[12px] text-foreground/30 transition-colors hover:border-foreground/40 hover:text-foreground/50"
        >
          ✓ Done — undo
        </button>
      )}
    </div>
  );
}

function DayRow({
  plan,
  isCurrentDay,
  isDone,
  isSelected,
  onSelect,
  onMarkDone,
  onUnmarkDone,
}: {
  plan: DayPlan;
  isCurrentDay: boolean;
  isDone: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onMarkDone: () => void;
  onUnmarkDone: () => void;
}) {
  return (
    <div>
      <button
        onClick={onSelect}
        className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
          isCurrentDay
            ? "bg-foreground/10"
            : isSelected
            ? "bg-foreground/5"
            : "hover:bg-foreground/5"
        }`}
      >
        <span className={`shrink-0 w-8 text-[11px] font-bold tabular-nums ${isCurrentDay ? "text-foreground" : "text-muted"}`}>
          D{plan.day}
        </span>

        <span className={`flex-1 min-w-0 truncate text-[13px] ${
          isCurrentDay ? "font-semibold text-foreground" : isDone ? "text-foreground/35" : "text-foreground/80"
        }`}>
          {plan.topic}
        </span>

        {isCurrentDay && (
          <span className="shrink-0 rounded-full bg-foreground px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-background">
            Current
          </span>
        )}

        {isDone && !isCurrentDay && (
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
        <DayDetail
          plan={plan}
          isDone={isDone}
          isCurrentDay={isCurrentDay}
          onMarkDone={onMarkDone}
          onUnmarkDone={onUnmarkDone}
        />
      )}
    </div>
  );
}

function PhaseSection({
  phase,
  plans,
  currentDay,
  doneDays,
  isOpen,
  onToggle,
  onMarkDone,
  onUnmarkDone,
}: {
  phase: Phase;
  plans: DayPlan[];
  currentDay: number;
  doneDays: Set<number>;
  isOpen: boolean;
  onToggle: () => void;
  onMarkDone: (day: number) => void;
  onUnmarkDone: (day: number) => void;
}) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const phaseDone = plans.filter((p) => doneDays.has(p.day)).length;
  const hasCurrent = plans.some((p) => p.day === currentDay);

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

        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: phase.color }} />

        <span className="flex-1 font-display text-[13px] tracking-[0.8px] text-foreground">
          Phase {phase.phase} — {phase.name}
        </span>

        {hasCurrent && (
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
              isCurrentDay={plan.day === currentDay}
              isDone={doneDays.has(plan.day)}
              isSelected={selectedDay === plan.day}
              onSelect={() => setSelectedDay(selectedDay === plan.day ? null : plan.day)}
              onMarkDone={() => onMarkDone(plan.day)}
              onUnmarkDone={() => onUnmarkDone(plan.day)}
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
  const [currentDay, setCurrentDay] = useState(1);
  const [doneDays, setDoneDays] = useState<Set<number>>(new Set());
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([1]));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sd = localStorage.getItem("schedule:startDate");
    const cd = parseInt(localStorage.getItem("schedule:currentDay") ?? "1", 10);
    setStartDate(sd);
    setCurrentDay(isNaN(cd) ? 1 : Math.max(1, Math.min(30, cd)));

    const done = new Set<number>();
    for (let d = 1; d <= 30; d++) {
      if (localStorage.getItem(`schedule:done:${d}`) === "1") done.add(d);
    }
    setDoneDays(done);

    if (sd) {
      const activePlan = schedule.find((p) => p.day === cd);
      if (activePlan) setOpenPhases(new Set([activePlan.phase]));
    }

    setLoaded(true);
  }, [schedule]);

  function handleStart() {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("schedule:startDate", today);
    localStorage.setItem("schedule:currentDay", "1");
    setStartDate(today);
    setCurrentDay(1);
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

  function handleMarkDone(day: number) {
    localStorage.setItem(`schedule:done:${day}`, "1");
    setDoneDays((prev) => new Set([...prev, day]));
    if (day === currentDay) {
      const next = Math.min(day + 1, 30);
      localStorage.setItem("schedule:currentDay", String(next));
      setCurrentDay(next);
      // Auto-open the next day's phase
      const nextPlan = schedule.find((p) => p.day === next);
      if (nextPlan) setOpenPhases((prev) => new Set([...prev, nextPlan.phase]));
    }
  }

  function handleUnmarkDone(day: number) {
    localStorage.removeItem(`schedule:done:${day}`);
    setDoneDays((prev) => {
      const next = new Set(prev);
      next.delete(day);
      return next;
    });
  }

  function handleReset() {
    if (!confirm("Reset schedule? This will clear your start date and current day (done days are kept).")) return;
    localStorage.removeItem("schedule:startDate");
    localStorage.removeItem("schedule:currentDay");
    setStartDate(null);
    setCurrentDay(1);
    setOpenPhases(new Set([1]));
  }

  if (!loaded) return null;

  if (!startDate) {
    return (
      <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-8 shadow-[3px_3px_0_#111] text-center space-y-5">
        <div className="space-y-2">
          <p className="font-display text-[24px] tracking-[1px] text-foreground">Ready to begin?</p>
          <p className="text-[13px] leading-relaxed text-muted">
            30 days · 10 hrs/day · 3 DSA sessions + 1 LLD session daily<br />
            DSA progresses from arrays to DP. LLD runs in parallel.<br />
            Miss a day? Just pick up where you left off tomorrow.
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

  const currentPlan = schedule.find((p) => p.day === currentDay);
  const totalDone = doneDays.size;
  const pct = Math.round((totalDone / 30) * 100);

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
      {currentPlan && (
        <div className="rounded-xl border-[2.5px] border-foreground bg-surface px-4 py-4 shadow-[3px_3px_0_#111] space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-[20px] tracking-[0.5px] text-foreground">
                Day {currentDay} of 30
              </p>
              <p className="text-[12px] text-muted">{currentPlan.phaseName}</p>
              <p className="mt-0.5 text-[13px] font-medium text-foreground">{currentPlan.topic}</p>
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

          <p className="text-[11px] text-muted">
            Miss a day? You stay on Day {currentDay} until you mark it done — nothing shifts or gets lost.
          </p>
        </div>
      )}

      {/* Phase list */}
      <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-3 shadow-[3px_3px_0_#111]">
        <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
          60-Day Plan · 3 DSA + 1 LLD per day
        </p>
        <div className="space-y-0.5">
          {phases.map((phase) => (
            <PhaseSection
              key={phase.phase}
              phase={phase}
              plans={plansByPhase[phase.phase] ?? []}
              currentDay={currentDay}
              doneDays={doneDays}
              isOpen={openPhases.has(phase.phase)}
              onToggle={() => togglePhase(phase.phase)}
              onMarkDone={handleMarkDone}
              onUnmarkDone={handleUnmarkDone}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-muted">
        Started {startFormatted}
        {" · "}
        <button onClick={handleReset} className="underline transition-colors hover:text-foreground">
          reset
        </button>
      </p>
    </div>
  );
}
