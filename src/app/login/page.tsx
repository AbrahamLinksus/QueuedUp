import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto mt-16 max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-lg font-semibold text-foreground">dsa.journal</h1>
        <p className="text-sm text-muted">Enter your passcode to continue.</p>
      </div>
      <form action={login} className="space-y-3">
        <input
          type="password"
          name="passcode"
          autoFocus
          required
          placeholder="Passcode"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {error && <p className="text-sm text-danger">Incorrect passcode.</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
