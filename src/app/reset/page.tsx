import Link from "next/link";
import { resetPassword } from "./actions";

const ERROR_MSGS: Record<string, string> = {
  code: "Incorrect reset code.",
  short: "Password must be at least 6 characters.",
  match: "Passwords don't match.",
  user: "Username not found.",
};

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="font-display text-[48px] leading-[0.9] tracking-[3px] text-foreground">
            RESET
            <br />
            PASSWORD
          </h1>
          <p className="mt-2 text-sm text-muted">Enter your username and the reset code.</p>
        </div>

        {error && (
          <div className="rounded-lg border-[2px] border-danger bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
            {ERROR_MSGS[error] ?? "Something went wrong."}
          </div>
        )}

        <form action={resetPassword} className="space-y-3">
          <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111] space-y-3">
            <div>
              <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
                Username
              </label>
              <input
                name="username"
                required
                autoComplete="username"
                placeholder="your username"
                className="w-full rounded-lg border-2 border-foreground bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
                Reset Code
              </label>
              <input
                name="code"
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full rounded-lg border-2 border-foreground bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
                New Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="min 6 characters"
                className="w-full rounded-lg border-2 border-foreground bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
                Confirm Password
              </label>
              <input
                name="confirm"
                type="password"
                required
                placeholder="same as above"
                className="w-full rounded-lg border-2 border-foreground bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl border-[2.5px] border-foreground bg-foreground py-4 font-display text-[22px] tracking-[2.5px] text-background shadow-[3px_3px_0_#111] active:translate-y-px"
          >
            RESET
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-foreground underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
