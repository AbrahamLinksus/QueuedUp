"use client";

import { MotionButton } from "@/components/motion-button";

export function DeleteButton({ action }: { action: () => void | Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this problem and all its entries/reviews?")) {
          e.preventDefault();
        }
      }}
    >
      <MotionButton
        type="submit"
        className="rounded-full border-2 border-danger px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10"
      >
        Delete
      </MotionButton>
    </form>
  );
}
