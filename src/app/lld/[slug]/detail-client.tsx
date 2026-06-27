"use client";

import { useState, useEffect } from "react";
import { CodeBlock } from "@/components/code-block";
import type { Block } from "../content/types";

function storageKey(slug: string) {
  return `lld:done:${slug}`;
}

function renderInline(text: string) {
  // Very minimal inline markdown: **bold** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-foreground/10 px-1 py-0.5 text-[12px] font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function LLDDetailClient({
  slug,
  blocks,
}: {
  slug: string;
  blocks: Block[];
}) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(localStorage.getItem(storageKey(slug)) === "1");
  }, [slug]);

  function toggleDone() {
    const next = !done;
    setDone(next);
    if (next) {
      localStorage.setItem(storageKey(slug), "1");
    } else {
      localStorage.removeItem(storageKey(slug));
    }
  }

  return (
    <>
      {/* Mark done button */}
      <button
        onClick={toggleDone}
        className={`flex items-center gap-2 rounded-full border-[2px] px-4 py-1.5 text-[12px] font-bold transition-all ${
          done
            ? "border-foreground bg-foreground text-background"
            : "border-foreground/30 text-muted hover:border-foreground hover:text-foreground"
        }`}
      >
        {done ? (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <polyline points="1.5,6 4.5,9.5 10.5,2.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Studied
          </>
        ) : (
          "Mark as studied"
        )}
      </button>

      {/* Content */}
      <div className="space-y-4">
        {blocks.map((block, i) => {
          if (block.type === "heading") {
            return (
              <h3 key={i} className="font-display text-[18px] tracking-[1px] text-foreground border-b border-foreground/10 pb-1 mt-6">
                {block.text}
              </h3>
            );
          }

          if (block.type === "text") {
            return (
              <p key={i} className="text-[14px] leading-relaxed text-foreground/80">
                {renderInline(block.md)}
              </p>
            );
          }

          if (block.type === "bullets") {
            return (
              <ul key={i} className="space-y-1.5 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-[13px] text-foreground/80">
                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === "code") {
            return (
              <div key={i} className="rounded-xl border-[2px] border-foreground/15 overflow-hidden">
                {block.caption && (
                  <div className="bg-foreground/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.8px] text-muted border-b border-foreground/10">
                    {block.caption}
                  </div>
                )}
                <CodeBlock code={block.code} language={block.lang} />
              </div>
            );
          }

          return null;
        })}
      </div>
    </>
  );
}
