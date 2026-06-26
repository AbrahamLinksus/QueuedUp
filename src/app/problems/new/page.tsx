import Link from "next/link";
import { db } from "@/lib/db";
import { ProblemForm } from "../problem-form";
import { createProblem } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProblemPage() {
  const presetTags = await db.tag.findMany({
    where: { isPreset: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h1 className="font-display text-[52px] leading-[0.9] tracking-[3px] text-foreground">
          NEW
          <br />
          PROBLEM
        </h1>
        <Link
          href="/problems"
          className="mt-1.5 shrink-0 rounded-full border-2 border-[#ccc] px-3 py-1.5 text-xs font-semibold text-muted"
        >
          ✕ cancel
        </Link>
      </div>

      <ProblemForm action={createProblem} presetTags={presetTags} submitLabel="Save Problem" />
    </div>
  );
}
