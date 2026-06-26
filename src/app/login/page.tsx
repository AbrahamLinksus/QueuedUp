import Link from "next/link";
import { MotionButton } from "@/components/motion-button";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; registered?: string; reset?: string }>;
}) {
  const { error, registered, reset } = await searchParams;

  return (
    <div className="mx-auto mt-16 max-w-sm space-y-8">
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="font-display text-[56px] leading-none tracking-[3px] text-foreground">
          QUEUED<span className="opacity-40">UP</span>
        </div>
        <p className="text-sm text-muted">Sign in to your account.</p>
      </div>
      <form action={login} className="space-y-3">
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
          autoComplete="current-password"
          placeholder="Password"
          className="w-full rounded-xl border-[2.5px] border-foreground bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted shadow-[3px_3px_0_#111] focus:outline-none"
        />
        {registered && <p className="text-sm text-foreground font-medium">Account created — sign in below.</p>}
        {reset && <p className="text-sm text-foreground font-medium">Password updated — sign in with your new password.</p>}
        {error && <p className="text-sm text-danger">Incorrect username or password.</p>}
        <MotionButton
          type="submit"
          className="w-full rounded-xl border-[2.5px] border-foreground bg-foreground py-3 font-display text-[18px] tracking-[2px] text-background shadow-[3px_3px_0_#111]"
        >
          SIGN IN
        </MotionButton>
      </form>
      <div className="space-y-2 text-center text-sm text-muted">
        <p>
          No account?{" "}
          <Link href="/register" className="font-semibold text-foreground underline">
            Register
          </Link>
        </p>
        <p>
          Forgot password?{" "}
          <Link href="/reset" className="font-semibold text-foreground underline">
            Reset
          </Link>
        </p>
      </div>
    </div>
  );
}
