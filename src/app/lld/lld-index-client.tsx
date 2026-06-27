"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { LLDSection } from "./data";

const DIFF_COLOR: Record<string, string> = {
  EASY: "#16a34a",
  MEDIUM: "#b45309",
  HARD: "#dc2626",
};

function storageKey(slug: string) {
  return `lld:done:${slug}`;
}

function SectionFolder({
  section,
  defaultOpen,
  query,
}: {
  section: LLDSection;
  defaultOpen: boolean;
  query: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initial = new Set<string>();
    for (const item of section.items) {
      if (localStorage.getItem(storageKey(item.slug)) === "1") {
        initial.add(item.slug);
      }
    }
    setChecked(initial);
  }, [section]);

  const filtered = query
    ? section.items.filter((item) =>
        item.title.toLowerCase().includes(query) ||
        item.slug.replace(/-/g, " ").includes(query)
      )
    : section.items;

  if (query && filtered.length === 0) return null;

  const done = checked.size;
  const total = section.items.length;
  const isOpen = query ? true : open;

  return (
    <div className="select-none">
      <button
        onClick={() => !query && setOpen((o) => !o)}
        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ${
          query ? "cursor-default" : "hover:bg-foreground/5 active:bg-foreground/10"
        }`}
      >
        {!query && (
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className={`shrink-0 text-muted transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
          >
            <polyline points="3,2 7,5 3,8" />
          </svg>
        )}

        <svg width="15" height="13" viewBox="0 0 15 13" fill="none" className="shrink-0">
          <path
            d="M1 2.5C1 1.67 1.67 1 2.5 1H5.5L7 3H12.5C13.33 3 14 3.67 14 4.5V10.5C14 11.33 13.33 12 12.5 12H2.5C1.67 12 1 11.33 1 10.5V2.5Z"
            fill="#F5F1E8"
            stroke="#111111"
            strokeWidth="1.5"
          />
        </svg>

        <span className="flex-1 font-display text-[13px] tracking-[1px] text-foreground">
          {section.title}
        </span>

        <span className="shrink-0 text-[11px] text-muted">{done}/{total}</span>
        {done > 0 && (
          <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-foreground/50"
              style={{ width: `${Math.round((done / total) * 100)}%` }}
            />
          </div>
        )}
      </button>

      {isOpen && (
        <div className={`border-l-[1.5px] border-foreground/15 pl-3 ${query ? "ml-0" : "ml-3"}`}>
          {filtered.map((item) => {
            const isDone = checked.has(item.slug);
            const color = item.difficulty ? DIFF_COLOR[item.difficulty] : null;

            return (
              <Link
                key={item.slug}
                href={`/lld/${item.slug}`}
                className={`group flex items-center gap-2 rounded-lg px-2 py-[5px] transition-opacity ${
                  isDone ? "opacity-40" : "hover:bg-foreground/5"
                }`}
              >
                <svg width="11" height="13" viewBox="0 0 11 13" fill="none" className="shrink-0 text-muted/50">
                  <rect x="1" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="3" y1="4.5" x2="8" y2="4.5" stroke="currentColor" strokeWidth="1" />
                  <line x1="3" y1="7" x2="7" y2="7" stroke="currentColor" strokeWidth="1" />
                </svg>

                {color && (
                  <span className="shrink-0 w-3 text-[10px] font-bold" style={{ color }}>
                    {item.difficulty![0]}
                  </span>
                )}

                <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
                  {item.title}
                </span>

                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-foreground/30">
                    <polyline points="1.5,6 4.5,9.5 10.5,2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-muted/30 opacity-0 group-hover:opacity-100">
                    <polyline points="2,2 6,6 2,10" />
                  </svg>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function LLDIndexClient({
  sections,
  totalItems,
}: {
  sections: LLDSection[];
  totalItems: number;
}) {
  const [query, setQuery] = useState("");
  const [totalDone, setTotalDone] = useState(0);

  useEffect(() => {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("lld:done:") && localStorage.getItem(k) === "1") count++;
    }
    setTotalDone(count);
  }, []);

  const q = query.toLowerCase().trim();

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 overflow-hidden rounded-full bg-foreground/10 h-2">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${Math.round((totalDone / totalItems) * 100)}%` }}
          />
        </div>
        <span className="shrink-0 text-[12px] text-muted tabular-nums">
          {totalDone}/{totalItems}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        >
          <circle cx="6" cy="6" r="4.5" />
          <line x1="9.5" y1="9.5" x2="13" y2="13" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, patterns, concepts…"
          className="w-full rounded-xl border-[2px] border-foreground/20 bg-surface py-2 pl-9 pr-4 text-[13px] text-foreground placeholder:text-muted focus:border-foreground focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="10" y2="10" />
              <line x1="10" y1="2" x2="2" y2="10" />
            </svg>
          </button>
        )}
      </div>

      {/* Sections */}
      <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-3 shadow-[3px_3px_0_#111]">
        {!q && (
          <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
            LLD Curriculum
          </p>
        )}
        <div className="space-y-0.5">
          {sections.map((section, i) => (
            <SectionFolder
              key={section.slug}
              section={section}
              defaultOpen={i === 0}
              query={q}
            />
          ))}
        </div>

        {q && sections.every((s) =>
          !s.items.some(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.slug.replace(/-/g, " ").includes(q)
          )
        ) && (
          <p className="px-3 py-4 text-center text-[13px] text-muted">
            No topics match &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
