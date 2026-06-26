import Link from "next/link";
import { db } from "@/lib/db";
import { ProblemForm } from "../problem-form";
import { createProblem } from "../actions";

// Maps sheet topic names → preset tag names
const TOPIC_TO_PRESET: Record<string, string> = {
  arrays: "Array",
  hashing: "Hash Table",
  string: "String",
  "linked list": "Linked List",
  stack: "Stack",
  queue: "Heap",
  trees: "Binary Tree",
  traversal: "DFS",
  backtracking: "Backtracking",
  sorting: "Sorting",
  "dynamic programming": "Dynamic Programming",
  graph: "Graph",
  recursion: "Recursion",
};

export default async function NewProblemPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const [params, presetTags] = await Promise.all([
    searchParams,
    db.tag.findMany({ where: { isPreset: true }, orderBy: { name: "asc" } }),
  ]);

  // Build initial values from sheet pre-fill params
  const prefillTopic = params.topic?.toLowerCase().trim();
  const presetName = prefillTopic ? TOPIC_TO_PRESET[prefillTopic] : undefined;
  const matchedTag = presetName
    ? presetTags.find((t) => t.name.toLowerCase() === presetName.toLowerCase())
    : undefined;

  const initial = {
    title: params.title,
    url: params.url,
    difficulty: params.difficulty,
    tagIds: matchedTag ? [matchedTag.id] : undefined,
    customTags: !matchedTag && prefillTopic ? prefillTopic : undefined,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h1 className="font-display text-[52px] leading-[0.9] tracking-[3px] text-foreground">
          NEW
          <br />
          PROBLEM
        </h1>
        <Link
          href={params.url ? "/sheets" : "/problems"}
          className="mt-1.5 shrink-0 rounded-full border-2 border-[#ccc] px-3 py-1.5 text-xs font-semibold text-muted"
        >
          ✕ cancel
        </Link>
      </div>

      <ProblemForm action={createProblem} presetTags={presetTags} initial={initial} submitLabel="Save Problem" />
    </div>
  );
}
