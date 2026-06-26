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
    <div className="mx-auto mt-16 max-w-sm space-y-8">
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="font-display text-[56px] leading-none tracking-[3px] text-foreground">
          QUEUED<span className="opacity-40">UP</span>
        </div>
        <p className="text-sm text-muted">Enter your passcode to continue.</p>
      </div>
      <form action={login} className="space-y-3">
        <input
          type="password"
          name="passcode"
          autoFocus
          required
          placeholder="Passcode"
          className="w-full rounded-xl border-[2.5px] border-foreground bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted shadow-[3px_3px_0_#111] focus:outline-none"
        />
        {error && <p className="text-sm text-danger">Incorrect passcode.</p>}
        <MotionButton
          type="submit"
          className="w-full rounded-xl border-[2.5px] border-foreground bg-foreground py-3 font-display text-[18px] tracking-[2px] text-background shadow-[3px_3px_0_#111]"
        >
          UNLOCK
        </MotionButton>
      </form>
    </div>
  );
}
