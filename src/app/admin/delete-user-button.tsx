"use client";

import { useState, useTransition } from "react";
import { deleteUser } from "./actions";

export function DeleteUserButton({ username }: { username: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await deleteUser(username);
      setConfirming(false);
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted">Delete @{username}?</span>
        <button
          onClick={handleConfirm}
          disabled={isPending}
          className="rounded-lg border-[2px] border-red-500 bg-red-500 px-3 py-1 text-[11px] font-bold text-white disabled:opacity-50"
        >
          {isPending ? "Deleting…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="rounded-lg border-[2px] border-foreground/20 px-3 py-1 text-[11px] text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg border-[2px] border-foreground/20 px-3 py-1 text-[11px] text-muted hover:border-red-500 hover:text-red-500 transition-colors"
    >
      Delete user
    </button>
  );
}
