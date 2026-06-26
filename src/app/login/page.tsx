import { CodeIllustration } from "@/components/illustrations/code-illustration";
import { MotionButton } from "@/components/motion-button";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto mt-16 max-w-sm space-y-6">
      <div className="flex flex-col items-center space-y-3 text-center">
        <CodeIllustration className="h-20 w-20 text-primary" />
        <div className="space-y-1">
          <h1 className="font-display text-lg font-bold text-foreground">QueuedUp</h1>
          <p className="text-sm text-muted">Enter your passcode to continue.</p>
        </div>
      </div>
      <form action={login} className="space-y-3">
        <input
          type="password"
          name="passcode"
          autoFocus
          required
          placeholder="Passcode"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-sm text-danger">Incorrect passcode.</p>}
        <MotionButton
          type="submit"
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Unlock
        </MotionButton>
      </form>
    </div>
  );
}
