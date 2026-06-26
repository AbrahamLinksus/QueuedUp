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

export function ProblemForm({
  action,
  presetTags,
  initial = {},
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  presetTags: PresetTag[];
  initial?: ProblemFormInitial;
  submitLabel: string;
}) {
  const selectedTagIds = new Set(initial.tagIds ?? []);

  const [title, setTitle] = useState(initial.title ?? "");
  const [url, setUrl] = useState(initial.url ?? "");
  const [platform, setPlatform] = useState(initial.platform ?? "OTHER");
  const [difficulty, setDifficulty] = useState(initial.difficulty ?? "MEDIUM");
  const [autofillStatus, setAutofillStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAutofill() {
    setAutofillStatus(null);
    startTransition(async () => {
      const result = await fetchLeetCodeProblem(url);
      if ("error" in result) {
        setAutofillStatus(result.error);
        return;
      }
      setTitle(result.title);
      setDifficulty(result.difficulty);
      setPlatform("LEETCODE");
      setAutofillStatus(`Filled in "${result.title}" (${result.difficulty}).`);
    });
  }

  return (
    <form action={action} className="space-y-6">
      <section className="space-y-3 rounded-lg border border-border bg-surface p-4">
        <h2 className="text-sm font-medium text-muted">Problem</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-muted">URL</span>
            <div className="flex gap-2">
              <input
                name="url"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <MotionButton
                type="button"
                onClick={handleAutofill}
                disabled={!url || isPending}
                className="shrink-0 rounded-md border border-border px-3 py-2 text-sm text-muted hover:bg-white/5 disabled:opacity-50"
              >
                {isPending ? "Fetching…" : "Autofill"}
              </MotionButton>
            </div>
            {autofillStatus && <p className="mt-1 text-xs text-muted">{autofillStatus}</p>}
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Title</span>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Platform</span>
            <select
              name="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="LEETCODE">LeetCode</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Difficulty</span>
            <select
              name="difficulty"
              required
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border border-border bg-surface p-4">
        <h2 className="text-sm font-medium text-muted">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {presetTags.map((tag) => (
            <label
              key={tag.id}
              className="cursor-pointer rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors has-[:checked]:border-accent has-[:checked]:text-accent"
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
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Custom tags (comma-separated)</span>
          <input
            name="customTags"
            defaultValue={initial.customTags}
            placeholder="e.g. Segment Tree, Meet in the Middle"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
      </section>

      <section className="space-y-3 rounded-lg border border-border bg-surface p-4">
        <h2 className="text-sm font-medium text-muted">Notes &amp; solution</h2>
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Approach notes</span>
          <textarea
            name="notes"
            rows={5}
            defaultValue={initial.notes}
            placeholder="Key insight, gotchas, why this approach works..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Code</span>
            <textarea
              name="codeSnippet"
              rows={8}
              defaultValue={initial.codeSnippet}
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Language</span>
            <input
              name="codeLanguage"
              defaultValue={initial.codeLanguage ?? "python"}
              className="w-28 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Time complexity</span>
            <input
              name="timeComplexity"
              defaultValue={initial.timeComplexity}
              placeholder="O(n)"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Space complexity</span>
            <input
              name="spaceComplexity"
              defaultValue={initial.spaceComplexity}
              placeholder="O(1)"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Time taken (min)</span>
            <input
              type="number"
              min={0}
              name="timeTakenMinutes"
              defaultValue={initial.timeTakenMinutes}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Attempts</span>
            <input
              type="number"
              min={1}
              name="attemptsCount"
              defaultValue={initial.attemptsCount ?? "1"}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
        </div>
      </section>

      <MotionButton
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {submitLabel}
      </MotionButton>
    </form>
  );
}
