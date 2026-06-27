import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";
import { SCHEDULE, PHASES } from "./data";
import { ScheduleClient } from "./schedule-client";

const OWNER_USERNAME = (process.env.OWNER_USERNAME ?? "jake").toLowerCase();

export default async function SchedulePage() {
  const userId = await getCurrentUserId();
  const self = await db.user.findUnique({
    where: { id: userId },
    select: { username: true, scheduleAccess: true },
  });
  const isOwner = self?.username.toLowerCase() === OWNER_USERNAME;
  if (!self || (!isOwner && !self.scheduleAccess)) redirect("/");

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h1 className="font-display text-[56px] leading-[0.9] tracking-[3px] text-foreground">
          SCHEDULE
        </h1>
        <p className="mt-1.5 text-sm text-muted">60-day DSA + LLD master plan</p>
      </div>
      <ScheduleClient schedule={SCHEDULE} phases={PHASES} />
    </div>
  );
}
