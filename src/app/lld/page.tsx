import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";
import { LLD_SECTIONS, TOTAL_ITEMS } from "./data";
import { LLDIndexClient } from "./lld-index-client";

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
        <p className="mt-1.5 text-sm text-muted">
          Low Level Design · {TOTAL_ITEMS} topics
        </p>
      </div>

      <LLDIndexClient sections={LLD_SECTIONS} totalItems={TOTAL_ITEMS} />
    </div>
  );
}
