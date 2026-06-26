import Link from "next/link";
import { MotionButton } from "@/components/motion-button";
import { register } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  username_short: "Username must be at least 3 characters.",
  password_short: "Password must be at least 6 characters.",
  mismatch: "Passwords don't match.",
  taken: "That username is already taken.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMsg = error ? (ERROR_MESSAGES[error] ?? "Something went wrong.") : null;

  return (
    <div className="mx-auto mt-16 max-w-sm space-y-8">
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="font-display text-[56px] leading-none tracking-[3px] text-foreground">
          QUEUED<span className="opacity-40">UP</span>
        </div>
        <p className="text-sm text-muted">Create your account.</p>
      </div>
      <form action={register} className="space-y-3">
        <input
          type="text"
          name="username"
          autoFocus
          required
          autoComplete="username"
          placeholder="Username"
          className="w-full rounded-xl border-[2.5px] border-foreground bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted shadow-[3px_3px_0_#111] focus:outline-none"
        />
        <input
          type="password"
          name="password"
          required
          autoComplete="new-password"
          placeholder="Password"
          className="w-full rounded-xl border-[2.5px] border-foreground bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted shadow-[3px_3px_0_#111] focus:outline-none"
        />
        <input
          type="password"
          name="confirm"
          required
          autoComplete="new-password"
          placeholder="Confirm password"
          className="w-full rounded-xl border-[2.5px] border-foreground bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted shadow-[3px_3px_0_#111] focus:outline-none"
        />
        {errorMsg && <p className="text-sm text-danger">{errorMsg}</p>}
        <MotionButton
          type="submit"
          className="w-full rounded-xl border-[2.5px] border-foreground bg-foreground py-3 font-display text-[18px] tracking-[2px] text-background shadow-[3px_3px_0_#111]"
        >
          CREATE ACCOUNT
        </MotionButton>
      </form>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-foreground underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
