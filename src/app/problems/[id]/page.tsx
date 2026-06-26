import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Markdown } from "@/components/markdown";
import { CodeBlock } from "@/components/code-block";
import { ProblemForm } from "../problem-form";
import { updateProblem, deleteProblem } from "../actions";
import { DeleteButton } from "../delete-button";

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [problem, presetTags] = await Promise.all([
    db.problem.findUnique({
      where: { id },
      include: {
        tags: true,
        entries: { orderBy: { createdAt: "desc" } },
        reviews: { orderBy: { scheduledFor: "asc" } },
      },
    }),
    db.tag.findMany({ where: { isPreset: true }, orderBy: { name: "asc" } }),
  ]);

  if (!problem) notFound();

  const latestEntry = problem.entries[0];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[42px] leading-[0.9] tracking-[2px] text-foreground">
            {problem.title}
          </h1>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-xs text-muted underline"
          >
            {problem.url}
          </a>
        </div>
        <DeleteButton action={deleteProblem.bind(null, problem.id)} />
      </div>

      {latestEntry && (latestEntry.notes || latestEntry.codeSnippet) && (
        <section className="space-y-3 rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111]">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">Solution</h2>
          {latestEntry.notes && <Markdown>{latestEntry.notes}</Markdown>}
          {latestEntry.codeSnippet && (
            <CodeBlock code={latestEntry.codeSnippet} language={latestEntry.codeLanguage} />
          )}
        </section>
      )}

      <section className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111]">
        <h2 className="mb-3 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
          Review history
        </h2>
        {problem.reviews.length === 0 ? (
          <p className="text-sm text-muted">No reviews scheduled yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {problem.reviews.map((review) => (
              <li
                key={review.id}
                className="flex items-center justify-between text-sm text-muted"
              >
                <span>Day +{review.dayOffset}</span>
                <span>{review.scheduledFor.toLocaleDateString()}</span>
                <span className="text-[11px]">{review.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ProblemForm
        action={updateProblem.bind(null, problem.id)}
        presetTags={presetTags}
        submitLabel="Save Changes"
        singleColumn
        initial={{
          title: problem.title,
          url: problem.url,
          platform: problem.platform,
          difficulty: problem.difficulty,
          status: problem.status,
          tagIds: problem.tags.map((tag) => tag.id),
          notes: latestEntry?.notes,
          codeSnippet: latestEntry?.codeSnippet,
          codeLanguage: latestEntry?.codeLanguage,
          timeComplexity: latestEntry?.timeComplexity ?? undefined,
          spaceComplexity: latestEntry?.spaceComplexity ?? undefined,
          timeTakenMinutes: latestEntry?.timeTakenMinutes?.toString(),
          attemptsCount: latestEntry?.attemptsCount?.toString(),
        }}
      />
    </div>
  );
}
