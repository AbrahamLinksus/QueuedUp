import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";
import { LLD_SECTIONS, TOTAL_ITEMS } from "./data";
import { LLDSectionCard, LLDProgress } from "./lld-section";

const OWNER_USERNAME = (process.env.OWNER_USERNAME ?? "jake").toLowerCase();

export default async function LLDPage() {
  const userId = await getCurrentUserId();
  const self = await db.user.findUnique({ where: { id: userId }, select: { username: true } });
  if (!self || self.username.toLowerCase() !== OWNER_USERNAME) redirect("/");

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">
          LLD
        </h1>
        <LLDProgress totalItems={TOTAL_ITEMS} />
      </div>

      <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-3 shadow-[3px_3px_0_#111]">
        <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
          AlgoMaster LLD Curriculum
        </p>
        <div className="space-y-0.5">
          {LLD_SECTIONS.map((section, i) => (
            <LLDSectionCard
              key={section.slug}
              section={section}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
