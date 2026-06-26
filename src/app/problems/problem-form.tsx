"use client";

import { useState, useTransition } from "react";
import { MotionButton } from "@/components/motion-button";
import { fetchLeetCodeProblem } from "./actions";

type PresetTag = { id: string; name: string };

export type ProblemFormInitial = {
  title?: string;
  url?: string;
  platform?: string;
  difficulty?: string;
  status?: string;
  tagIds?: string[];
  customTags?: string;
  notes?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  timeTakenMinutes?: string;
  attemptsCount?: string;
};

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
const DIFFICULTY_LABELS: Record<string, string> = { EASY: "EASY", MEDIUM: "MED", HARD: "HARD" };

function DifficultyIcon({ difficulty }: { difficulty: string }) {
  if (difficulty === "EASY")
    return <div className="h-[9px] w-[9px] shrink-0 rounded-full border-2 border-current" />;
  if (difficulty === "MEDIUM")
    return (
      <div className="-mt-px h-0 w-0 shrink-0 border-b-[9px] border-l-[5px] border-r-[5px] border-b-current border-l-transparent border-r-transparent" />
    );
  return <div className="h-[9px] w-[9px] shrink-0 border-2 border-current" />;
}

export function ProblemForm({
  action,
  presetTags,
  initial = {},
  submitLabel,
  singleColumn = false,
}: {
  action: (formData: FormData) => void | Promise<void>;
  presetTags: PresetTag[];
  initial?: ProblemFormInitial;
  submitLabel: string;
  singleColumn?: boolean;
}) {
  const selectedTagIds = new Set(initial.tagIds ?? []);

  const [title, setTitle] = useState(initial.title ?? "");
  const [url, setUrl] = useState(initial.url ?? "");
  const [platform, setPlatform] = useState(initial.platform ?? "OTHER");
  const [difficulty, setDifficulty] = useState(initial.difficulty ?? "MEDIUM");
  const [status, setStatus] = useState(initial.status ?? "ACTIVE_REVIEW");
  const [autofillStatus, setAutofillStatus] = useState<{ ok: boolean; rateLimited?: boolean; msg: string } | null>(null);
  const [showCode, setShowCode] = useState(!!initial.codeSnippet);
  const [showComplexity, setShowComplexity] = useState(
    !!(initial.timeComplexity || initial.spaceComplexity || initial.timeTakenMinutes)
  );
  const [isPending, startTransition] = useTransition();

  const inputClass =
    "w-full rounded-lg border-2 border-foreground bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30";

  function handleAutofill() {
    setAutofillStatus(null);
    startTransition(async () => {
      const result = await fetchLeetCodeProblem(url);
      if ("error" in result) {
        if (result.error === "rate-limited") {
          setAutofillStatus({ ok: false, rateLimited: true, msg: "LeetCode rate limit hit — fill in the title and difficulty manually below." });
        } else {
          setAutofillStatus({ ok: false, msg: result.error });
        }
        return;
      }
      setTitle(result.title);
      setDifficulty(result.difficulty);
      setPlatform("LEETCODE");
      setAutofillStatus({ ok: true, msg: `Filled "${result.title}" (${result.difficulty}).` });
    });
  }

  return (
    <form action={action} className="space-y-3.5">
      {/*
        Desktop two-column grid:
          Left col  = problem metadata (title, difficulty, tags, status)
          Right col = entry data (notes, code, complexity+timing)
      */}
      <div className={singleColumn ? "space-y-3.5" : "space-y-3.5 md:grid md:grid-cols-2 md:items-start md:gap-4 md:space-y-0"}>

        {/* ── LEFT COLUMN ──────────────────────────────────────── */}

        {/* Title + URL — left col, row 1 */}
        <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111] md:col-start-1 md:row-start-1">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
            Problem Title
          </p>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Two Sum"
            className={inputClass}
          />
          <div className="mt-2 flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border-2 border-[#ccc] bg-background px-3 py-2.5">
              <span className="shrink-0 text-xs text-muted">URL</span>
              <div className="h-3.5 w-px shrink-0 bg-[#ccc]" />
              <input
                name="url"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="leetcode.com/problems/..."
                className="min-w-0 flex-1 bg-transparent text-xs text-foreground focus:outline-none"
              />
            </div>
            <MotionButton
              type="button"
              onClick={handleAutofill}
              disabled={!url || isPending}
              className="shrink-0 rounded-lg border-2 border-[#ccc] px-3 py-2.5 text-xs font-semibold text-muted hover:border-foreground disabled:opacity-40"
            >
              {isPending ? "…" : "Autofill"}
            </MotionButton>
          </div>
          {autofillStatus && (
            <p className={`mt-1.5 text-xs ${autofillStatus.ok ? "text-muted" : autofillStatus.rateLimited ? "text-foreground font-medium" : "text-danger"}`}>
              {autofillStatus.msg}
            </p>
          )}
          <input type="hidden" name="platform" value={platform} />
        </div>

        {/* Difficulty — left col, row 2 */}
        <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111] md:col-start-1 md:row-start-2">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
            Difficulty
          </p>
          <input type="hidden" name="difficulty" value={difficulty} />
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border-[2.5px] border-foreground py-2.5 text-xs font-bold transition-colors ${
                  difficulty === d
                    ? "bg-foreground text-background"
                    : "bg-background text-foreground"
                }`}
              >
                <DifficultyIcon difficulty={d} />
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </div>

        {/* Tags — left col, row 3 */}
        <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111] md:col-start-1 md:row-start-3">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Category</p>
          <div className="flex flex-wrap gap-2">
            {presetTags.map((tag) => (
              <label
                key={tag.id}
                className="cursor-pointer rounded-full border-2 border-foreground px-3 py-1 text-xs font-semibold text-foreground transition-colors has-[:checked]:bg-foreground has-[:checked]:font-bold has-[:checked]:text-background"
              >
                <input
                  type="checkbox"
                  name="tagIds"
                  value={tag.id}
                  defaultChecked={selectedTagIds.has(tag.id)}
                  className="sr-only"
                />
                {tag.name}
              </label>
            ))}
          </div>
          <input
            name="customTags"
            defaultValue={initial.customTags}
            placeholder="Custom tags, comma-separated…"
            className="mt-2.5 w-full rounded-lg border-[1.5px] border-dashed border-[#bbb] bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-foreground focus:outline-none"
          />
        </div>

        {/* Status — left col, row 4 on desktop */}
        <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111] md:col-start-1 md:row-start-4">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Status</p>
          <input type="hidden" name="status" value={status} />
          {status === "MASTERED" ? (
            <div className="flex items-center gap-2 rounded-lg border-[2.5px] border-foreground bg-foreground px-4 py-2.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                <polyline points="1.5,6 4.5,9.5 10.5,2.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-bold text-background">MASTERED</span>
              <span className="ml-auto text-[10px] text-background opacity-60">earned via reviews</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setStatus("ACTIVE_REVIEW")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-[2.5px] border-foreground bg-foreground py-2.5 text-xs font-bold text-background"
            >
              <div className="h-2 w-2 shrink-0 rounded-full bg-background" />
              ACTIVE
            </button>
          )}
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────── */}

        {/* Notes — right col, row 1 */}
        <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111] md:col-start-2 md:row-start-1">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Notes</p>
            <span className="text-[10px] text-[#aaa]">optional</span>
          </div>
          <textarea
            name="notes"
            rows={4}
            defaultValue={initial.notes}
            placeholder="Key insight, gotchas, approach..."
            className={inputClass}
          />
        </div>

        {/* Code — right col, row 2 — collapsible */}
        <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111] md:col-start-2 md:row-start-2">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Code</p>
            {showCode ? (
              <button
                type="button"
                onClick={() => setShowCode(false)}
                className="text-[10px] text-muted hover:text-foreground"
              >
                ✕ remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowCode(true)}
                className="rounded border border-dashed border-[#bbb] px-2 py-0.5 text-[10px] text-muted hover:border-foreground hover:text-foreground"
              >
                + add
              </button>
            )}
          </div>
          {showCode && (
            <div className="mt-2 space-y-2">
              <input
                name="codeLanguage"
                defaultValue={initial.codeLanguage ?? "python"}
                placeholder="language"
                className="rounded border border-[#ccc] bg-background px-2 py-1 text-xs text-muted focus:outline-none"
              />
              <textarea
                name="codeSnippet"
                rows={6}
                defaultValue={initial.codeSnippet}
                className={`${inputClass} font-mono`}
              />
            </div>
          )}
        </div>

        {/* Complexity + timing — right col, row 3 — collapsible */}
        <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111] md:col-start-2 md:row-start-3">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
              Complexity &amp; Timing
            </p>
            {showComplexity ? (
              <button
                type="button"
                onClick={() => setShowComplexity(false)}
                className="text-[10px] text-muted hover:text-foreground"
              >
                ✕ remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowComplexity(true)}
                className="rounded border border-dashed border-[#bbb] px-2 py-0.5 text-[10px] text-muted hover:border-foreground hover:text-foreground"
              >
                + add
              </button>
            )}
          </div>
          {showComplexity && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-[10px] text-muted">Time</span>
                <input
                  name="timeComplexity"
                  defaultValue={initial.timeComplexity}
                  placeholder="O(n)"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] text-muted">Space</span>
                <input
                  name="spaceComplexity"
                  defaultValue={initial.spaceComplexity}
                  placeholder="O(1)"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] text-muted">Time taken (min)</span>
                <input
                  type="number"
                  min={0}
                  name="timeTakenMinutes"
                  defaultValue={initial.timeTakenMinutes}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] text-muted">Attempts</span>
                <input
                  type="number"
                  min={1}
                  name="attemptsCount"
                  defaultValue={initial.attemptsCount ?? "1"}
                  className={inputClass}
                />
              </label>
            </div>
          )}
        </div>

      </div>

      {/* Submit — always full width below both columns */}
      <MotionButton
        type="submit"
        className="w-full rounded-xl border-[2.5px] border-foreground bg-foreground py-4 font-display text-[22px] tracking-[2.5px] text-background shadow-[3px_3px_0_#111]"
      >
        {submitLabel.toUpperCase()}
      </MotionButton>
    </form>
  );
}
