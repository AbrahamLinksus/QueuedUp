"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Tag = { id: string; name: string };

export function FilterBar({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const selectClass =
    "rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className={selectClass}
        value={searchParams.get("difficulty") ?? "ALL"}
        onChange={(e) => setParam("difficulty", e.target.value)}
      >
        <option value="ALL">All difficulties</option>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>

      <select
        className={selectClass}
        value={searchParams.get("status") ?? "ALL"}
        onChange={(e) => setParam("status", e.target.value)}
      >
        <option value="ALL">All statuses</option>
        <option value="ACTIVE_REVIEW">Active review</option>
        <option value="MASTERED">Mastered</option>
      </select>

      <select
        className={selectClass}
        value={searchParams.get("platform") ?? "ALL"}
        onChange={(e) => setParam("platform", e.target.value)}
      >
        <option value="ALL">All platforms</option>
        <option value="LEETCODE">LeetCode</option>
        <option value="OTHER">Other</option>
      </select>

      <select
        className={selectClass}
        value={searchParams.get("tag") ?? "ALL"}
        onChange={(e) => setParam("tag", e.target.value)}
      >
        <option value="ALL">All tags</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={searchParams.get("sort") ?? "newest"}
        onChange={(e) => setParam("sort", e.target.value)}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="difficulty">Difficulty</option>
      </select>
    </div>
  );
}
