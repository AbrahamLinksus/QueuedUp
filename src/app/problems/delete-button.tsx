"use client";

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
      <button
        type="submit"
        className="rounded-md border border-danger/40 px-3 py-1.5 text-sm text-danger hover:bg-danger/10"
      >
        Delete
      </button>
    </form>
  );
}
