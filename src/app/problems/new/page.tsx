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
    <div className="space-y-6">
      <h1 className="font-display text-xl font-bold text-foreground">Log a new problem</h1>
      <ProblemForm action={createProblem} presetTags={presetTags} submitLabel="Save problem" />
    </div>
  );
}
