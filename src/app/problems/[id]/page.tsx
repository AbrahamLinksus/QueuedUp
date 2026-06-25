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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{problem.title}</h1>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline"
          >
            {problem.url}
          </a>
        </div>
        <DeleteButton action={deleteProblem.bind(null, problem.id)} />
      </div>

      {latestEntry && (latestEntry.notes || latestEntry.codeSnippet) && (
        <section className="space-y-3 rounded-lg border border-border bg-surface p-4">
          <h2 className="text-sm font-medium text-muted">Solution</h2>
          {latestEntry.notes && <Markdown>{latestEntry.notes}</Markdown>}
          {latestEntry.codeSnippet && (
            <CodeBlock code={latestEntry.codeSnippet} language={latestEntry.codeLanguage} />
          )}
        </section>
      )}

      <section className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-2 text-sm font-medium text-muted">Review history</h2>
        {problem.reviews.length === 0 ? (
          <p className="text-sm text-muted">No reviews scheduled yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {problem.reviews.map((review) => (
              <li key={review.id} className="flex items-center justify-between text-muted">
                <span>Day +{review.dayOffset}</span>
                <span>{review.scheduledFor.toLocaleDateString()}</span>
                <span>{review.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ProblemForm
        action={updateProblem.bind(null, problem.id)}
        presetTags={presetTags}
        submitLabel="Save changes"
        initial={{
          title: problem.title,
          url: problem.url,
          platform: problem.platform,
          difficulty: problem.difficulty,
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
