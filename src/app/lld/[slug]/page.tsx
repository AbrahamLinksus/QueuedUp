import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";
import { CONTENT_BY_SLUG } from "../content";
import { LLDDetailClient } from "./detail-client";

const OWNER_USERNAME = (process.env.OWNER_USERNAME ?? "jake").toLowerCase();

export default async function LLDTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const userId = await getCurrentUserId();
  const self = await db.user.findUnique({ where: { id: userId }, select: { username: true } });
  if (!self || self.username.toLowerCase() !== OWNER_USERNAME) redirect("/");

  const content = CONTENT_BY_SLUG.get(slug);
  if (!content) notFound();

  return (
    <div className="pb-28 space-y-5">
      {/* Back */}
      <Link
        href="/lld"
        className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-foreground transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="8,2 4,6 8,10" />
        </svg>
        LLD
      </Link>

      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[1px] text-muted mb-1">
          {content.section}
        </p>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-[2px] text-foreground">
          {content.title.toUpperCase()}
        </h1>
        <p className="mt-2 text-sm text-muted">{content.tagline}</p>
      </div>

      {/* Content blocks */}
      <LLDDetailClient slug={slug} blocks={content.blocks} />
    </div>
  );
}
