"use client";

import { useTransition } from "react";
import { setUserAccess } from "./actions";

export function AccessButtons({
  username,
  lldAccess,
  scheduleAccess,
}: {
  username: string;
  lldAccess: boolean;
  scheduleAccess: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function toggle(field: "lldAccess" | "scheduleAccess", current: boolean) {
    startTransition(() => setUserAccess(username, field, !current));
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => toggle("lldAccess", lldAccess)}
        disabled={pending}
        className={`rounded-full border-[1.5px] px-3 py-1 text-[11px] font-medium transition-colors disabled:opacity-50 ${
          lldAccess
            ? "border-foreground bg-foreground text-background"
            : "border-foreground/30 text-muted hover:border-foreground/60 hover:text-foreground/70"
        }`}
      >
        LLD
      </button>
      <button
        onClick={() => toggle("scheduleAccess", scheduleAccess)}
        disabled={pending}
        className={`rounded-full border-[1.5px] px-3 py-1 text-[11px] font-medium transition-colors disabled:opacity-50 ${
          scheduleAccess
            ? "border-foreground bg-foreground text-background"
            : "border-foreground/30 text-muted hover:border-foreground/60 hover:text-foreground/70"
        }`}
      >
        Schedule
      </button>
    </div>
  );
}
