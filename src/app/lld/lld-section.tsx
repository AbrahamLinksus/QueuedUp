"use client";

import { useState, useEffect } from "react";
import type { LLDSection } from "./data";
import { lldUrl } from "./data";

const DIFF_COLOR: Record<string, string> = {
  EASY: "#16a34a",
  MEDIUM: "#b45309",
  HARD: "#dc2626",
};

const DIFF_LABEL: Record<string, string> = {
  EASY: "E",
  MEDIUM: "M",
  HARD: "H",
};

function storageKey(sectionSlug: string, itemSlug: string) {
  return `lld:${sectionSlug}:${itemSlug}`;
}

export function LLDSectionCard({
  section,
  defaultOpen = false,
}: {
  section: LLDSection;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initial = new Set<string>();
    for (const item of section.items) {
      if (localStorage.getItem(storageKey(section.slug, item.slug)) === "1") {
        initial.add(item.slug);
      }
    }
    setChecked(initial);
  }, [section]);

  function toggle(slug: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
        localStorage.removeItem(storageKey(section.slug, slug));
      } else {
        next.add(slug);
        localStorage.setItem(storageKey(section.slug, slug), "1");
      }
      return next;
    });
  }

  const done = checked.size;
  const total = section.items.length;

  return (
    <div className="select-none">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-foreground/5 active:bg-foreground/10"
      >
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`shrink-0 text-muted transition-transform duration-150 ${open ? "rotate-90" : ""}`}
        >
          <polyline points="3,2 7,5 3,8" />
        </svg>

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

        <span className="shrink-0 text-[11px] text-muted">
          {done}/{total}
        </span>
        {done > 0 && (
          <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-foreground/50"
              style={{ width: `${Math.round((done / total) * 100)}%` }}
            />
          </div>
        )}
      </button>

      {open && (
        <div className="ml-3 border-l-[1.5px] border-foreground/15 pl-3">
          {section.items.map((item) => {
            const isChecked = checked.has(item.slug);
            const color = item.difficulty ? (DIFF_COLOR[item.difficulty] ?? "#666") : null;

            return (
              <div
                key={item.slug}
                className={`group flex items-center gap-2 rounded-lg px-2 py-[5px] transition-opacity ${
                  isChecked ? "opacity-40" : "hover:bg-foreground/5"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggle(item.slug)}
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-[1.5px] border-foreground/30 transition-colors hover:border-foreground"
                  style={isChecked ? { background: "#111", borderColor: "#111" } : {}}
                >
                  {isChecked && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <polyline
                        points="1,4 3,6.5 7,1.5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {/* Difficulty badge */}
                {color && (
                  <span className="shrink-0 text-[10px] font-bold w-3" style={{ color }}>
                    {DIFF_LABEL[item.difficulty!]}
                  </span>
                )}

                {/* Title — opens AlgoMaster */}
                <a
                  href={lldUrl(item.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate text-[13px] text-foreground hover:underline"
                >
                  {item.title}
                </a>

                {/* External link icon */}
                <svg
                  width="10" height="10" viewBox="0 0 10 10" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  className="shrink-0 text-muted/40 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <path d="M4 2H2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V6" />
                  <polyline points="6,1 9,1 9,4" />
                  <line x1="5" y1="5" x2="9" y2="1" />
                </svg>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function LLDProgress({ totalItems }: { totalItems: number }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("lld:") && localStorage.getItem(k) === "1") count++;
    }
    setDone(count);
  }, []);

  return (
    <p className="mt-1.5 text-sm text-muted">
      {done} of {totalItems} completed
    </p>
  );
}
