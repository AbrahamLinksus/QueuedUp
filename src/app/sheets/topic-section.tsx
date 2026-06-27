"use client";

import { useState } from "react";
import Link from "next/link";

type SheetRow = {
  id: string;
  title: string;
  url: string;
  difficulty: string;
  topic: string;
};

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

export function TopicSection({
  topic,
  problems,
  loggedUrls,
  defaultOpen = false,
}: {
  topic: string;
  problems: SheetRow[];
  loggedUrls: Set<string>;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const normalizeUrl = (url: string) =>
    url.toLowerCase().split(/[?#]/)[0].replace(/\/$/, "");

  const done = problems.filter((p) => loggedUrls.has(normalizeUrl(p.url))).length;

  function addUrl(p: SheetRow) {
    const params = new URLSearchParams({
      title: p.title,
      url: p.url,
      difficulty: p.difficulty,
      topic: p.topic,
    });
    return `/problems/new?${params.toString()}`;
  }

  return (
    <div className="select-none">
      {/* ── Folder row ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-foreground/5 active:bg-foreground/10"
      >
        {/* Chevron */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`shrink-0 text-muted transition-transform duration-150 ${open ? "rotate-90" : ""}`}
        >
          <polyline points="3,2 7,5 3,8" />
        </svg>

        {/* Folder icon */}
        <svg width="15" height="13" viewBox="0 0 15 13" fill="none" className="shrink-0">
          <path
            d="M1 2.5C1 1.67 1.67 1 2.5 1H5.5L7 3H12.5C13.33 3 14 3.67 14 4.5V10.5C14 11.33 13.33 12 12.5 12H2.5C1.67 12 1 11.33 1 10.5V2.5Z"
            fill="#F5F1E8"
            stroke="#111111"
            strokeWidth="1.5"
          />
        </svg>

        {/* Topic name */}
        <span className="flex-1 font-display text-[13px] capitalize tracking-[1px] text-foreground">
          {topic}
        </span>

        {/* Progress */}
        <span className="shrink-0 text-[11px] text-muted">
          {done}/{problems.length}
        </span>
        {done > 0 && (
          <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-foreground/50"
              style={{ width: `${Math.round((done / problems.length) * 100)}%` }}
            />
          </div>
        )}
      </button>

      {/* ── File rows ── */}
      {open && (
        <div className="ml-3 border-l-[1.5px] border-foreground/15 pl-3">
          {problems.map((p) => {
            const isLogged = loggedUrls.has(normalizeUrl(p.url));
            const color = DIFF_COLOR[p.difficulty] ?? "#666";
            return (
              <div
                key={p.id}
                className={`group flex items-center gap-2 rounded-lg px-2 py-[5px] ${
                  isLogged ? "opacity-50" : "hover:bg-foreground/5"
                }`}
              >
                {/* File icon */}
                <svg width="11" height="13" viewBox="0 0 11 13" fill="none" className="shrink-0 text-muted/50">
                  <rect x="1" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="3" y1="4.5" x2="8" y2="4.5" stroke="currentColor" strokeWidth="1" />
                  <line x1="3" y1="7" x2="7" y2="7" stroke="currentColor" strokeWidth="1" />
                </svg>

                {/* Difficulty dot */}
                <span
                  className="shrink-0 text-[10px] font-bold"
                  style={{ color }}
                >
                  {DIFF_LABEL[p.difficulty] ?? "?"}
                </span>

                {/* Title — opens LeetCode */}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate text-[13px] text-foreground hover:underline"
                >
                  {p.title}
                </a>

                {/* Action */}
                {isLogged ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-foreground/30">
                    <polyline points="1.5,6 4.5,9.5 10.5,2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <Link
                    href={addUrl(p)}
                    className="shrink-0 rounded border border-transparent px-1.5 py-0.5 text-[10px] font-semibold text-muted opacity-0 transition-opacity group-hover:border-foreground/20 group-hover:opacity-100 hover:text-foreground"
                  >
                    + Log
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
